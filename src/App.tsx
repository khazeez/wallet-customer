import { useState } from 'react';
import './index.css';
import './qr-scanner.css';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Badge } from './components/ui/badge';

import { WalletConnection } from './components/WalletConnection';
import { TokenBalance } from './components/TokenBalance';
import { RedeemButton } from './components/RedeemButton';
import { QRScanner } from './components/QRScanner';
import { ActionButtons } from './components/ActionButtons';
import PromoModal from './components/PromoModal';


import { TransactionFilters, TransactionFilters as FilterTypes } from './components/TransactionFilters';
import { TransactionList } from './components/TransactionList';
import { SettingsPanel } from './components/SettingsPanel';

// Transaction type
interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  type: 'earn' | 'spend';
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function WalletPreview() {
  // --- same content as App, but as a separate component for preview route ---
  const [balance, setBalance] = useState(1250);
  // Using the transactions directly without setTransactions to avoid lint warning
  const transactions = [
    { id: '1', date: '2025-05-07', merchant: 'Coffee Shop', amount: 50, type: 'earn' },
    { id: '2', date: '2025-05-06', merchant: 'Book Store', amount: 120, type: 'earn' },
    { id: '3', date: '2025-05-05', merchant: 'Electronics Store', amount: 200, type: 'spend' }
  ];
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const handleConnect = (address: string) => {
    setConnected(true);
    setWalletAddress(address);
  };
  const handleDisconnect = () => {
    setConnected(false);
    setWalletAddress('');
  };
  const handleSpendPoints = () => {
    console.log('Spend points clicked');
  };
  const handleSwapToUSDC = () => {
    console.log('Swap to USDC clicked');
  };
  const handleRedeem = async (optionId: string, pointsAmount: number): Promise<boolean> => {
    console.log(`Redeeming ${pointsAmount} points for option ${optionId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        setBalance(prevBalance => prevBalance - pointsAmount);
        resolve(true);
      }, 1000);
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-snow-white via-soft-mint to-cloud-grey font-sans">
      <header className="bg-flow-teal text-white py-6 shadow-md">
        <div className="max-w-xl mx-auto flex items-center justify-between px-6">
          <h1 className="text-2xl font-bold tracking-tight">Flow Points Wallet</h1>
          <WalletConnection connected={connected} walletAddress={walletAddress} onConnect={handleConnect} onDisconnect={handleDisconnect} />
        </div>
      </header>
      <main className="max-w-xl mx-auto px-4 py-8">
        <Card className="rounded-2xl shadow-lg border border-cloud-grey bg-white">
          <CardHeader className="bg-soft-mint rounded-t-2xl px-6 py-5 border-b border-cloud-grey">
            <CardTitle className="text-flow-teal text-xl font-semibold">Your Flow Points</CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-4">
            <TokenBalance balance={balance} onSpend={handleSpendPoints} onSwap={handleSwapToUSDC} />
            <RedeemButton onRedeem={handleRedeem} balance={balance} />
            <div className="mt-8">
              <h3 className="font-semibold mb-3 text-deep-ink">Recent Transactions</h3>
              {transactions.length === 0 ? (
                <p className="text-muted-foreground">No transactions yet.</p>
              ) : (
                <ul className="divide-y divide-cloud-grey">
                  {transactions.map((tx) => (
                    <li key={tx.id} className="flex justify-between items-center py-2">
                      <span className="text-sm text-deep-ink">{tx.date} - {tx.merchant}</span>
                      <Badge variant={tx.type === 'earn' ? 'secondary' : 'outline'} className={tx.type === 'earn' ? 'bg-soft-mint text-flow-teal' : 'border-cloud-grey text-deep-ink'}>
                        {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="text-center text-xs text-cloud-grey mt-12 mb-4">Flow Point Loyalty • Built on Solana</footer>
    </div>
  );
}

function App() {
  // Application state
  const [balance, setBalance] = useState(1250);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  // UI state
  const [activeView, setActiveView] = useState<'home' | 'settings'>('home');
  const [qrOpen, setQROpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterTypes>({
    dateRange: 'all',
    type: 'all',
    sortBy: 'newest'
  });
  const [promoModalOpen, setPromoModalOpen] = useState(false);

  // Handle wallet connection
  const handleConnect = (address: string) => {
    setConnected(true);
    setWalletAddress(address);
    // In a real app, we would fetch the user's Flow Point balance here
    
    // Initialize transactions
    setTransactions([
      { id: '1', date: '2025-05-07', merchant: 'Coffee Shop', amount: 50, type: 'earn' },
      { id: '2', date: '2025-05-06', merchant: 'Book Store', amount: 120, type: 'earn' },
      { id: '3', date: '2025-05-05', merchant: 'Electronics Store', amount: 200, type: 'spend' },
      { id: '4', date: '2025-05-04', merchant: 'Restaurant', amount: 75, type: 'earn' },
      { id: '5', date: '2025-05-03', merchant: 'Online Store', amount: 150, type: 'spend' },
      { id: '6', date: '2025-05-02', merchant: 'Grocery Store', amount: 30, type: 'earn' },
      { id: '7', date: '2025-05-01', merchant: 'Gas Station', amount: 45, type: 'earn' },
      { id: '8', date: '2025-04-30', merchant: 'Department Store', amount: 180, type: 'spend' },
      { id: '9', date: '2025-04-29', merchant: 'Coffee Shop', amount: 25, type: 'earn' },
      { id: '10', date: '2025-04-28', merchant: 'Electronics Store', amount: 300, type: 'spend' }
    ]);
  };
  
  const handleDisconnect = () => {
    setConnected(false);
    setWalletAddress('');
  };

  // QR Scanner handler
  const handleQRScan = (data: string, mode: 'pay' | 'redeem') => {
    setQROpen(false);
    if (mode === 'pay') {
      // PAY FLOW
      let paymentInfo: { merchant: string; amount: number } | null = null;
      try {
        const obj = JSON.parse(data);
        if (obj && typeof obj.merchant === 'string' && typeof obj.amount === 'number') {
          paymentInfo = obj;
        }
      } catch {
        if (data.startsWith('pointflow://pay?')) {
          const params = new URLSearchParams(data.split('?')[1]);
          const merchant = params.get('merchant');
          const amount = Number(params.get('amount'));
          if (merchant && !isNaN(amount)) {
            paymentInfo = { merchant, amount };
          }
        }
      }
      if (paymentInfo) {
        if (balance < paymentInfo.amount) {
          alert('Insufficient balance for this payment.');
          return;
        }
        setBalance(prev => prev - paymentInfo.amount);
        setTransactions(prev => [{
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          merchant: paymentInfo.merchant,
          amount: paymentInfo.amount,
          type: 'spend'
        }, ...prev]);
        alert(`Paid ${paymentInfo.amount} FP to ${paymentInfo.merchant}! Loyalty rewards earned.`);
      } else {
        alert('Invalid QR code for payment.');
      }
    } else if (mode === 'redeem') {
      // REDEEM FLOW
      // Accepts: pointflow://redeem?option=optionId&amount=pointsAmount
      let redeemInfo: { option: string; amount: number } | null = null;
      try {
        const obj = JSON.parse(data);
        if (obj && typeof obj.option === 'string' && typeof obj.amount === 'number') {
          redeemInfo = obj;
        }
      } catch {
        if (data.startsWith('pointflow://redeem?')) {
          const params = new URLSearchParams(data.split('?')[1]);
          const option = params.get('option');
          const amount = Number(params.get('amount'));
          if (option && !isNaN(amount)) {
            redeemInfo = { option, amount };
          }
        }
      }
      if (redeemInfo) {
        if (balance < redeemInfo.amount) {
          alert('Insufficient points for this redemption.');
          return;
        }
        handleRedeem(redeemInfo.option, redeemInfo.amount).then(success => {
          if (success) {
            alert(`Successfully redeemed ${redeemInfo.amount} points for ${redeemInfo.option} option!`);
          } else {
            alert('Redemption failed.');
          }
        });
      } else {
        alert('Invalid QR code for redemption.');
      }
    }
  };

  // Action handlers
  const handleSendPoints = () => {
    // In a real app, this would open a send points form
    const recipient = prompt('Enter recipient address:');
    const amount = Number(prompt('Enter amount to send:'));
    
    if (recipient && !isNaN(amount) && amount > 0) {
      if (balance < amount) {
        alert('Insufficient balance for this transfer.');
        return;
      }
      
      setBalance(prev => prev - amount);
      setTransactions(prev => [{
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        merchant: `Transfer to ${recipient.substring(0, 6)}...`,
        amount: amount,
        type: 'spend'
      }, ...prev]);
      
      alert(`Sent ${amount} FP to ${recipient}`);
    }
  };
  
  const handleReceivePoints = () => {
    // In a real app, this would show a QR code for receiving points
    alert('Your receive address: ' + walletAddress);
  };
  
  const handleSwapToUSDC = () => {
    // In a real app, this would open a swap interface
    const amount = Number(prompt('Enter amount to swap to USDC:'));
    
    if (!isNaN(amount) && amount > 0) {
      if (balance < amount) {
        alert('Insufficient balance for this swap.');
        return;
      }
      
      setBalance(prev => prev - amount);
      setTransactions(prev => [{
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        merchant: 'Swap to USDC',
        amount: amount,
        type: 'spend'
      }, ...prev]);
      
      alert(`Swapped ${amount} FP to ${(amount * 0.01).toFixed(2)} USDC`);
    }
  };

  // Handle redemption
  const handleRedeem = async (optionId: string, pointsAmount: number): Promise<boolean> => {
    console.log(`Redeeming ${pointsAmount} points for option ${optionId}`);
    
    // Simulate API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Deduct points on successful redemption
        setBalance(prevBalance => prevBalance - pointsAmount);
        
        // Add a new transaction
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          merchant: 'Rewards Program',
          amount: pointsAmount,
          type: 'spend'
        };
        
        setTransactions(prev => [newTransaction, ...prev]);
        resolve(true);
      }, 2000);
    });
  };

  return (
    <div className="min-h-screen bg-bg-light-gray font-sans antialiased">
      <div className="max-w-md mx-auto p-4 pt-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-flow-teal flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">FP</span>
            </div>
            <h1 className="text-2xl font-bold text-flow-teal">PointFlow</h1>
          </div>
          <div className="flex items-center gap-2">
            {connected && (
              <button 
                onClick={() => setActiveView(activeView === 'home' ? 'settings' : 'home')}
                className="p-2 text-flow-teal hover:bg-soft-mint rounded-full"
                aria-label="Settings"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0 .73 2.73l-.22.38a2 2 0 0 0-2.73.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V20a2 2 0 0 0-2-2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            )}
            <WalletConnection 
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              connected={connected}
              walletAddress={walletAddress}
            />
          </div>
        </header>

        <main className="space-y-6">
          {!connected ? (
            <div className="text-center py-12 bg-white rounded-lg border border-cloud-grey shadow-sm p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-flow-teal text-white mb-6">
                <span className="text-2xl font-bold">FP</span>
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-flow-teal">Welcome to PointFlow</h2>
              <p className="text-secondary-text mb-8 max-w-xs mx-auto">Connect your wallet to view your Flow Point balance and transaction history.</p>
              <div className="pt-4 border-t border-cloud-grey">
                <p className="text-l text-cloud-grey">Powered by Solana</p>
                {/* <img 
                  src="https://solana.com/_next/static/media/logotype.e4df684f.svg" 
                  alt="Powered by Solana" 
                  className="h-8 mx-auto opacity-60"
                /> */}
              </div>
            </div>
          ) : activeView === 'settings' ? (
            <SettingsPanel 
              walletAddress={walletAddress} 
              onClose={() => setActiveView('home')} 
            />
          ) : (
            <>
              {/* Balance Section */}
              <TokenBalance balance={balance} />

              {/* Action Buttons */}
              <ActionButtons
                onSend={handleSendPoints}
                onReceive={handleReceivePoints}
                onSwap={handleSwapToUSDC}
                onScan={() => setQROpen(true)}
                onPromo={() => setPromoModalOpen(true)}
              />

              {/* Transaction Filters */}
              <TransactionFilters
                onFilterChange={setFilters}
                onSearchChange={setSearchTerm}
              />

              {/* Transaction List */}
              <TransactionList
                transactions={transactions}
                searchTerm={searchTerm}
                filters={filters}
              />
            </>
          )}
        </main>

        <footer className="mt-12 text-center text-sm text-secondary-text pb-6">
          <p>Flow Point Loyalty • Built on Solana</p>
        </footer>
      </div>
      {qrOpen && (
        <QRScanner onScan={handleQRScan} onClose={() => setQROpen(false)} />
      )}
      <PromoModal
        open={promoModalOpen}
        onClose={() => setPromoModalOpen(false)}
        userBalance={balance}
        onRedeem={(promo) => {
          setBalance(prev => prev - promo.pointsRequired);
        }}
      />
    </div>
  );
}

function RouterWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/preview/customer" element={<WalletPreview />} />
        <Route path="*" element={<App />} />
      </Routes>
    </Router>
  );
}

export default RouterWrapper;