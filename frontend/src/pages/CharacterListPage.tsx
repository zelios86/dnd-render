import Card from '../components/common/Card';

/**
 * Character list page - displays all characters
 */
export default function CharacterListPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Characters</h1>
      </div>

      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-semibold mb-2">No Characters Yet</h2>
          <p className="text-gray-600 mb-4">
            Create your first character to get started!
          </p>
        </div>
      </Card>
    </div>
  );
}
