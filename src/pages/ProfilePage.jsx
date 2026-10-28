import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Trophy,
  Star,
  History,
  Settings,
  ChevronLeft,
  Award,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for MVP progression
  const stats = {
    matchesPlayed: 42,
    wins: 12,
    bestReaction: '184ms',
    rank: 'Silver IV'
  };

  const achievements = [
    { id: 1, name: 'First Blood', desc: 'Win your first match', unlocked: true, icon: <Zap className="text-yellow-400" /> },
    { id: 2, name: 'Reflex God', desc: 'Reaction under 200ms', unlocked: true, icon: <Star className="text-blue-400" /> },
    { id: 3, name: 'Veteran', desc: 'Play 100 matches', unlocked: false, icon: <Award className="text-gray-500" /> },
  ];

  return (
    <div className="min-h-screen bg-nexora-bg text-nexora-text p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/lobby')}
          className="flex items-center gap-2 text-nexora-muted hover:text-nexora-text transition-colors mb-8 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Lobby
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Identity */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-nexora-card border border-nexora-border rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-nexora-primary to-nexora-secondary" />
              <div className="w-24 h-24 bg-nexora-secondaryBg border-4 border-nexora-primary rounded-full flex items-center justify-center text-5xl mx-auto mb-4 shadow-lg">
                {user?.avatar === 'av1' ? '🦊' : user?.avatar === 'av2' ? '🐺' : user?.avatar === 'av3' ? '🐯' : user?.avatar === 'av4' ? '🐼' : user?.avatar === 'av5' ? '🐉' : '🦄'}
              </div>
              <h2 className="text-2xl font-bold">{user?.username || 'Rival'}</h2>
              <p className="text-nexora-muted text-sm mb-6">{stats.rank}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-nexora-secondaryBg p-3 rounded-2xl">
                  <p className="text-xs text-nexora-muted uppercase font-bold">Wins</p>
                  <p className="text-xl font-black">{stats.wins}</p>
                </div>
                <div className="bg-nexora-secondaryBg p-3 rounded-2xl">
                  <p className="text-xs text-nexora-muted uppercase font-bold">Best</p>
                  <p className="text-xl font-black">{stats.bestReaction}</p>
                </div>
              </div>
            </div>

            <div className="bg-nexora-card border border-nexora-border rounded-3xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Settings size={18} className="text-nexora-primary" /> Account
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 text-sm bg-nexora-secondaryBg rounded-xl hover:bg-nexora-primary/10 transition-all">Edit Display Name</button>
                <button className="w-full text-left p-3 text-sm bg-nexora-secondaryBg rounded-xl hover:bg-nexora-primary/10 transition-all">Change Avatar</button>
                <button className="w-full text-left p-3 text-sm bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all">Delete Account</button>
              </div>
            </div>
          </div>

          {/* Right Column: Progression */}
          <div className="md:col-span-2 space-y-8">
            {/* XP Progress */}
            <div className="bg-nexora-card border border-nexora-border rounded-3xl p-8">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h3 className="text-xl font-bold">Level 1</h3>
                  <p className="text-nexora-muted text-sm">Progress to Level 2</p>
                </div>
                <span className="text-sm font-mono text-nexora-primary">120 / 500 XP</span>
              </div>
              <div className="w-full h-4 bg-nexora-secondaryBg rounded-full overflow-hidden border border-nexora-border">
                <div className="h-full bg-gradient-to-r from-nexora-primary to-nexora-secondary w-1/4 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-nexora-card border border-nexora-border rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Award size={24} className="text-nexora-secondary" /> Achievements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map(ach => (
                  <div key={ach.id} className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
                    ach.unlocked ? 'bg-nexora-secondaryBg border-nexora-primary/30' : 'bg-nexora-bg border-nexora-border opacity-50'
                  }`}>
                    <div className={`p-3 rounded-xl ${ach.unlocked ? 'bg-nexora-primary/20' : 'bg-nexora-muted/10'}`}>
                      {ach.icon}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{ach.name}</p>
                      <p className="text-xs text-nexora-muted">{ach.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Match History */}
            <div className="bg-nexora-card border border-nexora-border rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <History size={24} className="text-nexora-primary" /> Match History
              </h3>
              <div className="space-y-3">
                {[1, 2, 3].map(m => (
                  <div key={m} className="flex items-center justify-between p-4 bg-nexora-secondaryBg rounded-2xl border border-nexora-border">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-nexora-success" />
                      <span className="font-medium">Win vs Rival_{m}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-nexora-muted">210ms</span>
                      <span className="text-sm font-bold text-nexora-primary">+25 XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
