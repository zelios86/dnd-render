import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useCharacterWizard } from '../../hooks/useCharacterWizard';
import { createCharacter } from '../../api/characters';
import StepIndicator from './StepIndicator';
import Button from '../common/Button';
import RaceSelection from './steps/RaceSelection';
import ClassSelection from './steps/ClassSelection';
import AbilityScores from './steps/AbilityScores';
import EquipmentSelection from './steps/EquipmentSelection';
import Review from './steps/Review';

/**
 * Main Character Creation Wizard component
 */
export default function CharacterWizard() {
  const navigate = useNavigate();
  const wizard = useCharacterWizard();

  // Mutation for creating character
  const createMutation = useMutation({
    mutationFn: createCharacter,
    onSuccess: (character) => {
      wizard.reset();
      navigate(`/characters/${character.id}`);
    },
    onError: (error) => {
      console.error('Failed to create character:', error);
      alert('Failed to create character. Please try again.');
    },
  });

  const handleNext = () => {
    if (wizard.state.currentStep === 'review') {
      // Submit character
      const character = wizard.buildCharacter();
      if (character) {
        createMutation.mutate(character);
      }
    } else {
      wizard.nextStep();
    }
  };

  const renderStep = () => {
    switch (wizard.state.currentStep) {
      case 'race':
        return <RaceSelection selectedRace={wizard.state.race} onSelect={wizard.setRace} />;
      case 'class':
        return <ClassSelection selectedClass={wizard.state.class} onSelect={wizard.setClass} />;
      case 'abilities':
        return (
          <AbilityScores
            abilityScores={wizard.state.abilityScores}
            method={wizard.state.abilityMethod}
            race={wizard.state.race}
            onUpdate={wizard.setAbilityScores}
          />
        );
      case 'equipment':
        return (
          <EquipmentSelection
            selectedClass={wizard.state.class}
            equipment={wizard.state.equipment}
            onUpdate={wizard.setEquipment}
          />
        );
      case 'review':
        return (
          <Review
            state={wizard.state}
            onUpdateName={wizard.setName}
            onUpdateBackstory={wizard.setBackstory}
            onUpdateNotes={wizard.setNotes}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicator */}
      <StepIndicator currentStep={wizard.state.currentStep} progress={wizard.progress()} />

      {/* Step Content */}
      <div className="mb-8">{renderStep()}</div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={wizard.previousStep}
          disabled={wizard.state.currentStep === 'race'}
        >
          ← Back
        </Button>

        <div className="flex gap-2">
          <Button variant="secondary" onClick={wizard.reset}>
            Reset
          </Button>

          <Button
            onClick={handleNext}
            disabled={!wizard.canGoNext() || createMutation.isPending}
          >
            {createMutation.isPending
              ? 'Creating...'
              : wizard.state.currentStep === 'review'
              ? 'Create Character'
              : 'Next →'}
          </Button>
        </div>
      </div>
    </div>
  );
}
