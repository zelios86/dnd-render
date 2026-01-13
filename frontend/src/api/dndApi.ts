import apiClient from './client';
import type {
  APIListResponse,
  APIReference,
  RaceAPI,
  ClassAPI,
  SpellAPI,
  EquipmentAPI,
  MagicItemAPI,
  FeatAPI,
  ConditionAPI,
  SpellFilters,
} from '../types/dnd';

/**
 * D&D 5e API functions (proxied through backend)
 */

// Races
export async function getRaces(): Promise<APIReference[]> {
  const response = await apiClient.get<APIListResponse<APIReference>>('/dnd/races');
  return response.data.results;
}

export async function getRaceByIndex(index: string): Promise<RaceAPI> {
  const response = await apiClient.get<RaceAPI>(`/dnd/races/${index}`);
  return response.data;
}

// Classes
export async function getClasses(): Promise<APIReference[]> {
  const response = await apiClient.get<APIListResponse<APIReference>>('/dnd/classes');
  return response.data.results;
}

export async function getClassByIndex(index: string): Promise<ClassAPI> {
  const response = await apiClient.get<ClassAPI>(`/dnd/classes/${index}`);
  return response.data;
}

// Spells
export async function getSpells(filters?: SpellFilters): Promise<APIReference[]> {
  const params = new URLSearchParams();
  if (filters?.level !== undefined) params.append('level', filters.level.toString());
  if (filters?.school) params.append('school', filters.school);

  const response = await apiClient.get<APIListResponse<APIReference>>(
    `/dnd/spells?${params.toString()}`
  );
  return response.data.results;
}

export async function getSpellByIndex(index: string): Promise<SpellAPI> {
  const response = await apiClient.get<SpellAPI>(`/dnd/spells/${index}`);
  return response.data;
}

// Equipment
export async function getEquipment(): Promise<APIReference[]> {
  const response = await apiClient.get<APIListResponse<APIReference>>('/dnd/equipment');
  return response.data.results;
}

export async function getEquipmentByIndex(index: string): Promise<EquipmentAPI> {
  const response = await apiClient.get<EquipmentAPI>(`/dnd/equipment/${index}`);
  return response.data;
}

// Magic Items
export async function getMagicItems(): Promise<APIReference[]> {
  const response = await apiClient.get<APIListResponse<APIReference>>('/dnd/magic-items');
  return response.data.results;
}

export async function getMagicItemByIndex(index: string): Promise<MagicItemAPI> {
  const response = await apiClient.get<MagicItemAPI>(`/dnd/magic-items/${index}`);
  return response.data;
}

// Feats
export async function getFeats(): Promise<APIReference[]> {
  const response = await apiClient.get<APIListResponse<APIReference>>('/dnd/feats');
  return response.data.results;
}

export async function getFeatByIndex(index: string): Promise<FeatAPI> {
  const response = await apiClient.get<FeatAPI>(`/dnd/feats/${index}`);
  return response.data;
}

// Conditions
export async function getConditions(): Promise<APIReference[]> {
  const response = await apiClient.get<APIListResponse<APIReference>>('/dnd/conditions');
  return response.data.results;
}

export async function getConditionByIndex(index: string): Promise<ConditionAPI> {
  const response = await apiClient.get<ConditionAPI>(`/dnd/conditions/${index}`);
  return response.data;
}
