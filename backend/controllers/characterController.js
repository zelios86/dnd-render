const { randomUUID } = require('crypto');
const storageService = require('../services/storageService');
const calculationService = require('../services/calculationService');

/**
 * Character Controller
 * Handles all CRUD operations for characters
 */

/**
 * Create a new character
 * POST /api/characters
 */
async function createCharacter(req, res, next) {
  try {
    const characterData = req.body;

    // Validate required fields
    if (!characterData.name || !characterData.race || !characterData.class || !characterData.level || !characterData.abilityScores) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Missing required fields: name, race, class, level, abilityScores'
      });
    }

    // Generate unique ID
    const id = randomUUID();

    // Build character object
    const character = {
      id,
      name: characterData.name,
      race: characterData.race,
      class: characterData.class,
      level: characterData.level,
      abilityScores: characterData.abilityScores,
      background: characterData.background || null,
      skills: characterData.skills || [],
      equipment: characterData.equipment || [],
      spellcasting: characterData.spellcasting || null,
      features: characterData.features || [],
      hitDice: characterData.hitDice || {
        total: characterData.level,
        current: characterData.level,
        type: `d${characterData.class.hitDie || 8}`
      },
      backstory: characterData.backstory || '',
      notes: characterData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Calculate all stats
    const characterWithStats = calculationService.calculateAllStats(character);

    // Save to storage
    const savedCharacter = await storageService.createCharacter(characterWithStats);

    res.status(201).json(savedCharacter);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all characters
 * GET /api/characters
 */
async function getAllCharacters(req, res, next) {
  try {
    const characters = await storageService.getAllCharacters();
    res.json(characters);
  } catch (error) {
    next(error);
  }
}

/**
 * Get single character by ID
 * GET /api/characters/:id
 */
async function getCharacterById(req, res, next) {
  try {
    const { id } = req.params;
    const character = await storageService.getCharacterById(id);

    if (!character) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Character with ID "${id}" not found`
      });
    }

    res.json(character);
  } catch (error) {
    next(error);
  }
}

/**
 * Update character
 * PUT /api/characters/:id
 */
async function updateCharacter(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Get existing character
    const existing = await storageService.getCharacterById(id);
    if (!existing) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Character with ID "${id}" not found`
      });
    }

    // Merge updates with existing character
    const updatedCharacter = {
      ...existing,
      ...updates,
      id, // Ensure ID doesn't change
      createdAt: existing.createdAt // Preserve creation date
    };

    // Recalculate stats if relevant fields changed
    if (updates.level || updates.abilityScores || updates.race || updates.class || updates.equipment) {
      const characterWithStats = calculationService.calculateAllStats(updatedCharacter);
      const saved = await storageService.updateCharacter(id, characterWithStats);
      return res.json(saved);
    }

    // Update without recalculation
    const saved = await storageService.updateCharacter(id, updatedCharacter);
    res.json(saved);
  } catch (error) {
    next(error);
  }
}

/**
 * Delete character
 * DELETE /api/characters/:id
 */
async function deleteCharacter(req, res, next) {
  try {
    const { id } = req.params;
    const deleted = await storageService.deleteCharacter(id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Character with ID "${id}" not found`
      });
    }

    res.json({
      message: 'Character deleted successfully',
      id
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update character HP (quick action)
 * PATCH /api/characters/:id/hp
 */
async function updateHP(req, res, next) {
  try {
    const { id } = req.params;
    const { currentHitPoints, temporaryHitPoints } = req.body;

    // Get existing character
    const character = await storageService.getCharacterById(id);
    if (!character) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Character with ID "${id}" not found`
      });
    }

    // Update HP
    const updates = {
      calculatedStats: {
        ...character.calculatedStats,
        ...(currentHitPoints !== undefined && { currentHitPoints }),
        ...(temporaryHitPoints !== undefined && { temporaryHitPoints })
      }
    };

    const updated = await storageService.updateCharacter(id, updates);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

/**
 * Update spell slot usage
 * PATCH /api/characters/:id/spell-slots
 */
async function updateSpellSlots(req, res, next) {
  try {
    const { id } = req.params;
    const { spellSlots } = req.body;

    // Get existing character
    const character = await storageService.getCharacterById(id);
    if (!character) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Character with ID "${id}" not found`
      });
    }

    if (!character.spellcasting) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Character is not a spellcaster'
      });
    }

    // Update spell slots
    const updates = {
      spellcasting: {
        ...character.spellcasting,
        spellSlots
      }
    };

    const updated = await storageService.updateCharacter(id, updates);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCharacter,
  getAllCharacters,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
  updateHP,
  updateSpellSlots
};
