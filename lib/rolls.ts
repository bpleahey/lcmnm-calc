import type { Damage } from '@/lib/types';

export interface DamageRollLine {
  label?: string;
  rolls: string;
}

function formatRollList(rolls: number[]): string {
  return rolls.join(',');
}

export function formatDamageRollDisplay(damage: Damage): DamageRollLine[] {
  if (typeof damage === 'number') {
    return [{ rolls: String(damage) }];
  }
  if (Array.isArray(damage) && typeof damage[0] === 'number') {
    return [{ rolls: formatRollList(damage as number[]) }];
  }
  if (Array.isArray(damage) && Array.isArray(damage[0])) {
    return (damage as number[][]).map((hit, index) => ({
      label: `Hit ${index + 1}`,
      rolls: formatRollList(hit as number[]),
    }));
  }
  return [{ rolls: String(damage) }];
}

export function formatDamageRollLines(damage: Damage): string[] {
  return formatDamageRollDisplay(damage).map((line) =>
    line.label ? `${line.label}: ${line.rolls}` : line.rolls,
  );
}

export function formatDamageRolls(damage: Damage): string {
  return formatDamageRollLines(damage).join('\n');
}
