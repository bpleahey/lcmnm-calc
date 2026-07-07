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

function speciesIsBanned(name: string): boolean {
  if (banExceptionSet.has(name)) return false;
  if (bannedSet.has(name)) return true;
  const species = dex.species.get(toID(name));
  if (!species?.baseSpecies) return false;
  return bannedSet.has(species.baseSpecies);
}

function isLcTierSpecies(name: string): boolean {
  const species = dex.species.get(toID(name));
  return species?.tier === 'LC';
}

export const LCMNM_POKEMON = {
  banned: [...BANNED_SPECIES],
  restricted: [...RESTRICTED_SPECIES],
  unrestricted: [] as string[],
};

for (const species of dex.species.all()) {
  if (species.tier !== 'LC') continue;
  if (speciesIsBanned(species.name)) continue;
  if (restrictedSet.has(species.name)) continue;
  LCMNM_POKEMON.unrestricted.push(species.name);
}

LCMNM_POKEMON.unrestricted.sort((a, b) => a.localeCompare(b));

export const ALL_LEGAL_SPECIES = [
  ...LCMNM_POKEMON.unrestricted,
  ...LCMNM_POKEMON.restricted,
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
  return isLcTierSpecies(name);
}

export function getSpeciesFormes(name: string): string[] {
  const species = dex.species.get(toID(name));
  if (!species) return [name];
  const formes = [species.name, ...(species.otherFormes ?? [])];
  return formes.filter((forme) => isSpeciesLegal(forme));
}
