import type { WizardStep } from '../../hooks/useCharacterWizard';

interface StepIndicatorProps {
  currentStep: WizardStep;
  progress: number;
}

const STEPS: { id: WizardStep; label: string; icon: string }[] = [
  { id: 'race', label: 'Race', icon: '🧝' },
  { id: 'class', label: 'Class', icon: '⚔️' },
  { id: 'abilities', label: 'Abilities', icon: '💪' },
  { id: 'equipment', label: 'Equipment', icon: '🎒' },
  { id: 'review', label: 'Review', icon: '✅' },
];

/**
 * Step indicator showing wizard progress
 */
export default function StepIndicator({ currentStep, progress }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="relative mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="absolute -top-1 right-0 text-xs text-gray-500 font-semibold">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = index < currentIndex;
          const isUpcoming = index > currentIndex;

          return (
            <div
              key={step.id}
              className={`flex flex-col items-center flex-1 ${
                index < STEPS.length - 1 ? 'relative' : ''
              }`}
            >
              {/* Icon circle */}
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center text-2xl
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-primary text-white scale-110 shadow-lg'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }
                `}
              >
                {isCompleted ? '✓' : step.icon}
              </div>

              {/* Label */}
              <span
                className={`
                  mt-2 text-xs sm:text-sm font-medium text-center
                  ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                `}
              >
                {step.label}
              </span>

              {/* Connection line (hidden on mobile for last step) */}
              {index < STEPS.length - 1 && (
                <div
                  className={`
                    hidden sm:block absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)]
                    h-0.5 -z-10
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
