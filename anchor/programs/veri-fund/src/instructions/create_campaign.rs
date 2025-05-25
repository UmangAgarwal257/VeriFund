#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::state::{Campaign, ProgramState};

#[derive(Accounts)]
pub struct CreateCampaign<'info> {
    #[account(
        mut,
        seeds = [b"program_state"],
        bump,
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        init,
        payer = creator,
        space = 8 + Campaign::INIT_SPACE,
        seeds = [b"campaign", (program_state.campaign_count + 1).to_le_bytes().as_ref()],
        bump,
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn create_campaign(
    ctx: Context<CreateCampaign>,
    title: String,
    description: String,
    image_url: String,
    goal: u64,
) -> Result<()> {
    let program_state = &mut ctx.accounts.program_state;
    let campaign = &mut ctx.accounts.campaign;
    let creator = &ctx.accounts.creator;

    require!(title.len() <= 64, ErrorCode::TitleTooLong);
    require!(description.len() <= 512, ErrorCode::DescriptionTooLong);
    require!(image_url.len() <= 256, ErrorCode::ImageUrlTooLong);
    require!(goal > 0, ErrorCode::InvalidGoalAmount);

    let timestamp = Clock::get()?.unix_timestamp;
    let deadline = timestamp + (30 * 24 * 60 * 60); // 30 days from now

    campaign.cid = program_state.campaign_count;
    campaign.creator = creator.key();
    campaign.title = title;
    campaign.description = description;
    campaign.image_url = image_url;
    campaign.goal = goal;
    campaign.amount_raised = 0;
    campaign.withdrawals_total = 0;
    campaign.created_at = timestamp;
    campaign.deadline = deadline;
    campaign.donors = 0;
    campaign.balance = 0;
    campaign.is_active = true;

    program_state.campaign_count += 1;

    Ok(())
}
