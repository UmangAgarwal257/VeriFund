import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { AnchorProvider, Program, Idl, BN } from '@coral-xyz/anchor';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

// Your program ID from lib.rs  
const PROGRAM_ID = new PublicKey('8xHxSZahioqDShhXYBT3pATqRXAYTxrWdtqowVoDPP1j');

// Import your IDL
import IDL from './veri_fund.json';

// Define proper wallet interface for Anchor with correct types
interface AnchorWallet {
  publicKey: PublicKey;
  signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>;
}

export function useAnchorProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  if (!wallet.connected || !wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) {
    return null;
  }

  try {
    // Create wallet adapter that satisfies Anchor's requirements
    const anchorWallet: AnchorWallet = {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
    };

    const provider = new AnchorProvider(
      connection,
      anchorWallet,
      { 
        preflightCommitment: 'processed',
        commitment: 'processed'
      }
    );

    const program = new Program(IDL as Idl, provider);
    
    return { program, provider };
  } catch (error) {
    console.error('Failed to create Anchor program:', error);
    return null;
  }
}

// Helper functions for PDA derivation
export const getProgramStatePda = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('program_state')],
    PROGRAM_ID
  )[0];
};

export const getCampaignPda = (campaignId: number) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('campaign'), new BN(campaignId).toArrayLike(Buffer, 'le', 8)],
    PROGRAM_ID
  )[0];
};

export const getVouchPda = (campaignPubkey: PublicKey, voucherPubkey: PublicKey) => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('vouch'), campaignPubkey.toBuffer(), voucherPubkey.toBuffer()],
    PROGRAM_ID
  )[0];
};

export const getDonationPda = (
  donorPubkey: PublicKey, 
  campaignId: number, 
  donorCount: number
) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('transaction'),
      donorPubkey.toBuffer(),
      new BN(campaignId).toArrayLike(Buffer, 'le', 8),
      new BN(donorCount).toArrayLike(Buffer, 'le', 8)
    ],
    PROGRAM_ID
  )[0];
};

export { BN, PROGRAM_ID };