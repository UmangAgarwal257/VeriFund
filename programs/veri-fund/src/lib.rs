pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("Ai8JfY6X3b65SdbFYjpTyXfPtkNCgoEnQv2HpnBWFhcn");

#[program]
pub mod veri_fund {
    use super::*;
}
