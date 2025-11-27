import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmployeeBackground from '../components/EmployeeBackground';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register, enterAsGuest, isAuthenticated, isGuest } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated || isGuest) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isGuest, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = isLogin 
      ? await login(username, password)
      : await register(username, password);

    setLoading(false);

    if (!result.success) {
      setError(result.error);
    }
    // Navigation will happen automatically via useEffect when auth state updates
  };

  const handleGuestAccess = () => {
    enterAsGuest();
    // Navigation will happen automatically via useEffect
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#05060d] via-[#0b1a45] to-[#020614] px-4 overflow-hidden">
      {/* Animated Employee Avatars in Background */}
      <EmployeeBackground />
      
      {/* Login Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-6xl">⚡</span>
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300 mb-2 drop-shadow-lg">
            TaskFlow
          </h1>
          <p className="text-gray-400 text-sm">
            {isLogin ? 'Sign in to manage tasks' : 'Create your account'}
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full glass-input p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-[0_10px_30px_rgba(16,134,255,0.45)]"
            >
              {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Register')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-blue-300 hover:text-blue-200 text-sm transition-colors"
            >
              {isLogin 
                ? "Don't have an account? Register" 
                : "Already have an account? Sign In"}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-gray-400">OR</span>
            </div>
          </div>

          <button
            onClick={handleGuestAccess}
            className="w-full glass-panel border border-white/20 hover:border-white/40 text-gray-300 hover:text-white font-medium py-3 rounded-xl transition-all duration-300"
          >
            Continue as Guest (View Only)
          </button>

          <p className="mt-4 text-xs text-gray-500 text-center">
            Guest mode allows you to view tasks but not create or modify them
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
