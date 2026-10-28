import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Check, ChevronRight } from 'lucide-react';

const AVATARS = [
  { id: 'av1', color: 'bg-red-500', icon: '🦊' },
  { id: 'av2', color: 'bg-blue-500', icon: '🐺' },
  { id: 'av3', color: 'bg-green-500', icon: '🐯' },
  { id: 'av4', color: 'bg-yellow-500', icon: '🐼' },
  { id: 'av5', color: 'bg-purple-500', icon: '🐉' },
  { id: 'av6', color: 'bg-pink-500', icon: '🦄' },
];

const OnboardingPage = () => {
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0].id);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleComplete = () => {
    if (username.length < 3 || username.length > 16) return;
    setUser(prev => ({ ...prev, username, avatar: selectedAvatar }));
    navigate('/lobby');
  };

  return (
    <div className="min-h-screen bg-nexora-bg text-nexora-text flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Create Your <span className="text-nexora-primary">Identity</span></h1>
          <p className="text-nexora-muted text-lg">Your display name will be visible to all rivals in the arena.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8 bg-nexora-card border border-nexora-border p-8 rounded-3xl shadow-2xl">
            <div className="space-y-3">
              <label className="text-sm font-medium text-nexora-muted ml-1 flex items-center gap-2">
                <User size={16} /> Display Name
              </label>
              <input
                type="text"
                maxLength={16}
                className="w-full bg-nexora-secondaryBg border border-nexora-border rounded-xl py-4 px-4 focus:outline-none focus:border-nexora-primary transition-all text-xl font-bold"
                placeholder="Enter your alias..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <p className={`text-xs ${username.length >= 3 && username.length <= 16 ? 'text-nexora-success' : 'text-nexora-muted'}`}>
                {username.length < 3 ? 'Minimum 3 characters' : username.length > 16 ? 'Maximum 16 characters' : 'Username available!'}
              </p>
            </div>

            <button
              onClick={handleComplete}
              disabled={username.length < 3 || username.length > 16}
              className="w-full py-4 bg-nexora-primary rounded-xl text-white font-bold hover:bg-nexora-primary/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-50"
            >
              Finish Setup
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-6 bg-nexora-primary rounded-full"></span>
              Choose Avatar
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`aspect-square rounded-2xl text-3xl flex items-center justify-center transition-all border-4 ${
                    selectedAvatar === av.id
                      ? 'border-nexora-primary bg-nexora-primary/20 scale-110 shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                      : 'border-transparent bg-nexora-card hover:bg-nexora-secondaryBg'
                  }`}
                >
                  {av.icon}
                </button>
              ))}
            </div>
            <div className="p-6 bg-nexora-secondaryBg/50 border border-nexora-border rounded-2xl">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${AVATARS.find(a => a.id === selectedAvatar).color} rounded-full flex items-center justify-center text-2xl`}>
                  {AVATARS.find(a => a.id === selectedAvatar).icon}
                </div>
                <div>
                  <p className="text-sm text-nexora-muted">Preview identity</p>
                  <p className="font-bold text-lg">{username || 'YourName'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
