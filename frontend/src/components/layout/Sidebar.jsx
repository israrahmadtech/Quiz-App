import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  HiHome, HiClipboardList, HiChartBar, HiUser,
  HiLogout, HiX, HiPlusCircle, HiCog, HiClock,
} from 'react-icons/hi';

const NavItem = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
        isActive
          ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20'
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`
    }
  >
    <Icon size={18} />
    {label}
  </NavLink>
);

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', icon: HiHome,          label: 'Dashboard' },
    { to: '/quizzes',   icon: HiClipboardList,  label: 'Browse Quizzes' },
    { to: '/history',   icon: HiClock,          label: 'My History' },
    { to: '/profile',   icon: HiUser,           label: 'Profile' },
  ];

  const adminItems = [
    { to: '/admin',         icon: HiChartBar,   label: 'Admin Overview' },
    { to: '/admin/quizzes', icon: HiCog,        label: 'Manage Quizzes' },
    { to: '/admin/quizzes/new', icon: HiPlusCircle, label: 'New Quiz' },
  ];

  const content = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-xl">⚡</div>
          <span className="font-bold text-white text-lg">QuizMaster</span>
        </div>
        <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-white p-1 rounded-lg hover:bg-slate-800">
          <HiX size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 pb-2 pt-1">Menu</p>
        {navItems.map((item) => <NavItem key={item.to} {...item} onClick={onClose} />)}

        {user?.role === 'admin' && (
          <>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 pb-2 pt-4">Admin</p>
            {adminItems.map((item) => <NavItem key={item.to} {...item} onClick={onClose} />)}
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 mb-1">
          <img
            src={user?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff`}
            alt={user?.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <HiLogout size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay (mobile) */}
      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-shrink-0 bg-slate-950 border-r border-slate-800 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile drawer */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-950 border-r border-slate-800 z-50 transform transition-transform duration-300 lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        {content}
      </aside>
    </>
  );
}
