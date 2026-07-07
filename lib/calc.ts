import {
  calculate,
  Generations,
  Move,
  Pokemon,
  Field,
} from '@smogon/calc';
import type { Generation } from '@smogon/calc/dist/data/interface';
import type { NatureName, StatID, StatusName, StatsTable } from '@/lib/types';
import { LC_LEVEL } from '@/lib/constants';
import { applyMixAndMega, isAutoTransformItem, isToggleMegaStone } from '@/lib/mixMega';
import { formatDamageRollDisplay, type DamageRollLine } from '@/lib/rolls';
import { getDisplayedStats, mergeSwitchInBoosts } from '@/lib/displayStats';
import type { PokemonSet } from '@/data/suggested-sets';

export const gen: Generation = Generations.get(9);

export interface FieldState {
  weather: string;
  terrain: string;
  isMagicRoom: boolean;
  isWonderRoom: boolean;
  isGravity: boolean;
  leftSide: SideState;
  rightSide: SideState;
}

export interface SideState {
  spikes: number;
  isSR: boolean;
  isReflect: boolean;
  isLightScreen: boolean;
  isProtected: boolean;
  isSeeded: boolean;
  isSaltCured: boolean;
  isForesight: boolean;
  isPowerTrick: boolean;
  isAuroraVeil: boolean;
}

export interface PokemonState {
  species: string;
  item: string;
  ability: string;
  megaEvolved: boolean;
  nature: NatureName;
  suggestedNatures?: NatureName[];
  evs: Partial<StatsTable>;
  ivs: Partial<StatsTable>;
  moves: [string, string, string, string];
  moveSlotOptions?: [string[], string[], string[], string[]];
  status: StatusName | '';
  boosts: Partial<StatsTable>;
  gender: 'M' | 'F' | 'N';
  hpPercent: number;
  toxicCounter: number;
}

export function defaultPokemonState(species = 'Chinchou'): PokemonState {
  return {
    species,
    item: '',
    ability: '',
    megaEvolved: false,
    nature: 'Serious',
    evs: {},
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
    moves: ['', '', '', ''],
    status: '',
    boosts: {},
    gender: 'M',
    hpPercent: 100,
    toxicCounter: 1,
  };
}

export function defaultFieldState(): FieldState {
  return {
    weather: '',
    terrain: '',
    isMagicRoom: false,
    isWonderRoom: false,
    isGravity: false,
    leftSide: defaultSideState(),
    rightSide: defaultSideState(),
  };
}

export function defaultSideState(): SideState {
  return {
    spikes: 0,
    isSR: false,
    isReflect: false,
    isLightScreen: false,
    isProtected: false,
    isSeeded: false,
    isSaltCured: false,
    isForesight: false,
    isPowerTrick: false,
    isAuroraVeil: false,
  };
}

export function getEffectiveMixedState(state: PokemonState) {
  if (!state.item) return null;
  if (isAutoTransformItem(state.item)) {
    return applyMixAndMega(gen, state.species, state.item as never);
  }
  if (state.megaEvolved && isToggleMegaStone(gen, state.item)) {
    return applyMixAndMega(gen, state.species, state.item as never);
  }
  return null;
}

export function pokemonStateFromSet(set: PokemonSet): PokemonState {
  const isToggleStone = Boolean(set.item && isToggleMegaStone(gen, set.item));
  const isAuto = Boolean(set.item && isAutoTransformItem(set.item));
  const mixed = set.item ? applyMixAndMega(gen, set.species, set.item as never) : null;
  const ability = isToggleStone ? '' : isAuto && mixed ? mixed.ability : set.ability;
  return {
    species: set.species,
    item: set.item,
    ability,
    megaEvolved: false,
    nature: set.nature,
    suggestedNatures: set.suggestedNatures,
    evs: set.evs,
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...set.ivs },
    moves: set.moves,
    moveSlotOptions: set.moveSlotOptions,
    status: set.status,
    boosts: mergeSwitchInBoosts(set.boosts, ability),
    gender: set.gender,
    hpPercent: set.hpPercent,
    toxicCounter: set.toxicCounter ?? 1,
  };
}

function toId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '') as Parameters<Generation['species']['get']>[0];
}

function isResolvableSpecies(name: string): boolean {
  if (!name.trim()) return false;
  return Boolean(gen.species.get(toId(name)));
}

const EMPTY_STATS: StatsTable = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

export function buildPokemon(state: PokemonState): Pokemon {
  if (!isResolvableSpecies(state.species)) {
    throw new Error(`Unknown species: ${state.species}`);
  }

  const species = gen.species.get(toId(state.species));
  const defaultAbility = species?.abilities?.[0] ?? '';
  const mixed = getEffectiveMixedState(state);

  const overrides = mixed
    ? {
        baseStats: mixed.baseStats,
        types: mixed.types,
        abilities: { 0: mixed.ability as '' },
      }
    : undefined;

  const ability = state.ability || (mixed?.ability ?? defaultAbility);

  const basePokemon = new Pokemon(gen, state.species, {
    level: LC_LEVEL,
    item: state.item || undefined,
    ability: ability || undefined,
    nature: state.nature,
    evs: state.evs,
    ivs: state.ivs,
    boosts: state.boosts,
    gender: state.gender,
    status: state.status || undefined,
    toxicCounter: state.toxicCounter,
    overrides,
  });

  const maxHp = basePokemon.maxHP();
  const curHp = Math.max(1, Math.round((maxHp * state.hpPercent) / 100));

  return new Pokemon(gen, state.species, {
    level: LC_LEVEL,
    item: state.item || undefined,
    ability: ability || undefined,
    nature: state.nature,
    evs: state.evs,
    ivs: state.ivs,
    boosts: state.boosts,
    gender: state.gender,
    status: state.status || undefined,
    toxicCounter: state.toxicCounter,
    originalCurHP: curHp,
    overrides,
  });
}

export function buildField(state: FieldState, attackerOnLeft = true): Field {
  return new Field({
    gameType: 'Singles',
    weather: (state.weather || undefined) as never,
    terrain: (state.terrain || undefined) as never,
    isMagicRoom: state.isMagicRoom,
    isWonderRoom: state.isWonderRoom,
    isGravity: state.isGravity,
    attackerSide: attackerOnLeft ? state.leftSide : state.rightSide,
    defenderSide: attackerOnLeft ? state.rightSide : state.leftSide,
  });
}

export function calcMoveDamage(
  attackerState: PokemonState,
  defenderState: PokemonState,
  fieldState: FieldState,
  moveName: string,
  attackerOnLeft = true,
): DamageRollLine[] {
  if (!moveName.trim()) return [{ rolls: '—' }];
  try {
    const attacker = buildPokemon(attackerState);
    const defender = buildPokemon(defenderState);
    const field = buildField(fieldState, attackerOnLeft);
    const move = new Move(gen, moveName);
    const result = calculate(gen, attacker, defender, move, field);
    return formatDamageRollDisplay(result.damage);
  } catch {
    return [{ rolls: '—' }];
  }
}

export function getCalculatedStats(state: PokemonState): StatsTable {
  if (!isResolvableSpecies(state.species)) return EMPTY_STATS;
  try {
    const pokemon = buildPokemon(state);
    return getDisplayedStats(gen, pokemon, state);
  } catch {
    return EMPTY_STATS;
  }
}

export function getBaseStatTotal(state: PokemonState): number {
  const mixed = getEffectiveMixedState(state);
  if (mixed) return mixed.bst;
  const species = gen.species.get(toId(state.species));
  if (!species) return 0;
  const stats = species.baseStats;
  return stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;
}

export function getSpeciesTypes(state: PokemonState): string[] {
  const mixed = getEffectiveMixedState(state);
  if (mixed) return [...mixed.types];
  const species = gen.species.get(toId(state.species));
  return species ? [...species.types] : [];
}

export function getAllMoves(): string[] {
  const moves: string[] = [];
  for (const move of gen.moves) {
    moves.push(move.name);
  }
  return moves;
}

export function getAbilitiesForSpecies(speciesName: string): string[] {
  const species = gen.species.get(toId(speciesName));
  if (!species?.abilities) return [];
  return Object.values(species.abilities).filter(Boolean) as string[];
}

export const STAT_LABELS: Record<StatID, string> = {
  hp: 'HP',
  atk: 'Atk',
  def: 'Def',
  spa: 'SpA',
  spd: 'SpD',
  spe: 'Spe',
};
