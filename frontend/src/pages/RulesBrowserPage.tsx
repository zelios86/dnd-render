import Card from '../components/common/Card';

/**
 * Rules browser page - browse spells, items, feats, conditions
 */
export default function RulesBrowserPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Rules Browser</h1>

      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold mb-2">D&D 5e Rules Browser</h2>
          <p className="text-gray-600 mb-4">
            Browse spells, items, feats, and conditions from D&D 5.5 (2024)
          </p>
          <p className="text-sm text-gray-500">
            (Coming in Phase 5)
          </p>
        </div>
      </Card>
    </div>
  );
}
