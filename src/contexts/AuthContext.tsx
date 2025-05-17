
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Mock login function
  const login = async (email: string, password: string): Promise<void> => {
    // This would normally be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // For demo purposes, accept any credentials
        const mockUser = {
          id: '123',
          username: email.split('@')[0],
          email: email,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('imageGenHubUser', JSON.stringify(mockUser));
        resolve();
      }, 1000);
    });
  };

  // Mock register function
  const register = async (username: string, email: string, password: string): Promise<void> => {
    // This would normally be an API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // In a real app, this would create a new user in the database
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('imageGenHubUser');
  };

  // Check for saved user on load
  useEffect(() => {
    const savedUser = localStorage.getItem('imageGenHubUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
