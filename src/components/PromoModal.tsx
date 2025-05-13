import React, { useState } from 'react';
import PromoCard, { Promo } from './PromoCard';

const PROMO_CATEGORIES = ['All', 'F&B', 'Fashion'] as const;
type PromoCategory = typeof PROMO_CATEGORIES[number];

interface PromoModalProps {
  open: boolean;
  onClose: () => void;
  onRedeem: (promo: Promo) => void;
  userBalance: number;
}

const promos: Promo[] = [
  // F&B
  {
    id: 'starbucks-bogo',
    brand: 'Starbucks',
    logo: '/brands/starbucks.svg',
    category: 'F&B',
    title: 'Buy 1 Get 1 Free Latte',
    description: 'Enjoy a free latte with every purchase. Valid at all outlets.',
    pointsRequired: 500,
  },
  {
    id: 'mcd-fries',
    brand: 'McDonald’s',
    logo: '/brands/mcdonalds.svg',
    category: 'F&B',
    title: 'Free Fries with Any Burger',
    description: 'Redeem for a free medium fries with any burger purchase.',
    pointsRequired: 350,
  },
  {
    id: 'kfc-bucket',
    brand: 'KFC',
    logo: '/brands/kfc.svg',
    category: 'F&B',
    title: '20% Off Family Bucket',
    description: 'Get 20% off a Family Bucket with this promo.',
    pointsRequired: 800,
  },
  {
    id: 'bk-whopper',
    brand: 'Burger King',
    logo: '/brands/burgerking.svg',
    category: 'F&B',
    title: 'Whopper Meal for 700 FP',
    description: 'Redeem a Whopper Meal for just 700 Flow Points.',
    pointsRequired: 700,
  },
  // Fashion
  {
    id: 'nike-20off',
    brand: 'Nike',
    logo: '/brands/nike.svg',
    category: 'Fashion',
    title: '$20 Off Next Purchase',
    description: 'Save $20 on your next Nike purchase, in-store or online.',
    pointsRequired: 1500,
  },
  {
    id: 'adidas-socks',
    brand: 'Adidas',
    logo: '/brands/adidas.svg',
    category: 'Fashion',
    title: 'Exclusive Socks with Shoes',
    description: 'Get a pair of Adidas socks with any footwear purchase.',
    pointsRequired: 900,
  },
  {
    id: 'uniqlo-10off',
    brand: 'Uniqlo',
    logo: '/brands/uniqlo.svg',
    category: 'Fashion',
    title: '10% Off Storewide',
    description: 'Enjoy 10% off all items at Uniqlo stores.',
    pointsRequired: 1000,
  },
  {
    id: 'zara-gift',
    brand: 'Zara',
    logo: '/brands/zara.svg',
    category: 'Fashion',
    title: '$15 Gift Card',
    description: 'Redeem a $15 Zara gift card for shopping.',
    pointsRequired: 1200,
  },
  {
    id: 'hm-tote',
    brand: 'H&M',
    logo: '/brands/hm.svg',
    category: 'Fashion',
    title: 'Free Tote Bag with Purchase',
    description: 'Get a limited edition tote bag with any purchase.',
    pointsRequired: 800,
  },
];

const PromoModal: React.FC<PromoModalProps> = ({ open, onClose, onRedeem, userBalance }) => {
  const [category, setCategory] = useState<PromoCategory>('All');
  const [search, setSearch] = useState('');

  const filteredPromos = promos.filter((promo) => {
    const matchesCategory = category === 'All' || promo.category === category;
    const matchesSearch = promo.brand.toLowerCase().includes(search.toLowerCase()) ||
      promo.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-3 relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 text-xl">×</button>
        <h2 className="text-lg font-bold mb-1">Brand Promotions</h2>
        <div className="flex gap-1 mb-2">
          {PROMO_CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`px-3 py-1 rounded-full text-sm font-medium ${cat === category ? 'bg-flow-teal text-white' : 'bg-cloud-grey text-flow-teal'}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          type="text"
          className="w-full mb-2 px-2 py-1 border rounded-md text-sm"
          placeholder="Search by brand or offer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredPromos.length === 0 ? (
            <div className="col-span-2 text-center text-muted-foreground py-4 text-sm">No promos available right now. Check back soon!</div>
          ) : (
            filteredPromos.map(promo => (
              <PromoCard
                key={promo.id}
                promo={promo}
                userBalance={userBalance}
                onRedeem={onRedeem}
                compact
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoModal;
