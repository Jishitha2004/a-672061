
import React, { ReactNode } from 'react';
import Header from './Header';
import { useIsMobile } from '@/hooks/use-mobile';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />
      <main className={`flex-1 p-4 md:p-6 ${isMobile ? 'pt-20' : 'pt-24'}`}>
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      <footer className="bg-white dark:bg-gray-800 py-4 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} ImageGenHub - The Developer Meme Community</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
