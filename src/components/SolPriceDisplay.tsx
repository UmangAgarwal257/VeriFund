'use client';

import { useSolPrice, solToUsd } from '@/hooks/useSolPrice';

interface SolToUsdProps {
  solAmount: number;
  className?: string;
  showSolAmount?: boolean;
  precision?: number;
}

export function SolToUsdDisplay({ 
  solAmount, 
  className = "", 
  showSolAmount = true,
  precision = 2 
}: SolToUsdProps) {
  const { price: solPrice, loading, error } = useSolPrice();

  if (loading) {
    return (
      <span className={`text-gray-500 ${className}`}>
        {showSolAmount && `${solAmount.toFixed(precision)} SOL`} (Converting...)
      </span>
    );
  }

  if (error || !solPrice) {
    return (
      <span className={`text-gray-500 ${className}`}>
        {showSolAmount && `${solAmount.toFixed(precision)} SOL`} (≈ ${solToUsd(solAmount, 100)} USD)
      </span>
    );
  }

  return (
    <span className={className}>
      {showSolAmount && `${solAmount.toFixed(precision)} SOL`}
      {showSolAmount && " "}(≈ ${solToUsd(solAmount, solPrice)} USD)
    </span>
  );
}

interface SolPriceIndicatorProps {
  className?: string;
}

export function SolPriceIndicator({ className = "" }: SolPriceIndicatorProps) {
  const { price: solPrice, loading, error } = useSolPrice();

  if (loading) {
    return <span className={`text-gray-500 ${className}`}>Loading SOL price...</span>;
  }

  if (error || !solPrice) {
    return <span className={`text-gray-500 ${className}`}>SOL price unavailable</span>;
  }

  return (
    <span className={`text-gray-400 ${className}`}>
      1 SOL ≈ ${solPrice.toFixed(2)} USD
    </span>
  );
}
