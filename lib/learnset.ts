import { Dex } from '@pkmn/dex';
import type { NatureName } from '@/lib/types';
import { NATURES } from '@/lib/constants';

const dex = Dex.forGen(9);
const moveCache = new Map<string, string[]>();

export const OPTION_DIVIDER = '──────────';

export function isOptionDivider(value: string): boolean {
  return value === OPTION_DIVIDER;
}

function toId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export async function getLegalMovesForSpecies(species: string): Promise<string[]> {
  const cached = moveCache.get(species);
  if (cached) return cached;

  const learnset = await dex.learnsets.get(toId(species));
  const moves = Object.keys(learnset.learnset ?? {})
    .flatMap((moveId) => {
      const name = dex.moves.get(moveId)?.name;
      return name ? [String(name)] : [];
    })
    .sort((a, b) => a.localeCompare(b));

  moveCache.set(species, moves);
  return moves;
}

export function buildMoveSlotOptions(suggested: string[], legalMoves: string[]): string[] {
  const picks = suggested.filter(Boolean);
  const pickSet = new Set(picks);
  const rest = legalMoves.filter((move) => !pickSet.has(move));

  if (!picks.length) return legalMoves;
  if (!rest.length) return picks;
  return [...picks, OPTION_DIVIDER, ...rest];
}

export function buildNatureSelectOptions(suggested: NatureName[]): {
  name: NatureName | '';
  label: string;
  disabled?: boolean;
}[] {
  const picks = suggested.length ? suggested : [];
  const pickSet = new Set<NatureName>(picks);
  const rest = NATURES.filter((n) => !pickSet.has(n.name));

  if (!picks.length) return NATURES;
  return [
    ...picks.map((name) => {
      const entry = NATURES.find((n) => n.name === name);
      return entry ?? { name, label: name };
    }),
    { name: '', label: OPTION_DIVIDER, disabled: true },
    ...rest,
  ];
}
