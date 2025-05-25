use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Vouch {
    pub campaign: Pubkey,
    pub voucher: Pubkey,
    pub stake_amount: u64,
    pub timestamp: i64,
}
