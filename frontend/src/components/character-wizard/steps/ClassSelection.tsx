import { useQuery } from '@tanstack/react-query';
import { getClasses, getClassByIndex } from '../../../api/dndApi';
import type { Class } from '../../../types/character';
import type { ClassAPI } from '../../../types/dnd';
import Card from '../../common/Card';
import Loading from '../../common/Loading';

interface ClassSelectionProps {
  selectedClass: Class | null;
  onSelect: (classData: Class) => void;
}

/**
 * Step 2: Class Selection
 */
export default function ClassSelection({ selectedClass, onSelect }: ClassSelectionProps) {
  // Fetch all classes
  const { data: classes, isLoading, error } = useQuery({
    queryKey: ['classes'],
    queryFn: getClasses,
  });

  const handleSelectClass = async (classIndex: string) => {
    try {
      const classData: ClassAPI = await getClassByIndex(classIndex);

      // Transform API data to our Class type
      const characterClass: Class = {
        name: classData.name,
        index: classData.index,
        hitDie: classData.hit_die || 8,
        proficiencies: classData.proficiencies?.map(p => p.name) || [],
        savingThrows: classData.saving_throws?.map(st => st.index) || [],
      };

      onSelect(characterClass);
    } catch (err) {
      console.error('Failed to load class details:', err);
      alert('Failed to load class details. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <Loading text="Loading classes..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold mb-2">Failed to Load Classes</h3>
          <p className="text-gray-600">Please check your connection and try again.</p>
        </div>
      </Card>
    );
  }

  const getClassIcon = (index: string) => {
    const icons: Record<string, string> = {
      barbarian: '🪓',
      bard: '🎵',
      cleric: '✨',
      druid: '🌿',
      fighter: '⚔️',
      monk: '🥋',
      paladin: '🛡️',
      ranger: '🏹',
      rogue: '🗡️',
      sorcerer: '🔮',
      warlock: '👁️',
      wizard: '🧙',
    };
    return icons[index] || '⚡';
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Choose Your Class</h2>
      <p className="text-gray-600 mb-6">
        Your class defines your abilities, skills, and role in combat.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes?.map((classItem) => (
          <Card
            key={classItem.index}
            hoverable
            className={`cursor-pointer transition-all ${
              selectedClass?.index === classItem.index
                ? 'ring-2 ring-primary bg-red-50'
                : 'hover:shadow-lg'
            }`}
            onClick={() => handleSelectClass(classItem.index)}
          >
            <div className="flex items-start gap-3">
              <div className="text-4xl">{getClassIcon(classItem.index)}</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{classItem.name}</h3>
                {selectedClass?.index === classItem.index && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="mb-1">
                      <strong>Hit Die:</strong> d{selectedClass.hitDie}
                    </p>
                    <p>
                      <strong>Saving Throws:</strong>{' '}
                      {selectedClass.savingThrows.map(st => st.toUpperCase()).join(', ')}
                    </p>
                  </div>
                )}
              </div>
              {selectedClass?.index === classItem.index && (
                <div className="text-primary text-2xl">✓</div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {selectedClass && (
        <Card className="mt-6 bg-blue-50 border border-blue-200">
          <h4 className="font-bold mb-2">Selected: {selectedClass.name}</h4>
          <p className="text-sm text-gray-700 mb-2">
            <strong>Hit Die:</strong> d{selectedClass.hitDie} (Your HP will be calculated automatically)
          </p>
          <p className="text-sm text-gray-700">
            Click "Next" to set your ability scores.
          </p>
        </Card>
      )}
    </div>
  );
}
