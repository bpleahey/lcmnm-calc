import type { NatureName, StatID, StatusName } from '@/lib/types';

export const LC_LEVEL = 5;
export const MAX_EV_TOTAL = 508;
export const MAX_EV_PER_STAT = 236;

export const STAT_IDS: StatID[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];

export const NATURES: { name: NatureName; label: string }[] = [
  { name: 'Adamant', label: 'Adamant (+Atk, -SpA)' },
  { name: 'Bashful', label: 'Bashful' },
  { name: 'Bold', label: 'Bold (+Def, -Atk)' },
  { name: 'Brave', label: 'Brave (+Atk, -Spe)' },
  { name: 'Calm', label: 'Calm (+SpD, -Atk)' },
  { name: 'Careful', label: 'Careful (+SpD, -SpA)' },
  { name: 'Docile', label: 'Docile' },
  { name: 'Gentle', label: 'Gentle (+SpD, -Def)' },
  { name: 'Hardy', label: 'Hardy' },
  { name: 'Hasty', label: 'Hasty (+Spe, -Def)' },
  { name: 'Impish', label: 'Impish (+Def, -SpA)' },
  { name: 'Jolly', label: 'Jolly (+Spe, -SpA)' },
  { name: 'Lax', label: 'Lax (+Def, -SpD)' },
  { name: 'Lonely', label: 'Lonely (+Atk, -Def)' },
  { name: 'Mild', label: 'Mild (+SpA, -Def)' },
  { name: 'Modest', label: 'Modest (+SpA, -Atk)' },
  { name: 'Naive', label: 'Naive (+Spe, -SpD)' },
  { name: 'Naughty', label: 'Naughty (+Atk, -SpD)' },
  { name: 'Quiet', label: 'Quiet (+SpA, -Spe)' },
  { name: 'Quirky', label: 'Quirky' },
  { name: 'Rash', label: 'Rash (+SpA, -SpD)' },
  { name: 'Relaxed', label: 'Relaxed (+Def, -Spe)' },
  { name: 'Sassy', label: 'Sassy (+SpD, -Spe)' },
  { name: 'Serious', label: 'Serious' },
  { name: 'Timid', label: 'Timid (+Spe, -Atk)' },
];

export const STATUS_OPTIONS: { value: StatusName | ''; label: string }[] = [
  { value: '', label: 'Healthy' },
  { value: 'brn', label: 'Burned' },
  { value: 'psn', label: 'Poisoned' },
  { value: 'tox', label: 'Badly Poisoned' },
  { value: 'par', label: 'Paralyzed' },
  { value: 'slp', label: 'Asleep' },
  { value: 'frz', label: 'Frozen' },
];

export const WEATHER_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'Sun', label: 'Sun' },
  { value: 'Rain', label: 'Rain' },
  { value: 'Sand', label: 'Sand' },
  { value: 'Snow', label: 'Snow' },
  { value: 'Harsh Sunshine', label: 'Harsh Sunshine' },
  { value: 'Heavy Rain', label: 'Heavy Rain' },
  { value: 'Strong Winds', label: 'Strong Winds' },
] as const;

export const TERRAIN_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'Electric', label: 'Electric' },
  { value: 'Grassy', label: 'Grassy' },
  { value: 'Misty', label: 'Misty' },
  { value: 'Psychic', label: 'Psychic' },
] as const;
