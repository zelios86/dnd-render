import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

/**
 * 404 Not Found page
 */
export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎲</div>
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
