import { calcStat } from '@smogon/calc';
import type { NatureName, StatID } from '@/lib/types';
import { LC_LEVEL, MAX_EV_PER_STAT } from '@/lib/constants';
import { gen, getEffectiveMixedState } from '@/lib/calc';
import type { PokemonState } from '@/lib/calc';

function toId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '') as Parameters<typeof gen.species.get>[0];
}

function getBaseStat(state: PokemonState, stat: StatID): number {
  const mixed = getEffectiveMixedState(state);
  if (mixed) return mixed.baseStats[stat];
  const species = gen.species.get(toId(state.species));
  return species?.baseStats[stat] ?? 0;
}

export function calcFinalStat(
  state: PokemonState,
  stat: StatID,
  ev: number,
  iv = state.ivs[stat] ?? 31,
): number {
  const base = getBaseStat(state, stat);
  return calcStat(gen, stat, base, iv, ev, LC_LEVEL, state.nature as NatureName);
}

/** EV values where the final stat changes (Showdown-style slider stops). */
export function getMeaningfulEvSteps(state: PokemonState, stat: StatID): number[] {
  const steps: number[] = [];
  let lastStat = -1;

  for (let ev = 0; ev <= MAX_EV_PER_STAT; ev++) {
    const statVal = calcFinalStat(state, stat, ev);
    if (statVal !== lastStat) {
      steps.push(ev);
      lastStat = statVal;
    }
  }

  return steps.length > 0 ? steps : [0];
}

export function snapEvToMeaningfulStep(state: PokemonState, stat: StatID, ev: number): number {
  const steps = getMeaningfulEvSteps(state, stat);
  let closest = steps[0];
  let minDist = Math.abs(ev - closest);
  for (const step of steps) {
    const dist = Math.abs(ev - step);
    if (dist < minDist) {
      minDist = dist;
      closest = step;
    }
  }
  return closest;
}

export function evStepIndex(steps: number[], ev: number): number {
  const exact = steps.indexOf(ev);
  if (exact >= 0) return exact;
  return steps.reduce((bestIdx, step, idx) => {
    const bestStep = steps[bestIdx];
    return Math.abs(step - ev) < Math.abs(bestStep - ev) ? idx : bestIdx;
  }, 0);
}

export function hpFromPercent(maxHp: number, percent: number): number {
  return Math.max(1, Math.min(maxHp, Math.round((maxHp * percent) / 100)));
}

export function percentFromHp(maxHp: number, hp: number): number {
  return Math.max(1, Math.min(100, Math.round((hp / maxHp) * 100)));
}

/** HP values 1..maxHp — each step is a distinct current HP. */
export function getMeaningfulHpValues(maxHp: number): number[] {
  return Array.from({ length: maxHp }, (_, i) => i + 1);
}

/** Percents where rounding produces a new current HP (for manual % entry). */
export function getMeaningfulHpPercents(maxHp: number): number[] {
  const steps: number[] = [];
  let lastHp = -1;
  for (let p = 1; p <= 100; p++) {
    const hp = hpFromPercent(maxHp, p);
    if (hp !== lastHp) {
      steps.push(p);
      lastHp = hp;
    }
  }
  return steps.length > 0 ? steps : [100];
}

export function snapHpPercent(maxHp: number, percent: number): number {
  const steps = getMeaningfulHpPercents(maxHp);
  let closest = steps[0];
  let minDist = Math.abs(percent - closest);
  for (const step of steps) {
    const dist = Math.abs(percent - step);
    if (dist < minDist) {
      minDist = dist;
      closest = step;
    }
  }
  return closest;
}
