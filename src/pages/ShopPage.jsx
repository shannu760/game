import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Gem, ShieldCheck, Lock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ShopPage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [coins, setCoins] = useState(1200);

  const items = [
    { id: 'f1', name: 'Neon Glow Frame', price: 500, type: 'frame', rarity: 'Rare', icon: <Star className="text-yellow-400" /> },
    { id: 'f2', name: 'Void Border', price: 1200, type: 'frame', rarity: 'Epic', icon: <Star className="text-purple-400" /> },
    { id: 'a1', name: 'Golden Fox', price: 800, type: 'avatar', rarity: 'Epic', icon: <Star className="text-yellow-600" /> },
    { id: 'a2', name: 'Cyber Wolf', price: 600, type: 'avatar', rarity: 'Rare', icon: <Star className="text-blue-400" /> },
  ];

  const buyItem = (item) => {
    if (coins < item.price) return alert('Not enough coins!');
    setCoins(prev => prev - item.price);
    setUser(prev => ({ ...prev, inventory: [...(prev.inventory || []), item.id] }));
    alert(`${item.name} added to inventory!`);
  };

  return (
    <div className="min-h-screen bg-nexora-bg text-nexora-text p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => navigate('/lobby')} className="px-4 py-2 bg-nexora-card border border-nexora-border rounded-xl hover:bg-nexora-secondaryBg transition-all">
            Back to Lobby
          </button>
          <div className="flex items-center gap-6">
            <div className="bg-nexora-card border border-nexora-border px-4 py-2 rounded-full flex items-center gap-2">
              <Gem className="text-nexora-secondary" size={20} />
              <span className="font-bold">{coins} NEX-COINS</span>
            </div>
            <button className="px-4 py-2 bg-nexora-primary rounded-full font-bold text-white hover:bg-nexora-primary/90 transition-all shadow-lg">
              Buy Coins
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Premium Subscription */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-nexora-primary to-indigo-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={24} />
                  <span className="font-black uppercase tracking-widest text-xs">Membership</span>
                </div>
                <h2 className="text-4xl font-black mb-2">NEXORA PLUS</h2>
                <p className="text-indigo-100 mb-8 text-sm leading-relaxed">Unlock exclusive frames, ad-free experience, and priority match-making.</p>
                <div className="space-y-3 mb-8">
                  {['Premium Frames', 'Custom Room Themes', 'Exclusive Avatars', 'No Ads'].map(feat => (
                    <div key={feat} className="flex items-center gap-2 text-sm font-medium">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" /> {feat}
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 bg-white text-indigo-700 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-xl">
                  Upgrade for ₹99/mo
                </button>
              </div>
            </div>
          </div>

          {/* Cosmetic Store */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingCart className="text-nexora-primary" size={28} />
              <h3 className="text-2xl font-bold">Cosmetic Shop</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {items.map(item => (
                <div key={item.id} className="bg-nexora-card border border-nexora-border p-6 rounded-3xl hover:border-nexora-primary/50 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-nexora-secondaryBg rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {item.type === 'avatar' ? '👤' : '🖼️'}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-nexora-muted bg-nexora-secondaryBg px-2 py-1 rounded">
                      {item.icon} {item.rarity}
                    </div>
                  </div>
                  <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                  <p className="text-nexora-muted text-sm mb-6 capitalize">{item.type} accessory</p>
                  <button
                    onClick={() => buyItem(item)}
                    className="w-full py-3 bg-nexora-secondaryBg hover:bg-nexora-primary hover:text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Gem size={16} /> {item.price}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
