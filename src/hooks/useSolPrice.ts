'use client';

import { useState, useEffect } from 'react';

interface PriceData {
  solana: {
    usd: number;
  };
}

export function useSolPrice() {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
          {
            headers: {
              'Accept': 'application/json',
            },
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: PriceData = await response.json();
        
        if (data.solana && typeof data.solana.usd === 'number') {
          setPrice(data.solana.usd);
        } else {
          throw new Error('Invalid price data received');
        }
      } catch (err) {
        console.error('Failed to fetch SOL price:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch price');
        // Fallback to environment variable or default
        const fallbackPrice = process.env.NEXT_PUBLIC_SOL_USD_FALLBACK 
          ? parseFloat(process.env.NEXT_PUBLIC_SOL_USD_FALLBACK) || 100
          : 100;
        setPrice(fallbackPrice);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    
    // Refresh price every 5 minutes
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return { price, loading, error };
}

// Utility function to convert SOL to USD
export function solToUsd(solAmount: number, solPrice: number | null): string {
  if (!solPrice || isNaN(solAmount)) return '0.00';
  return (solAmount * solPrice).toFixed(2);
}

// Utility function to convert USD to SOL
export function usdToSol(usdAmount: number, solPrice: number | null): string {
  if (!solPrice || solPrice === 0 || isNaN(usdAmount)) return '0.00';
  return (usdAmount / solPrice).toFixed(4);
}
