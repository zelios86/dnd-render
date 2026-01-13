import { Outlet } from 'react-router-dom';
import Header from './Header';
import Navigation from './Navigation';

/**
 * Main layout component with header and navigation
 */
export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-20 md:pb-6">
        <Outlet />
      </main>

      {/* Bottom navigation (mobile only) */}
      <Navigation />
    </div>
  );
}
