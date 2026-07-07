export type NatureName =
  | 'Adamant' | 'Bashful' | 'Bold' | 'Brave' | 'Calm'
  | 'Careful' | 'Docile' | 'Gentle' | 'Hardy' | 'Hasty'
  | 'Impish' | 'Jolly' | 'Lax' | 'Lonely' | 'Mild'
  | 'Modest' | 'Naive' | 'Naughty' | 'Quiet' | 'Quirky'
  | 'Rash' | 'Relaxed' | 'Sassy' | 'Serious' | 'Timid';

export type StatusName = 'slp' | 'psn' | 'brn' | 'frz' | 'par' | 'tox';

export type StatID = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';

export type StatsTable = Record<StatID, number>;

export type Damage = number | number[] | [number, number] | number[][];
