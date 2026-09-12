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
      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#1c1c1e]/80 backdrop-blur-xl border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
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

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 fixed top-0 left-0 bottom-0 bg-[#111112] border-r border-white/5 p-4 z-50">
        <div className="flex items-center gap-3 px-4 py-6 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse"></span>
          <h1 className="text-xl font-bold tracking-wider text-white">AJMO</h1>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon
                  className={cn("w-5 h-5", isActive && "text-yellow-500")}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                <span className="font-medium tracking-wide">{item.name}</span>
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
      <div className="min-h-[100dvh] bg-black text-white font-sans selection:bg-yellow-500 selection:text-black flex flex-col relative w-full overflow-x-hidden md:pl-64">
        {/* Mobile Header */}
        <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 pt-[env(safe-area-inset-top)]">
          <div className="h-14 flex items-center justify-center px-4 w-full">
            <h1 className="text-[17px] font-semibold tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
              AJMO
            </h1>
          </div>
        </header>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pt-[calc(3.5rem+env(safe-area-inset-top))] md:pt-8 pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-12">
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
