import { Generations } from '@smogon/calc';
import type { Generation, ItemName } from '@smogon/calc/dist/data/interface';
import { BANNED_ITEMS, FORMAT_LEGAL_EXTRAS } from '@/data/banned-items';
import { isMegaStoneItem } from '@/lib/mixMega';
import { OPTION_DIVIDER } from '@/lib/learnset';

export interface MegaStoneInfo {
  name: string;
  targetSpecies: string;
  ability: string;
  types: string[];
  baseStatDeltas: Record<string, number>;
  bannedInLCMNM: boolean;
}

const bannedSet = new Set<string>(BANNED_ITEMS);

const PRIORITY_ITEMS = ['Eviolite', 'Life Orb', 'Choice Scarf'] as const;

function toID(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function buildMegaStoneDictionary(gen: Generation = Generations.get(9)): MegaStoneInfo[] {
  const stones: MegaStoneInfo[] = [];

  for (const item of gen.items) {
    if (!item.megaStone && !FORMAT_LEGAL_EXTRAS.includes(item.name as typeof FORMAT_LEGAL_EXTRAS[number])) {
      continue;
    }
    if (!isMegaStoneItem(gen, item.name)) continue;

    const targetSpecies = item.megaStone
      ? (Object.values(item.megaStone)[0] as string)
      : item.name === 'Red Orb'
        ? 'Groudon-Primal'
        : item.name === 'Blue Orb'
          ? 'Kyogre-Primal'
          : item.name === 'Rusted Sword'
            ? 'Zacian-Crowned'
            : item.name === 'Rusted Shield'
              ? 'Zamazenta-Crowned'
              : '';

    const megaSpecies = gen.species.get(toID(targetSpecies) as never);
    const baseSpeciesName = megaSpecies?.baseSpecies ?? targetSpecies.split('-')[0];
    const baseSpecies = gen.species.get(toID(baseSpeciesName) as never);

    const baseStatDeltas: Record<string, number> = {};
    if (megaSpecies && baseSpecies) {
      for (const stat of ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as const) {
        baseStatDeltas[stat] = megaSpecies.baseStats[stat] - baseSpecies.baseStats[stat];
      }
    }

    stones.push({
      name: item.name,
      targetSpecies,
      ability: megaSpecies?.abilities?.[0] ?? '',
      types: megaSpecies ? [...megaSpecies.types] : [],
      baseStatDeltas,
      bannedInLCMNM: bannedSet.has(item.name),
    });
  }

  return stones.sort((a, b) => a.name.localeCompare(b.name));
}

export function getAvailableItems(
  gen: Generation,
  speciesName: string,
  isRestricted: boolean,
): string[] {
  const items: string[] = [];

  for (const item of gen.items) {
    if (bannedSet.has(item.name)) continue;
    items.push(item.name);
  }

  for (const extra of FORMAT_LEGAL_EXTRAS) {
    if (!bannedSet.has(extra) && !items.includes(extra)) {
      items.push(extra);
    }
  }

  if (isRestricted) {
    return items.filter((name) => !isMegaStoneItem(gen, name));
  }

  return items.sort((a, b) => a.localeCompare(b));
}

export function getSuggestedItems(gen: Generation, isRestricted: boolean): string[] {
  const suggested: string[] = [];
  const extrasSet = new Set<string>(FORMAT_LEGAL_EXTRAS);

  if (!isRestricted) {
    for (const stone of buildMegaStoneDictionary(gen)) {
      if (stone.bannedInLCMNM || extrasSet.has(stone.name)) continue;
      suggested.push(stone.name);
    }

    for (const extra of FORMAT_LEGAL_EXTRAS) {
      if (!bannedSet.has(extra)) suggested.push(extra);
    }
  }

  for (const item of PRIORITY_ITEMS) {
    if (!bannedSet.has(item)) suggested.push(item);
  }

  return suggested;
}

export function buildItemOptions(
  gen: Generation,
  speciesName: string,
  isRestricted: boolean,
): string[] {
  const all = getAvailableItems(gen, speciesName, isRestricted);
  const suggested = getSuggestedItems(gen, isRestricted).filter((item) => all.includes(item));
  const pickSet = new Set(suggested);
  const rest = all.filter((item) => !pickSet.has(item));

  if (!suggested.length) return all;
  if (!rest.length) return suggested;
  return [...suggested, OPTION_DIVIDER, ...rest];
}

export function isItemBanned(itemName: string): boolean {
  return bannedSet.has(itemName);
}
