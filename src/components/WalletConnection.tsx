import { useState } from 'react';
import { Button } from './ui/button';
import { shortenAddress } from '../lib/utils';

interface WalletConnectionProps {
  onConnect: (walletAddress: string) => void;
  onDisconnect: () => void;
  connected: boolean;
  walletAddress?: string;
}

export function WalletConnection({
  onConnect,
  onDisconnect,
  connected,
  walletAddress = '',
}: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      // In a real implementation, this would connect to a Solana wallet
      // For now, we're just simulating with a delay
      setTimeout(() => {
        // Sample wallet address for testing
        const testWalletAddress = 'DexKyxUPRjaMf8DdXEPxv7kJQCp5kvZafPgiErQN1s7Z';
        onConnect(testWalletAddress);
        setIsConnecting(false);
      }, 1000);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    onDisconnect();
  };

  return (
    <div>
      {connected ? (
        <Button 
          variant="outline" 
          onClick={handleDisconnect}
          className="border-flow-teal text-flow-teal hover:bg-flow-teal/10 font-medium rounded-md shadow-sm px-4 py-2 flex items-center gap-2"
        >
          <div className="w-3 h-3 rounded-full bg-accent-green animate-pulse"></div>
          {shortenAddress(walletAddress)}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </Button>
      ) : (
        <Button 
          onClick={handleConnect} 
          disabled={isConnecting}
          className="bg-flow-teal hover:bg-flow-teal/90 text-white font-semibold rounded-md shadow-sm px-4 py-2 flex items-center gap-2"
        >
          {isConnecting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2"/>
                <path d="M12 12h.01"/>
              </svg>
              Connect Wallet
            </>
          )}
        </Button>
      )}
    </div>
  );
}