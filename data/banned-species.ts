/** Banned species — cannot be selected. Source: Gen 9 LCMNM /challenge ruleset. */
export const BANNED_SPECIES = [
  'Basculin',
  'Diglett',
  'Dunsparce',
  'Duraludon',
  'Meditite',
  'Rufflet',
  'Scyther',
  'Sneasel',
  'Stantler',
] as const;

/** Explicitly legal despite a base-species ban. */
export const BAN_EXCEPTIONS = [
  'Diglett-Alola',
] as const;
