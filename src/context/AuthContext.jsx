import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('nexora_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('nexora_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('nexora_user');
      }
    } catch {
      // ignore
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    const username = email.split('@')[0] || 'Rival';
    setUser({ id: 'user_' + Date.now(), email, username, avatar: 'av1', level: 1, xp: 120 });
    setLoading(false);
  };

  const register = async (email, password) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    const username = email.split('@')[0] || 'Rival';
    setUser({ id: 'user_' + Date.now(), email, username, avatar: 'av1', level: 1, xp: 120 });
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexora_user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
