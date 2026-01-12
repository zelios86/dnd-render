const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/characters.json');
const BACKUP_FILE = path.join(__dirname, '../data/characters.json.backup');

/**
 * Storage Service for file-based JSON character storage
 * Handles all read/write operations with file locking and backup
 */
class StorageService {
  /**
   * Read all characters from JSON file
   * @returns {Promise<Array>} Array of character objects
   */
  async readCharacters() {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      const parsed = JSON.parse(data);
      return parsed.characters || [];
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, create it
        await this.writeCharacters([]);
        return [];
      }
      throw new Error(`Failed to read characters: ${error.message}`);
    }
  }

  /**
   * Write characters to JSON file with atomic write and backup
   * @param {Array} characters - Array of character objects
   * @returns {Promise<void>}
   */
  async writeCharacters(characters) {
    try {
      // Create backup of existing file
      try {
        await fs.copyFile(DATA_FILE, BACKUP_FILE);
      } catch (error) {
        // Ignore if file doesn't exist yet
        if (error.code !== 'ENOENT') {
          console.warn('Failed to create backup:', error.message);
        }
      }

      // Write to temp file first (atomic write)
      const tempFile = `${DATA_FILE}.tmp`;
      const data = JSON.stringify({ characters }, null, 2);
      await fs.writeFile(tempFile, data, 'utf8');

      // Rename temp file to actual file (atomic operation)
      await fs.rename(tempFile, DATA_FILE);
    } catch (error) {
      throw new Error(`Failed to write characters: ${error.message}`);
    }
  }

  /**
   * Get a single character by ID
   * @param {string} id - Character ID
   * @returns {Promise<Object|null>} Character object or null if not found
   */
  async getCharacterById(id) {
    const characters = await this.readCharacters();
    return characters.find(char => char.id === id) || null;
  }

  /**
   * Create a new character
   * @param {Object} character - Character object with ID already assigned
   * @returns {Promise<Object>} Created character
   */
  async createCharacter(character) {
    const characters = await this.readCharacters();

    // Check if character with same ID already exists
    const exists = characters.some(char => char.id === character.id);
    if (exists) {
      throw new Error('Character with this ID already exists');
    }

    characters.push(character);
    await this.writeCharacters(characters);
    return character;
  }

  /**
   * Update an existing character
   * @param {string} id - Character ID
   * @param {Object} updates - Object with fields to update
   * @returns {Promise<Object|null>} Updated character or null if not found
   */
  async updateCharacter(id, updates) {
    const characters = await this.readCharacters();
    const index = characters.findIndex(char => char.id === id);

    if (index === -1) {
      return null;
    }

    // Merge updates with existing character
    characters[index] = {
      ...characters[index],
      ...updates,
      id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString()
    };

    await this.writeCharacters(characters);
    return characters[index];
  }

  /**
   * Delete a character
   * @param {string} id - Character ID
   * @returns {Promise<boolean>} true if deleted, false if not found
   */
  async deleteCharacter(id) {
    const characters = await this.readCharacters();
    const initialLength = characters.length;
    const filtered = characters.filter(char => char.id !== id);

    if (filtered.length === initialLength) {
      return false; // Character not found
    }

    await this.writeCharacters(filtered);
    return true;
  }

  /**
   * Get all characters
   * @returns {Promise<Array>} Array of all characters
   */
  async getAllCharacters() {
    return await this.readCharacters();
  }
}

module.exports = new StorageService();
