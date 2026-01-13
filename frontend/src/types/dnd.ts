/**
 * TypeScript types for D&D 5e API responses
 */

export interface APIReference {
  index: string;
  name: string;
  url: string;
}

export interface APIListResponse<T> {
  count?: number;
  results: T[];
}

// Races
export interface RaceAPI extends APIReference {
  speed?: number;
  ability_bonuses?: Array<{
    ability_score: APIReference;
    bonus: number;
  }>;
  size?: string;
  size_description?: string;
  traits?: APIReference[];
}

// Classes
export interface ClassAPI extends APIReference {
  hit_die?: number;
  proficiencies?: APIReference[];
  proficiency_choices?: unknown[];
  saving_throws?: APIReference[];
  starting_equipment?: unknown[];
  class_levels?: string;
  subclasses?: APIReference[];
}

// Spells
export interface SpellAPI extends APIReference {
  level: number;
  school: APIReference;
  casting_time?: string;
  range?: string;
  components?: string[];
  duration?: string;
  concentration?: boolean;
  ritual?: boolean;
  desc?: string[];
  higher_level?: string[];
  classes?: APIReference[];
  attack_type?: string;
  damage?: {
    damage_type: APIReference;
    damage_at_slot_level?: Record<string, string>;
  };
}

// Equipment
export interface EquipmentAPI extends APIReference {
  equipment_category?: APIReference;
  cost?: {
    quantity: number;
    unit: string;
  };
  weight?: number;
  desc?: string[];
  weapon_category?: string;
  weapon_range?: string;
  category_range?: string;
  damage?: {
    damage_dice: string;
    damage_type: APIReference;
  };
  range?: {
    normal: number;
    long?: number;
  };
  properties?: APIReference[];
  armor_category?: string;
  armor_class?: {
    base: number;
    dex_bonus: boolean;
    max_bonus?: number;
  };
  str_minimum?: number;
  stealth_disadvantage?: boolean;
}

// Magic Items
export interface MagicItemAPI extends APIReference {
  equipment_category?: APIReference;
  rarity?: {
    name: string;
  };
  variants?: APIReference[];
  variant?: boolean;
  desc?: string[];
}

// Feats
export interface FeatAPI extends APIReference {
  prerequisites?: Array<{
    type?: string;
    ability_score?: APIReference;
    minimum_score?: number;
  }>;
  desc?: string[];
}

// Conditions
export interface ConditionAPI extends APIReference {
  desc?: string[];
}

// Filters for API requests
export interface SpellFilters {
  level?: number;
  school?: string;
  class?: string;
}
