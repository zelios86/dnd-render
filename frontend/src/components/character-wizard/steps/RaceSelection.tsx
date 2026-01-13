import { useQuery } from '@tanstack/react-query';
import { getRaces, getRaceByIndex } from '../../../api/dndApi';
import type { Race } from '../../../types/character';
import type { RaceAPI } from '../../../types/dnd';
import Card from '../../common/Card';
import Loading from '../../common/Loading';

interface RaceSelectionProps {
  selectedRace: Race | null;
  onSelect: (race: Race) => void;
}

/**
 * Step 1: Race Selection
 */
export default function RaceSelection({ selectedRace, onSelect }: RaceSelectionProps) {
  // Fetch all races
  const { data: races, isLoading, error } = useQuery({
    queryKey: ['races'],
    queryFn: getRaces,
  });

  const handleSelectRace = async (raceIndex: string) => {
    try {
      const raceData: RaceAPI = await getRaceByIndex(raceIndex);

      // Transform API data to our Race type
      const race: Race = {
        name: raceData.name,
        index: raceData.index,
        abilityBonuses: raceData.ability_bonuses?.map(ab => ({
          abilityScore: ab.ability_score.index,
          bonus: ab.bonus
        })) || [],
        size: raceData.size || 'Medium',
        speed: raceData.speed || 30,
        traits: []
      };

      onSelect(race);
    } catch (err) {
      console.error('Failed to load race details:', err);
      alert('Failed to load race details. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <Loading text="Loading races..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold mb-2">Failed to Load Races</h3>
          <p className="text-gray-600">Please check your connection and try again.</p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Choose Your Race</h2>
      <p className="text-gray-600 mb-6">
        Your race determines your character's physical traits, ability bonuses, and special features.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {races?.map((race) => (
          <Card
            key={race.index}
            hoverable
            className={`cursor-pointer transition-all ${
              selectedRace?.index === race.index
                ? 'ring-2 ring-primary bg-red-50'
                : 'hover:shadow-lg'
            }`}
            onClick={() => handleSelectRace(race.index)}
          >
            <div className="flex items-start gap-3">
              <div className="text-4xl">
                {race.index === 'dragonborn' && '🐉'}
                {race.index === 'dwarf' && '⛏️'}
                {race.index === 'elf' && '🧝'}
                {race.index === 'gnome' && '🎩'}
                {race.index === 'half-elf' && '🧝‍♂️'}
                {race.index === 'half-orc' && '👹'}
                {race.index === 'halfling' && '🍀'}
                {race.index === 'human' && '👤'}
                {race.index === 'tiefling' && '😈'}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{race.name}</h3>
                {selectedRace?.index === race.index && (
                  <div className="mt-2">
                    <div className="text-sm text-gray-600">
                      <p className="mb-1">
                        <strong>Size:</strong> {selectedRace.size}
                      </p>
                      <p className="mb-1">
                        <strong>Speed:</strong> {selectedRace.speed} ft.
                      </p>
                      {selectedRace.abilityBonuses.length > 0 && (
                        <p>
                          <strong>Ability Bonuses:</strong>{' '}
                          {selectedRace.abilityBonuses
                            .map((ab) => `+${ab.bonus} ${ab.abilityScore.toUpperCase()}`)
                            .join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {selectedRace?.index === race.index && (
                <div className="text-primary text-2xl">✓</div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {selectedRace && (
        <Card className="mt-6 bg-blue-50 border border-blue-200">
          <h4 className="font-bold mb-2">Selected: {selectedRace.name}</h4>
          <p className="text-sm text-gray-700">
            Click "Next" to continue to class selection.
          </p>
        </Card>
      )}
    </div>
  );
}
