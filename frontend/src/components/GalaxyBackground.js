import { useRef, useEffect } from 'react';
import { useGalaxyCanvas } from '../hooks/use-galaxy-canvas';
import { NebulaClouds } from './NebulaClouds';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export const GalaxyBackground = ({ children }) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sync dark class on document root for Tailwind
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  useGalaxyCanvas(canvasRef, mouseRef, isDark);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
        <NebulaClouds isDark={isDark} />
      </div>
      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        data-testid="theme-toggle-btn"
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer border-0 transition-all duration-300 ${
          isDark
            ? 'bg-white/10 backdrop-blur-xl shadow-[0_4px_30px_rgba(139,92,246,0.3)] hover:bg-white/20'
            : 'bg-slate-900/10 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.15)] hover:bg-slate-900/20'
        }`}
      >
        {isDark ? (
          <Sun className="h-6 w-6 text-amber-300" />
        ) : (
          <Moon className="h-6 w-6 text-indigo-600" />
        )}
      </motion.button>
    </div>
  );
};
