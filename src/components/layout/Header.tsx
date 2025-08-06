import { Brain, Menu, X, LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface HeaderProps {
  onNavigate?: (section: string) => void;
}

export const Header = ({ onNavigate }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const getUserInitials = (email: string | undefined) => {
    if (!email) return "U";
    const parts = email.split("@")[0].split(".");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return email[0].toUpperCase();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { label: "Docs", value: "https://docs.nexlayer.com/", isExternal: true },
    {
      label: "API Reference",
      value: "https://docs.nexlayer.com/documentation/api-reference",
      isExternal: true,
    },
    { label: "About", value: "https://nexlayer.com/about", isExternal: true },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-nexlayer-cyan/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
              onClick={() => {
                if (item.isExternal) {
                  window.open(item.value, '_blank', 'noopener,noreferrer');
                } else {
                  onNavigate?.(item.value);
                }
              }}
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
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-nexlayer-cyan text-nexlayer-dark font-semibold">
                      {getUserInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Quiz Master</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-nexlayer-cyan/20 bg-card/95 backdrop-blur">
          <nav className="container py-4 px-4">
            <div className="flex flex-col space-y-3">
              {user && (
                <div className="flex items-center space-x-3 pb-2 border-b border-border">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-nexlayer-cyan text-nexlayer-dark font-semibold">
                      {getUserInitials(user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Quiz Master</p>
                  </div>
                </div>
              )}
              {navItems.map((item) => (
                <Button
                  key={item.value}
                  variant="ghost"
                  onClick={() => {
                    if (item.isExternal) {
                      window.open(item.value, '_blank', 'noopener,noreferrer');
                    } else {
                      onNavigate?.(item.value);
                    }
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
              {user && (
                <Button
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                  variant="ghost"
                  className="justify-start text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
