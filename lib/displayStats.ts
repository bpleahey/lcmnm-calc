import { Field, type Pokemon } from '@smogon/calc';
import type { Generation } from '@smogon/calc/dist/data/interface';
import type { StatID, StatsTable } from '@/lib/types';
import type { PokemonState } from '@/lib/calc';
import {
  getFinalSpeed,
  getModifiedStat,
  pokeRound,
} from '@smogon/calc/dist/mechanics/util';

const BATTLE_STATS: StatID[] = ['atk', 'def', 'spa', 'spd', 'spe'];

function toId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function applyItemStatModifier(stat: number, multiplier: number): number {
  return pokeRound((stat * multiplier) / 4096);
}

function applyDefensiveItemModifiers(
  gen: Generation,
  pokemon: Pokemon,
  speciesName: string,
  stats: StatsTable,
): void {
  const species = gen.species.get(toId(speciesName) as never);

  if (
    pokemon.hasItem('Eviolite') &&
    (speciesName === 'Dipplin' || species?.nfe)
  ) {
    stats.def = applyItemStatModifier(stats.def, 6144);
    stats.spd = applyItemStatModifier(stats.spd, 6144);
  }

  if (pokemon.hasItem('Assault Vest')) {
    stats.spd = applyItemStatModifier(stats.spd, 6144);
  }
}

/** Stats shown in the UI — includes boost stages and always-on item modifiers. */
export function getDisplayedStats(
  gen: Generation,
  pokemon: Pokemon,
  state: PokemonState,
): StatsTable {
  const field = new Field({ gameType: 'Singles' });

  const stats: StatsTable = {
    hp: pokemon.rawStats.hp,
    atk: getModifiedStat(pokemon.rawStats.atk, state.boosts.atk ?? 0, gen),
    def: getModifiedStat(pokemon.rawStats.def, state.boosts.def ?? 0, gen),
    spa: getModifiedStat(pokemon.rawStats.spa, state.boosts.spa ?? 0, gen),
    spd: getModifiedStat(pokemon.rawStats.spd, state.boosts.spd ?? 0, gen),
    spe: getFinalSpeed(gen, pokemon, field, field.attackerSide),
  };

  applyDefensiveItemModifiers(gen, pokemon, state.species, stats);
  return stats;
}

export function getSwitchInBoosts(ability: string): Partial<StatsTable> {
  if (ability === 'Intrepid Sword') return { atk: 1 };
  if (ability === 'Dauntless Shield') return { def: 1 };
  return {};
}

export function mergeSwitchInBoosts(
  boosts: Partial<StatsTable>,
  ability: string,
): Partial<StatsTable> {
  const switchIn = getSwitchInBoosts(ability);
  const merged = { ...boosts };
  for (const stat of BATTLE_STATS) {
    if (switchIn[stat] !== undefined && merged[stat] === undefined) {
      merged[stat] = switchIn[stat];
    }
  }
  return merged;
}
