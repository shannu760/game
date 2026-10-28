import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const QuickDrawGame = ({ room, user, onReturn }) => {
  const [gameState, setGameState] = useState('waiting'); // waiting | starting | active | results
  const [reactionTime, setReactionTime] = useState(null);
  const [falseStart, setFalseStart] = useState(false);
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    socket.emit('join_room', { roomId: room.id, profileId: user.id });

    socket.on('game_state_change', ({ state }) => {
      setGameState(state);
      setFalseStart(false);
      setReactionTime(null);
    });

    socket.on('false_start', () => {
      setFalseStart(true);
      setReactionTime(null);
    });

    socket.on('game_results', ({ rankings }) => {
      setRankings(rankings);
      setGameState('results');
    });

    return () => {
      socket.off('game_state_change');
      socket.off('false_start');
      socket.off('game_results');
    };
  }, [room.id, user.id]);

  const handleReaction = () => {
    if (gameState !== 'active') return;

    // Client-side timing for UI immediate feedback,
    // but server handles the authoritative result.
    // We just notify the server that we clicked.
    socket.emit('submit_reaction', {
      roomId: room.id,
      profileId: user.id
    });
  };

  return (
    <div className="min-h-screen bg-[#080B14] flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <div className="flex justify-between items-center mb-12">
          <button
            onClick={onReturn}
            className="text-slate-500 hover:text-white transition-colors text-xs uppercase font-bold"
          >
            ← Exit Arena
          </button>
          <div className="px-4 py-1 bg-slate-800 rounded-full text-xs font-mono text-cyan-400 border border-slate-700">
            ROOM: {room.id}
          </div>
        </div>

        <div className="relative w-full aspect-square max-w-md mx-auto rounded-3xl flex items-center justify-center overflow-hidden transition-all duration-500 border-4 border-slate-800 shadow-2xl">
          {gameState === 'waiting' && (
            <div className="flex flex-col items-center p-8 animate-fade-in">
              <div className="text-6xl mb-6">⏳</div>
              <h2 className="text-3xl font-black text-white mb-4">Waiting for Opponents</h2>
              <p className="text-slate-400">The host will start the match soon.</p>
              {/* In a real app, we'd list players here */}
            </div>
          )}

          {gameState === 'starting' && (
            <div className="flex flex-col items-center p-8 animate-pulse">
              <h2 className="text-5xl font-black text-yellow-400 italic tracking-tighter">GET READY...</h2>
              <p className="text-slate-500 mt-4 uppercase font-bold tracking-widest">Click exactly when it turns GREEN</p>
            </div>
          )}

          {gameState === 'active' && (
            <button
              onClick={handleReaction}
              className="w-full h-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-black font-black text-6xl transition-all active:scale-95 shadow-[0_0_50px_rgba(52,211,153,0.5)]"
            >
              CLICK!
            </button>
          )}

          {gameState === 'results' && (
            <div className="p-8 w-full h-full bg-[#151D30] animate-fade-in overflow-y-auto">
              <h2 className="text-4xl font-black text-white mb-8">Match Results</h2>
              <div className="space-y-4">
                {rankings.map((res, idx) => (
                  <div key={res.id} className={`flex justify-between items-center p-4 rounded-xl ${idx === 0 ? 'bg-violet-500/20 border border-violet-500' : 'bg-slate-800 border border-slate-700'}`}>
                    <div className="flex items-center gap-4">
                      <span className="font-black text-xl w-6">{idx + 1}.</span>
                      <span className="font-bold text-white">{res.id === user.id ? 'YOU' : 'Player'}</span>
                    </div>
                    <span className="font-mono font-bold text-cyan-400">{res.time}ms</span>
                  </div>
                ))}
              </div>
              <button
                onClick={onReturn}
                className="mt-8 w-full py-4 btn-primary text-white font-bold rounded-xl"
              >
                Return to Lobby
              </button>
            </div>
          )}

          {falseStart && (
            <div className="absolute inset-0 bg-red-600/90 flex flex-col items-center justify-center p-8 text-center">
              <h2 className="text-5xl font-black text-white mb-4">FALSE START!</h2>
              <p className="text-white/80">You clicked too early. Please wait for the signal.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickDrawGame;
