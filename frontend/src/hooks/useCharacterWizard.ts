import { useState, useCallback } from 'react';
import type { Race, Class, AbilityScores, Equipment, CreateCharacterInput } from '../types/character';

/**
 * Wizard steps
 */
export type WizardStep = 'race' | 'class' | 'abilities' | 'equipment' | 'review';

/**
 * Ability score generation method
 */
export type AbilityMethod = 'standard-array' | 'point-buy' | 'manual';

/**
 * Wizard state
 */
export interface WizardState {
  currentStep: WizardStep;
  name: string;
  race: Race | null;
  class: Class | null;
  level: number;
  abilityScores: AbilityScores | null;
  abilityMethod: AbilityMethod;
  equipment: Equipment[];
  backstory: string;
  notes: string;
}

const INITIAL_STATE: WizardState = {
  currentStep: 'race',
  name: '',
  race: null,
  class: null,
  level: 1,
  abilityScores: null,
  abilityMethod: 'standard-array',
  equipment: [],
  backstory: '',
  notes: '',
};

const STEP_ORDER: WizardStep[] = ['race', 'class', 'abilities', 'equipment', 'review'];

/**
 * Custom hook for managing character creation wizard state
 */
export function useCharacterWizard() {
  const [state, setState] = useState<WizardState>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('character-wizard');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_STATE;
      }
    }
    return INITIAL_STATE;
  });

  // Save to localStorage on every state change
  const updateState = useCallback((updates: Partial<WizardState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates };
      localStorage.setItem('character-wizard', JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Navigation
  const nextStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      updateState({ currentStep: STEP_ORDER[currentIndex + 1] });
    }
  }, [state.currentStep, updateState]);

  const previousStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    if (currentIndex > 0) {
      updateState({ currentStep: STEP_ORDER[currentIndex - 1] });
    }
  }, [state.currentStep, updateState]);

  const goToStep = useCallback(
    (step: WizardStep) => {
      updateState({ currentStep: step });
    },
    [updateState]
  );

  // Update specific fields
  const setRace = useCallback(
    (race: Race) => {
      updateState({ race });
    },
    [updateState]
  );

  const setClass = useCallback(
    (classData: Class) => {
      updateState({ class: classData });
    },
    [updateState]
  );

  const setAbilityScores = useCallback(
    (scores: AbilityScores, method?: AbilityMethod) => {
      updateState({
        abilityScores: scores,
        ...(method && { abilityMethod: method }),
      });
    },
    [updateState]
  );

  const setEquipment = useCallback(
    (equipment: Equipment[]) => {
      updateState({ equipment });
    },
    [updateState]
  );

  const setName = useCallback(
    (name: string) => {
      updateState({ name });
    },
    [updateState]
  );

  const setBackstory = useCallback(
    (backstory: string) => {
      updateState({ backstory });
    },
    [updateState]
  );

  const setNotes = useCallback(
    (notes: string) => {
      updateState({ notes });
    },
    [updateState]
  );

  // Validation
  const canGoNext = useCallback(() => {
    switch (state.currentStep) {
      case 'race':
        return state.race !== null;
      case 'class':
        return state.class !== null;
      case 'abilities':
        return state.abilityScores !== null;
      case 'equipment':
        return true; // Equipment is optional
      case 'review':
        return state.name.trim().length > 0;
      default:
        return false;
    }
  }, [state]);

  // Build final character object
  const buildCharacter = useCallback((): CreateCharacterInput | null => {
    if (!state.race || !state.class || !state.abilityScores || !state.name) {
      return null;
    }

    return {
      name: state.name.trim(),
      race: state.race,
      class: state.class,
      level: state.level,
      abilityScores: state.abilityScores,
      equipment: state.equipment,
      backstory: state.backstory,
      notes: state.notes,
    };
  }, [state]);

  // Reset wizard
  const reset = useCallback(() => {
    setState(INITIAL_STATE);
    localStorage.removeItem('character-wizard');
  }, []);

  // Get progress percentage
  const progress = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    return ((currentIndex + 1) / STEP_ORDER.length) * 100;
  }, [state.currentStep]);

  return {
    // State
    state,

    // Navigation
    nextStep,
    previousStep,
    goToStep,
    canGoNext,
    progress,

    // Updates
    setRace,
    setClass,
    setAbilityScores,
    setEquipment,
    setName,
    setBackstory,
    setNotes,

    // Actions
    buildCharacter,
    reset,
  };
}
