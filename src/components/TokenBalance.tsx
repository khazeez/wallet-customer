
import { Card } from './ui/card';
import { formatNumber } from '../lib/utils';

interface TokenBalanceProps {
  balance: number;
  onSpend?: () => void;
  onSwap?: () => void;
}

export function TokenBalance({ balance }: TokenBalanceProps) {
  // Flow Points are pegged to USDC at 100:1 ratio (1 FP = $0.01)
  const usdValue = balance * 0.01;
  
  // Mock data for balance history
  const weeklyChange = 23.5; // percentage
  const monthlyChange = 45.2; // percentage
  
  return (
    <Card className="overflow-hidden rounded-lg border border-cloud-grey shadow-sm">
      <div className="bg-gradient-to-r from-soft-mint to-bg-light-gray p-6 text-deep-ink">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-flow-teal flex items-center justify-center">
              <span className="text-white font-bold text-lg">FP</span>
            </div>
            <h2 className="text-lg font-bold text-deep-ink">Flow Points</h2>
          </div>
          <div className="flex items-center gap-1 text-accent-green text-sm font-medium bg-white/50 px-2 py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 12 5 5 9-9"/>
            </svg>
            <span>Active</span>
          </div>
        </div>
        
        <div className="mt-6 mb-2">
          <div className="text-5xl font-bold text-flow-teal tracking-tight">{formatNumber(balance)} FP</div>
          <div className="text-base text-secondary-text mt-1 font-medium flex items-center gap-2">
            <span>≈ ${usdValue.toFixed(2)} USD</span>
            <div className="flex items-center gap-1 text-accent-green text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m18 15-6-6-6 6"/>
              </svg>
              <span>+{weeklyChange}%</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-xs text-secondary-text mb-1">Weekly Change</div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-flow-teal">+{weeklyChange}%</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-green">
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="text-xs text-secondary-text mb-1">Monthly Change</div>
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-flow-teal">+{monthlyChange}%</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-green">
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}