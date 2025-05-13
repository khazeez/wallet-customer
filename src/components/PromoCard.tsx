import React, { useState } from 'react';

export interface Promo {
  id: string;
  brand: string;
  logo: string; // URL or path
  category: 'F&B' | 'Fashion';
  title: string;
  description: string;
  pointsRequired: number;
}

interface PromoCardProps {
  promo: Promo;
  userBalance: number;
  onRedeem: (promo: Promo) => void;
  compact?: boolean;
}

const PromoCard: React.FC<PromoCardProps> = ({ promo, userBalance, onRedeem, compact = false }) => {
  const [confirm, setConfirm] = useState(false);
  const [redeemed, setRedeemed] = useState(false);
  const [voucher, setVoucher] = useState<string | null>(null);
  const canRedeem = userBalance >= promo.pointsRequired;

  const handleRedeem = () => {
    setConfirm(false);
    setRedeemed(true);
    // Generate a fake voucher code for demo
    setVoucher('PROMO-' + promo.id.toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000));
    onRedeem(promo);
  };

  return (
    <div className={`border rounded-lg ${compact ? 'p-2' : 'p-4'} bg-bg-light-gray flex flex-col items-center shadow-sm relative ${compact ? 'min-h-[180px]' : ''}`}>
      <img src={promo.logo} alt={promo.brand + ' logo'} className={`${compact ? 'w-8 h-8 mb-1' : 'w-12 h-12 mb-2'} rounded-full object-contain bg-white`} />
      <div className={`${compact ? 'font-semibold text-flow-teal text-center mb-0.5 text-sm' : 'font-bold text-flow-teal text-center mb-1'}`}>{promo.title}</div>
      <div className={`${compact ? 'text-xs text-secondary-text text-center mb-1' : 'text-sm text-secondary-text text-center mb-2'}`}>{promo.description}</div>
      <div className={`${compact ? 'mb-1 flex items-center gap-1' : 'mb-2 flex items-center gap-2'}`}>
        <span className={`bg-flow-teal/10 text-flow-teal font-semibold ${compact ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 rounded text-xs'}`}>{promo.pointsRequired} FP</span>
      </div>
      {redeemed && voucher ? (
        <div className="text-center mt-2">
          <div className="font-semibold text-green-700">Redeemed!</div>
          <div className="text-xs mt-1">Voucher Code:</div>
          <div className="font-mono text-base bg-white border rounded px-2 py-1 inline-block mt-1">{voucher}</div>
          <div className="text-xs mt-2 text-gray-500">Show this code at checkout or in the brand app.</div>
        </div>
      ) : confirm ? (
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 rounded-lg">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <div className="font-bold mb-2">Redeem this offer?</div>
            <div className="mb-2 text-sm">This will deduct <span className='font-semibold'>{promo.pointsRequired} FP</span> from your balance.</div>
            <button
              className="bg-flow-teal text-white px-4 py-2 rounded mr-2"
              onClick={handleRedeem}
              disabled={!canRedeem}
            >
              Confirm
            </button>
            <button
              className="bg-cloud-grey text-flow-teal px-4 py-2 rounded"
              onClick={() => setConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className={`w-full ${compact ? 'mt-1 py-1 text-sm' : 'mt-2 py-2'} rounded font-semibold ${canRedeem ? 'bg-flow-teal text-white hover:bg-flow-teal/90' : 'bg-cloud-grey text-flow-teal cursor-not-allowed'}`}
          disabled={!canRedeem}
          onClick={() => setConfirm(true)}
        >
          Redeem
        </button>
      )}
    </div>
  );
};

export default PromoCard;
