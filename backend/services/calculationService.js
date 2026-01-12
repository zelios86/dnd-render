/**
 * D&D 5e Calculation Service
 * Handles all auto-calculations for character stats
 * Migrated from index.js calcolaBonusCompetenza function
 */

/**
 * Calculate proficiency bonus based on character level
 * @param {number} level - Character level (1-20)
 * @returns {number} Proficiency bonus
 */
function calculateProficiencyBonus(level) {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

/**
 * Calculate ability modifier from ability score
 * @param {number} score - Ability score (1-30)
 * @returns {number} Ability modifier
 */
function calculateAbilityModifier(score) {
  return Math.floor((score - 10) / 2);
}

/**
 * Get racial bonus for a specific ability
 * @param {Object} race - Race object with abilityBonuses array
 * @param {string} abilityName - Name of ability (strength, dexterity, etc.)
 * @returns {number} Racial bonus
 */
function getRacialBonus(race, abilityName) {
  if (!race || !race.abilityBonuses) return 0;

  const bonus = race.abilityBonuses.find(
    ab => ab.abilityScore.toLowerCase() === abilityName.toLowerCase()
  );

  return bonus ? bonus.bonus : 0;
}

/**
 * Calculate final ability scores with racial bonuses
 * @param {Object} abilityScores - Base ability scores
 * @param {Object} race - Race object
 * @returns {Object} Final ability scores
 */
function calculateFinalAbilityScores(abilityScores, race) {
  const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
  const finalScores = {};

  abilities.forEach(ability => {
    const base = abilityScores[ability] || 10;
    const racialBonus = getRacialBonus(race, ability);
    finalScores[ability] = base + racialBonus;
  });

  return finalScores;
}

/**
 * Calculate all ability modifiers
 * @param {Object} finalAbilityScores - Final ability scores with racial bonuses
 * @returns {Object} Ability modifiers
 */
function calculateAbilityModifiers(finalAbilityScores) {
  const modifiers = {};

  Object.keys(finalAbilityScores).forEach(ability => {
    modifiers[ability] = calculateAbilityModifier(finalAbilityScores[ability]);
  });

  return modifiers;
}

/**
 * Calculate maximum hit points
 * @param {Object} character - Character object
 * @param {Object} finalAbilityScores - Final ability scores
 * @returns {number} Maximum HP
 */
function calculateMaxHP(character, finalAbilityScores) {
  const conModifier = calculateAbilityModifier(finalAbilityScores.constitution);
  const hitDie = character.class.hitDie || 8;
  const level = character.level || 1;

  // First level: full hit die + CON modifier
  const firstLevelHP = hitDie + conModifier;

  // Additional levels: average of hit die + CON modifier per level
  if (level === 1) {
    return Math.max(1, firstLevelHP); // Minimum 1 HP
  }

  const avgRollPerLevel = Math.floor(hitDie / 2) + 1;
  const additionalLevels = level - 1;
  const additionalHP = additionalLevels * (avgRollPerLevel + conModifier);

  return Math.max(level, firstLevelHP + additionalHP); // Minimum 1 HP per level
}

/**
 * Calculate armor class
 * @param {Object} character - Character object
 * @param {Object} finalAbilityScores - Final ability scores
 * @returns {number} Armor class
 */
function calculateAC(character, finalAbilityScores) {
  const dexModifier = calculateAbilityModifier(finalAbilityScores.dexterity);

  // Base AC (unarmored) = 10 + DEX modifier
  let ac = 10 + dexModifier;

  // Check equipped armor
  if (character.equipment && Array.isArray(character.equipment)) {
    const equippedArmor = character.equipment.find(
      item => item.equipped && item.type && item.type.toLowerCase().includes('armor')
    );

    if (equippedArmor && equippedArmor.ac) {
      ac = equippedArmor.ac;
      // Some armor types add DEX modifier (light armor)
      // Medium armor adds DEX modifier (max +2)
      // Heavy armor doesn't add DEX modifier
      // This is simplified - would need armor type info
    }
  }

  return ac;
}

/**
 * Calculate initiative
 * @param {Object} finalAbilityScores - Final ability scores
 * @returns {number} Initiative modifier
 */
function calculateInitiative(finalAbilityScores) {
  return calculateAbilityModifier(finalAbilityScores.dexterity);
}

/**
 * Calculate saving throws
 * @param {Object} character - Character object
 * @param {Object} abilityModifiers - Ability modifiers
 * @returns {Object} Saving throws
 */
function calculateSavingThrows(character, abilityModifiers) {
  const proficiencyBonus = calculateProficiencyBonus(character.level);
  const savingThrows = {};
  const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

  abilities.forEach(ability => {
    const isProficient = character.class && character.class.savingThrows &&
                        character.class.savingThrows.includes(ability);
    const modifier = abilityModifiers[ability];
    const profBonus = isProficient ? proficiencyBonus : 0;

    savingThrows[ability] = {
      value: modifier + profBonus,
      proficient: isProficient
    };
  });

  return savingThrows;
}

/**
 * Calculate skill modifiers
 * @param {Object} character - Character object
 * @param {Object} abilityModifiers - Ability modifiers
 * @returns {Array} Skills with calculated values
 */
function calculateSkills(character, abilityModifiers) {
  const proficiencyBonus = calculateProficiencyBonus(character.level);

  // D&D 5e skills and their associated abilities
  const skillAbilities = {
    acrobatics: 'dexterity',
    'animal handling': 'wisdom',
    arcana: 'intelligence',
    athletics: 'strength',
    deception: 'charisma',
    history: 'intelligence',
    insight: 'wisdom',
    intimidation: 'charisma',
    investigation: 'intelligence',
    medicine: 'wisdom',
    nature: 'intelligence',
    perception: 'wisdom',
    performance: 'charisma',
    persuasion: 'charisma',
    religion: 'intelligence',
    'sleight of hand': 'dexterity',
    stealth: 'dexterity',
    survival: 'wisdom'
  };

  const skills = [];

  Object.entries(skillAbilities).forEach(([skillName, abilityName]) => {
    // Check if character has this skill defined
    const characterSkill = character.skills && character.skills.find(
      s => s.name.toLowerCase() === skillName.toLowerCase()
    );

    const isProficient = characterSkill ? characterSkill.proficient : false;
    const hasExpertise = characterSkill ? characterSkill.expertise : false;
    const abilityMod = abilityModifiers[abilityName];
    const profBonus = isProficient ? proficiencyBonus : 0;
    const expertiseBonus = hasExpertise ? proficiencyBonus : 0;

    skills.push({
      name: skillName,
      abilityScore: abilityName,
      proficient: isProficient,
      expertise: hasExpertise,
      value: abilityMod + profBonus + expertiseBonus
    });
  });

  return skills;
}

/**
 * Calculate spellcasting stats
 * @param {Object} character - Character object
 * @param {Object} abilityModifiers - Ability modifiers
 * @returns {Object|null} Spellcasting stats or null if not a spellcaster
 */
function calculateSpellcasting(character, abilityModifiers) {
  if (!character.spellcasting || !character.spellcasting.spellcastingAbility) {
    return null;
  }

  const spellcastingAbility = character.spellcasting.spellcastingAbility;
  const abilityMod = abilityModifiers[spellcastingAbility];
  const proficiencyBonus = calculateProficiencyBonus(character.level);

  return {
    ...character.spellcasting,
    spellSaveDC: 8 + abilityMod + proficiencyBonus,
    spellAttackBonus: abilityMod + proficiencyBonus
  };
}

/**
 * Calculate all character stats
 * Main function that calculates all auto-calculated stats
 * @param {Object} character - Character object
 * @returns {Object} Character with calculated stats
 */
function calculateAllStats(character) {
  // Calculate final ability scores (base + racial bonuses)
  const finalAbilityScores = calculateFinalAbilityScores(
    character.abilityScores,
    character.race
  );

  // Calculate ability modifiers
  const abilityModifiers = calculateAbilityModifiers(finalAbilityScores);

  // Calculate proficiency bonus
  const proficiencyBonus = calculateProficiencyBonus(character.level);

  // Calculate all stats
  const maxHitPoints = calculateMaxHP(character, finalAbilityScores);
  const armorClass = calculateAC(character, finalAbilityScores);
  const initiative = calculateInitiative(finalAbilityScores);
  const savingThrows = calculateSavingThrows(character, abilityModifiers);
  const skills = calculateSkills(character, abilityModifiers);
  const spellcasting = calculateSpellcasting(character, abilityModifiers);

  // Speed (base + racial)
  const speed = character.race && character.race.speed ? character.race.speed : 30;

  // Build calculated stats object
  const calculatedStats = {
    proficiencyBonus,
    finalAbilityScores,
    abilityModifiers,
    savingThrows,
    initiative,
    armorClass,
    speed,
    maxHitPoints,
    currentHitPoints: character.calculatedStats?.currentHitPoints || maxHitPoints
  };

  // Return character with updated calculated stats
  return {
    ...character,
    calculatedStats,
    skills,
    spellcasting: spellcasting || character.spellcasting,
    updatedAt: new Date().toISOString()
  };
}

module.exports = {
  calculateProficiencyBonus,
  calculateAbilityModifier,
  getRacialBonus,
  calculateFinalAbilityScores,
  calculateAbilityModifiers,
  calculateMaxHP,
  calculateAC,
  calculateInitiative,
  calculateSavingThrows,
  calculateSkills,
  calculateSpellcasting,
  calculateAllStats
};
