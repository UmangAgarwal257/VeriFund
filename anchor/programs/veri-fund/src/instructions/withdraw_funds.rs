#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::state::{Campaign, ProgramState, Transaction};

#[derive(Accounts)]
#[instruction(cid: u64)]
pub struct WithdrawFunds<'info> {
    #[account(
        mut,
        seeds = [b"campaign", cid.to_le_bytes().as_ref()],
        bump,
        has_one = creator,
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(
        init,
        payer = creator,
        space = 8 + Transaction::INIT_SPACE,
        seeds = [
            b"withdraw",
            creator.key().as_ref(),
            cid.to_le_bytes().as_ref(),
            campaign.withdrawals_total.to_le_bytes().as_ref()
        ],
        bump,
    )]
    pub transaction: Account<'info, Transaction>,

    #[account(mut)]
    pub program_state: Account<'info, ProgramState>,

    /// CHECK: Platform address for fee collection
    #[account(mut)]
    pub platform_address: AccountInfo<'info>,

    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn withdraw_funds(ctx: Context<WithdrawFunds>, cid: u64, amount: u64) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    let creator = &ctx.accounts.creator;
    let transaction = &mut ctx.accounts.transaction;
    let program_state = &ctx.accounts.program_state;
    let platform_account_info = &ctx.accounts.platform_address;

    require!(campaign.cid == cid, ErrorCode::CampaignNotFound);
    require!(campaign.creator == creator.key(), ErrorCode::Unauthorized);
    require!(amount > 0, ErrorCode::InvalidWithdrawalAmount);
    require!(amount <= campaign.balance, ErrorCode::InsufficientBalance);
    require!(
        platform_account_info.key() == program_state.platform_address,
        ErrorCode::InvalidPlatformAddress
    );

    let rent_balance = Rent::get()?.minimum_balance(campaign.to_account_info().data_len());
    require!(
        amount <= **campaign.to_account_info().lamports.borrow() - rent_balance,
        ErrorCode::InsufficientFund
    );

    let platform_fee = amount * program_state.platform_fee / 100;
    let creator_amount = amount - platform_fee;

    // Transfer to creator
    **campaign.to_account_info().try_borrow_mut_lamports()? -= creator_amount;
    **creator.to_account_info().try_borrow_mut_lamports()? += creator_amount;

    // Transfer to platform
    **campaign.to_account_info().try_borrow_mut_lamports()? -= platform_fee;
    **platform_account_info.try_borrow_mut_lamports()? += platform_fee;

    campaign.withdrawals_total += amount;
    campaign.balance -= amount;

    transaction.amount = amount;
    transaction.cid = cid;
    transaction.owner = creator.key();
    transaction.timestamp = Clock::get()?.unix_timestamp as u64;
    transaction.credited = false;

    Ok(())
}
