#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

use crate::error::ErrorCode;
use crate::state::ProgramState;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + ProgramState::INIT_SPACE,
        seeds = [b"program_state"],
        bump,
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

pub fn initialize_program(ctx: Context<Initialize>) -> Result<()> {
    let program_state = &mut ctx.accounts.program_state;
    let authority = &ctx.accounts.authority;

    if program_state.initialized {
        return Err(ErrorCode::AlreadyInitialized.into());
    }

    program_state.initialized = true;
    program_state.campaign_count = 0;
    program_state.platform_fee = 5;
    program_state.platform_address = authority.key();

    Ok(())
}
