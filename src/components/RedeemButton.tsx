import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

interface RedeemOption {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  available: boolean;
}

interface RedeemButtonProps {
  balance: number;
  onRedeem: (optionId: string, pointsAmount: number) => Promise<boolean>;
}

export function RedeemButton({ balance, onRedeem }: RedeemButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  // Example redemption options
  const redeemOptions: RedeemOption[] = [
    {
      id: 'discount10',
      title: '10% Discount',
      description: 'Get 10% off your next purchase',
      pointsCost: 500,
      available: true,
    },
    {
      id: 'freeCoffee',
      title: 'Free Coffee',
      description: 'Redeem for a free coffee at participating stores',
      pointsCost: 300,
      available: true,
    },
    {
      id: 'vipUpgrade',
      title: 'VIP Membership',
      description: 'Upgrade to VIP status for 30 days',
      pointsCost: 2000,
      available: true,
    },
  ];

  const handleRedeem = async (optionId: string, pointsCost: number) => {
    if (balance < pointsCost) {
      alert('Not enough Flow Points for this redemption');
      return;
    }

    setIsRedeeming(true);
    setSelectedOption(optionId);

    try {
      const success = await onRedeem(optionId, pointsCost);
      if (success) {
        alert('Redemption successful!');
        setIsOpen(false);
      } else {
        alert('Redemption failed. Please try again.');
      }
    } catch (error) {
      console.error('Redemption error:', error);
      alert('An error occurred during redemption');
    } finally {
      setIsRedeeming(false);
      setSelectedOption(null);
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)} 
        variant="outline" 
        className="w-full py-3 border-flow-teal text-flow-teal hover:bg-flow-teal/5 rounded-md font-semibold shadow-sm flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
        Redeem Rewards
      </Button>
    );
  }

  return (
    <Card className="border-cloud-grey rounded-lg shadow-sm overflow-hidden">
      <CardHeader className="bg-white border-b border-cloud-grey py-4 px-6">
        <CardTitle className="text-flow-teal text-lg font-bold">Redeem Flow Points</CardTitle>
        <CardDescription className="text-secondary-text">Choose a reward to redeem with your points</CardDescription>
      </CardHeader>
      <CardContent className="bg-white p-4">
        <div className="space-y-3">
          {redeemOptions.map((option) => (
            <div 
              key={option.id}
              className={`p-4 border rounded-md ${option.available && balance >= option.pointsCost 
                ? 'cursor-pointer hover:bg-soft-mint border-cloud-grey shadow-sm' 
                : 'opacity-50 cursor-not-allowed'}`}
              onClick={() => {
                if (option.available && balance >= option.pointsCost) {
                  handleRedeem(option.id, option.pointsCost);
                }
              }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-deep-ink">{option.title}</h3>
                  <p className="text-sm text-secondary-text mt-1">{option.description}</p>
                </div>
                <div className="bg-soft-mint text-flow-teal font-bold px-3 py-1 rounded-md text-sm">
                  {option.pointsCost} FP
                </div>
              </div>
              {selectedOption === option.id && isRedeeming && (
                <div className="mt-3 text-sm text-center text-secondary-text bg-bg-light-gray py-2 rounded-md">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Processing...
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsOpen(false)}
          className="w-full mt-6 border-cloud-grey text-deep-ink hover:bg-bg-light-gray py-2 rounded-md"
        >
          Cancel
        </Button>
      </CardContent>
    </Card>
  );
}