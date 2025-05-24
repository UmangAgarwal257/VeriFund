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
}
