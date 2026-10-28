import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { Zap, RotateCcw, Home, AlertCircle, Users, Trophy } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const socket = io(BACKEND_URL);

const GamePage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    socket.emit('room:join', {
      roomId,
      player: { username: user.username, avatar: user.avatar }
    });

    socket.on('room:state', (state) => {
      setRoom(state);
    });

    socket.on('error', (msg) => {
      setError(msg);
      setTimeout(() => navigate('/lobby'), 3000);
    });

    return () => {
      socket.off('room:state');
      socket.off('error');
    };
  }, [roomId, user, navigate]);

  const handleStart = () => {
    socket.emit('room:start', roomId);
  };

  const handleClick = () => {
    socket.emit('game:click', { roomId });
  };

  if (error) return (
    <div className="min-h-screen bg-nexora-bg text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <AlertCircle size={48} className="mx-auto text-red-500" />
        <p className="text-xl font-bold">{error}</p>
      </div>
    </div>
  );

  if (!room) return (
    <div className="min-h-screen bg-nexora-bg text-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-nexora-primary"></div>
    </div>
  );

  const me = room.players.find(p => p.id === socket.id);
  const isHost = room.players[0]?.id === socket.id;
  const myReaction = me?.reactionTime;

  return (
    <div className="min-h-screen bg-nexora-bg text-nexora-text flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className={`absolute inset-0 transition-colors duration-300 ${
        room.state === 'go' ? 'bg-nexora-success/20' :
        room.state === 'countdown' ? 'bg-nexora-warning/20' : 'bg-transparent'
      }`} />

      <div className="relative z-10 w-full max-w-4xl text-center">
        <div className="flex justify-between items-center mb-12">
          <button onClick={() => navigate('/lobby')} className="p-3 bg-nexora-card border border-nexora-border rounded-xl hover:bg-nexora-secondaryBg transition-all">
            <Home size={24} />
          </button>
          <div className="text-2xl font-black tracking-tighter italic text-nexora-muted">ROOM {roomId}</div>
          <div className="w-12" /> {/* Spacer */}
        </div>

        {/* Game Area */}
        <div className={`relative w-full aspect-square max-w-md mx-auto rounded-full flex items-center justify-center transition-all duration-200 border-8 ${
          room.state === 'waiting' ? 'border-nexora-card' :
          room.state === 'countdown' ? 'border-nexora-warning' :
          room.state === 'go' ? 'border-nexora-success' : 'border-nexora-primary'
        }`}>
          {room.state === 'waiting' && (
            <div className="text-center">
              <Users size={64} className="mx-auto mb-4 text-nexora-muted" />
              <h2 className="text-2xl font-bold mb-2">Waiting for Rivals</h2>
              <p className="text-nexora-muted mb-6">{room.players.length}/8 Joined</p>
              {isHost && room.players.length >= 2 && (
                <button
                  onClick={handleStart}
                  className="px-8 py-3 bg-nexora-primary rounded-full font-bold hover:scale-105 transition-transform"
                >
                  Start Battle
                </button>
              )}
            </div>
          )}

          {room.state === 'countdown' && (
            <div className="text-center">
              <h2 className="text-6xl font-black text-nexora-warning animate-pulse">GET READY...</h2>
              <p className="mt-4 text-nexora-muted">Click too early = False Start!</p>
            </div>
          )}

          {room.state === 'go' && (
            <button
              onClick={handleClick}
              className="w-64 h-64 bg-nexora-success rounded-full text-white text-4xl font-black shadow-[0_0_50px_rgba(52,211,153,0.6)] hover:scale-95 active:scale-90 transition-all"
            >
              CLICK!
            </button>
          )}

          {room.state === 'results' && (
            <div className="text-center">
              <Trophy size={64} className="mx-auto mb-4 text-nexora-primary" />
              <h2 className="text-4xl font-black mb-6">Battle Ended</h2>
              <div className="space-y-2 max-w-xs mx-auto">
                {room.players
                  .sort((a, b) => (a.reactionTime || 9999) - (b.reactionTime || 9999))
                  .map((p, i) => (
                    <div key={p.id} className={`flex justify-between p-3 rounded-xl ${p.id === socket.id ? 'bg-nexora-primary/20 border border-nexora-primary' : 'bg-nexora-card border border-nexora-border'}`}>
                      <span className="font-bold">#{i+1} {p.username}</span>
                      <span className="font-mono">
                        {p.reactionTime === -1 ? 'False Start' : p.reactionTime ? `${p.reactionTime}ms` : 'DNF'}
                      </span>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => socket.emit('room:start', roomId)}
                className="mt-8 px-8 py-3 bg-nexora-primary rounded-full font-bold flex items-center gap-2 mx-auto hover:scale-105 transition-transform"
              >
                <RotateCcw size={20} /> Rematch
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
