import { Link } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

/**
 * Home page / Landing page
 */
export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          D&D Character Manager
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Create and manage your D&D 5e characters with ease
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/characters/new">
            <Button size="lg" className="w-full sm:w-auto">
              Create New Character
            </Button>
          </Link>
          <Link to="/characters">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              View Characters
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <div className="flex items-start gap-4">
            <div className="text-4xl">🎲</div>
            <div>
              <h3 className="text-lg font-bold mb-2">Auto-Calculations</h3>
              <p className="text-gray-600">
                Automatically calculate stats, HP, AC, modifiers, and more based on D&D 5e rules.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="text-4xl">📱</div>
            <div>
              <h3 className="text-lg font-bold mb-2">Mobile-First</h3>
              <p className="text-gray-600">
                Optimized for mobile devices with touch-friendly interface and offline support.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="text-4xl">📚</div>
            <div>
              <h3 className="text-lg font-bold mb-2">Rules Browser</h3>
              <p className="text-gray-600">
                Browse spells, items, feats, and conditions from the D&D 5e SRD.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-4">
            <div className="text-4xl">👥</div>
            <div>
              <h3 className="text-lg font-bold mb-2">Multiple Characters</h3>
              <p className="text-gray-600">
                Create and manage unlimited characters with full character sheets.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick links */}
      <Card>
        <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link to="/characters/new" className="text-primary hover:underline">
            → Create Character
          </Link>
          <Link to="/characters" className="text-primary hover:underline">
            → View Characters
          </Link>
          <Link to="/rules" className="text-primary hover:underline">
            → Browse Rules
          </Link>
        </div>
      </Card>
    </div>
  );
}
