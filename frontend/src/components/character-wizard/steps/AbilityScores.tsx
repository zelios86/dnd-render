import { useState, useMemo } from 'react';
import type { AbilityScores, Race } from '../../../types/character';
import type { AbilityMethod } from '../../../hooks/useCharacterWizard';
import Card from '../../common/Card';
import Button from '../../common/Button';
import Input from '../../common/Input';

interface AbilityScoresProps {
  abilityScores: AbilityScores | null;
  method: AbilityMethod;
  race: Race | null;
  onUpdate: (scores: AbilityScores, method?: AbilityMethod) => void;
}

const ABILITIES: (keyof AbilityScores)[] = [
  'strength',
  'dexterity',
  'constitution',
  'intelligence',
  'wisdom',
  'charisma',
];

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

const ABILITY_LABELS: Record<keyof AbilityScores, string> = {
  strength: 'Strength (STR)',
  dexterity: 'Dexterity (DEX)',
  constitution: 'Constitution (CON)',
  intelligence: 'Intelligence (INT)',
  wisdom: 'Wisdom (WIS)',
  charisma: 'Charisma (CHA)',
};

/**
 * Step 3: Ability Scores
 */
export default function AbilityScores({ abilityScores, method, race, onUpdate }: AbilityScoresProps) {
  const [selectedMethod, setSelectedMethod] = useState<AbilityMethod>(method);
  const [scores, setScores] = useState<AbilityScores>(
    abilityScores || {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    }
  );

  // Standard Array: Track which values have been assigned
  const [arrayAssignments, setArrayAssignments] = useState<Record<keyof AbilityScores, number>>(() => {
    if (selectedMethod === 'standard-array' && abilityScores) {
      return abilityScores as Record<keyof AbilityScores, number>;
    }
    return {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    };
  });

  const getRacialBonus = (ability: keyof AbilityScores): number => {
    if (!race) return 0;
    const bonus = race.abilityBonuses.find(
      (ab) => ab.abilityScore.toLowerCase() === ability.toLowerCase()
    );
    return bonus?.bonus || 0;
  };

  const calculateModifier = (score: number): string => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  // Get final scores with racial bonuses
  const finalScores = useMemo(() => {
    const final: Record<string, number> = {};
    ABILITIES.forEach((ability) => {
      final[ability] = scores[ability] + getRacialBonus(ability);
    });
    return final;
  }, [scores, race]);

  const handleMethodChange = (newMethod: AbilityMethod) => {
    setSelectedMethod(newMethod);
    // Reset scores based on method
    if (newMethod === 'standard-array') {
      const defaultScores: AbilityScores = {
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
      };
      setScores(defaultScores);
      setArrayAssignments(defaultScores as Record<keyof AbilityScores, number>);
    } else {
      setScores({
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      });
    }
  };

  const handleStandardArrayAssign = (ability: keyof AbilityScores, value: number) => {
    const newAssignments = { ...arrayAssignments, [ability]: value };
    setArrayAssignments(newAssignments);
    setScores(newAssignments as AbilityScores);
  };

  const handleManualChange = (ability: keyof AbilityScores, value: string) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.max(1, Math.min(20, numValue));
    setScores({ ...scores, [ability]: clampedValue });
  };

  const handleConfirm = () => {
    // Validate based on method
    if (selectedMethod === 'standard-array') {
      const usedValues = Object.values(arrayAssignments);
      const allAssigned = usedValues.every((v) => v > 0);
      if (!allAssigned) {
        alert('Please assign all ability scores from the standard array.');
        return;
      }
    }

    onUpdate(scores, selectedMethod);
  };

  // Check if scores are valid
  const isValid = useMemo(() => {
    if (selectedMethod === 'standard-array') {
      const usedValues = Object.values(arrayAssignments);
      return usedValues.every((v) => v > 0);
    }
    return Object.values(scores).every((s) => s >= 1 && s <= 20);
  }, [scores, arrayAssignments, selectedMethod]);

  // Get available values for standard array
  const getAvailableValues = (currentAbility: keyof AbilityScores) => {
    const usedValues = ABILITIES.filter((a) => a !== currentAbility).map(
      (a) => arrayAssignments[a]
    );
    return STANDARD_ARRAY.filter((v) => !usedValues.includes(v));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Set Ability Scores</h2>
      <p className="text-gray-600 mb-6">
        Choose how to generate your ability scores. Racial bonuses will be applied automatically.
      </p>

      {/* Method Selection */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card
          hoverable
          className={`cursor-pointer ${
            selectedMethod === 'standard-array' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => handleMethodChange('standard-array')}
        >
          <h3 className="font-bold mb-2">Standard Array</h3>
          <p className="text-sm text-gray-600">
            Assign: 15, 14, 13, 12, 10, 8
          </p>
        </Card>

        <Card
          hoverable
          className={`cursor-pointer ${
            selectedMethod === 'point-buy' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => handleMethodChange('point-buy')}
        >
          <h3 className="font-bold mb-2">Point Buy</h3>
          <p className="text-sm text-gray-600">27 points to distribute</p>
          <p className="text-xs text-gray-500 mt-1">(Coming soon)</p>
        </Card>

        <Card
          hoverable
          className={`cursor-pointer ${
            selectedMethod === 'manual' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => handleMethodChange('manual')}
        >
          <h3 className="font-bold mb-2">Manual Entry</h3>
          <p className="text-sm text-gray-600">Enter rolled scores</p>
        </Card>
      </div>

      {/* Ability Score Input */}
      <Card>
        <div className="space-y-4">
          {ABILITIES.map((ability) => {
            const racialBonus = getRacialBonus(ability);
            const baseScore = scores[ability];
            const finalScore = finalScores[ability];

            return (
              <div key={ability} className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">
                    {ABILITY_LABELS[ability]}
                  </label>

                  {selectedMethod === 'standard-array' ? (
                    <select
                      value={arrayAssignments[ability]}
                      onChange={(e) =>
                        handleStandardArrayAssign(ability, parseInt(e.target.value))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value={0}>Select...</option>
                      {getAvailableValues(ability).map((val) => (
                        <option key={val} value={val}>
                          {val}
                        </option>
                      ))}
                      {arrayAssignments[ability] > 0 && (
                        <option value={arrayAssignments[ability]}>
                          {arrayAssignments[ability]} (current)
                        </option>
                      )}
                    </select>
                  ) : selectedMethod === 'point-buy' ? (
                    <div className="text-gray-500">Point buy coming soon...</div>
                  ) : (
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={baseScore}
                      onChange={(e) => handleManualChange(ability, e.target.value)}
                    />
                  )}
                </div>

                {/* Racial Bonus */}
                {racialBonus > 0 && (
                  <div className="text-green-600 font-semibold">+{racialBonus}</div>
                )}

                {/* Final Score & Modifier */}
                <div className="text-center min-w-[80px]">
                  <div className="text-2xl font-bold text-primary">{finalScore}</div>
                  <div className="text-sm text-gray-600">{calculateModifier(finalScore)}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <Button onClick={handleConfirm} disabled={!isValid} fullWidth>
            Confirm Ability Scores
          </Button>
        </div>
      </Card>

      {race && (
        <Card className="mt-4 bg-blue-50 border border-blue-200">
          <h4 className="font-bold mb-2">Racial Bonuses Applied</h4>
          <p className="text-sm text-gray-700">
            {race.abilityBonuses.map((ab) => `+${ab.bonus} ${ab.abilityScore.toUpperCase()}`).join(', ')}
          </p>
        </Card>
      )}
    </div>
  );
}
