const axios = require('axios');

/**
 * D&D API Service
 * Integrates with Open5e API (2024 rules) and DnD5e API (fallback)
 * Includes in-memory caching to reduce API calls
 */

const OPEN5E_BASE_URL = process.env.OPEN5E_API_URL || 'https://api.open5e.com/v2';
const DND5E_BASE_URL = process.env.DND5E_API_URL || 'https://www.dnd5eapi.co/api';

// In-memory cache with TTL (30 minutes)
const cache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Cache helper functions
 */
function getCacheKey(endpoint, params) {
  return `${endpoint}_${JSON.stringify(params || {})}`;
}

function getFromCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  if (now - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return cached.data;
}

function setInCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

/**
 * Make API request with caching
 * @param {string} url - Full URL to request
 * @param {string} cacheKey - Cache key
 * @returns {Promise<Object>} API response data
 */
async function fetchWithCache(url, cacheKey) {
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'application/json'
      }
    });

    const data = response.data;
    setInCache(cacheKey, data);
    return data;
  } catch (error) {
    throw new Error(`API request failed: ${error.message}`);
  }
}

/**
 * Get all races
 * @returns {Promise<Array>} Array of races
 */
async function getRaces() {
  const cacheKey = getCacheKey('races');

  try {
    // Try DnD5e API first (more reliable for races)
    const url = `${DND5E_BASE_URL}/races`;
    const data = await fetchWithCache(url, cacheKey);
    return data.results || [];
  } catch (error) {
    console.error('Failed to fetch races:', error.message);
    return [];
  }
}

/**
 * Get specific race by index
 * @param {string} index - Race index/slug
 * @returns {Promise<Object>} Race data
 */
async function getRaceByIndex(index) {
  const cacheKey = getCacheKey('race', { index });

  try {
    const url = `${DND5E_BASE_URL}/races/${index}`;
    return await fetchWithCache(url, cacheKey);
  } catch (error) {
    throw new Error(`Failed to fetch race "${index}": ${error.message}`);
  }
}

/**
 * Get all classes
 * @returns {Promise<Array>} Array of classes
 */
async function getClasses() {
  const cacheKey = getCacheKey('classes');

  try {
    const url = `${DND5E_BASE_URL}/classes`;
    const data = await fetchWithCache(url, cacheKey);
    return data.results || [];
  } catch (error) {
    console.error('Failed to fetch classes:', error.message);
    return [];
  }
}

/**
 * Get specific class by index
 * @param {string} index - Class index/slug
 * @returns {Promise<Object>} Class data
 */
async function getClassByIndex(index) {
  const cacheKey = getCacheKey('class', { index });

  try {
    const url = `${DND5E_BASE_URL}/classes/${index}`;
    return await fetchWithCache(url, cacheKey);
  } catch (error) {
    throw new Error(`Failed to fetch class "${index}": ${error.message}`);
  }
}

/**
 * Get all spells with optional filters
 * @param {Object} filters - Optional filters (level, school, class)
 * @returns {Promise<Array>} Array of spells
 */
async function getSpells(filters = {}) {
  const cacheKey = getCacheKey('spells', filters);

  try {
    // Build query params
    const params = new URLSearchParams();
    if (filters.level !== undefined) params.append('level', filters.level);
    if (filters.school) params.append('school', filters.school);

    const url = `${DND5E_BASE_URL}/spells?${params.toString()}`;
    const data = await fetchWithCache(url, cacheKey);
    return data.results || [];
  } catch (error) {
    console.error('Failed to fetch spells:', error.message);
    return [];
  }
}

/**
 * Get specific spell by index
 * @param {string} index - Spell index/slug
 * @returns {Promise<Object>} Spell data
 */
async function getSpellByIndex(index) {
  const cacheKey = getCacheKey('spell', { index });

  try {
    const url = `${DND5E_BASE_URL}/spells/${index}`;
    return await fetchWithCache(url, cacheKey);
  } catch (error) {
    throw new Error(`Failed to fetch spell "${index}": ${error.message}`);
  }
}

/**
 * Get all equipment
 * @returns {Promise<Array>} Array of equipment
 */
async function getEquipment() {
  const cacheKey = getCacheKey('equipment');

  try {
    const url = `${DND5E_BASE_URL}/equipment`;
    const data = await fetchWithCache(url, cacheKey);
    return data.results || [];
  } catch (error) {
    console.error('Failed to fetch equipment:', error.message);
    return [];
  }
}

/**
 * Get specific equipment by index
 * @param {string} index - Equipment index/slug
 * @returns {Promise<Object>} Equipment data
 */
async function getEquipmentByIndex(index) {
  const cacheKey = getCacheKey('equipment', { index });

  try {
    const url = `${DND5E_BASE_URL}/equipment/${index}`;
    return await fetchWithCache(url, cacheKey);
  } catch (error) {
    throw new Error(`Failed to fetch equipment "${index}": ${error.message}`);
  }
}

/**
 * Get all magic items
 * @returns {Promise<Array>} Array of magic items
 */
async function getMagicItems() {
  const cacheKey = getCacheKey('magic-items');

  try {
    const url = `${DND5E_BASE_URL}/magic-items`;
    const data = await fetchWithCache(url, cacheKey);
    return data.results || [];
  } catch (error) {
    console.error('Failed to fetch magic items:', error.message);
    return [];
  }
}

/**
 * Get specific magic item by index
 * @param {string} index - Magic item index/slug
 * @returns {Promise<Object>} Magic item data
 */
async function getMagicItemByIndex(index) {
  const cacheKey = getCacheKey('magic-item', { index });

  try {
    const url = `${DND5E_BASE_URL}/magic-items/${index}`;
    return await fetchWithCache(url, cacheKey);
  } catch (error) {
    throw new Error(`Failed to fetch magic item "${index}": ${error.message}`);
  }
}

/**
 * Get all feats
 * Note: DnD5e API has limited feat support, may need manual data
 * @returns {Promise<Array>} Array of feats
 */
async function getFeats() {
  const cacheKey = getCacheKey('feats');

  try {
    const url = `${DND5E_BASE_URL}/feats`;
    const data = await fetchWithCache(url, cacheKey);
    return data.results || [];
  } catch (error) {
    console.warn('Feats endpoint not available, returning empty array');
    return [];
  }
}

/**
 * Get specific feat by index
 * @param {string} index - Feat index/slug
 * @returns {Promise<Object>} Feat data
 */
async function getFeatByIndex(index) {
  const cacheKey = getCacheKey('feat', { index });

  try {
    const url = `${DND5E_BASE_URL}/feats/${index}`;
    return await fetchWithCache(url, cacheKey);
  } catch (error) {
    throw new Error(`Failed to fetch feat "${index}": ${error.message}`);
  }
}

/**
 * Get all conditions
 * @returns {Promise<Array>} Array of conditions
 */
async function getConditions() {
  const cacheKey = getCacheKey('conditions');

  try {
    const url = `${DND5E_BASE_URL}/conditions`;
    const data = await fetchWithCache(url, cacheKey);
    return data.results || [];
  } catch (error) {
    console.error('Failed to fetch conditions:', error.message);
    return [];
  }
}

/**
 * Get specific condition by index
 * @param {string} index - Condition index/slug
 * @returns {Promise<Object>} Condition data
 */
async function getConditionByIndex(index) {
  const cacheKey = getCacheKey('condition', { index });

  try {
    const url = `${DND5E_BASE_URL}/conditions/${index}`;
    return await fetchWithCache(url, cacheKey);
  } catch (error) {
    throw new Error(`Failed to fetch condition "${index}": ${error.message}`);
  }
}

/**
 * Clear cache (useful for testing or manual refresh)
 */
function clearCache() {
  cache.clear();
}

/**
 * Get cache stats (for debugging)
 */
function getCacheStats() {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
}

module.exports = {
  getRaces,
  getRaceByIndex,
  getClasses,
  getClassByIndex,
  getSpells,
  getSpellByIndex,
  getEquipment,
  getEquipmentByIndex,
  getMagicItems,
  getMagicItemByIndex,
  getFeats,
  getFeatByIndex,
  getConditions,
  getConditionByIndex,
  clearCache,
  getCacheStats
};
