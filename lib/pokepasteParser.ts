import type { NatureName, StatID, StatsTable } from '@/lib/types';
import type { PokemonSet } from '@/data/suggested-sets';
import { applyMixAndMega, isMegaStoneItem } from '@/lib/mixMega';
import { gen, getAbilitiesForSpecies } from '@/lib/calc';

const STAT_ALIASES: Record<string, StatID> = {
  hp: 'hp',
  atk: 'atk',
  attack: 'atk',
  def: 'def',
  defense: 'def',
  spa: 'spa',
  'sp. atk': 'spa',
  'sp atk': 'spa',
  spd: 'spd',
  'sp. def': 'spd',
  'sp def': 'spd',
  spe: 'spe',
  speed: 'spe',
};

const STAT_LABEL: Record<string, string> = {
  hp: 'HP', atk: 'Atk', def: 'Def', spa: 'SpA', spd: 'SpD', spe: 'Spe',
};

const NATURE_NAMES = new Set<string>([
  'Adamant', 'Bashful', 'Bold', 'Brave', 'Calm', 'Careful', 'Docile', 'Gentle',
  'Hardy', 'Hasty', 'Impish', 'Jolly', 'Lax', 'Lonely', 'Mild', 'Modest',
  'Naive', 'Naughty', 'Quiet', 'Quirky', 'Rash', 'Relaxed', 'Sassy', 'Serious', 'Timid',
]);

const ITEM_FIXES: Record<string, string> = {
  Loppunite: 'Lopunnite',
};

function titleCase(word: string): string {
  return word
    .split(/([- ])/g)
    .map((part) => {
      if (part === '-' || part === ' ') return part;
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join('');
}

function normalizeMove(move: string): string {
  const trimmed = move.trim();
  const hpMatch = trimmed.match(/^Hidden Power \[([A-Za-z ]+)\]$/i);
  if (hpMatch) return `Hidden Power ${titleCase(hpMatch[1])}`;
  return titleCase(trimmed);
}

function normalizeItem(item: string): string {
  const titled = titleCase(item.trim());
  return ITEM_FIXES[titled] ?? titled;
}

function parseStatSpread(line: string): Partial<StatsTable> {
  const stats: Partial<StatsTable> = {};
  const body = line.replace(/^(EVs|IVs):\s*/i, '');
  for (const part of body.split('/')) {
    const match = part.trim().match(/^(\d+)\s+(.+)$/);
    if (!match) continue;
    const value = Number(match[1]);
    const key = STAT_ALIASES[match[2].trim().toLowerCase()];
    if (key) stats[key] = value;
  }
  return stats;
}

function parseSlashOptions<T extends string>(value: string, normalize: (part: string) => T | null): T[] {
  return value
    .split('/')
    .map((part) => normalize(part.trim()))
    .filter((part): part is T => part !== null);
}

/** Parse Showdown export first line → set name, species, item, gender. */
export function parseSpeciesLine(line: string): {
  name: string;
  species: string;
  item: string;
  gender?: 'M' | 'F' | 'N';
} {
  let rest = line.trim();
  let gender: 'M' | 'F' | 'N' | undefined;

  let item = '';
  const atIdx = rest.lastIndexOf('@');
  if (atIdx >= 0) {
    item = normalizeItem(rest.slice(atIdx + 1).split('/')[0]);
    rest = rest.slice(0, atIdx).trim();
  }

  let name = '';
  let species = rest;
  const parenMatch = rest.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (parenMatch) {
    const inner = parenMatch[2].trim();
    if (inner === 'M' || inner === 'F' || inner === 'N') {
      species = titleCase(parenMatch[1].trim());
      gender = inner;
    } else {
      name = titleCase(parenMatch[1].trim());
      species = titleCase(inner);
    }
  } else {
    species = titleCase(species);
  }

  if (!name) name = item || species;

  return { name, species, item, gender };
}

function resolveAbility(species: string, item: string, pastedAbility?: string): string {
  if (item && isMegaStoneItem(gen, item)) {
    const mixed = applyMixAndMega(gen, species, item);
    if (mixed?.ability) return mixed.ability;
  }
  if (pastedAbility) return pastedAbility;
  const abilities = getAbilitiesForSpecies(species);
  return abilities[0] ?? '';
}

/** Parse a single Showdown / Pokepaste Pokémon block into a PokemonSet. */
export function parseShowdownSet(block: string): PokemonSet {
  const lines = block
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error('Empty set block');
  }

  const { name, species, item, gender } = parseSpeciesLine(lines[0]);
  let nature: NatureName = 'Serious';
  let suggestedNatures: NatureName[] = [];
  let pastedAbility = '';
  const evs: Partial<StatsTable> = {};
  const ivs: Partial<StatsTable> = {};
  const moves: string[] = [];
  const moveSlotOptions: string[][] = [];

  for (const line of lines.slice(1)) {
    if (/^[-*]/.test(line)) {
      const movePart = line.replace(/^[-*]\s*/, '');
      const options = parseSlashOptions(movePart, (part) => {
        const move = normalizeMove(part);
        return move || null;
      });
      moveSlotOptions.push(options);
      moves.push(options[0] ?? '');
      continue;
    }
    if (/^evs:/i.test(line)) {
      Object.assign(evs, parseStatSpread(line));
      continue;
    }
    if (/^ivs:/i.test(line)) {
      Object.assign(ivs, parseStatSpread(line));
      continue;
    }
    if (/^ability:/i.test(line)) {
      pastedAbility = line.replace(/^ability:\s*/i, '').trim();
      continue;
    }
    if (/^level:/i.test(line)) continue;
    if (/^shiny:/i.test(line)) continue;
    if (/^happiness:/i.test(line)) continue;
    if (/^tera type:/i.test(line)) continue;
    if (/ nature$/i.test(line)) {
      const nat = line.replace(/\s+nature$/i, '').trim();
      suggestedNatures = parseSlashOptions(nat, (part) => {
        const titled = titleCase(part);
        return NATURE_NAMES.has(titled) ? (titled as NatureName) : null;
      });
      if (suggestedNatures.length) nature = suggestedNatures[0];
    }
  }

  while (moves.length < 4) {
    moves.push('');
    moveSlotOptions.push([]);
  }

  const ability = resolveAbility(species, item, pastedAbility);

  return {
    name,
    species,
    item,
    ability,
    nature,
    suggestedNatures: suggestedNatures.length > 1 ? suggestedNatures : undefined,
    evs,
    ivs: Object.keys(ivs).length > 0 ? ivs : { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
    moves: moves.slice(0, 4) as [string, string, string, string],
    moveSlotOptions: moveSlotOptions.slice(0, 4) as [string[], string[], string[], string[]],
    status: '',
    boosts: {},
    gender: gender ?? 'M',
    hpPercent: 100,
  };
}

/** Parse a full paste (one or more Pokémon, blank-line separated). */
export function parseShowdownPaste(text: string): PokemonSet[] {
  return text
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map(parseShowdownSet);
}

/** Fetch raw text from a pokepast.es URL. */
export async function fetchPokepaste(url: string): Promise<string> {
  const idMatch = url.match(/pokepast\.es\/([a-f0-9]{8,})/i);
  if (idMatch) {
    const rawUrl = `https://pokepast.es/${idMatch[1]}/raw`;
    const res = await fetch(rawUrl);
    if (res.ok) return res.text();
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

export function formatSetSummary(set: PokemonSet): string {
  const evStr = Object.entries(set.evs)
    .filter(([, v]) => v)
    .map(([k, v]) => `${v} ${STAT_LABEL[k] ?? k}`)
    .join(' / ') || '(none)';
  const ivStr = Object.entries(set.ivs)
    .filter(([, v]) => v !== 31)
    .map(([k, v]) => `${v} ${STAT_LABEL[k] ?? k}`)
    .join(' / ') || '(default 31)';
  const moveSlots = set.moveSlotOptions
    ?.map((slot, i) => {
      const picks = slot.length ? slot.join(' / ') : set.moves[i];
      return picks || '(empty)';
    })
    .join(' | ') ?? set.moves.filter(Boolean).join(', ');
  return [
    `name: ${set.name}`,
    `pokemon: ${set.species}`,
    `item: ${set.item || '(none)'}`,
    `ability: ${set.ability}`,
    `nature: ${set.nature}${set.suggestedNatures ? ` (${set.suggestedNatures.join(' / ')})` : ''}`,
    `evs: ${evStr}`,
    `ivs: ${ivStr}`,
    `moves: ${moveSlots}`,
  ].join('\n');
}

function formatStringArray(values: string[], indent: string): string {
  if (!values.length) return '[]';
  return `[\n${values.map((v) => `${indent}  '${v.replace(/'/g, "\\'")}'`).join(',\n')}\n${indent}]`;
}

export function formatSetAsTypeScript(set: PokemonSet, indent = '        '): string {
  const evEntries = Object.entries(set.evs).filter(([, v]) => v !== undefined && v > 0);
  const ivEntries = Object.entries(set.ivs).filter(([k, v]) => {
    const defaults = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
    return v !== defaults[k as StatID];
  });

  const evsStr = evEntries.length
    ? `{ ${evEntries.map(([k, v]) => `${k}: ${v}`).join(', ')} }`
    : '{}';
  const ivsStr = ivEntries.length
    ? `{ ${ivEntries.map(([k, v]) => `${k}: ${v}`).join(', ')} }`
    : '{}';
  const movesStr = `[${set.moves.map((m) => `'${m.replace(/'/g, "\\'")}'`).join(', ')}]`;
  const suggestedNaturesStr = set.suggestedNatures?.length
    ? `\n${indent}  suggestedNatures: [${set.suggestedNatures.map((n) => `'${n}'`).join(', ')}],`
    : '';

  const moveSlotOptionsBlock = set.moveSlotOptions?.some((slot) => slot.length > 1)
    ? `\n${indent}  moveSlotOptions: [\n${set.moveSlotOptions
        .map((slot) => `${indent}    ${formatStringArray(slot, `${indent}    `)}`)
        .join(',\n')}\n${indent}  ] as [string[], string[], string[], string[]],`
    : '';

  return `${indent}{
${indent}  name: '${set.name.replace(/'/g, "\\'")}',
${indent}  species: '${set.species}',
${indent}  item: '${set.item}',
${indent}  ability: '${set.ability}',
${indent}  nature: '${set.nature}',${suggestedNaturesStr}
${indent}  evs: ${evsStr},
${indent}  ivs: ${ivsStr},
${indent}  moves: ${movesStr} as [string, string, string, string],${moveSlotOptionsBlock}
${indent}  status: '',
${indent}  boosts: {},
${indent}  gender: '${set.gender}',
${indent}  hpPercent: 100,
${indent}},`;
}

export function formatForSuggestedSets(sets: PokemonSet[]): string {
  const byPokemon = new Map<string, PokemonSet[]>();
  for (const set of sets) {
    const list = byPokemon.get(set.species) ?? [];
    list.push(set);
    byPokemon.set(set.species, list);
  }

  const blocks: string[] = [];
  for (const [pokemon, variants] of byPokemon) {
    blocks.push(`  {
    pokemon: '${pokemon}',
    variants: [
${variants.map((v) => formatSetAsTypeScript(v, '      ')).join('\n')}
    ],
  },`);
  }
  return blocks.join('\n');
}
