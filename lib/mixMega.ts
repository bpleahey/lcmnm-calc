import type { Generation, ItemName, Specie, SpeciesName, StatID, StatsTable, TypeName } from '@smogon/calc/dist/data/interface';

type SparseStats = Partial<StatsTable>;

interface FormeDeltas {
  ability: string;
  baseStats: SparseStats;
  type?: TypeName;
  formeType?: string;
  isMega?: boolean;
}

export interface MixedSpeciesResult {
  baseStats: StatsTable;
  types: [TypeName] | [TypeName, TypeName];
  abilities: { 0: string };
  ability: string;
  bst: number;
}

function toId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function clampStat(value: number): number {
  return Math.min(255, Math.max(1, value));
}

function getForcedForme(gen: Generation, itemName?: string): SpeciesName | null {
  if (!itemName) return null;
  const item = gen.items.get(toId(itemName) as never);
  if (!item) return null;

  if (itemName === 'Red Orb') return 'Groudon-Primal' as SpeciesName;
  if (itemName === 'Blue Orb') return 'Kyogre-Primal' as SpeciesName;
  if (itemName === 'Rusted Sword') return 'Zacian-Crowned' as SpeciesName;
  if (itemName === 'Rusted Shield') return 'Zamazenta-Crowned' as SpeciesName;

  if (item.megaStone) {
    return Object.values(item.megaStone)[0] as SpeciesName;
  }

  return null;
}

function getFormeChangeDeltas(
  gen: Generation,
  formeChangeSpecies: Specie,
): FormeDeltas {
  let baseSpeciesName = formeChangeSpecies.name;
  if (formeChangeSpecies.name.includes('-Mega')) {
    const battleOnly = formeChangeSpecies.baseSpecies;
    if (battleOnly) baseSpeciesName = battleOnly;
  }

  const baseSpecies = gen.species.get(toId(baseSpeciesName) as never)!;
  const deltas: FormeDeltas = {
    ability: formeChangeSpecies.abilities?.[0] ?? '',
    baseStats: {},
  };

  for (const stat of ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as StatID[]) {
    deltas.baseStats[stat] =
      formeChangeSpecies.baseStats[stat] - baseSpecies.baseStats[stat];
  }

  let formeType: string | undefined;
  if (['Arceus', 'Silvally'].includes(baseSpecies.name)) {
    deltas.type = formeChangeSpecies.types[0];
    formeType = 'Primary';
  } else if (formeChangeSpecies.types.length > baseSpecies.types.length) {
    deltas.type = formeChangeSpecies.types[1];
  } else if (formeChangeSpecies.types.length < baseSpecies.types.length) {
    deltas.type = baseSpecies.types[0];
  } else if (formeChangeSpecies.types[1] !== baseSpecies.types[1]) {
    deltas.type = formeChangeSpecies.types[1];
  } else if (formeChangeSpecies.types[0] !== baseSpecies.types[0]) {
    deltas.type = formeChangeSpecies.types[0];
    formeType = 'Primary';
    deltas.isMega = true;
  }

  if (formeChangeSpecies.name.includes('-Mega') && !formeType) {
    formeType = 'Mega';
  }
  if (formeChangeSpecies.name.includes('-Primal')) {
    formeType = 'Primal';
  }
  if (formeChangeSpecies.name.endsWith('-Crowned')) {
    formeType = 'Crowned';
  }
  if (formeType) deltas.formeType = formeType;

  return deltas;
}

function mutateOriginalSpecies(
  originalSpecies: Specie,
  deltas: FormeDeltas,
): { baseStats: StatsTable; types: [TypeName] | [TypeName, TypeName] } {
  const baseStats = { ...originalSpecies.baseStats } as StatsTable;
  for (const stat of ['hp', 'atk', 'def', 'spa', 'spd', 'spe'] as StatID[]) {
    baseStats[stat] = clampStat(baseStats[stat] + (deltas.baseStats[stat] ?? 0));
  }

  let types: [TypeName] | [TypeName, TypeName] = [...originalSpecies.types] as
    | [TypeName]
    | [TypeName, TypeName];

  if (deltas.formeType === 'Primary' && deltas.type) {
    const secondType = types[1];
    types = secondType && secondType !== deltas.type
      ? [deltas.type, secondType]
      : [deltas.type];
  } else if (types[0] === deltas.type) {
    types = [deltas.type!];
  } else if (deltas.type === types[0]) {
    types = [types[0]];
  } else if (deltas.type) {
    types = [types[0], deltas.type];
  }

  return { baseStats, types };
}

export function applyMixAndMega(
  gen: Generation,
  speciesName: string,
  itemName?: ItemName | string,
): MixedSpeciesResult | null {
  const originalSpecies = gen.species.get(toId(speciesName) as never);
  if (!originalSpecies) return null;

  const forcedForme = getForcedForme(gen, itemName);
  if (!forcedForme) return null;

  const formeChangeSpecies = gen.species.get(toId(forcedForme) as never);
  if (!formeChangeSpecies) return null;

  if (
    formeChangeSpecies.baseSpecies === originalSpecies.baseSpecies &&
    !formeChangeSpecies.name.includes('-Mega') &&
    !formeChangeSpecies.name.includes('-Primal')
  ) {
    return {
      baseStats: { ...formeChangeSpecies.baseStats } as StatsTable,
      types: [...formeChangeSpecies.types] as [TypeName] | [TypeName, TypeName],
      abilities: { 0: formeChangeSpecies.abilities?.[0] ?? '' },
      ability: formeChangeSpecies.abilities?.[0] ?? '',
      bst: sumStats(formeChangeSpecies.baseStats),
    };
  }

  const deltas = getFormeChangeDeltas(gen, formeChangeSpecies);
  const mixed = mutateOriginalSpecies(originalSpecies, deltas);

  return {
    baseStats: mixed.baseStats,
    types: mixed.types,
    abilities: { 0: deltas.ability },
    ability: deltas.ability,
    bst: sumStats(mixed.baseStats),
  };
}

export function getBaseStatTotal(gen: Generation, speciesName: string, itemName?: string): number {
  const mixed = applyMixAndMega(gen, speciesName, itemName);
  if (mixed) return mixed.bst;
  const species = gen.species.get(toId(speciesName) as never);
  return species ? sumStats(species.baseStats) : 0;
}

function sumStats(stats: StatsTable | Readonly<StatsTable>): number {
  return stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;
}

export function isMegaStoneItem(gen: Generation, itemName: string): boolean {
  const item = gen.items.get(toId(itemName) as never);
  if (!item) return false;
  return Boolean(
    item.megaStone ||
      itemName === 'Red Orb' ||
      itemName === 'Blue Orb' ||
      itemName === 'Rusted Sword' ||
      itemName === 'Rusted Shield',
  );
}
