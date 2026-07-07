import { Dex } from '@pkmn/dex';
import { BAN_EXCEPTIONS, BANNED_SPECIES } from '@/data/banned-species';
import { RESTRICTED_SPECIES } from '@/data/restricted-species';

const dex = Dex.forGen(9);

const bannedSet = new Set<string>(BANNED_SPECIES);
const banExceptionSet = new Set<string>(BAN_EXCEPTIONS);
const restrictedSet = new Set<string>(RESTRICTED_SPECIES);

function toID(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * LCMNM legality:
 * 1. Base pool — Showdown LC tier, plus NFE-tier first-stage species with evolutions
 *    (LC-legal in play but not ranked LC: Porygon, Shellder, Torchic, Vulpix, etc.).
 * 2. Minus format species bans (with form exceptions).
 * 3. Restricted list — explicit *species from challenge; legal but no mega stones.
 *    Includes species outside the base pool (Gligar, Qwilfish-Hisui).
 */
function speciesIsBanned(name: string): boolean {
  if (banExceptionSet.has(name)) return false;
  if (bannedSet.has(name)) return true;
  const species = dex.species.get(toID(name));
  if (!species?.baseSpecies) return false;
  return bannedSet.has(species.baseSpecies);
}

function isLcEligibleSpecies(name: string): boolean {
  const species = dex.species.get(toID(name));
  if (!species?.num || species.num <= 0) return false;
  if (species.isNonstandard) return false;
  if (species.tier === 'LC') return true;
  if (species.tier === 'NFE' && !species.prevo && (species.evos?.length ?? 0) > 0) return true;
  return false;
}

export const LCMNM_POKEMON = {
  banned: [...BANNED_SPECIES],
  restricted: [...RESTRICTED_SPECIES],
  unrestricted: [] as string[],
};

for (const species of dex.species.all()) {
  if (!isLcEligibleSpecies(species.name)) continue;
  if (speciesIsBanned(species.name)) continue;
  if (restrictedSet.has(species.name)) continue;
  LCMNM_POKEMON.unrestricted.push(species.name);
}

LCMNM_POKEMON.unrestricted.sort((a, b) => a.localeCompare(b));

const restrictedLegal = RESTRICTED_SPECIES.filter((name) => !speciesIsBanned(name));

export const ALL_LEGAL_SPECIES = [
  ...LCMNM_POKEMON.unrestricted,
  ...restrictedLegal,
].sort((a, b) => a.localeCompare(b));

export function isSpeciesBanned(name: string): boolean {
  return speciesIsBanned(name);
}

export function isSpeciesRestricted(name: string): boolean {
  return restrictedSet.has(name);
}

export function isSpeciesLegal(name: string): boolean {
  if (speciesIsBanned(name)) return false;
  if (restrictedSet.has(name)) return true;
  return isLcEligibleSpecies(name);
}

export function getSpeciesFormes(name: string): string[] {
  const species = dex.species.get(toID(name));
  if (!species) return [name];
  const formes = [species.name, ...(species.otherFormes ?? [])];
  return formes.filter((forme) => isSpeciesLegal(forme));
}
