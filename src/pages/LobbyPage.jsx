import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Gamepad2,
  PlusCircle,
  Search,
  Trophy,
  User,
  Settings,
  LogOut,
  Zap,
  Users,
  ArrowRight
} from 'lucide-react';

const LobbyPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');

  const handleJoin = () => {
    if (roomCode.length > 0) {
      navigate(`/game/${roomCode}`);
    }
  };

  const handleCreate = () => {
    const id = Math.random().toString(36).substring(2, 7).toUpperCase();
    navigate(`/game/${id}`);
  };

  return (
    <div className="min-h-screen bg-nexora-bg text-nexora-text">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-20 bg-nexora-secondaryBg border-r border-nexora-border flex flex-col items-center py-8 gap-8">
        <div className="w-12 h-12 bg-gradient-to-br from-nexora-primary to-nexora-secondary rounded-xl flex items-center justify-center shadow-lg">
          <Zap className="text-white fill-white" size={24} />
        </div>
        <div className="flex flex-col gap-6 mt-12">
          <button onClick={() => navigate('/lobby')} title="Lobby" className="p-3 text-nexora-primary bg-nexora-primary/10 rounded-xl transition-all"><Gamepad2 size={24} /></button>
          <button onClick={() => navigate('/leaderboard')} title="Leaderboard" className="p-3 text-nexora-muted hover:text-nexora-text hover:bg-nexora-card rounded-xl transition-all"><Trophy size={24} /></button>
          <button onClick={() => navigate('/profile')} title="Profile" className="p-3 text-nexora-muted hover:text-nexora-text hover:bg-nexora-card rounded-xl transition-all"><User size={24} /></button>
          <button onClick={() => navigate('/shop')} title="Shop" className="p-3 text-nexora-muted hover:text-nexora-text hover:bg-nexora-card rounded-xl transition-all"><Settings size={24} /></button>
        </div>
        <button
          onClick={logout}
          className="mt-auto p-3 text-nexora-muted hover:text-red-400 transition-all"
        >
          <LogOut size={24} />
        </button>
      </aside>

      {/* Main Content */}
      <main className="pl-20 min-h-screen">
        <div className="max-w-7xl mx-auto p-8">
          {/* Header / User Stats */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-nexora-card border-2 border-nexora-primary rounded-2xl flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                {user?.avatar === 'av1' ? '🦊' : user?.avatar === 'av2' ? '🐺' : user?.avatar === 'av3' ? '🐯' : user?.avatar === 'av4' ? '🐼' : user?.avatar === 'av5' ? '🐉' : '🦄'}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.username || 'Rival'}!</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm font-medium text-nexora-primary bg-nexora-primary/10 px-2 py-0.5 rounded">LVL 1</span>
                  <div className="w-32 h-2 bg-nexora-card border border-nexora-border rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-nexora-primary shadow-[0_0_10px_rgba(139,92,246,0.5)]"></div>
                  </div>
                  <span className="text-xs text-nexora-muted">120 / 500 XP</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinModal(true)}
                className="px-6 py-3 bg-nexora-card border border-nexora-border rounded-xl font-semibold hover:bg-nexora-secondaryBg transition-all flex items-center gap-2"
              >
                <Search size={18} /> Join Room
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-nexora-primary rounded-xl font-bold text-white hover:bg-nexora-primary/90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)]"
              >
                <PlusCircle size={18} /> Create Room
              </button>
            </div>
          </header>

          {/* Quick Match / Featured */}
          <section className="mb-12">
            <div className="relative overflow-hidden bg-gradient-to-br from-nexora-primary/20 to-nexora-secondary/20 border border-nexora-primary/30 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="relative z-10">
                <h2 className="text-4xl font-black mb-2 italic tracking-tighter">QUICK MATCH</h2>
                <p className="text-nexora-muted max-w-md mb-6">Instantly match with rivals of your skill level. No waiting, just fighting.</p>
                <button onClick={() => navigate('/game/QUICK')} className="px-8 py-4 bg-nexora-primary rounded-xl text-white font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-xl">
                  Find Game <ArrowRight size={20} />
                </button>
              </div>
              <div className="hidden lg:block relative z-10 opacity-20">
                <Gamepad2 size={200} className="text-nexora-primary rotate-12" />
              </div>
              {/* Abstract background glow */}
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-nexora-primary/30 blur-[100px] rounded-full" />
            </div>
          </section>

          {/* Public Rooms */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <Users size={24} className="text-nexora-secondary" /> Active Arenas
              </h3>
              <span className="text-sm text-nexora-muted">12 Rooms Online</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Mock Room Cards */}
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-nexora-card border border-nexora-border p-5 rounded-2xl hover:border-nexora-primary/50 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-lg">Arena #{i}04</h4>
                      <p className="text-xs text-nexora-muted">Game: Quickdraw</p>
                    </div>
                    <div className="px-2 py-1 bg-nexora-secondaryBg rounded text-[10px] font-bold text-nexora-secondary uppercase">Public</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-nexora-muted">
                      <Users size={14} /> <span>{i+1}/8 Players</span>
                    </div>
                    <button
                      onClick={() => navigate(`/game/${i}04`)}
                      className="px-4 py-2 bg-nexora-secondaryBg group-hover:bg-nexora-primary group-hover:text-white rounded-lg text-sm font-bold transition-all"
                    >
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Modals (Simplistic implementation for now) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-nexora-bg/80 backdrop-blur-sm">
          <div className="bg-nexora-card border border-nexora-border p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Create New Arena</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-nexora-muted mb-2 block">Room Name</label>
                <input className="w-full bg-nexora-secondaryBg border border-nexora-border rounded-xl p-3 focus:outline-none focus:border-nexora-primary" placeholder="Enter room name..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-nexora-muted mb-2 block">Max Players</label>
                  <select className="w-full bg-nexora-secondaryBg border border-nexora-border rounded-xl p-3 focus:outline-none">
                    <option>2</option><option>4</option><option>8</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-nexora-muted mb-2 block">Privacy</label>
                  <select className="w-full bg-nexora-secondaryBg border border-nexora-border rounded-xl p-3 focus:outline-none">
                    <option>Public</option><option>Private</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 bg-nexora-secondaryBg rounded-xl font-semibold hover:bg-nexora-muted/20 transition-all">Cancel</button>
                <button onClick={handleCreate} className="flex-1 py-3 bg-nexora-primary rounded-xl font-bold text-white hover:bg-nexora-primary/90 transition-all">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 bg-nexora-bg/80 backdrop-blur-sm">
          <div className="bg-nexora-card border border-nexora-border p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">Join Arena</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-nexora-muted mb-2 block">Room Code</label>
                <input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="w-full bg-nexora-secondaryBg border border-nexora-border rounded-xl p-3 focus:outline-none focus:border-nexora-primary text-center text-2xl font-mono tracking-widest"
                  placeholder="XXXXX"
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setShowJoinModal(false)} className="flex-1 py-3 bg-nexora-secondaryBg rounded-xl font-semibold hover:bg-nexora-muted/20 transition-all">Cancel</button>
                <button onClick={handleJoin} className="flex-1 py-3 bg-nexora-primary rounded-xl font-bold text-white hover:bg-nexora-primary/90 transition-all">Join</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LobbyPage;
