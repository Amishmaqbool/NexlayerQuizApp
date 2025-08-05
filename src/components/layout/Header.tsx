import { Brain, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HeaderProps {
  onNavigate?: (section: string) => void;
}

export const Header = ({ onNavigate }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", value: "dashboard" },
    { label: "Quizzes", value: "list" },
    { label: "About", value: "about" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-nexlayer-cyan/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3">
          <img src="/logo.webp" alt="Nexlayer Logo" className="w-40 h-8" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Button
              key={item.value}
              variant="ghost"
              onClick={() => onNavigate?.(item.value)}
              className="text-sm font-medium hover:text-nexlayer-cyan hover:bg-nexlayer-cyan/10 transition-colors"
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center space-x-4">
          <Button 
            onClick={() => onNavigate?.("list")}
            className="bg-nexlayer-cyan hover:bg-nexlayer-cyan/90 text-nexlayer-dark font-semibold"
          >
            Start Learning
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-nexlayer-cyan/20 bg-card/95 backdrop-blur">
          <nav className="container py-4 px-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Button
                  key={item.value}
                  variant="ghost"
                  onClick={() => {
                    onNavigate?.(item.value);
                    setIsMenuOpen(false);
                  }}
                  className="justify-start hover:text-nexlayer-cyan hover:bg-nexlayer-cyan/10"
                >
                  {item.label}
                </Button>
              ))}
              <Button 
                onClick={() => {
                  onNavigate?.("list");
                  setIsMenuOpen(false);
                }}
                className="bg-nexlayer-cyan hover:bg-nexlayer-cyan/90 text-nexlayer-dark font-semibold mt-4"
              >
                Start Learning
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
