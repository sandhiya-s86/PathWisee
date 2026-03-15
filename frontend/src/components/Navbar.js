import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { GraduationCap, User, LogOut, Menu, X, Home, Compass, LayoutDashboard, UserCircle, BookOpen, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navLinks = user ? [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/careers', label: 'Careers', icon: Compass },
    { path: '/exams', label: 'Exams', icon: BookOpen },
    { path: '/colleges', label: 'Colleges', icon: Building2 }
  ] : [
    { path: '/', label: 'Home', icon: Home },
    { path: '/careers', label: 'Explore Careers', icon: Compass }
  ];

  const isActive = (path) => location.pathname === path;

  const navBg = scrolled
    ? isDark
      ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-purple-900/10'
      : 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-slate-200/50'
    : isDark
      ? 'bg-slate-900/40 backdrop-blur-md'
      : 'bg-white/50 backdrop-blur-sm';

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2 group">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                <GraduationCap className={`h-8 w-8 ${isDark ? 'text-indigo-400' : 'text-blue-600'}`} />
              </motion.div>
              <span className={`text-2xl font-outfit font-bold ${isDark ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'}`}>
                PATHWISE
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.path} to={link.path}>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        className={`rounded-full px-5 gap-2 text-sm ${
                          isActive(link.path)
                            ? isDark
                              ? 'bg-indigo-500/20 text-indigo-300 font-semibold'
                              : 'bg-blue-100 text-blue-700 font-semibold'
                            : isDark
                              ? 'text-slate-300 hover:text-white hover:bg-white/10'
                              : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                        } transition-all duration-200`}
                        data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Button>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/profile">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-white/10 text-slate-200' : 'bg-slate-100 text-slate-700'}`}
                    >
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">{user.name}</span>
                    </motion.div>
                  </Link>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className={`rounded-full gap-2 ${isDark ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10' : 'text-red-600 hover:text-red-700 hover:bg-red-50'}`}
                      data-testid="nav-logout-btn"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        className={`rounded-full ${isDark ? 'text-slate-300 hover:text-white hover:bg-white/10' : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'}`}
                        data-testid="nav-login-btn"
                      >
                        Login
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/signup">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
                        data-testid="nav-signup-btn"
                      >
                        Get Started
                      </Button>
                    </motion.div>
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-white/10 text-white' : 'hover:bg-slate-100 text-slate-700'}`}
              data-testid="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`fixed top-16 left-0 right-0 z-40 border-b shadow-lg md:hidden ${
              isDark ? 'bg-slate-900/95 backdrop-blur-xl border-white/5' : 'bg-white/95 backdrop-blur-lg border-slate-200'
            }`}
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 rounded-xl ${
                        isActive(link.path)
                          ? isDark ? 'bg-indigo-500/20 text-indigo-300 font-semibold' : 'bg-blue-100 text-blue-700 font-semibold'
                          : isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Button>
                  </Link>
                );
              })}
              <div className={`pt-4 mt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                      <div className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl ${isDark ? 'bg-white/5 text-slate-200' : 'bg-slate-50 text-slate-700'}`}>
                        <User className="h-5 w-5" />
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </Link>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className={`w-full justify-start gap-3 rounded-xl ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className={`w-full rounded-xl ${isDark ? 'border-white/20 text-white' : ''}`}>Login</Button>
                    </Link>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16"></div>
    </>
  );
};
