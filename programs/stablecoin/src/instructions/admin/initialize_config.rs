use anchor_lang::prelude::*;
use crate::{ Config, MINT_DECIMALS, SEED_CONFIG_ACCOUNT, SEED_MINT_ACCOUNT };

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = 8 + Config::INIT_SPACE,
        seeds = [SEED_CONFIG_ACCOUNT],
        bump
    )]
    pub config_account: Account<'info, Config>,

    #[account(
        init,
        payer = authority,
        seeds = [SEED_MINT_ACCOUNT],
        bump,
        mint::decimals = MINT_DECIMALS,
        mint::authority = mint_account,
        mint::freeze_authority = mint_account,
        mint::token_progrm = token_program
    )]
    pub mint_account: Interface<'info, Mint>,
    pub token_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

pub fn process_initialize_config(ctx: Context<InitializeConfig>) -> Result<()> {
    Ok(())
}
