use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Vouch {
    campaign: Pubkey,
    voucher: Pubkey,
    stake_amount: u64,
    timestamp: i64,
}
