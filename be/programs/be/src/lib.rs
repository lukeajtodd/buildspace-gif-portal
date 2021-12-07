use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod be {
    use super::*;
    pub fn start(ctx: Context<Start>) -> ProgramResult {
        let base_account = &mut ctx.accounts.base_account;

        base_account.total_gifs = 0;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Start<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
}