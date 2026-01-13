import CharacterWizard from '../components/character-wizard/CharacterWizard';

/**
 * Character creation wizard page
 */
export default function CharacterCreationPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Character</h1>
      <CharacterWizard />
    </div>
  );
}
