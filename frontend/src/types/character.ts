/**
 * TypeScript types for D&D characters
 */

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface AbilityModifiers {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface SavingThrow {
  value: number;
  proficient: boolean;
}

export interface SavingThrows {
  strength: SavingThrow;
  dexterity: SavingThrow;
  constitution: SavingThrow;
  intelligence: SavingThrow;
  wisdom: SavingThrow;
  charisma: SavingThrow;
}

export interface Skill {
  name: string;
  abilityScore: string;
  proficient: boolean;
  expertise?: boolean;
  value: number;
}

export interface AbilityBonus {
  abilityScore: string;
  bonus: number;
}

export interface RaceTrait {
  name: string;
  description: string;
}

export interface Race {
  name: string;
  index: string;
  abilityBonuses: AbilityBonus[];
  size: string;
  speed: number;
  traits?: RaceTrait[];
}

export interface Class {
  name: string;
  index: string;
  hitDie: number;
  proficiencies: string[];
  savingThrows: string[];
}

export interface Background {
  name: string;
  feature: Record<string, unknown>;
  proficiencies: string[];
}

export interface Equipment {
  name: string;
  index: string;
  quantity: number;
  equipped: boolean;
  type?: string;
  description?: string;
}

export interface SpellSlot {
  level: number;
  total: number;
  used: number;
}

export interface Spell {
  name: string;
  index: string;
  level: number;
  prepared: boolean;
}

export interface Spellcasting {
  spellcastingAbility: string;
  spellSaveDC: number;
  spellAttackBonus: number;
  spellSlots: SpellSlot[];
  spellsKnown: Spell[];
}

export interface Feature {
  name: string;
  source: string;
  description: string;
}

export interface HitDice {
  total: number;
  current: number;
  type: string;
}

export interface CalculatedStats {
  proficiencyBonus: number;
  finalAbilityScores: AbilityScores;
  abilityModifiers: AbilityModifiers;
  savingThrows: SavingThrows;
  initiative: number;
  armorClass: number;
  speed: number;
  maxHitPoints: number;
  currentHitPoints: number;
  temporaryHitPoints?: number;
}

export interface Character {
  id: string;
  name: string;
  race: Race;
  class: Class;
  level: number;
  abilityScores: AbilityScores;
  background?: Background | null;
  skills: Skill[];
  equipment: Equipment[];
  spellcasting?: Spellcasting | null;
  features: Feature[];
  hitDice: HitDice;
  backstory?: string;
  notes?: string;
  calculatedStats: CalculatedStats;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCharacterInput {
  name: string;
  race: Race;
  class: Class;
  level: number;
  abilityScores: AbilityScores;
  background?: Background;
  skills?: Skill[];
  equipment?: Equipment[];
  spellcasting?: Spellcasting;
  features?: Feature[];
  backstory?: string;
  notes?: string;
}
