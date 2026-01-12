import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  darkMode?: boolean;
}

export function Header({ currentPage, onNavigate, darkMode = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Главная" },
    { id: "universities", label: "Вузы" },
    { id: "colleges", label: "Ссузы" },
    { id: "companies", label: "Предприятия" },
    { id: "videos", label: "Видео" },
    { id: "roadmap", label: "Roadmap" }
  ];

  return (
    <header className={`sticky top-0 z-50 w-full border-b-2 backdrop-blur ${
      darkMode 
        ? 'border-[#598EBC]/50 bg-[#031429]/95 shadow-[0_4px_30px_rgba(89,142,188,0.3)]' 
        : 'border-[#598EBC]/30 bg-white/95 shadow-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <span className={`text-lg tracking-wide uppercase ${
              darkMode ? 'text-white drop-shadow-[0_0_15px_rgba(89,142,188,0.8)]' : 'text-[#031429] text-glow-blue'
            }`}>
              Космический Roadmap
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => onNavigate(item.id)}
                className={`px-4 uppercase tracking-wide text-sm transition-all ${
                  currentPage === item.id
                    ? darkMode
                      ? "text-[#598EBC] bg-[#598EBC]/20 border-b-2 border-[#598EBC] shadow-[0_0_15px_rgba(89,142,188,0.4)]"
                      : "text-[#598EBC] bg-[#598EBC]/10 border-b-2 border-[#598EBC]"
                    : darkMode
                      ? "text-[#92A8B4] hover:text-[#598EBC] hover:bg-[#598EBC]/10"
                      : "text-[#6D6E71] hover:text-[#598EBC] hover:bg-[#598EBC]/5"
                }`}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 transition-colors ${
              darkMode ? 'text-white hover:text-[#598EBC]' : 'text-[#031429] hover:text-[#598EBC]'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className={`md:hidden py-4 space-y-2 border-t-2 ${
            darkMode ? 'border-[#598EBC]/50' : 'border-[#598EBC]/30'
          }`}>
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full justify-start uppercase tracking-wide text-sm transition-all ${
                  currentPage === item.id
                    ? darkMode
                      ? "text-[#598EBC] bg-[#598EBC]/20 border-l-3 border-[#598EBC]"
                      : "text-[#598EBC] bg-[#598EBC]/10 border-l-3 border-[#598EBC]"
                    : darkMode
                      ? "text-[#92A8B4] hover:text-[#598EBC] hover:bg-[#598EBC]/10"
                      : "text-[#6D6E71] hover:text-[#598EBC] hover:bg-[#598EBC]/5"
                }`}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
