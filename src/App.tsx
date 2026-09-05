import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Calculator, ClipboardList } from "lucide-react";
import CalculatorPage from "./pages/CalculatorPage";
import SavedJobsPage from "./pages/SavedJobsPage";
import SharePage from "./pages/SharePage";
import { cn } from "./lib/utils";
import { motion } from "framer-motion";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const NativeTabBar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Kalkulator", path: "/", icon: Calculator },
    { name: "Spremljeno", path: "/jobs", icon: ClipboardList },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-[#1c1c1e]/80 backdrop-blur-xl border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-[68px] px-2 w-full max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className="flex flex-col items-center justify-center w-full h-full pt-1 tap-highlight-transparent"
            >
              <item.icon
                className={cn(
                  "w-7 h-7 mb-1 transition-all duration-200",
                  isActive ? "text-yellow-500 scale-105" : "text-gray-500",
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-[10px] font-medium tracking-wide transition-colors",
                  isActive ? "text-yellow-500" : "text-gray-500",
                )}
              >
                {item.name}
              </span>
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
      {/* iOS App Container: Full screen, proper safe areas, no horizontal scrolling */}
      <div className="min-h-[100dvh] bg-black text-white font-sans selection:bg-yellow-500 selection:text-black flex flex-col relative w-full overflow-x-hidden pt-[env(safe-area-inset-top)]">
        {/* iOS style minimal header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 pt-[env(safe-area-inset-top)]">
          <div className="h-14 flex items-center justify-center px-4 w-full">
            <h1 className="text-[17px] font-semibold tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
              AJMO
            </h1>
          </div>
        </header>

        {/* Adjust top padding for header + safe area, bottom padding for tab bar + safe area */}
        <main className="flex-1 w-full max-w-md mx-auto px-4 pt-[calc(3.5rem+env(safe-area-inset-top))] pb-[calc(5rem+env(safe-area-inset-bottom))]">
          <Routes>
            <Route path="/" element={<CalculatorPage />} />
            <Route path="/jobs" element={<SavedJobsPage />} />
            <Route path="/share/:id" element={<SharePage />} />
          </Routes>
        </main>

        <NativeTabBar />
      </div>
    </Router>
  );
}

export default App;
