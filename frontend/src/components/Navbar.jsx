import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isGuest, logout } = useAuth();

  const active = (path) =>
    location.pathname === path
      ? "bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.4)]"
      : "hover:bg-white/5";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div 
      className="fixed top-4 left-1/2 w-[90%] z-50 glass-panel rounded-2xl px-8 py-4 
                 flex justify-between items-center backdrop-blur-xl border border-white/10"
      style={{ transform: 'translateX(-50%)' }}
    >
      {/* Logo */}
      <Link 
        to="/" 
        className="flex items-center gap-3 text-3xl font-bold bg-clip-text text-transparent 
                   bg-gradient-to-r from-blue-300 to-purple-300 drop-shadow-lg"
      >
        <span className="text-4xl">⚡</span>
        TaskFlow
      </Link>

      {/* Center Navigation */}
      <div className="flex gap-4">
        <Link to="/" className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${active("/")}`}>
          Dashboard
        </Link>
        <Link to="/employees" className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${active("/employees")}`}>
          Employees
        </Link>
      </div>

      {/* User Info + Logout */}
      <div className="flex items-center gap-4">
        {isAuthenticated && user && (
          <span className="text-sm text-blue-200 font-medium">
            Hello, <span className="text-white font-semibold">{user.username || user.email || 'User'}</span>
          </span>
        )}

        {isGuest && (
          <span className="text-sm text-slate-400">
            <span className="text-blue-300">👤</span> Guest Mode
          </span>
        )}

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm 
                     transition shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        >
          {isGuest ? "Login" : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
