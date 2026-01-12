const express = require('express');
const router = express.Router();
const dndApiService = require('../services/dndApiService');

/**
 * D&D API proxy routes
 * Proxies requests to Open5e and DnD5e APIs
 */

// Races
router.get('/races', async (req, res, next) => {
  try {
    const races = await dndApiService.getRaces();
    res.json({ results: races });
  } catch (error) {
    next(error);
  }
});

router.get('/races/:index', async (req, res, next) => {
  try {
    const race = await dndApiService.getRaceByIndex(req.params.index);
    res.json(race);
  } catch (error) {
    next(error);
  }
});

// Classes
router.get('/classes', async (req, res, next) => {
  try {
    const classes = await dndApiService.getClasses();
    res.json({ results: classes });
  } catch (error) {
    next(error);
  }
});

router.get('/classes/:index', async (req, res, next) => {
  try {
    const classData = await dndApiService.getClassByIndex(req.params.index);
    res.json(classData);
  } catch (error) {
    next(error);
  }
});

// Spells
router.get('/spells', async (req, res, next) => {
  try {
    const filters = {
      level: req.query.level,
      school: req.query.school
    };
    const spells = await dndApiService.getSpells(filters);
    res.json({ results: spells });
  } catch (error) {
    next(error);
  }
});

router.get('/spells/:index', async (req, res, next) => {
  try {
    const spell = await dndApiService.getSpellByIndex(req.params.index);
    res.json(spell);
  } catch (error) {
    next(error);
  }
});

// Equipment
router.get('/equipment', async (req, res, next) => {
  try {
    const equipment = await dndApiService.getEquipment();
    res.json({ results: equipment });
  } catch (error) {
    next(error);
  }
});

router.get('/equipment/:index', async (req, res, next) => {
  try {
    const item = await dndApiService.getEquipmentByIndex(req.params.index);
    res.json(item);
  } catch (error) {
    next(error);
  }
});

// Magic Items
router.get('/magic-items', async (req, res, next) => {
  try {
    const magicItems = await dndApiService.getMagicItems();
    res.json({ results: magicItems });
  } catch (error) {
    next(error);
  }
});

router.get('/magic-items/:index', async (req, res, next) => {
  try {
    const magicItem = await dndApiService.getMagicItemByIndex(req.params.index);
    res.json(magicItem);
  } catch (error) {
    next(error);
  }
});

// Feats
router.get('/feats', async (req, res, next) => {
  try {
    const feats = await dndApiService.getFeats();
    res.json({ results: feats });
  } catch (error) {
    next(error);
  }
});

router.get('/feats/:index', async (req, res, next) => {
  try {
    const feat = await dndApiService.getFeatByIndex(req.params.index);
    res.json(feat);
  } catch (error) {
    next(error);
  }
});

// Conditions
router.get('/conditions', async (req, res, next) => {
  try {
    const conditions = await dndApiService.getConditions();
    res.json({ results: conditions });
  } catch (error) {
    next(error);
  }
});

router.get('/conditions/:index', async (req, res, next) => {
  try {
    const condition = await dndApiService.getConditionByIndex(req.params.index);
    res.json(condition);
  } catch (error) {
    next(error);
  }
});

// Cache management (for debugging)
router.get('/cache/stats', (req, res) => {
  const stats = dndApiService.getCacheStats();
  res.json(stats);
});

router.post('/cache/clear', (req, res) => {
  dndApiService.clearCache();
  res.json({ message: 'Cache cleared successfully' });
});

module.exports = router;
