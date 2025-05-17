
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, User, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '../auth/AuthModal';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleCreateMeme = () => {
    if (isAuthenticated) {
      navigate('/create');
    } else {
      openAuthModal('login');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold text-purple-600 dark:text-purple-400">
              ImageGenHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              onClick={handleCreateMeme}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Create Meme
            </Button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                  <User className="h-5 w-5" />
                  <span>{user?.username || 'Profile'}</span>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className="border-gray-300 dark:border-gray-600"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => openAuthModal('login')}
                  className="border-gray-300 dark:border-gray-600"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => openAuthModal('register')}
                  className="bg-gray-800 hover:bg-gray-900 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <Button variant="ghost" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden bg-white dark:bg-gray-800 py-4 px-2 shadow-lg rounded-b-lg animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Button 
                onClick={handleCreateMeme}
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 w-full"
              >
                <PlusCircle className="h-4 w-4" />
                Create Meme
              </Button>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>{user?.username || 'Profile'}</span>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      logout();
                      setShowMobileMenu(false);
                    }}
                    className="border-gray-300 dark:border-gray-600 w-full"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      openAuthModal('login');
                      setShowMobileMenu(false);
                    }}
                    className="border-gray-300 dark:border-gray-600 w-full"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => {
                      openAuthModal('register');
                      setShowMobileMenu(false);
                    }}
                    className="bg-gray-800 hover:bg-gray-900 dark:bg-purple-600 dark:hover:bg-purple-700 text-white w-full"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode={authMode}
      />
    </header>
  );
};

export default Header;
