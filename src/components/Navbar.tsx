
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, LogOut, LogIn } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './ui/use-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  return (
    <nav className="bg-background/95 backdrop-blur-xl sticky top-0 z-50 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="relative w-8 h-8 mr-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyber-primary to-cyber-accent rounded-md"></div>
                <div className="absolute inset-0.5 bg-background rounded-md flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 text-cyber-primary"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    <path d="M8 11V5l4 1v5" />
                    <path d="M16 11V5l-4 1" />
                  </svg>
                </div>
              </div>
              <span className="font-display font-bold text-xl text-foreground">MediaWatchdog</span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/analyze" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Analyze Media
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/docs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </Link>
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="ml-2 hover:bg-cyber-danger/10 hover:text-cyber-danger hover:border-cyber-danger transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 hover:bg-cyber-primary/10 hover:text-cyber-primary hover:border-cyber-primary transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link 
              to="/" 
              className="block py-2 px-4 rounded-md text-foreground hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/analyze" 
              className="block py-2 px-4 rounded-md text-foreground hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Analyze Media
            </Link>
            <Link 
              to="/about" 
              className="block py-2 px-4 rounded-md text-foreground hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/docs" 
              className="block py-2 px-4 rounded-md text-foreground hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Documentation
            </Link>
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left py-2 px-4 rounded-md text-cyber-danger hover:bg-cyber-danger/10 transition-colors flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            ) : (
              <Link 
                to="/auth" 
                className="block py-2 px-4 rounded-md text-cyber-primary hover:bg-cyber-primary/10 transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
