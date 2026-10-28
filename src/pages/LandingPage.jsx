import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Gamepad2, Trophy, Users, Zap } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-nexora-bg text-nexora-text font-sans selection:bg-nexora-primary/30">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-nexora-primary to-nexora-secondary rounded-lg flex items-center justify-center">
            <Zap className="text-white fill-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tighter">NEXORA</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-nexora-muted">
          <a href="#games" className="hover:text-nexora-primary transition-colors">Games</a>
          <a href="#leaderboard" className="hover:text-nexora-primary transition-colors">Leaderboard</a>
          <button
            onClick={() => navigate('/auth')}
            className="px-5 py-2 bg-nexora-card border border-nexora-border rounded-full hover:bg-nexora-secondaryBg transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="px-5 py-2 bg-nexora-primary rounded-full text-white font-semibold hover:bg-nexora-primary/90 shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all"
          >
            Play Now
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nexora-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nexora-secondary/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 leading-tight">
            Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-nexora-primary to-nexora-secondary">Rival</span> <br />
            Is Online.
          </h1>
          <p className="text-lg md:text-xl text-nexora-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Enter the arena. Outsmart everyone. Real-time multiplayer battles in your browser. No downloads, just skill.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/auth')}
              className="group px-8 py-4 bg-nexora-primary rounded-full text-white text-lg font-bold hover:bg-nexora-primary/90 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(139,92,246,0.5)]"
            >
              Play Now
              <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button className="px-8 py-4 bg-nexora-card border border-nexora-border rounded-full text-lg font-semibold hover:bg-nexora-secondaryBg transition-all">
              Explore Games
            </button>
          </div>
        </div>
      </section>

      {/* Features/Games Section */}
      <section id="games" className="py-24 px-6 bg-nexora-secondaryBg/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-2 bg-nexora-primary/20 rounded-lg">
              <Gamepad2 className="text-nexora-primary" size={28} />
            </div>
            <h2 className="text-3xl font-bold">Featured Games</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Quickdraw Card */}
            <div className="group p-6 bg-nexora-card border border-nexora-border rounded-3xl hover:border-nexora-primary/50 transition-all cursor-pointer">
              <div className="w-14 h-14 bg-nexora-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-nexora-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Quickdraw</h3>
              <p className="text-nexora-muted mb-6 text-sm">Test your reflexes. The fastest finger wins the round. Real-time reaction battle.</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium px-3 py-1 bg-nexora-secondaryBg rounded-full text-nexora-secondary">2-8 Players</span>
                <div className="text-nexora-primary font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Play <ChevronRight size={16} />
                </div>
              </div>
            </div>

            {/* Placeholder Game 2 */}
            <div className="p-6 bg-nexora-card border border-nexora-border rounded-3xl opacity-60 grayscale cursor-not-allowed">
              <div className="w-14 h-14 bg-nexora-muted/10 rounded-2xl flex items-center justify-center mb-6">
                <Trophy className="text-nexora-muted" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
              <p className="text-nexora-muted mb-6 text-sm">New challenges are being forged in the arena. Stay tuned.</p>
            </div>

            {/* Placeholder Game 3 */}
            <div className="p-6 bg-nexora-card border border-nexora-border rounded-3xl opacity-60 grayscale cursor-not-allowed">
              <div className="w-14 h-14 bg-nexora-muted/10 rounded-2xl flex items-center justify-center mb-6">
                <Users className="text-nexora-muted" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
              <p className="text-nexora-muted mb-6 text-sm">Social gaming modes arriving soon to bring your squad together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-nexora-border bg-nexora-bg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-nexora-primary rounded-lg flex items-center justify-center">
              <Zap className="text-white fill-white" size={18} />
            </div>
            <span className="text-xl font-bold tracking-tighter">NEXORA</span>
          </div>
          <div className="flex gap-6 text-sm text-nexora-muted">
            <a href="#" className="hover:text-s-muted transition-colors">Terms</a>
            <a href="#" className="hover:text-s-muted transition-colors">Privacy</a>
            <a href="#" className="hover:text-s-muted transition-colors">Contact</a>
          </div>
          <p className="text-xs text-nexora-muted">© 2026 NEXORA Arena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
