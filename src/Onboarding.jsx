import React, { useState, useEffect } from 'react';

const Onboarding = ({ onComplete }) => {
  const [formData, setFormData] = useState({ displayName: '', avatar: 'default' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      // Store user ID in localStorage for the session
      localStorage.setItem('nexora_user_id', data.id);
      localStorage.setItem('nexora_display_name', data.displayName);

      onComplete(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#080B14]">
      <div className="max-w-md w-full bg-[#151D30] p-8 rounded-3xl border border-slate-700 shadow-2xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-cyan-400 rounded-2xl mx-auto mb-4 flex items-center justify-center font-black text-white text-2xl shadow-lg">N</div>
          <h2 className="text-3xl font-black text-white">Create Identity</h2>
          <p className="text-slate-400 mt-2">Enter the arena with a unique name.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Display Name</label>
            <input
              type="text"
              required
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              placeholder="e.g. CyberGhost_99"
              className="w-full p-4 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-violet-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Choose Avatar</label>
            <div className="grid grid-cols-4 gap-3">
              {['👤', '🦊', '🤖', '👽'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar: emoji })}
                  className={`p-3 text-2xl rounded-xl border-2 transition-all ${
                    formData.avatar === emoji ? 'border-violet-500 bg-violet-500/20 scale-110' : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {error && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg text-center">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 btn-primary text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? 'Syncing...' : 'Enter Arena'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
