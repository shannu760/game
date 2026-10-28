import React, { useState } from 'react';

const LandingPage = ({ onPlayNow }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-cyan-400 rounded-lg shadow-lg flex items-center justify-center font-black text-white text-xl">N</div>
          <span className="text-2xl font-black tracking-tighter text-white">NEXORA</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Games</a>
          <a href="#" className="hover:text-white transition-colors">Leaderboards</a>
          <a href="#" className="hover:text-white transition-colors">Community</a>
        </div>
        <button onClick={onPlayNow} className="px-5 py-2 bg-white text-black font-bold rounded-full text-sm hover:bg-slate-200 transition-all">
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight">
          Your Next Rival <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            Is Online.
          </span>
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 font-medium leading-relaxed">
          Experience the next generation of real-time multiplayer gaming.
          Compete, climb the ranks, and dominate the arena in a seamless browser experience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onPlayNow}
            className="px-10 py-4 btn-primary text-white font-bold rounded-2xl text-lg shadow-xl"
          >
            Play Now
          </button>
          <button className="px-10 py-4 bg-slate-800 text-white font-bold rounded-2xl text-lg border border-slate-700 hover:bg-slate-700 transition-all">
            Explore Games
          </button>
        </div>

        {/* Trust/Social Proof */}
        <div className="mt-20 flex items-center gap-8 opacity-50 grayscale contrast-125">
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Trusted by 10k+ Gamers</div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 text-center text-slate-600 text-xs border-t border-slate-800">
        <p>© 2026 NEXORA Gaming. All rights reserved. | Terms & Privacy</p>
      </footer>
    </div>
  );
};

export default LandingPage;
