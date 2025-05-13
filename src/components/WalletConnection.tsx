import { useState, useCallback, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { shortenAddress } from '../lib/utils';
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Tooltip } from './ui/tooltip';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface WalletConnectionProps {
  onConnect: (walletAddress: string) => void;
  onDisconnect: () => void;
  walletAddress?: string;
}

export function WalletConnection({
  onConnect,
  onDisconnect,
  walletAddress = '',
}: WalletConnectionProps) {
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isBalanceChanging, setIsBalanceChanging] = useState(false);
  const previousBalanceRef = useRef<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { 
    publicKey, 
    connected, 
    connecting,
    disconnecting,
    disconnect,
    wallet
  } = useWallet();
  const { connection } = useConnection();

  // Fetch balance
  const fetchBalance = useCallback(async () => {
    if (!publicKey) return;
    
    try {
      setIsLoadingBalance(true);
      const bal = await connection.getBalance(publicKey);
      const newBalance = bal / LAMPORTS_PER_SOL;
      
      // Check if balance has changed
      if (previousBalanceRef.current !== null && previousBalanceRef.current !== newBalance) {
        setIsBalanceChanging(true);
        setTimeout(() => setIsBalanceChanging(false), 1000); // Reset after 1 second
      }
      
      setBalance(newBalance);
      previousBalanceRef.current = newBalance;
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch balance');
    } finally {
      setIsLoadingBalance(false);
    }
  }, [connection, publicKey]);

  // Update balance periodically
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance();
      const interval = setInterval(fetchBalance, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    } else {
      setBalance(null);
      previousBalanceRef.current = null;
    }
  }, [connected, publicKey, fetchBalance]);

  // Handle wallet connection state changes
  useEffect(() => {
    if (connected && publicKey) {
      const address = publicKey.toString();
      if (address !== walletAddress) {
        onConnect(address);
      }
    }
  }, [connected, publicKey, onConnect, walletAddress]);

  // Handle wallet disconnection
  useEffect(() => {
    if (!connected && !connecting && walletAddress) {
      onDisconnect();
    }
  }, [connected, connecting, onDisconnect, walletAddress]);

  // Handle connection errors
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      onDisconnect();
      setShowDropdown(false);
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError(err instanceof Error ? err.message : 'Failed to disconnect wallet');
    }
  }, [disconnect, onDisconnect]);

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
      )}
      
      {connected && publicKey ? (
        <div className="relative" ref={dropdownRef}>
          <div 
            className="group relative flex items-center gap-3 p-2.5 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-accent-green animate-pulse"></div>
            <div className="flex flex-col">
              <Tooltip content={walletAddress}>
                <span className="font-medium text-gray-900 text-sm">{shortenAddress(walletAddress)}</span>
              </Tooltip>
              {isBalanceChanging ? (
                <span className="text-xs text-gray-500">Loading balance...</span>
              ) : balance !== null ? (
                <span className="text-xs text-gray-500">{balance.toFixed(4)} $SOL</span>
              ) : null}
            </div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-gray-400 group-hover:text-gray-600 transition-colors ml-auto"
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1.5 z-10">
              <button
                onClick={handleDisconnect}
                className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                {disconnecting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Disconnecting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Disconnect
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <WalletMultiButton className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600" />
          {connecting && (
            <div className="text-sm text-gray-500">
              <svg className="animate-spin h-4 w-4 inline mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </div>
          )}
        </div>
      )}
    </div>
  );
}