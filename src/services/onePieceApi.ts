import type { Character, SortOption, StatusFilter } from '../types/character';

const CACHE_KEY = 'op_encyclopedia_characters_v2';

/**
 * Deduplicate characters array by ID
 */
function deduplicate(list: Character[]): Character[] {
  const map = new Map<string, Character>();
  for (const char of list) {
    if (char && char.id && !map.has(char.id)) {
      map.set(char.id, char);
    }
  }
  return Array.from(map.values());
}

/**
 * Save characters to sessionStorage
 */
function saveToCache(list: Character[]): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(list));
  } catch {
    // Ignore storage quota or disabled storage
  }
}

/**
 * Fetch characters using a resilient multi-tier strategy:
 * 1. sessionStorage cache (instant)
 * 2. Vite dev proxy /api/characters (avoids browser CORS)
 * 3. Local bundled static JSON /data/characters.json (guaranteed offline/production fallback)
 * 4. Direct https://onepieceapi.com/api/characters (if allowed or using extensions)
 */
export async function fetchAllCharacters(
  onProgress?: (loaded: number, total: number) => void
): Promise<Character[]> {
  // 1. Check sessionStorage cache
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (onProgress) onProgress(parsed.length, parsed.length);
        return parsed;
      }
    }
  } catch {
    // Ignore cache error
  }

  // 2. Try Vite proxy (/api/characters)
  try {
    const testRes = await fetch('/api/characters?limit=100&page=1');
    if (testRes.ok) {
      const totalPages = 7;
      const pagePromises = Array.from({ length: totalPages }, (_, i) => i + 1).map(async (page) => {
        const res = await fetch(`/api/characters?limit=100&page=${page}`);
        if (!res.ok) throw new Error(`Proxy page ${page} error`);
        return (await res.json()) as Character[];
      });
      const pagesData = await Promise.all(pagePromises);
      const allCharacters = deduplicate(pagesData.flat());
      if (allCharacters.length > 0) {
        saveToCache(allCharacters);
        if (onProgress) onProgress(allCharacters.length, allCharacters.length);
        return allCharacters;
      }
    }
  } catch (e) {
    console.info('Proxy not active or returned error, switching to static dataset fallback...', e);
  }

  // 3. Fallback: Local static dataset in public/data/characters.json (100% CORS-free and instant)
  try {
    const localRes = await fetch('/data/characters.json');
    if (localRes.ok) {
      const localData = (await localRes.json()) as Character[];
      const allCharacters = deduplicate(localData);
      if (allCharacters.length > 0) {
        saveToCache(allCharacters);
        if (onProgress) onProgress(allCharacters.length, allCharacters.length);
        return allCharacters;
      }
    }
  } catch (e) {
    console.warn('Local /data/characters.json fetch failed...', e);
  }

  // 4. Try direct fetch from onepieceapi.com
  try {
    const pages = [1, 2, 3, 4, 5, 6, 7];
    const pagePromises = pages.map(async (page) => {
      const res = await fetch(`https://onepieceapi.com/api/characters?limit=100&page=${page}`);
      if (!res.ok) throw new Error(`Direct page ${page} error`);
      return (await res.json()) as Character[];
    });
    const pagesData = await Promise.all(pagePromises);
    const allCharacters = deduplicate(pagesData.flat());
    if (allCharacters.length > 0) {
      saveToCache(allCharacters);
      if (onProgress) onProgress(allCharacters.length, allCharacters.length);
      return allCharacters;
    }
  } catch (err) {
    console.error('All fetch attempts failed:', err);
  }

  return [];
}

/**
 * Returns the highest or active bounty amount for a character.
 */
export function getActiveBounty(character: Character): number | null {
  if (!character.bounties || character.bounties.length === 0) {
    return null;
  }
  // Try finding the currently active bounty
  const active = character.bounties.find((b) => b.is_active);
  if (active && typeof active.amount === 'number') {
    return active.amount;
  }
  // Otherwise, use the highest amount recorded
  const maxBounty = character.bounties.reduce((max, b) => {
    return (b.amount || 0) > (max.amount || 0) ? b : max;
  }, character.bounties[0]);

  return maxBounty?.amount ?? null;
}

/**
 * Format currency in Berries (฿ 3,000,000,000)
 */
export function formatBounty(amount: number | null): string {
  if (amount === null || amount === undefined) {
    return 'NO BOUNTY';
  }
  return `฿ ${amount.toLocaleString('en-US')}`;
}

export function getBountyLabel(character: Character): string {
  if (character.status?.toLowerCase() === 'deceased') {
    return 'LAST KNOWN BOUNTY';
  }
  return 'BOUNTY';
}

/**
 * Filter characters according to search query, status, category/chip, and bookmarks
 */
export function filterCharacters(
  characters: Character[],
  query: string,
  status: StatusFilter,
  categoryOrChip: string,
  savedIds: Set<string>
): Character[] {
  const cleanQuery = query.trim().toLowerCase();

  return characters.filter((char) => {
    // 1. Text search match
    if (cleanQuery) {
      const matchEn = char.name?.en?.toLowerCase().includes(cleanQuery);
      const matchJp = char.name?.jp?.toLowerCase().includes(cleanQuery);
      const matchRomaji = char.name?.romaji?.toLowerCase().includes(cleanQuery);
      if (!matchEn && !matchJp && !matchRomaji) {
        return false;
      }
    }

    // 2. Status dropdown filter
    if (status !== 'all') {
      if (char.status?.toLowerCase() !== status.toLowerCase()) {
        return false;
      }
    }

    // 3. Category or chip filter
    if (categoryOrChip === 'bounties') {
      const hasBounty = char.bounties && char.bounties.length > 0;
      if (!hasBounty) return false;
    } else if (categoryOrChip === 'alive') {
      if (char.status?.toLowerCase() !== 'alive') return false;
    } else if (categoryOrChip === 'deceased') {
      if (char.status?.toLowerCase() !== 'deceased') return false;
    } else if (categoryOrChip === 'saved') {
      if (!savedIds.has(char.id)) return false;
    }

    return true;
  });
}

/**
 * Sort characters
 */
export function sortCharacters(characters: Character[], sort: SortOption): Character[] {
  const list = [...characters];

  switch (sort) {
    case 'bounty':
      return list.sort((a, b) => {
        const bA = getActiveBounty(a) ?? -1;
        const bB = getActiveBounty(b) ?? -1;
        if (bB !== bA) return bB - bA;
        return (a.name?.en || '').localeCompare(b.name?.en || '');
      });

    case 'bounty_asc':
      return list.sort((a, b) => {
        const bA = getActiveBounty(a);
        const bB = getActiveBounty(b);
        if (bA === null && bB === null) return 0;
        if (bA === null) return 1;
        if (bB === null) return -1;
        if (bA !== bB) return bA - bB;
        return (a.name?.en || '').localeCompare(b.name?.en || '');
      });

    case 'name':
      return list.sort((a, b) => (a.name?.en || '').localeCompare(b.name?.en || ''));

    case 'name_desc':
      return list.sort((a, b) => (b.name?.en || '').localeCompare(a.name?.en || ''));

    case 'featured':
    default:
      return list.sort((a, b) => {
        const bA = getActiveBounty(a) ?? -1;
        const bB = getActiveBounty(b) ?? -1;
        if (bB !== bA) return bB - bA;
        return (a.name?.en || '').localeCompare(b.name?.en || '');
      });
  }
}
