'use client';

import { Autocomplete } from '@/components/Autocomplete';
import type { DamageRollLine } from '@/lib/rolls';

interface MoveDamageRowProps {
  move: string;
  damage: DamageRollLine[];
  moveOptions: string[];
  onChange: (move: string) => void;
}

export function MoveDamageRow({ move, damage, moveOptions, onChange }: MoveDamageRowProps) {
  const title = damage
    .map((line) => (line.label ? `${line.label}: ${line.rolls}` : line.rolls))
    .join('\n');

  return (
    <div className="move-damage-row rounded-md border border-[rgba(201,162,39,0.2)] bg-[rgba(22,22,31,0.5)] px-2 py-1">
      <Autocomplete
        value={move}
        options={moveOptions}
        onChange={onChange}
        placeholder="Move"
        className="min-w-0"
        inputClassName="input-field-compact move-input-truncate"
        listClassName="max-h-56"
        title={move}
      />
      <div className="move-damage-value" title={title}>
        {damage.map((line, index) => (
          <div key={index} className="move-damage-line">
            {line.label ? <span className="move-damage-label">{line.label}</span> : null}
            <span className="move-damage-rolls">{line.rolls}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
