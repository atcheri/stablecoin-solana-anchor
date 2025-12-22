use anchor_lang::prelude::*;

use state::*;
mod state;
use constants::*;
mod constants;

declare_id!("2V3QeeZGXpghj7PTHVftMAQhxX5GEZYf5EoiWHDtLhhF");

#[program]
pub mod stablecoin {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
