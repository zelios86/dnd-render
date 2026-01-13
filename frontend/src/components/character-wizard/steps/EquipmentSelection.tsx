import type { Class, Equipment } from '../../../types/character';
import Card from '../../common/Card';

interface EquipmentSelectionProps {
  selectedClass: Class | null;
  equipment: Equipment[];
  onUpdate: (equipment: Equipment[]) => void;
}

// Basic starting equipment by class (simplified)
const STARTING_EQUIPMENT: Record<string, Equipment[]> = {
  barbarian: [
    { name: 'Greataxe', index: 'greataxe', quantity: 1, equipped: true },
    { name: 'Handaxe', index: 'handaxe', quantity: 2, equipped: false },
    { name: "Explorer's Pack", index: 'explorers-pack', quantity: 1, equipped: false },
    { name: 'Javelin', index: 'javelin', quantity: 4, equipped: false },
  ],
  bard: [
    { name: 'Rapier', index: 'rapier', quantity: 1, equipped: true },
    { name: 'Lute', index: 'lute', quantity: 1, equipped: false },
    { name: 'Leather Armor', index: 'leather-armor', quantity: 1, equipped: true },
    { name: 'Dagger', index: 'dagger', quantity: 1, equipped: false },
  ],
  cleric: [
    { name: 'Mace', index: 'mace', quantity: 1, equipped: true },
    { name: 'Scale Mail', index: 'scale-mail', quantity: 1, equipped: true },
    { name: 'Shield', index: 'shield', quantity: 1, equipped: true },
    { name: 'Holy Symbol', index: 'holy-symbol', quantity: 1, equipped: false },
  ],
  druid: [
    { name: 'Scimitar', index: 'scimitar', quantity: 1, equipped: true },
    { name: 'Leather Armor', index: 'leather-armor', quantity: 1, equipped: true },
    { name: 'Druidic Focus', index: 'druidic-focus', quantity: 1, equipped: false },
  ],
  fighter: [
    { name: 'Longsword', index: 'longsword', quantity: 1, equipped: true },
    { name: 'Shield', index: 'shield', quantity: 1, equipped: true },
    { name: 'Chain Mail', index: 'chain-mail', quantity: 1, equipped: true },
    { name: 'Crossbow, light', index: 'crossbow-light', quantity: 1, equipped: false },
  ],
  monk: [
    { name: 'Shortsword', index: 'shortsword', quantity: 1, equipped: true },
    { name: 'Dart', index: 'dart', quantity: 10, equipped: false },
  ],
  paladin: [
    { name: 'Longsword', index: 'longsword', quantity: 1, equipped: true },
    { name: 'Shield', index: 'shield', quantity: 1, equipped: true },
    { name: 'Chain Mail', index: 'chain-mail', quantity: 1, equipped: true },
    { name: 'Holy Symbol', index: 'holy-symbol', quantity: 1, equipped: false },
  ],
  ranger: [
    { name: 'Longbow', index: 'longbow', quantity: 1, equipped: true },
    { name: 'Arrow', index: 'arrow', quantity: 20, equipped: false },
    { name: 'Shortsword', index: 'shortsword', quantity: 2, equipped: false },
    { name: 'Leather Armor', index: 'leather-armor', quantity: 1, equipped: true },
  ],
  rogue: [
    { name: 'Rapier', index: 'rapier', quantity: 1, equipped: true },
    { name: 'Shortbow', index: 'shortbow', quantity: 1, equipped: false },
    { name: 'Arrow', index: 'arrow', quantity: 20, equipped: false },
    { name: 'Leather Armor', index: 'leather-armor', quantity: 1, equipped: true },
    { name: "Thieves' Tools", index: 'thieves-tools', quantity: 1, equipped: false },
  ],
  sorcerer: [
    { name: 'Dagger', index: 'dagger', quantity: 2, equipped: true },
    { name: 'Arcane Focus', index: 'arcane-focus', quantity: 1, equipped: false },
    { name: 'Component Pouch', index: 'component-pouch', quantity: 1, equipped: false },
  ],
  warlock: [
    { name: 'Crossbow, light', index: 'crossbow-light', quantity: 1, equipped: true },
    { name: 'Bolt', index: 'bolt', quantity: 20, equipped: false },
    { name: 'Leather Armor', index: 'leather-armor', quantity: 1, equipped: true },
    { name: 'Arcane Focus', index: 'arcane-focus', quantity: 1, equipped: false },
  ],
  wizard: [
    { name: 'Quarterstaff', index: 'quarterstaff', quantity: 1, equipped: true },
    { name: 'Spellbook', index: 'spellbook', quantity: 1, equipped: false },
    { name: 'Component Pouch', index: 'component-pouch', quantity: 1, equipped: false },
  ],
};

/**
 * Step 4: Equipment Selection
 */
export default function EquipmentSelection({
  selectedClass,
  equipment,
  onUpdate,
}: EquipmentSelectionProps) {
  const handleSelectStartingEquipment = () => {
    if (!selectedClass) return;

    const startingEquipment = STARTING_EQUIPMENT[selectedClass.index] || [];
    onUpdate(startingEquipment);
  };

  const handleClearEquipment = () => {
    onUpdate([]);
  };

  const currentEquipment = equipment.length > 0 ? equipment : null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Starting Equipment</h2>
      <p className="text-gray-600 mb-6">
        Select your starting equipment based on your class.
      </p>

      {!currentEquipment ? (
        <Card>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎒</div>
            <h3 className="text-xl font-semibold mb-4">Choose Your Starting Equipment</h3>

            {selectedClass && (
              <>
                <p className="text-gray-600 mb-6">
                  As a {selectedClass.name}, you start with basic equipment for your class.
                </p>
                <button
                  onClick={handleSelectStartingEquipment}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Use {selectedClass.name} Starting Equipment
                </button>
                <p className="text-sm text-gray-500 mt-4">
                  You can skip this step and add equipment later.
                </p>
              </>
            )}
          </div>
        </Card>
      ) : (
        <div>
          <Card>
            <h3 className="font-bold text-lg mb-4">Your Starting Equipment</h3>
            <div className="space-y-2">
              {currentEquipment.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {item.equipped ? '✓' : '📦'}
                    </span>
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.quantity > 1 && (
                        <span className="text-gray-500 text-sm ml-2">x{item.quantity}</span>
                      )}
                    </div>
                  </div>
                  {item.equipped && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Equipped
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button
                onClick={handleClearEquipment}
                className="text-sm text-red-600 hover:underline"
              >
                Clear Equipment
              </button>
            </div>
          </Card>

          <Card className="mt-4 bg-blue-50 border border-blue-200">
            <p className="text-sm text-gray-700">
              Click "Next" to review your character and finalize creation.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
