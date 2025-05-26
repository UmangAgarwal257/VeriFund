#![allow(unexpected_cfgs)]
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
use instructions::*;
pub use state::*;

declare_id!("8xHxSZahioqDShhXYBT3pATqRXAYTxrWdtqowVoDPP1j");

#[program]
pub mod veri_fund {
    use super::*;

    pub fn initialize_program(ctx: Context<Initialize>) -> Result<()> {
        initialize::initialize_program(ctx)
    }

    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        title: String,
        description: String,
        image_url: String,
        goal: u64,
    ) -> Result<()> {
        create_campaign::create_campaign(ctx, title, description, image_url, goal)
    }

    pub fn vouch_for_campaign(
        ctx: Context<VouchForCampaign>,
        cid: u64,
        stake_amount: u64,
    ) -> Result<()> {
        vouch_for_campaign::vouch_for_campaign(ctx, cid, stake_amount)
    }

    pub fn donate_to_campaign(ctx: Context<DonateToCampaign>, cid: u64, amount: u64) -> Result<()> {
        donate_to_campaign::donate_to_campaign(ctx, cid, amount)
    }

    pub fn withdraw_funds(ctx: Context<WithdrawFunds>, cid: u64, amount: u64) -> Result<()> {
        withdraw_funds::withdraw_funds(ctx, cid, amount)
    }
}
