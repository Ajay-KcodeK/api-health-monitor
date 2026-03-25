import React, { createContext, useContext, useState } from 'react';
import { AuthResponse } from '../types';

interface AuthContextType {
  user: AuthResponse | null;
  token: string | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // Initialize DIRECTLY from localStorage — not in useEffect
  // This runs synchronously before first render
  // So isAuthenticated is already true on first render if token exists
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [user, setUser] = useState<AuthResponse | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // () => { ... } is called a "lazy initializer"
  // useState runs this function ONCE synchronously during initialization
  // Much faster than useEffect which runs AFTER render

  const login = (data: AuthResponse) => {
    setToken(data.token);
    setUser(data);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  };


  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!token
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
