import { Connection, PublicKey, Transaction, SignatureResult } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';

// Flow Point program ID (from Anchor.toml)
const PROGRAM_ID = new PublicKey('FPTkn1jWiMZZrQyNUu7AMrcAvRbVXk5o5oXMGi3fdym1');

// Function to load the IDL
const loadIdl = async (connection: Connection) => {
  // In a real app, this would be loaded from filesystem or a URL
  // For simplicity, we're loading it from a public account on Solana
  return await Program.fetchIdl(PROGRAM_ID, new anchor.AnchorProvider(
    connection,
    // @ts-ignore - we don't need a wallet for fetching IDL
    { publicKey: PublicKey.default, signTransaction: async () => {} },
    {}
  ));
};

// Function to get the FP mint address from program state
export const getFpMint = async (connection: Connection): Promise<PublicKey> => {
  try {
    const idl = await loadIdl(connection);
    if (!idl) throw new Error('Failed to load IDL');
    
    // Get state PDA
    const [statePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("state")],
      PROGRAM_ID
    );
    
    // Create a temporary program instance to fetch the state account
    const program = new Program(idl, PROGRAM_ID, new anchor.AnchorProvider(
      connection,
      // @ts-ignore - we're just using this to fetch data
      { publicKey: PublicKey.default, signTransaction: async () => {} },
      {}
    ));
    
    // Fetch the state account
    const state = await program.account.programState.fetch(statePda);
    
    // Extract and return FP mint address
    return state.fpMint;
  } catch (error) {
    console.error('Error getting FP mint address:', error);
    throw error;
  }
};

// Function to get Flow Point token balance
export const getFlowPointBalance = async (
  connection: Connection,
  walletAddress: PublicKey
): Promise<number> => {
  try {
    // Get the FP mint address
    const fpMint = await getFpMint(connection);
    
    // Get the associated token account address
    const tokenAccount = await getAssociatedTokenAddress(
      fpMint,
      walletAddress
    );
    
    try {
      // Query token account balance
      const tokenBalance = await connection.getTokenAccountBalance(tokenAccount);
      return parseInt(tokenBalance.value.amount);
    } catch (e) {
      // If token account doesn't exist, return 0
      return 0;
    }
  } catch (error) {
    console.error('Error getting Flow Point balance:', error);
    throw error;
  }
};

// Function to burn Flow Points and get USDC back
export const burnFlowPoints = async (
  connection: Connection,
  walletAddress: PublicKey,
  amount: number,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<string> => {
  try {
    const idl = await loadIdl(connection);
    if (!idl) throw new Error('Failed to load IDL');
    
    // Get state PDA
    const [statePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("state")],
      PROGRAM_ID
    );
    
    // Create a program instance with the user's wallet
    const program = new Program(idl, PROGRAM_ID, new anchor.AnchorProvider(
      connection,
      {
        publicKey: walletAddress,
        signTransaction,
      } as any,
      {}
    ));
    
    // Get FP mint from state
    const state = await program.account.programState.fetch(statePda);
    const fpMint = state.fpMint;
    
    // Get the associated token account address
    const tokenAccount = await getAssociatedTokenAddress(
      fpMint,
      walletAddress
    );
    
    // Call the burn_fp instruction
    const tx = await program.methods
      .burnFp(new anchor.BN(amount))
      .accounts({
        owner: walletAddress,
        ownerTokenAccount: tokenAccount,
        fpMint: fpMint,
        usdcReserve: state.usdcReserve,
        state: statePda,
        tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    
    return tx;
  } catch (error) {
    console.error('Error burning Flow Points:', error);
    throw error;
  }
};

// Function to wait for transaction confirmation
export const confirmTransaction = async (
  connection: Connection,
  signature: string,
  timeout = 30000
): Promise<SignatureResult> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    const signatureStatuses = await connection.getSignatureStatuses([signature]);
    const status = signatureStatuses.value[0];
    
    if (status && status.confirmationStatus === 'confirmed' || status?.confirmationStatus === 'finalized') {
      return status;
    }
    
    // Sleep for 1 second before checking again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error(`Transaction not confirmed within ${timeout}ms: ${signature}`);
};
