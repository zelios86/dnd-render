import { useParams } from 'react-router-dom';
import Card from '../components/common/Card';

/**
 * Character sheet page - displays full character sheet
 */
export default function CharacterSheetPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-xl font-semibold mb-2">Character Sheet</h2>
          <p className="text-gray-600">
            Character ID: {id}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            (Coming in Phase 4)
          </p>
        </div>
      </Card>
    </div>
  );
}
