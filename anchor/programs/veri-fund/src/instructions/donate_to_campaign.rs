#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};

use crate::state::{Campaign, Transaction};

use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(cid: u64)]
pub struct DonateToCampaign<'info> {
    #[account(
        mut,
        seeds = [b"campaign", cid.to_le_bytes().as_ref()],
        bump,
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(
        init,
        payer = donor,
        space = 8 + Transaction::INIT_SPACE,
        seeds = [
            b"transaction",
            donor.key().as_ref(),
            cid.to_le_bytes().as_ref(),
            (campaign.donors + 1).to_le_bytes().as_ref()
        ],
        bump,
    )]
    pub transaction: Account<'info, Transaction>,

    #[account(mut)]
    pub donor: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn donate_to_campaign(ctx: Context<DonateToCampaign>, cid: u64, amount: u64) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    let donor = &ctx.accounts.donor;
    let transaction = &mut ctx.accounts.transaction;

    require!(campaign.cid == cid, ErrorCode::CampaignNotFound);
    require!(campaign.is_active, ErrorCode::CampaignNotActive);
    require!(amount > 0, ErrorCode::InvalidDonationAmount);
    require!(
        campaign.goal > campaign.amount_raised,
        ErrorCode::CampaignGoalActualized
    );

    let current_time = Clock::get()?.unix_timestamp;
    require!(current_time < campaign.deadline, ErrorCode::CampaignExpired);

    let transfer_instruction = system_instruction::transfer(&donor.key(), &campaign.key(), amount);

    invoke(
        &transfer_instruction,
        &[donor.to_account_info(), campaign.to_account_info()],
    )?;

    campaign.amount_raised += amount;
    campaign.balance += amount;
    campaign.donors += 1;

    transaction.owner = donor.key();
    transaction.cid = cid;
    transaction.amount = amount;
    transaction.timestamp = current_time as u64;
    transaction.credited = true;

    Ok(())
}
