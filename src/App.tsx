import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Calculator, ClipboardList, Phone, MessageCircle } from 'lucide-react';
import CalculatorPage from './pages/CalculatorPage';
import SavedJobsPage from './pages/SavedJobsPage';
import SharePage from './pages/SharePage';
import { cn } from './lib/utils';
import { motion } from 'framer-motion';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const LiquidDock = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Kalkulator', path: '/', icon: Calculator },
    { name: 'Moji Poslovi', path: '/jobs', icon: ClipboardList },
    { name: 'Pozovi', path: 'tel:+385991234567', icon: Phone, external: true },
    { name: 'WhatsApp', path: 'https://wa.me/385991234567', icon: MessageCircle, external: true },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-max">
      <div className="flex items-center gap-2 p-2 bg-[#1c1c1e]/70 backdrop-blur-3xl saturate-150 border border-white/10 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path && !item.external;
          
          const content = (
            <div className="relative p-3.5 sm:p-4 rounded-full flex items-center justify-center text-white transition-all active:scale-90 group cursor-pointer">
              {isActive && (
                <motion.div
                  layoutId="active-dock-pill"
                  className="absolute inset-0 bg-yellow-500/15 rounded-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <item.icon 
                className={cn(
                  "w-6 h-6 relative z-10 transition-colors duration-300", 
                  isActive ? "text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" : "text-gray-400 group-hover:text-white"
                )} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
            </div>
          );

          if (item.external) {
            return (
              <a key={item.name} href={item.path} target={item.path.startsWith('http') ? '_blank' : '_self'} rel="noreferrer" title={item.name}>
                {content}
              </a>
            );
          }

          return (
            <Link key={item.name} to={item.path} title={item.name}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      {/* Liquid App Container: Pure black background, constrained max width for app feel */}
      <div className="min-h-[100dvh] bg-black text-white font-sans selection:bg-yellow-500 selection:text-black flex flex-col relative overflow-x-hidden">
        
        {/* iOS style minimal status/header bar */}
        <header className="w-full max-w-md mx-auto pt-6 pb-2 px-4 flex justify-center sticky top-0 z-50 bg-black/80 backdrop-blur-xl">
          <div className="bg-[#1c1c1e] text-white px-5 py-2 rounded-full font-bold text-xs tracking-[0.2em] uppercase border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            AJMO.
          </div>
        </header>

        <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 pb-40">
          <Routes>
            <Route path="/" element={<CalculatorPage />} />
            <Route path="/jobs" element={<SavedJobsPage />} />
            <Route path="/share/:id" element={<SharePage />} />
          </Routes>
        </main>
        
        <LiquidDock />
      </div>
    </Router>
  );
}

export default App;
