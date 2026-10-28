import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await register(email, password);
    }
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-nexora-bg text-nexora-text flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-nexora-primary to-nexora-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            <span className="text-white text-3xl font-black">N</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-nexora-muted">
            {isLogin ? 'Enter the arena and reclaim your rank.' : 'Start your journey in the NEXORA arena.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-nexora-card border border-nexora-border p-8 rounded-3xl shadow-2xl">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-nexora-muted ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-nexora-muted" size={18} />
                <input
                  type="email"
                  required
                  className="w-full bg-nexora-secondaryBg border border-nexora-border rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-nexora-primary transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-nexora-muted ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-nexora-muted" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-nexora-secondaryBg border border-nexora-border rounded-xl py-3 pl-11 pr-12 focus:outline-none focus:border-nexora-primary transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-nexora-muted hover:text-nexora-text transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full mt-8 py-4 bg-nexora-primary rounded-xl text-white font-bold hover:bg-nexora-primary/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-50"
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Register')}
            {!loading && <ArrowRight size={18} />}
          </button>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-nexora-muted hover:text-nexora-text transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
