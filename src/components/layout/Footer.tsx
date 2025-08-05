import { Brain, Twitter, Github, Globe, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "../../../public/logo.webp";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 border-t border-nexlayer-cyan/20 mt-auto">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <a href="/" className="flex items-center space-x-3">
              <img src={Logo} alt="Nexlayer Logo" className="w-40 h-8" />
            </a>
            <p className="text-sm text-muted-foreground">
              Master the AI-Native Cloud Platform with comprehensive quizzes. 
              From prototype to product, no infrastructure PhD required.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-nexlayer-cyan">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-nexlayer-cyan">
                  Dashboard
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-nexlayer-cyan">
                  Quizzes
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-nexlayer-cyan">
                  Results
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-nexlayer-cyan">
                  Leaderboard
                </Button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-nexlayer-cyan">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Button 
                  variant="link" 
                  className="h-auto p-0 text-muted-foreground hover:text-nexlayer-cyan"
                  onClick={() => window.open('https://nexlayer.com', '_blank')}
                >
                  Documentation
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-nexlayer-cyan">
                  API Reference
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-nexlayer-cyan">
                  Tutorials
                </Button>
              </li>
              <li>
                <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-nexlayer-cyan">
                  Community
                </Button>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-nexlayer-cyan">Connect</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-nexlayer-cyan/20 hover:bg-nexlayer-cyan/10 hover:border-nexlayer-cyan"
                onClick={() => window.open('https://nexlayer.com', '_blank')}
              >
                <Globe className="w-4 h-4" />
                <span className="sr-only">Website</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-nexlayer-cyan/20 hover:bg-nexlayer-cyan/10 hover:border-nexlayer-cyan"
              >
                <Twitter className="w-4 h-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-nexlayer-cyan/20 hover:bg-nexlayer-cyan/10 hover:border-nexlayer-cyan"
              >
                <Github className="w-4 h-4" />
                <span className="sr-only">GitHub</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="border-nexlayer-cyan/20 hover:bg-nexlayer-cyan/10 hover:border-nexlayer-cyan"
              >
                <Mail className="w-4 h-4" />
                <span className="sr-only">Email</span>
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Built with ❤️ for the Nexlayer Community</p>
              <p className="mt-1">© {currentYear} Nexlayer Quiz Platform</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-nexlayer-cyan/20">
          <div className="flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
            <p>Transform your cloud deployment knowledge with comprehensive AI-Native Platform quizzes.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground hover:text-nexlayer-cyan">
                Privacy Policy
              </Button>
              <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground hover:text-nexlayer-cyan">
                Terms of Service
              </Button>
              <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground hover:text-nexlayer-cyan">
                Cookie Policy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
