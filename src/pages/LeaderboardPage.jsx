import React from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LeaderboardPage = () => {
  const navigate = useNavigate();

  const topPlayers = [
    { rank: 1, username: 'FlashGod', xp: 12500, best: '142ms', avatar: 'av5' },
    { rank: 2, username: 'ZenReflex', xp: 11200, best: '158ms', avatar: 'av2' },
    { rank: 3, username: 'CyberSlayer', xp: 9800, best: '170ms', avatar: 'av1' },
    { rank: 4, username: 'Neo', xp: 8400, best: '188ms', avatar: 'av3' },
    { rank: 5, username: 'Void', xp: 7200, best: '195ms', avatar: 'av4' },
  ];

  return (
    <div className="min-h-screen bg-nexora-bg text-nexora-text p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/lobby')}
            className="px-4 py-2 bg-nexora-card border border-nexora-border rounded-xl hover:bg-nexora-secondaryBg transition-all"
          >
            Back to Lobby
          </button>
          <h1 className="text-4xl font-black italic tracking-tighter flex items-center gap-3">
            <Trophy className="text-nexora-primary" size={32} /> HALL OF FAME
          </h1>
          <div className="w-20" />
        </div>

        <div className="space-y-4">
          {/* Podium */}
          <div className="grid grid-cols-3 gap-4 mb-8 items-end">
            {/* Rank 2 */}
            <div className="bg-nexora-card border border-nexora-border p-6 rounded-3xl text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-nexora-bg">2</div>
              <div className="text-4xl mb-2">{topPlayers[1].avatar === 'av2' ? '🐺' : '👤'}</div>
              <p className="font-bold text-sm truncate">{topPlayers[1].username}</p>
              <p className="text-xs text-nexora-muted">{topPlayers[1].best}</p>
            </div>
            {/* Rank 1 */}
            <div className="bg-gradient-to-b from-nexora-primary/30 to-nexora-card border-2 border-nexora-primary p-8 rounded-3xl text-center relative scale-110 z-10 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-nexora-bg shadow-lg">1</div>
              <div className="text-6xl mb-2">{topPlayers[0].avatar === 'av5' ? '🐉' : '👤'}</div>
              <p className="font-black text-lg">{topPlayers[0].username}</p>
              <p className="text-sm text-nexora-primary font-bold">{topPlayers[0].best}</p>
            </div>
            {/* Rank 3 */}
            <div className="bg-nexora-card border border-nexora-border p-6 rounded-3xl text-center relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 border-nexora-bg">3</div>
              <div className="text-4xl mb-2">{topPlayers[2].avatar === 'av1' ? '🦊' : '👤'}</div>
              <p className="font-bold text-sm truncate">{topPlayers[2].username}</p>
              <p className="text-xs text-nexora-muted">{topPlayers[2].best}</p>
            </div>
          </div>

          {/* List */}
          <div className="bg-nexora-card border border-nexora-border rounded-3xl overflow-hidden">
            <div className="grid grid-cols-4 p-4 bg-nexora-secondaryBg text-xs font-bold text-nexora-muted uppercase tracking-widest">
              <div className="col-span-1">Rank</div>
              <div className="col-span-2">Player</div>
              <div className="col-span-1 text-right">Best</div>
            </div>
            <div className="divide-y divide-nexora-border">
              {topPlayers.slice(3).map(p => (
                <div key={p.rank} className="grid grid-cols-4 p-4 items-center hover:bg-nexora-secondaryBg/50 transition-all">
                  <div className="col-span-1 font-mono text-nexora-muted">#{p.rank}</div>
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-8 h-8 bg-nexora-secondaryBg rounded-full flex items-center justify-center text-sm">
                      {p.avatar === 'av3' ? '🐯' : p.avatar === 'av4' ? '🐼' : '👤'}
                    </div>
                    <span className="font-bold">{p.username}</span>
                  </div>
                  <div className="col-span-1 text-right font-mono text-nexora-primary">{p.best}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
