import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, username, avatar, xp, level }
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    // Simulation for now
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ id: '1', email });
    setLoading(false);
  };

  const register = async (email, password) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser({ id: '1', email });
    setLoading(false);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
