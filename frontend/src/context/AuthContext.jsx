import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if token exists
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    return storedToken && storedUsername ? { username: storedUsername } : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading] = useState(false); // No async initialization needed

  useEffect(() => {
    // Set axios default header if token exists
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/login`, {
        username,
        password
      });
      
      const { token: newToken, username: loggedUsername } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('username', loggedUsername);
      setToken(newToken);
      setUser({ username: loggedUsername });
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE}/api/auth/register`, {
        username,
        password
      });
      
      const { token: newToken, username: registeredUsername } = response.data;
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('username', registeredUsername);
      setToken(newToken);
      setUser({ username: registeredUsername });
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const enterAsGuest = () => {
    setUser({ username: 'Guest', isGuest: true });
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    enterAsGuest,
    isAuthenticated: !!token,
    isGuest: user?.isGuest || false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
