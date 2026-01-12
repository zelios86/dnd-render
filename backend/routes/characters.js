const express = require('express');
const router = express.Router();
const characterController = require('../controllers/characterController');

/**
 * Character routes
 */

// Create new character
router.post('/', characterController.createCharacter);

// Get all characters
router.get('/', characterController.getAllCharacters);

// Get single character
router.get('/:id', characterController.getCharacterById);

// Update character
router.put('/:id', characterController.updateCharacter);

// Delete character
router.delete('/:id', characterController.deleteCharacter);

// Quick HP update
router.patch('/:id/hp', characterController.updateHP);

// Spell slot update
router.patch('/:id/spell-slots', characterController.updateSpellSlots);

module.exports = router;
