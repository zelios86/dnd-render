import apiClient from './client';
import type { Character, CreateCharacterInput } from '../types/character';

/**
 * Character API functions
 */

/**
 * Get all characters
 */
export async function getAllCharacters(): Promise<Character[]> {
  const response = await apiClient.get<Character[]>('/characters');
  return response.data;
}

/**
 * Get single character by ID
 */
export async function getCharacterById(id: string): Promise<Character> {
  const response = await apiClient.get<Character>(`/characters/${id}`);
  return response.data;
}

/**
 * Create new character
 */
export async function createCharacter(data: CreateCharacterInput): Promise<Character> {
  const response = await apiClient.post<Character>('/characters', data);
  return response.data;
}

/**
 * Update character
 */
export async function updateCharacter(id: string, data: Partial<Character>): Promise<Character> {
  const response = await apiClient.put<Character>(`/characters/${id}`, data);
  return response.data;
}

/**
 * Delete character
 */
export async function deleteCharacter(id: string): Promise<void> {
  await apiClient.delete(`/characters/${id}`);
}

/**
 * Update character HP (quick action)
 */
export async function updateCharacterHP(
  id: string,
  currentHitPoints: number,
  temporaryHitPoints?: number
): Promise<Character> {
  const response = await apiClient.patch<Character>(`/characters/${id}/hp`, {
    currentHitPoints,
    temporaryHitPoints,
  });
  return response.data;
}

/**
 * Update spell slots
 */
export async function updateSpellSlots(
  id: string,
  spellSlots: Array<{ level: number; total: number; used: number }>
): Promise<Character> {
  const response = await apiClient.patch<Character>(`/characters/${id}/spell-slots`, {
    spellSlots,
  });
  return response.data;
}
