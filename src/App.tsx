import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Calculator, ClipboardList, BarChart3 } from "lucide-react";
import CalculatorPage from "./pages/CalculatorPage";
import SavedJobsPage from "./pages/SavedJobsPage";
import SharePage from "./pages/SharePage";
import StatsPage from "./pages/StatsPage";
import { cn } from "./lib/utils";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { name: "Kalkulator", path: "/", icon: Calculator },
    { name: "Spremljeno", path: "/jobs", icon: ClipboardList },
    { name: "Statistika", path: "/stats", icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Floating Dock */}
      <div className="md:hidden fixed bottom-6 left-4 right-4 z-[100] pb-[env(safe-area-inset-bottom)] pointer-events-none">
        <div className="bg-[#1c1c1e]/70 backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-[32px] overflow-hidden pointer-events-auto">
          <div className="flex justify-around items-center h-[72px] px-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex flex-col items-center justify-center w-full h-full pt-1 tap-highlight-transparent relative"
                >
                  {isActive && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-yellow-500/20 rounded-full blur-md" />
                  )}
                  <item.icon
                    className={cn(
                      "w-7 h-7 mb-1 transition-all duration-300 relative z-10",
                      isActive ? "text-yellow-500 scale-110" : "text-gray-500",
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-bold tracking-wide transition-colors relative z-10",
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
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-72 fixed top-0 left-0 bottom-0 bg-black/40 backdrop-blur-3xl border-r border-white/5 p-6 z-50">
        <div className="flex items-center gap-3 px-4 py-8 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)]">
            <span className="text-black font-black text-xl tracking-tighter">AJ</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">AJMO</h1>
        </div>
        <nav className="flex flex-col gap-3 flex-1 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-300",
                  isActive
                    ? "bg-white/10 text-white shadow-[0_4px_20px_rgba(255,255,255,0.05)] border border-white/10"
                    : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent",
                )}
              >
                <div className={cn(
                  "p-2 rounded-2xl transition-colors",
                  isActive ? "bg-yellow-500/20 text-yellow-500" : "bg-transparent text-gray-500"
                )}>
                  <item.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="font-semibold tracking-wide text-[15px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      {/* Main Container */}
      <div className="min-h-[100dvh] bg-black text-white font-sans selection:bg-yellow-500 selection:text-black flex flex-col relative w-full overflow-x-hidden md:pl-72">
        
        {/* Ambient Liquid Gradients */}
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-yellow-500/5 rounded-full blur-[150px] pointer-events-none" />
        
        {/* Mobile Header - Glassmorphic */}
        <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-2xl border-b border-white/5 pt-[env(safe-area-inset-top)]">
          <div className="h-16 flex items-center justify-between px-6 w-full">
            <h1 className="text-xl font-black tracking-tight flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                <span className="text-black font-black text-[13px] tracking-tighter">AJ</span>
              </div>
              AJMO
            </h1>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-10 pt-[calc(5rem+env(safe-area-inset-top))] md:pt-12 pb-[calc(8rem+env(safe-area-inset-bottom))] md:pb-16 relative z-10">
          <Routes>
            <Route path="/" element={<CalculatorPage />} />
            <Route path="/jobs" element={<SavedJobsPage />} />
            <Route path="/share/:id" element={<SharePage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>

        <Navigation />
      </div>
    </Router>
  );
}

export default App;
