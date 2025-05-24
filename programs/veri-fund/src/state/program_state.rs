use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct ProgramState {
    pub platform_address: Pubkey,
    pub initialized: bool,
    pub campaign_count: u64,
    pub platform_fee: u64,
}
