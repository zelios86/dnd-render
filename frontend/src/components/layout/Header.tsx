import { Link } from 'react-router-dom';

/**
 * App header component
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-secondary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 touch-target">
            <div className="text-2xl">🎲</div>
            <span className="text-xl font-bold hidden sm:inline">D&D Manager</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/characters" className="hover:text-primary transition-colors">
              Characters
            </Link>
            <Link to="/characters/new" className="hover:text-primary transition-colors">
              Create
            </Link>
            <Link to="/rules" className="hover:text-primary transition-colors">
              Rules
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
