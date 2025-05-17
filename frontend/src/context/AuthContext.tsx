import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signUp: (name: string, email: string, password: string, phone: string) => Promise<{ success: boolean; error?: string }>;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>; // <-- Add this line
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in (from localStorage in a real app)
    const storedUser = localStorage.getItem('tagalong-user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) return false;
      const data = await response.json();
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      localStorage.setItem('tagalong-user', JSON.stringify(data.user));
      // Optionally store token: localStorage.setItem('tagalong-token', data.token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('tagalong-user');
    localStorage.removeItem('tagalong-token');
  };

  const signUp = async (
    name: string, 
    email: string, 
    password: string, 
    phone: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { success: false, error: errorData.error || 'Registration failed. Please try again.' };
      }
      // Optionally, auto-login after signup:
      await login(email, password);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Something went wrong. Please try again.' };
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, login, logout, signUp, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};