import React, { useState, useEffect, useCallback } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import { Program, AnchorProvider, BN } from "@project-serum/anchor";
import {
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    getAccount,
} from "@solana/spl-token";
import toast from "react-hot-toast";
import { 
  NavBar, 
  HeroSection, 
  About, 
  Roadmap, 
  Feature, 
  Partners, 
  Process, 
  Token, 
  Footer 
} from "../components";

import IDL from "../lib/idl.json";

// Default values for development
const DEFAULT_PROGRAM_ID = "2wampQTiA3TTzXoyMkTkbZ7V666TvFR2qvgMHQMaesMt";
const DEFAULT_ICO_MINT = "8feMvB6goi4XdnkqjQRjUoAvksGB8ygqcjXcwDWV6JRh";

export default function Home() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [icoData, setIcoData] = useState(null);
    const [amount, setAmount] = useState("");
    const [userTokenBalance, setUserTokenBalance] = useState("0");
    const [userSolBalance, setUserSolBalance] = useState(0);

    const getProgram = useCallback(() => {
        if (!wallet.publicKey) return null;

        const provider = new AnchorProvider(connection, wallet, {
            commitment: "confirmed",
        });

        const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || DEFAULT_PROGRAM_ID);
        return new Program(IDL, programId, provider);
    }, [connection, wallet]);

    const fetchUserSolBalance = useCallback(async () => {
        try {
            if (!wallet.publicKey) return;
            const balance = await connection.getBalance(wallet.publicKey);
            setUserSolBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
            console.error("Error fetching SOL balance:", error);
        }
    }, [connection, wallet.publicKey]);

    const fetchUserTokenBalance = useCallback(async () => {
        try {
            if (!wallet.publicKey) return;
            const icoMintStr = process.env.NEXT_PUBLIC_ICO_MINT || DEFAULT_ICO_MINT;
            const icoMint = new PublicKey(icoMintStr);
            const userAta = await getAssociatedTokenAddress(icoMint, wallet.publicKey);

            try {
                const tokenAccount = await getAccount(connection, userAta);
                setUserTokenBalance((Number(tokenAccount.amount) / 1e9).toString());
            } catch (error) {
                setUserTokenBalance("0");
            }
        } catch (error) {
            console.error("Error fetching token balance:", error);
            setUserTokenBalance("0");
        }
    }, [connection, wallet.publicKey]);

    const fetchIcoData = useCallback(async () => {
        try {
            const program = getProgram();
            if (!program) return;

            const [statePda] = await PublicKey.findProgramAddress(
                [Buffer.from("ico-state")],
                program.programId
            );

            try {
                const state = await program.account.icoState.fetch(statePda);
                setIcoData(state);
                
                if (wallet.publicKey) {
                    setIsAdmin(state.admin.equals(wallet.publicKey));
                }
            } catch (error) {
                console.log("ICO State not initialized yet");
                setIcoData(null);
                const accounts = await program.account.icoState.all();
                if (accounts.length === 0) {
                    setIsAdmin(true); 
                }
            }
        } catch (error) {
            console.error("Error fetching ICO data:", error);
        }
    }, [getProgram, wallet.publicKey]);

    useEffect(() => {
        if (wallet.connected) {
            fetchIcoData();
            fetchUserTokenBalance();
            fetchUserSolBalance();
        } else {
            setIsAdmin(false);
            setIcoData(null);
            setUserSolBalance(0);
            setUserTokenBalance("0");
        }
    }, [wallet.connected, wallet.publicKey, fetchIcoData, fetchUserTokenBalance, fetchUserSolBalance]);

    const initializeIco = async () => {
        try {
            const val = parseFloat(amount);
            if (isNaN(val) || val <= 0) {
                toast.error("Please enter the total supply to initialize");
                return;
            }

            setLoading(true);
            const program = getProgram();
            if (!program) return;

            const icoMintStr = process.env.NEXT_PUBLIC_ICO_MINT || DEFAULT_ICO_MINT;
            const icoMint = new PublicKey(icoMintStr);
            const solPrice = parseFloat(process.env.NEXT_PUBLIC_PER_TOKEN_SOL_PRICE || "0.001");
            const priceInLamports = new BN(solPrice * LAMPORTS_PER_SOL);

            const [statePda] = await PublicKey.findProgramAddress(
                [Buffer.from("ico-state")],
                program.programId
            );

            // Correct seed: [b"ico-vault", mint]
            const [icoVault] = await PublicKey.findProgramAddress(
                [Buffer.from("ico-vault"), icoMint.toBuffer()],
                program.programId
            );

            await program.methods
                .initialize(priceInLamports)
                .accounts({
                    icoState: statePda,
                    icoVault: icoVault,
                    icoMint: icoMint,
                    admin: wallet.publicKey,
                    systemProgram: SystemProgram.programId,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    rent: SYSVAR_RENT_PUBKEY,
                })
                .rpc();

            toast.success("ICO Contract Initialized!");
            await fetchIcoData();
        } catch (error) {
            console.error("Error initializing ICO:", error);
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const buyTokens = async () => {
        try {
            const val = parseFloat(amount);
            if (isNaN(val) || val <= 0) {
                toast.error("Please enter a valid amount");
                return;
            }

            setLoading(true);
            const program = getProgram();
            if (!program || !icoData) {
                toast.error("Program not loaded or ICO not initialized");
                setLoading(false);
                return;
            }

            const solPrice = icoData.pricePerToken.toNumber() / LAMPORTS_PER_SOL;
            const solCost = val * solPrice;
            const balance = await connection.getBalance(wallet.publicKey);

            if (balance < solCost * LAMPORTS_PER_SOL + 10000) {
                toast.error(`Insufficient balance. Need ${solCost.toFixed(4)} SOL`);
                setLoading(false);
                return;
            }

            const icoMint = icoData.icoMint;
            const [statePda] = await PublicKey.findProgramAddress(
                [Buffer.from("ico-state")],
                program.programId
            );

            const [icoVault] = await PublicKey.findProgramAddress(
                [Buffer.from("ico-vault"), icoMint.toBuffer()],
                program.programId
            );

            const userAta = await getAssociatedTokenAddress(icoMint, wallet.publicKey);

            const transaction = new Transaction();
            try {
                await getAccount(connection, userAta);
            } catch (error) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        wallet.publicKey,
                        userAta,
                        wallet.publicKey,
                        icoMint
                    )
                );
            }

            const rawAmount = new BN(val * 1e9);

            await program.methods
                .buyTokens(rawAmount)
                .accounts({
                    icoState: statePda,
                    icoVault: icoVault,
                    icoMint: icoMint,
                    userTokenAccount: userAta,
                    user: wallet.publicKey,
                    admin: icoData.admin,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                })
                .preInstructions(transaction.instructions)
                .rpc();

            toast.success(`Successfully purchased ${amount} tokens!`);
            await fetchIcoData();
            await fetchUserTokenBalance();
            await fetchUserSolBalance();
            setAmount("");
        } catch (error) {
            console.error("Error purchasing tokens:", error);
            toast.error(`Purchase failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen text-white">
            <NavBar />
            <main>
                <section id="home">
                    <HeroSection
                        wallet={wallet}
                        isAdmin={isAdmin}
                        loading={loading}
                        icoData={icoData}
                        amount={amount}
                        userSolBalance={userSolBalance}
                        userTokenBalance={userTokenBalance}
                        setAmount={setAmount}
                        createIcoAta={initializeIco} // Map to new initialize function
                        depositIco={null} // Remove deposit if not used
                        buyTokens={buyTokens}
                    />
                </section>
                
                <section id="features">
                  <Feature />
                </section>

                <Process />
                
                <section id="about">
                  <About />
                </section>

                <Token />
                
                <section id="roadmap">
                  <Roadmap />
                </section>
                
                <Partners />
            </main>
            <Footer />
        </div>
    );
}
