use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use anchor_lang::solana_program::system_instruction;

declare_id!("3a6G9ij8kj6m6fZp2GJDW47NyZ5Kumv4BCwFbtpH6M3L");

#[program]
pub mod solana_ico {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        price_per_token: u64, // Price in lamports (e.g., 1,000,000 = 0.001 SOL)
    ) -> Result<()> {
        let ico_state = &mut ctx.accounts.ico_state;
        ico_state.admin = *ctx.accounts.admin.key;
        ico_state.ico_mint = ctx.accounts.ico_mint.key();
        ico_state.ico_vault = ctx.accounts.ico_vault.key();
        ico_state.price_per_token = price_per_token;
        ico_state.tokens_sold = 0;
        
        msg!("ICO Initialized successfully");
        Ok(())
    }

    pub fn buy_tokens(ctx: Context<BuyTokens>, amount: u64) -> Result<()> {
        let ico_state = &mut ctx.accounts.ico_state;
        
        // 1. Calculate SOL Cost
        let sol_cost = amount
            .checked_mul(ico_state.price_per_token)
            .ok_or(ErrorCode::MathOverflow)?;

        // 2. Transfer SOL from User to Admin
        let transfer_sol_ix = system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.admin.key(),
            sol_cost,
        );
        anchor_lang::solana_program::program::invoke(
            &transfer_sol_ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.admin.to_account_info(),
            ],
        )?;

        // 3. Transfer Tokens from Vault PDA to User
        let mint_key = ico_state.ico_mint;
        let seeds = &[
            b"ico-vault".as_ref(),
            mint_key.as_ref(),
            &[ctx.bumps.ico_vault],
        ];
        let signer = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.ico_vault.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.ico_vault.to_account_info(),
            },
            signer,
        );

        token::transfer(cpi_ctx, amount)?;

        // 4. Update State
        ico_state.tokens_sold = ico_state.tokens_sold
            .checked_add(amount)
            .ok_or(ErrorCode::MathOverflow)?;

        msg!("Purchase successful: {} tokens", amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 32 + 32 + 8 + 8,
        seeds = [b"ico-state"],
        bump
    )]
    pub ico_state: Account<'info, IcoState>,

    #[account(
        init,
        payer = admin,
        seeds = [b"ico-vault", ico_mint.key().as_ref()],
        bump,
        token::mint = ico_mint,
        token::authority = ico_vault,
    )]
    pub ico_vault: Account<'info, TokenAccount>,

    pub ico_mint: Account<'info, Mint>,

    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct BuyTokens<'info> {
    #[account(mut, seeds = [b"ico-state"], bump)]
    pub ico_state: Account<'info, IcoState>,

    #[account(mut, seeds = [b"ico-vault", ico_mint.key().as_ref()], bump)]
    pub ico_vault: Account<'info, TokenAccount>,

    pub ico_mint: Account<'info, Mint>,

    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: Recipient of SOL
    #[account(mut, address = ico_state.admin)]
    pub admin: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct IcoState {
    pub admin: Pubkey,
    pub ico_mint: Pubkey,
    pub ico_vault: Pubkey,
    pub price_per_token: u64,
    pub tokens_sold: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Calculation overflowed")]
    MathOverflow,
}
