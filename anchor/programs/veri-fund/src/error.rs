use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("The program has already been initialized.")]
    AlreadyInitialized,
    #[msg("The title is too long.")]
    TitleTooLong,
    #[msg("The description is too long.")]
    DescriptionTooLong,
    #[msg("The image URL is too long.")]
    ImageUrlTooLong,
    #[msg("The goal amount must be greater than zero.")]
    InvalidGoalAmount,
    #[msg("The campaign was not found.")]
    CampaignNotFound,
    #[msg("The campaign is not active.")]
    CampaignNotActive,
    #[msg("The donation amount must be greater than zero.")]
    InvalidDonationAmount,
    #[msg("The campaign has expired.")]
    CampaignExpired,
    #[msg("Campaign goal reached.")]
    CampaignGoalActualized,
    #[msg("Unauthorized action.")]
    Unauthorized,
    #[msg("Invalid withdrawal amount.")]
    InvalidWithdrawalAmount,
    #[msg("Insufficient balance.")]
    InsufficientBalance,
    #[msg("Invalid platform address.")]
    InvalidPlatformAddress,
    #[msg("Insufficient fund to maintain rent-exempt status.")]
    InsufficientFund,
    #[msg("You cannot vouch for your own campaign.")]
    CannotVouchOwnCampaign,
}
