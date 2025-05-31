'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Wallet, Send, Coins, RefreshCw } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import with no SSR
const WalletButton = dynamic(
  () => import('@/components/WalletButton').then(mod => ({ default: mod.WalletButton })),
  { 
    ssr: false,
    loading: () => (
      <div className="px-4 py-2 rounded-md bg-gray-800 text-gray-400 animate-pulse">
        Loading...
      </div>
    )
  }
);

export default function WalletTestPage() {
    const { connection } = useConnection();
    const { publicKey, sendTransaction, connected } = useWallet();
    const [balance, setBalance] = useState<number | null>(null);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [txSignature, setTxSignature] = useState('');

    const getBalance = async () => {
        if (!publicKey) return;
        
        setLoading(true);
        try {
            const balance = await connection.getBalance(publicKey);
            setBalance(balance / LAMPORTS_PER_SOL);
        } catch (error) {
            console.error('Error getting balance:', error);
        } finally {
            setLoading(false);
        }
    };

    const requestAirdrop = async () => {
        if (!publicKey) return;
        
        setLoading(true);
        try {
            const signature = await connection.requestAirdrop(publicKey, 3*LAMPORTS_PER_SOL);
            const latestBlockhash = await connection.getLatestBlockhash();
            await connection.confirmTransaction({
                signature,
                blockhash: latestBlockhash.blockhash,
                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            }, 'confirmed');
            setTxSignature(signature);
            await getBalance();
        } catch (error) {
            console.error('Error requesting airdrop:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendSol = async () => {
        if (!publicKey || !recipient || !amount) return;
        
        setLoading(true);
        try {
            // Validate recipient address
            let recipientPubkey: PublicKey;
            try {
                recipientPubkey = new PublicKey(recipient);
            } catch (error) {
                console.error('Invalid recipient address:', error);
                return;
            }
            
            // Validate and convert amount
            const numericAmount = parseFloat(amount);
            if (isNaN(numericAmount) || numericAmount <= 0) {
                console.error('Invalid amount');
                return;
            }
            const lamports = numericAmount * LAMPORTS_PER_SOL;
            
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: recipientPubkey,
                    lamports,
                })
            );
            
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'confirmed');
            setTxSignature(signature);
            await getBalance();
        } catch (error) {
            console.error('Error sending SOL:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <header className="px-4 lg:px-6 h-16 flex items-center border-b border-gray-800">
                <Link href="/" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
                <div className="ml-auto">
                    <WalletButton />
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-4">Wallet Testing</h1>
                    <p className="text-gray-400">Test wallet connection and basic Solana operations</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wallet className="w-5 h-5" />
                                Wallet Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="text-sm text-gray-400">Connection Status</div>
                                <div className={`font-semibold ${connected ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {connected ? 'Connected' : 'Not Connected'}
                                </div>
                            </div>

                            {publicKey && (
                                <div className="space-y-2">
                                    <div className="text-sm text-gray-400">Wallet Address</div>
                                    <div className="font-mono text-xs bg-gray-700 p-2 rounded break-all">
                                        {publicKey.toString()}
                                    </div>
                                </div>
                            )}

                            {connected && (
                                <div className="space-y-2">
                                    <div className="text-sm text-gray-400">Balance</div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold">
                                            {balance !== null ? `${balance.toFixed(4)} SOL` : 'Not loaded'}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={getBalance}
                                            disabled={loading}
                                            className="border-gray-600 hover:bg-gray-700"
                                        >
                                            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Coins className="w-5 h-5" />
                                Test Operations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {connected ? (
                                <>
                                    <div className="space-y-2">
                                        <Button
                                            onClick={requestAirdrop}
                                            disabled={loading}
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                        >
                                            Request 3 SOL Airdrop (Devnet)
                                        </Button>
                                        <div className="text-xs text-gray-400">
                                            Get test SOL for devnet testing
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gray-700">
                                        <div className="text-sm font-medium">Send SOL</div>
                                        
                                        <Input
                                            placeholder="Recipient address"
                                            value={recipient}
                                            onChange={(e) => setRecipient(e.target.value)}
                                            className="bg-gray-700 border-gray-600"
                                        />
                                        
                                        <Input
                                            placeholder="Amount (SOL)"
                                            type="number"
                                            step="0.01"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="bg-gray-700 border-gray-600"
                                        />
                                        
                                        <Button
                                            onClick={sendSol}
                                            disabled={loading || !recipient || !amount}
                                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                                        >
                                            <Send className="w-4 h-4 mr-2" />
                                            Send SOL
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center text-gray-400 py-8">
                                    Connect your wallet to test operations
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {txSignature && (
                    <Card className="bg-gray-800 border-gray-700 mt-8">
                        <CardHeader>
                            <CardTitle>Latest Transaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="text-sm text-gray-400">Transaction Signature</div>
                                <div className="font-mono text-xs bg-gray-700 p-2 rounded break-all">
                                    {txSignature}
                                </div>
                                <div className="text-xs text-gray-400">
                                    <a 
                                        href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-400 hover:text-emerald-300"
                                    >
                                        View on Solana Explorer (Devnet)
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}