import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useTyping } from '../../context/TypingContext';
import {
  MenuIcon,
  XIcon,
  LogOutIcon,
  SettingsIcon,
  LayoutDashboardIcon,
  HistoryIcon,
  TrophyIcon,
  ZapIcon,
  PaletteIcon,
  BookOpenIcon,
} from 'lucide-react';
import { VisualTheme } from '../../types';

const THEME_CYCLE: VisualTheme[] = ['typewriter', 'midnight', 'daylight', 'forest', 'sakura'];
const THEME_ICONS: Record<VisualTheme, string> = {
  typewriter: '🖋️',
  midnight: '🌑',
  daylight: '☀️',
  forest: '🌲',
  sakura: '🌸',
};

const Logo = () => {
  const { settings } = useSettings();
  const isTypewriter = settings.visualTheme === 'typewriter';

  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg shadow-lg shadow-primary/20 ${
      isTypewriter
        ? 'bg-[#8b4513] text-[#f4edd8]'
        : 'bg-gradient-to-br from-primary to-amber-500 text-primary-foreground'
    }`}>
      {isTypewriter ? (
        <span className="text-sm font-bold" style={{ fontFamily: 'Special Elite' }}>CT</span>
      ) : (
        <svg width="18" height="18" viewBox="0 0 64 64" fill="none">
          <path d="M22 24L14 32L22 40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 24L50 32L42 40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
};

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { focusMode } = useTyping();
  const location = useLocation();
  const navigate = useNavigate();

  if (focusMode) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const cycleTheme = () => {
    const currentIdx = THEME_CYCLE.indexOf(settings.visualTheme);
    const nextIdx = (currentIdx + 1) % THEME_CYCLE.length;
    updateSettings({ visualTheme: THEME_CYCLE[nextIdx] });
  };

  const isActive = (path: string) => location.pathname === path;
  const isTypewriter = settings.visualTheme === 'typewriter';

  const navLink = 'px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5';
  const activeClass = 'bg-primary/10 text-primary';
  const inactiveClass = 'text-muted-foreground hover:text-foreground hover:bg-muted/60';

  const links = [
    { to: '/practice', label: isTypewriter ? 'Type' : 'Practice', icon: <ZapIcon size={15} /> },
    { to: '/fundamentals', label: 'CS Q&A', icon: <BookOpenIcon size={15} /> },
    { to: '/leaderboard', label: 'Leaderboard', icon: <TrophyIcon size={15} /> },
    ...(user
      ? [
          { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboardIcon size={15} /> },
          { to: '/history', label: 'History', icon: <HistoryIcon size={15} /> },
        ]
      : []),
  ];

  return (
    <nav className={`sticky top-0 z-50 glass border-b border-border/60 ${
      isTypewriter ? 'font-[var(--font-display)]' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <Logo />
            <span className="font-display font-bold text-lg text-foreground tracking-tight hidden sm:inline group-hover:text-primary transition-colors">
              {isTypewriter ? (
                <>Code<span className="text-primary">Type</span></>
              ) : (
                <>Code<span className="text-primary">Type</span></>
              )}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`${navLink} ${isActive(l.to) ? activeClass : inactiveClass}`}
              >
                {l.icon}
                {l.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme cycle button */}
            <button
              onClick={cycleTheme}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors text-sm"
              title={`Theme: ${settings.visualTheme} — click to cycle`}
            >
              <span className="text-base">{THEME_ICONS[settings.visualTheme]}</span>
              <PaletteIcon size={14} />
            </button>

            {user ? (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 bg-muted/60 hover:bg-muted rounded-full transition-colors"
                >
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.username}
                      className="w-6 h-6 rounded-full object-cover border border-border/40"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                      isTypewriter
                        ? 'bg-[#8b4513] text-[#f4edd8]'
                        : 'bg-gradient-to-br from-primary to-amber-500 text-primary-foreground'
                    }`}>
                      {user.username[0].toUpperCase()}
                    </span>
                  )}
                  <span className="text-sm font-medium text-foreground">{user.username}</span>
                </Link>
                <Link
                  to="/settings"
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                  title="Settings"
                >
                  <SettingsIcon size={18} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-muted-foreground hover:text-error hover:bg-error/10 transition-colors"
                  title="Logout"
                >
                  <LogOutIcon size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary px-4 py-2 text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border/60 py-3 flex flex-col gap-1 animate-fade-in">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${isActive(l.to) ? activeClass : inactiveClass}`}
              >
                {l.icon}
                {l.label}
              </Link>
            ))}
            {user && (
              <Link
                to="/settings"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${inactiveClass}`}
              >
                <SettingsIcon size={16} />
                Settings
              </Link>
            )}
            <button
              onClick={cycleTheme}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium ${inactiveClass} text-left`}
            >
              <span>{THEME_ICONS[settings.visualTheme]}</span>
              Theme: {settings.visualTheme.charAt(0).toUpperCase() + settings.visualTheme.slice(1)}
            </button>

            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/10 text-left"
              >
                <LogOutIcon size={16} />
                Logout ({user.username})
              </button>
            ) : (
              <div className="flex gap-2 px-4 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center btn btn-ghost py-2 text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center btn btn-primary py-2 text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
