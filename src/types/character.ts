export interface CharacterName {
  en: string;
  jp: string;
  romaji?: string | null;
}

export interface Birthday {
  day?: number;
  month?: number;
  label?: {
    en?: string;
    jp?: string;
    pt?: string;
  };
  trivia?: {
    en?: string;
    pt?: string;
  };
}

export interface Bounty {
  id: string;
  amount: number;
  is_active: boolean;
  created_at?: string;
  character_id?: string;
}

export interface Character {
  id: string;
  created_at: string;
  name: CharacterName;
  age: number | null;
  status: 'Alive' | 'Deceased' | 'Unknown' | string;
  height: number | null;
  blood_type: string | null;
  birthday: Birthday | null;
  image_url: string;
  extra_data?: Record<string, unknown> | null;
  bounties: Bounty[];
}

export type StatusFilter = 'all' | 'Alive' | 'Deceased' | 'Unknown';
export type SortOption = 'bounty' | 'bounty_asc' | 'name' | 'name_desc' | 'featured';
export type ViewMode = 'grid' | 'list';
export type CategoryFilter = 'characters' | 'bounties' | 'saved';
export type FilterChipOption = 'all' | 'bounties' | 'alive' | 'deceased' | 'saved';

