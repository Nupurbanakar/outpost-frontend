import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * AppLayout - Main layout wrapper for authenticated routes
 * Includes Header, Footer, and Mobile bottom navigation
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <Header />
      
      <main id="main-content" className="flex-1 pb-20 lg:pb-0">
        {children}
      </main>
      
      <Footer />
      
      <MobileNav />
    </div>
  );
}
