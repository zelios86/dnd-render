import type { WizardState } from '../../../hooks/useCharacterWizard';
import Card from '../../common/Card';
import Input from '../../common/Input';

interface ReviewProps {
  state: WizardState;
  onUpdateName: (name: string) => void;
  onUpdateBackstory: (backstory: string) => void;
  onUpdateNotes: (notes: string) => void;
}

/**
 * Step 5: Review & Submit
 */
export default function Review({ state, onUpdateName, onUpdateBackstory, onUpdateNotes }: ReviewProps) {
  const calculateModifier = (score: number): string => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const getRacialBonus = (ability: string): number => {
    if (!state.race) return 0;
    const bonus = state.race.abilityBonuses.find(
      (ab) => ab.abilityScore.toLowerCase() === ability.toLowerCase()
    );
    return bonus?.bonus || 0;
  };

  const getFinalScore = (ability: keyof typeof state.abilityScores): number => {
    if (!state.abilityScores) return 10;
    return state.abilityScores[ability] + getRacialBonus(ability);
  };

  // Calculate expected HP (simplified)
  const calculateHP = (): number => {
    if (!state.class || !state.abilityScores) return 0;
    const conMod = Math.floor((getFinalScore('constitution') - 10) / 2);
    return state.class.hitDie + conMod;
  };

  // Calculate expected AC (simplified - base 10 + DEX)
  const calculateAC = (): number => {
    if (!state.abilityScores) return 10;
    const dexMod = Math.floor((getFinalScore('dexterity') - 10) / 2);
    return 10 + dexMod;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Review Your Character</h2>
      <p className="text-gray-600 mb-6">
        Review your character details and add final touches before creation.
      </p>

      {/* Character Name */}
      <Card className="mb-4">
        <Input
          label="Character Name *"
          placeholder="Enter your character's name..."
          value={state.name}
          onChange={(e) => onUpdateName(e.target.value)}
          error={state.name.trim().length === 0 ? 'Name is required' : undefined}
        />
      </Card>

      {/* Character Summary */}
      <Card className="mb-4">
        <h3 className="font-bold text-lg mb-4">Character Summary</h3>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Race</p>
            <p className="font-semibold text-lg">{state.race?.name || 'Not selected'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Class</p>
            <p className="font-semibold text-lg">{state.class?.name || 'Not selected'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Level</p>
            <p className="font-semibold text-lg">{state.level}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Hit Die</p>
            <p className="font-semibold text-lg">d{state.class?.hitDie || 8}</p>
          </div>
        </div>

        {/* Predicted Stats */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Max HP</p>
            <p className="text-3xl font-bold text-primary">{calculateHP()}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Armor Class</p>
            <p className="text-3xl font-bold text-primary">{calculateAC()}</p>
          </div>
        </div>
      </Card>

      {/* Ability Scores */}
      <Card className="mb-4">
        <h3 className="font-bold text-lg mb-4">Ability Scores</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {state.abilityScores && Object.entries(state.abilityScores).map(([ability, score]) => {
            const racialBonus = getRacialBonus(ability);
            const finalScore = score + racialBonus;

            return (
              <div key={ability} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs uppercase text-gray-600 mb-1">{ability.slice(0, 3)}</p>
                <p className="text-2xl font-bold">{finalScore}</p>
                <p className="text-sm text-gray-600">{calculateModifier(finalScore)}</p>
                {racialBonus > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    ({score} + {racialBonus})
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Equipment */}
      {state.equipment.length > 0 && (
        <Card className="mb-4">
          <h3 className="font-bold text-lg mb-4">Starting Equipment</h3>
          <div className="space-y-1">
            {state.equipment.slice(0, 5).map((item, index) => (
              <p key={index} className="text-sm text-gray-700">
                • {item.name} {item.quantity > 1 && `(x${item.quantity})`}
              </p>
            ))}
            {state.equipment.length > 5 && (
              <p className="text-sm text-gray-500">
                + {state.equipment.length - 5} more items
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Optional Fields */}
      <Card>
        <h3 className="font-bold text-lg mb-4">Additional Details (Optional)</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Backstory</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              rows={3}
              placeholder="Tell us about your character's history..."
              value={state.backstory}
              onChange={(e) => onUpdateBackstory(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              rows={2}
              placeholder="Any additional notes..."
              value={state.notes}
              onChange={(e) => onUpdateNotes(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {state.name.trim().length === 0 && (
        <Card className="mt-4 bg-yellow-50 border border-yellow-200">
          <p className="text-sm text-gray-700">
            ⚠️ Please enter a character name to proceed.
          </p>
        </Card>
      )}

      {state.name.trim().length > 0 && (
        <Card className="mt-4 bg-green-50 border border-green-200">
          <p className="text-sm text-gray-700">
            ✅ Ready to create! Click "Create Character" to finalize.
          </p>
        </Card>
      )}
    </div>
  );
}
