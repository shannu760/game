import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { Zap, RotateCcw, Home, AlertCircle, Users, Trophy, UserPlus, Wifi, WifiOff } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || (typeof window !== 'undefined' && window.location.protocol === 'https:' ? '' : 'http://localhost:3001');

const GamePage = () => {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [gameMode, setGameMode] = useState('connecting'); // 'online' | 'local'
  const socketRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize room and connection
  useEffect(() => {
    if (!user) return;

    let isSubscribed = true;
    let localRoom = {
      id: roomId,
      players: [
        { id: 'me', username: user.username || 'Rival', avatar: user.avatar || 'av1' }
      ],
      state: 'waiting',
      startTime: null
    };

    // Attempt Socket connection only if BACKEND_URL is available
    if (BACKEND_URL) {
      try {
        const s = io(BACKEND_URL, {
          timeout: 3000,
          reconnectionAttempts: 2,
          transports: ['websocket', 'polling']
        });
        socketRef.current = s;

        s.on('connect', () => {
          if (!isSubscribed) return;
          setIsOnline(true);
          setGameMode('online');
          s.emit('room:join', {
            roomId,
            player: { username: user.username || 'Rival', avatar: user.avatar || 'av1' }
          });
        });

        s.on('room:state', (state) => {
          if (!isSubscribed) return;
          setRoom(state);
        });

        s.on('error', (msg) => {
          if (!isSubscribed) return;
          setError(msg);
          setTimeout(() => navigate('/lobby'), 3000);
        });

        s.on('connect_error', () => {
          if (!isSubscribed) return;
          // Fallback to local mode after timeout
          setIsOnline(false);
          setGameMode('local');
          setRoom((prev) => prev || localRoom);
        });
      } catch (err) {
        console.warn('Socket connection failed, using local arena:', err);
        setGameMode('local');
        setRoom(localRoom);
      }
    }

    // Safety fallback: If no room state after 2 seconds, activate local arena
    const fallbackTimer = setTimeout(() => {
      if (isSubscribed && !room) {
        setGameMode('local');
        setRoom((prev) => prev || localRoom);
      }
    }, 2000);

    return () => {
      isSubscribed = false;
      clearTimeout(fallbackTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId, user, navigate]);

  // Handle Add Bot in local mode
  const handleAddBot = () => {
    if (!room) return;
    const botAvatars = ['av2', 'av3', 'av4', 'av5'];
    const botNames = ['CyberWolf', 'ZenReflex', 'ShadowNinja', 'NeoPulse'];
    const nextIdx = room.players.length;
    if (nextIdx >= 8) return;

    const newBot = {
      id: 'bot_' + nextIdx,
      username: botNames[nextIdx % botNames.length],
      avatar: botAvatars[nextIdx % botAvatars.length],
      isBot: true
    };

    const updated = {
      ...room,
      players: [...room.players, newBot]
    };
    setRoom(updated);

    if (gameMode === 'online' && socketRef.current?.connected) {
      // In online mode server handles players, but local reflection gives instant feedback
    }
  };

  // Start game handler
  const handleStart = () => {
    if (gameMode === 'online' && socketRef.current?.connected) {
      socketRef.current.emit('room:start', roomId);
      return;
    }

    // Local Arena game loop
    const readyRoom = {
      ...room,
      state: 'countdown',
      startTime: null,
      players: room.players.map((p) => ({ ...p, reactionTime: undefined }))
    };
    setRoom(readyRoom);

    // Random delay between 2 and 5 seconds
    const delay = Math.floor(Math.random() * 3000) + 2000;
    timerRef.current = setTimeout(() => {
      const startTime = Date.now();
      setRoom((prev) => ({
        ...prev,
        state: 'go',
        startTime
      }));

      // Simulate bot reactions if bots are present
      readyRoom.players.forEach((p) => {
        if (p.isBot) {
          const botDelay = Math.floor(Math.random() * 150) + 220; // 220ms - 370ms
          setTimeout(() => {
            setRoom((curr) => {
              if (!curr || curr.state !== 'go') return curr;
              const updatedPlayers = curr.players.map((pl) =>
                pl.id === p.id ? { ...pl, reactionTime: botDelay } : pl
              );
              const allDone = updatedPlayers.every((pl) => pl.reactionTime !== undefined);
              return {
                ...curr,
                players: updatedPlayers,
                state: allDone ? 'results' : curr.state
              };
            });
          }, botDelay);
        }
      });
    }, delay);
  };

  // Click handler
  const handleClick = () => {
    if (gameMode === 'online' && socketRef.current?.connected) {
      socketRef.current.emit('game:click', { roomId });
      return;
    }

    // Local Arena Click Handler
    if (!room) return;

    if (room.state === 'countdown') {
      // False start
      if (timerRef.current) clearTimeout(timerRef.current);
      const updated = {
        ...room,
        state: 'results',
        players: room.players.map((p) =>
          p.id === 'me' ? { ...p, reactionTime: -1 } : { ...p, reactionTime: Math.floor(Math.random() * 200) + 250 }
        )
      };
      setRoom(updated);
    } else if (room.state === 'go') {
      const time = Date.now() - (room.startTime || Date.now());
      const updatedPlayers = room.players.map((p) =>
        p.id === 'me' ? { ...p, reactionTime: time } : p
      );
      const allDone = updatedPlayers.every((p) => p.reactionTime !== undefined);
      setRoom({
        ...room,
        players: updatedPlayers,
        state: allDone ? 'results' : 'go'
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-nexora-bg text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle size={48} className="mx-auto text-red-500" />
          <p className="text-xl font-bold">{error}</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-nexora-bg text-white flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-nexora-primary"></div>
        <p className="text-nexora-muted font-medium text-sm animate-pulse">Entering Arena...</p>
      </div>
    );
  }

  const myId = (socketRef.current && socketRef.current.id) || 'me';
  const me = room.players.find((p) => p.id === myId || p.id === 'me');
  const isHost = room.players[0]?.id === myId || room.players[0]?.id === 'me';

  return (
    <div className="min-h-screen bg-nexora-bg text-nexora-text flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Background Glow */}
      <div
        className={`absolute inset-0 transition-colors duration-300 pointer-events-none ${
          room.state === 'go'
            ? 'bg-nexora-success/20'
            : room.state === 'countdown'
            ? 'bg-nexora-warning/20'
            : 'bg-transparent'
        }`}
      />

      <div className="relative z-10 w-full max-w-4xl text-center">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate('/lobby')}
            className="p-3 bg-nexora-card border border-nexora-border rounded-xl hover:bg-nexora-secondaryBg transition-all flex items-center gap-2 text-sm font-semibold"
          >
            <Home size={18} />
            <span>Lobby</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="text-xl font-black tracking-tighter italic text-nexora-muted">
              ROOM <span className="text-white">{roomId}</span>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
                isOnline
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
              }`}
            >
              {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span>{isOnline ? 'Online Multiplayer' : 'Practice Arena'}</span>
            </div>
          </div>

          <div className="w-20 flex justify-end">
            {room.state === 'waiting' && room.players.length < 8 && (
              <button
                onClick={handleAddBot}
                title="Add AI Rival"
                className="px-3 py-2 bg-nexora-card border border-nexora-border rounded-xl hover:bg-nexora-secondaryBg text-xs font-bold flex items-center gap-1.5 text-nexora-secondary transition-all"
              >
                <UserPlus size={14} />
                <span>+ Rival</span>
              </button>
            )}
          </div>
        </div>

        {/* Game Arena Center Box */}
        <div
          className={`relative w-full aspect-square max-w-md mx-auto rounded-3xl flex items-center justify-center transition-all duration-200 border-8 shadow-2xl ${
            room.state === 'waiting'
              ? 'border-nexora-card bg-nexora-card/30'
              : room.state === 'countdown'
              ? 'border-nexora-warning bg-nexora-warning/10 cursor-pointer'
              : room.state === 'go'
              ? 'border-nexora-success bg-nexora-success/20 cursor-pointer'
              : 'border-nexora-primary bg-nexora-card/60'
          }`}
          onClick={room.state === 'countdown' || room.state === 'go' ? handleClick : undefined}
        >
          {/* WAITING STATE */}
          {room.state === 'waiting' && (
            <div className="text-center p-6 space-y-4">
              <div className="w-16 h-16 bg-nexora-primary/10 rounded-2xl flex items-center justify-center mx-auto text-nexora-primary">
                <Users size={36} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">Rivals in Arena</h2>
                <p className="text-sm text-nexora-muted">
                  {room.players.length}/8 Ready to Battle
                </p>
              </div>

              {/* Player Badges */}
              <div className="flex flex-wrap gap-2 justify-center max-w-xs mx-auto py-2">
                {room.players.map((p) => (
                  <span
                    key={p.id}
                    className="px-3 py-1 bg-nexora-secondaryBg border border-nexora-border rounded-full text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>{p.avatar === 'av2' ? '🐺' : p.avatar === 'av3' ? '🐯' : p.avatar === 'av5' ? '🐉' : '🦊'}</span>
                    <span>{p.username}</span>
                  </span>
                ))}
              </div>

              {isHost && (
                <button
                  onClick={handleStart}
                  className="px-8 py-3.5 bg-nexora-primary rounded-xl font-bold text-white hover:bg-nexora-primary/90 transition-all shadow-[0_0_25px_rgba(139,92,246,0.5)] transform hover:scale-105 active:scale-95"
                >
                  Start Battle
                </button>
              )}
            </div>
          )}

          {/* COUNTDOWN STATE */}
          {room.state === 'countdown' && (
            <div className="text-center p-6 space-y-4">
              <h2 className="text-5xl font-black text-nexora-warning italic tracking-tighter animate-pulse">
                GET READY...
              </h2>
              <p className="text-xs text-nexora-muted uppercase font-bold tracking-widest">
                Wait for GREEN • Click too early = False Start!
              </p>
            </div>
          )}

          {/* GO STATE */}
          {room.state === 'go' && (
            <button
              onClick={handleClick}
              className="w-64 h-64 bg-nexora-success rounded-full text-slate-950 text-5xl font-black shadow-[0_0_60px_rgba(52,211,153,0.8)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            >
              CLICK!
            </button>
          )}

          {/* RESULTS STATE */}
          {room.state === 'results' && (
            <div className="text-center p-6 w-full max-h-[380px] overflow-y-auto space-y-4">
              <div className="w-12 h-12 bg-yellow-500/20 text-yellow-400 rounded-full flex items-center justify-center mx-auto">
                <Trophy size={24} />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Round Leaderboard</h2>

              <div className="space-y-2 max-w-xs mx-auto">
                {[...room.players]
                  .sort((a, b) => {
                    const timeA = a.reactionTime === undefined || a.reactionTime < 0 ? 99999 : a.reactionTime;
                    const timeB = b.reactionTime === undefined || b.reactionTime < 0 ? 99999 : b.reactionTime;
                    return timeA - timeB;
                  })
                  .map((p, i) => (
                    <div
                      key={p.id}
                      className={`flex justify-between items-center p-2.5 rounded-xl text-sm ${
                        p.id === myId || p.id === 'me'
                          ? 'bg-nexora-primary/20 border border-nexora-primary font-bold'
                          : 'bg-nexora-card border border-nexora-border'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-nexora-muted font-mono w-4">#{i + 1}</span>
                        <span>{p.username}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-nexora-secondary">
                        {p.reactionTime === -1
                          ? 'False Start'
                          : p.reactionTime !== undefined
                          ? `${p.reactionTime}ms`
                          : 'DNF'}
                      </span>
                    </div>
                  ))}
              </div>

              <button
                onClick={handleStart}
                className="px-6 py-2.5 bg-nexora-primary rounded-xl font-bold text-white flex items-center gap-2 mx-auto hover:bg-nexora-primary/90 transition-all text-sm shadow-lg hover:scale-105"
              >
                <RotateCcw size={16} /> Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
