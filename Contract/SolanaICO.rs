use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("2wampQTiA3TTzXoyMkTkbZ7V666TvFR2qvgMHQMaesMt");

#[program]
pub mod ico_program {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        price_per_token: u64, // in lamports (e.g., 1,000,000 for 0.001 SOL)
    ) -> Result<()> {
        let ico_state = &mut ctx.accounts.ico_state;
        ico_state.admin = *ctx.accounts.admin.key;
        ico_state.ico_mint = ctx.accounts.ico_mint.key();
        ico_state.ico_ata_pda = ctx.accounts.ico_ata_pda.key();
        ico_state.price_per_token = price_per_token;
        ico_state.tokens_sold = 0;
        
        msg!("ICO Initialized. Admin: {}", ico_state.admin);
        Ok(())
    }

    pub fn buy_tokens(ctx: Context<BuyTokens>, amount: u64) -> Result<()> {
        let ico_state = &mut ctx.accounts.ico_state;
        
        // Calculate SOL cost
        let sol_amount = amount
            .checked_mul(ico_state.price_per_token)
            .ok_or(ErrorCode::Overflow)?;

        // Transfer SOL from user to admin
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.admin.key(),
            sol_amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.admin.to_account_info(),
            ],
        )?;

        // Transfer tokens from PDA ATA to user
        let mint_key = ctx.accounts.ico_mint.key();
        let seeds = &[
            b"ico-ata".as_ref(),
            mint_key.as_ref(),
            &[ctx.bumps.ico_ata_pda],
        ];
        let signer = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.ico_ata_pda.to_account_info(),
                to: ctx.accounts.user_ata.to_account_info(),
                authority: ctx.accounts.ico_ata_pda.to_account_info(),
            },
            signer,
        );

        // Standard SPL Token decimals is usually 9, matching SOL
        // Amount here is expected to be in raw units (amount * 10^decimals)
        token::transfer(cpi_ctx, amount)?;

        // Update state
        ico_state.tokens_sold = ico_state.tokens_sold
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;

        msg!("Purchase successful: {} tokens", amount);
        Ok(())
    }

    // Admin can withdraw remaining tokens or update price if needed
    pub fn update_price(ctx: Context<UpdatePrice>, new_price: u64) -> Result<()> {
        let ico_state = &mut ctx.accounts.ico_state;
        require!(ico_state.admin == *ctx.accounts.admin.key, ErrorCode::Unauthorized);
        ico_state.price_per_token = new_price;
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
        seeds = [b"ico-ata", ico_mint.key().as_ref()],
        bump,
        token::mint = ico_mint,
        token::authority = ico_ata_pda,
    )]
    pub ico_ata_pda: Account<'info, TokenAccount>,

    pub ico_mint: Account<'info, Mint>,

    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct BuyTokens<'info> {
    #[account(
        mut,
        seeds = [b"ico-state"],
        bump,
    )]
    pub ico_state: Account<'info, IcoState>,

    #[account(
        mut,
        seeds = [b"ico-ata", ico_mint.key().as_ref()],
        bump,
    )]
    pub ico_ata_pda: Account<'info, TokenAccount>,

    pub ico_mint: Account<'info, Mint>,

    #[account(mut)]
    pub user_ata: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: Admin is just a recipient of SOL
    #[account(mut, address = ico_state.admin)]
    pub admin: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdatePrice<'info> {
    #[account(mut, seeds = [b"ico-state"], bump)]
    pub ico_state: Account<'info, IcoState>,
    pub admin: Signer<'info>,
}

#[account]
pub struct IcoState {
    pub admin: Pubkey,
    pub ico_mint: Pubkey,
    pub ico_ata_pda: Pubkey,
    pub price_per_token: u64,
    pub tokens_sold: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Unauthorized access")]
    Unauthorized,
}
