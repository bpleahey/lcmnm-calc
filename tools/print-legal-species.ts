import { Dex } from '@pkmn/dex';
import { BAN_EXCEPTIONS, BANNED_SPECIES } from '../data/banned-species';
import { RESTRICTED_SPECIES } from '../data/restricted-species';

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

function isLcEligibleSpecies(name: string): boolean {
  const species = dex.species.get(toID(name));
  if (!species?.num || species.num <= 0) return false;
  if (species.isNonstandard) return false;
  if (species.tier === 'LC') return true;
  if (species.tier === 'NFE' && !species.prevo && (species.evos?.length ?? 0) > 0) return true;
  return false;
}

const unrestricted: string[] = [];
for (const species of dex.species.all()) {
  if (!isLcEligibleSpecies(species.name)) continue;
  if (speciesIsBanned(species.name)) continue;
  if (restrictedSet.has(species.name)) continue;
  unrestricted.push(species.name);
}
unrestricted.sort();

const restricted = RESTRICTED_SPECIES.filter((name) => !speciesIsBanned(name));

const nfeExtras = unrestricted.filter((name) => dex.species.get(toID(name))?.tier === 'NFE');

console.log(`Unrestricted (${unrestricted.length}):\n${unrestricted.join(', ')}\n`);
console.log(`Restricted (${restricted.length}):\n${restricted.join(', ')}\n`);
console.log(`NFE-tier unrestricted (${nfeExtras.length}):\n${nfeExtras.join(', ')}\n`);
console.log(`Total legal: ${unrestricted.length + restricted.length}`);
