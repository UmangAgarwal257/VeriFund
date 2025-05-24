use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Campaign {
    pub cid: u64,
    pub creator: Pubkey,
    #[max_len(64)]
    pub title: String,
    #[max_len(512)]
    pub description: String,
    #[max_len(256)]
    pub image_url: String,
    pub goal: u64,
    pub amount_raised: u64,
    pub withdrawals_total: u64,
    pub created_at: i64,
    pub deadline: i64,
    pub donors: u64,
    pub balance: u64,
    pub is_active: bool,
}

impl Campaign {
    pub const TITLE_MAX_LEN: usize = 64;
    pub const DESCRIPTION_MAX_LEN: usize = 512;
    pub const IMAGE_URL_MAX_LEN: usize = 256;
}
