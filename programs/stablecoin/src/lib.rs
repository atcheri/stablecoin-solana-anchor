use anchor_lang::prelude::*;

use state::*;
mod state;
use constants::*;
mod constants;
use instructions::*;
mod instructions;
use errors::*;
mod errors;

declare_id!("2V3QeeZGXpghj7PTHVftMAQhxX5GEZYf5EoiWHDtLhhF");

#[program]
pub mod stablecoin {
    use super::*;

    pub fn initialize_config(ctx: Context<InitializeConfig>) -> Result<()> {
        process_initialize_config(ctx)
    }

    pub fn update_config(ctx: Context<UpdateConfig>, min_health_factor: u64) -> Result<()> {
        process_update_config(ctx, min_health_factor)
    }
}

#[derive(Accounts)]
pub struct Initialize {}
