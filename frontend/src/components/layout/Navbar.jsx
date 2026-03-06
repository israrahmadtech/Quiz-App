import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { FiZap, FiMenu, FiX, FiLogOut, FiUser, FiBookOpen, FiHome, FiClock, FiShield } from 'react-icons/fi';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const navLinks = user ? [
    { to: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { to: '/quizzes', label: 'Quizzes', icon: <FiBookOpen /> },
    { to: '/history', label: 'History', icon: <FiClock /> },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', icon: <FiShield /> }] : []),
  ] : [];

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-white/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-white">
            <span className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <FiZap className="text-white text-sm" />
            </span>
            QuizMaster
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(l => (
              <NavLink key={l.to} to={l.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                   ${isActive ? 'bg-brand-600/20 text-brand-400' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                {l.icon}{l.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {user.avatar?.url
                    ? <img src={user.avatar.url} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-600/50" />
                    : <div className="w-8 h-8 rounded-full bg-brand-600/30 flex items-center justify-center text-brand-400 text-sm font-semibold">
                        {user.name?.[0]?.toUpperCase()}
                      </div>
                  }
                  <span className="text-sm font-medium text-gray-300">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="btn-secondary py-1.5 px-3 text-sm flex items-center gap-1.5">
                  <FiLogOut className="text-sm" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary py-1.5 px-4 text-sm">Login</Link>
                <Link to="/register" className="btn-primary py-1.5 px-4 text-sm">Sign Up</Link>
              </>
            )}
          </div>

          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setOpen(!open)}>
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass-dark border-t border-white/5 px-4 pb-4 animate-slide-down">
          {navLinks.map(l => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium my-0.5
                 ${isActive ? 'bg-brand-600/20 text-brand-400' : 'text-gray-400'}`}>
              {l.icon}{l.label}
            </NavLink>
          ))}
          {user ? (
            <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-3 py-3 text-sm text-red-400 mt-2">
              <FiLogOut /> Logout
            </button>
          ) : (
            <div className="flex gap-2 mt-3">
              <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary py-2 text-sm flex-1 text-center">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary py-2 text-sm flex-1 text-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
