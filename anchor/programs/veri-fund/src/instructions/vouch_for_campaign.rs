#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::state::{Campaign, Vouch};

#[derive(Accounts)]
pub struct VouchForCampaign<'info> {
    #[account(
        seeds = [b"campaign", campaign.cid.to_le_bytes().as_ref()],
        bump,
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(
        init,
        payer = voucher,
        space = 8 + Vouch::INIT_SPACE,
        seeds = [b"vouch", campaign.key().as_ref(), voucher.key().as_ref()],
        bump,
    )]
    pub vouch: Account<'info, Vouch>,

    #[account(mut)]
    pub voucher: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn vouch_for_campaign(ctx: Context<VouchForCampaign>, stake_amount: u64) -> Result<()> {
    let campaign = &ctx.accounts.campaign;
    let vouch = &mut ctx.accounts.vouch;
    let voucher = &ctx.accounts.voucher;

    require!(campaign.is_active, ErrorCode::CampaignNotActive);
    require!(
        campaign.creator != voucher.key(),
        ErrorCode::CannotVouchOwnCampaign
    );

    let timestamp = Clock::get()?.unix_timestamp;

    vouch.campaign = campaign.key();
    vouch.voucher = voucher.key();
    vouch.stake_amount = stake_amount;
    vouch.timestamp = timestamp;

    Ok(())
}
