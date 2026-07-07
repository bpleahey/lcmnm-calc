'use client';

import type { StatID } from '@/lib/types';
import { MAX_EV_PER_STAT } from '@/lib/constants';
import {
  evStepIndex,
  getMeaningfulEvSteps,
  getMeaningfulHpValues,
  hpFromPercent,
  percentFromHp,
  snapHpPercent,
} from '@/lib/statSteps';
import type { PokemonState } from '@/lib/calc';

const BOOST_OPTIONS = Array.from({ length: 13 }, (_, i) => i - 6);

function boostLabel(value: number): string {
  if (value === 0) return '--';
  return value > 0 ? `+${value}` : String(value);
}

interface StatRowProps {
  stat: StatID;
  label: string;
  state: PokemonState;
  finalStat: number;
  evTotal: number;
  onEvChange: (stat: StatID, value: number) => void;
  onIvChange: (stat: StatID, value: number) => void;
  onBoostChange: (stat: StatID, value: number) => void;
}

export function StatRow({
  stat,
  label,
  state,
  finalStat,
  evTotal,
  onEvChange,
  onIvChange,
  onBoostChange,
}: StatRowProps) {
  const ev = state.evs[stat] ?? 0;
  const iv = state.ivs[stat] ?? 31;
  const boost = state.boosts[stat] ?? 0;
  const steps = getMeaningfulEvSteps(state, stat);
  const stepIdx = evStepIndex(steps, ev);

  const setEvClamped = (nextEv: number) => {
    const clamped = Math.max(0, Math.min(MAX_EV_PER_STAT, nextEv));
    const delta = clamped - ev;
    if (evTotal + delta > 508) return;
    onEvChange(stat, clamped);
  };

  return (
    <div className="stat-row">
      <span className="stat-label">{label}</span>
      <input
        type="range"
        min={0}
        max={Math.max(steps.length - 1, 0)}
        value={stepIdx}
        onChange={(e) => setEvClamped(steps[Number(e.target.value)] ?? 0)}
        className="stat-range accent-gold"
        title="EVs"
      />
      <span className="stat-value">{finalStat}</span>
      <input
        type="number"
        min={0}
        max={MAX_EV_PER_STAT}
        value={ev}
        onChange={(e) => setEvClamped(Number(e.target.value) || 0)}
        className="stat-num-input"
        title="EVs"
      />
      <input
        type="number"
        min={0}
        max={31}
        value={iv}
        onChange={(e) => onIvChange(stat, Math.max(0, Math.min(31, Number(e.target.value) || 0)))}
        className="stat-num-input"
        title="IVs"
      />
      <select
        value={boost}
        onChange={(e) => onBoostChange(stat, Number(e.target.value))}
        className="stat-boost-select"
        title="Boost"
      >
        {BOOST_OPTIONS.map((n) => (
          <option key={n} value={n}>
            {boostLabel(n)}
          </option>
        ))}
      </select>
    </div>
  );
}

interface HpControlProps {
  hpPercent: number;
  maxHp: number;
  onChange: (hpPercent: number) => void;
  compact?: boolean;
}

export function HpControl({ hpPercent, maxHp, onChange, compact = false }: HpControlProps) {
  const hpSteps = getMeaningfulHpValues(maxHp);
  const curHp = hpFromPercent(maxHp, hpPercent);
  const hpStepIdx = Math.max(0, curHp - 1);
  const displayPercent = percentFromHp(maxHp, curHp);

  const setFromHp = (hp: number) => {
    const clamped = Math.max(1, Math.min(maxHp, hp));
    onChange(percentFromHp(maxHp, clamped));
  };

  const setFromPercent = (percent: number) => {
    const snapped = snapHpPercent(maxHp, percent);
    onChange(snapped);
  };

  if (compact) {
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-gold-light">
          <span>HP</span>
          <span>
            {curHp}/{maxHp} ({displayPercent}%)
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={Math.max(hpSteps.length - 1, 0)}
          value={hpStepIdx}
          onChange={(e) => setFromHp(hpSteps[Number(e.target.value)] ?? 1)}
          className="stat-range w-full accent-gold"
        />
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs text-gold-light">
        <span>HP</span>
        <span>
          {curHp} / {maxHp} ({displayPercent}%)
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={Math.max(hpSteps.length - 1, 0)}
        value={hpStepIdx}
        onChange={(e) => setFromHp(hpSteps[Number(e.target.value)] ?? 1)}
        className="stat-range w-full accent-gold"
      />
      <div className="flex items-center gap-1.5 text-xs">
        <label className="text-gold-light">HP</label>
        <input
          type="number"
          min={1}
          max={maxHp}
          value={curHp}
          onChange={(e) => setFromHp(Number(e.target.value) || 1)}
          className="stat-num-input"
        />
        <span className="text-gold-light">%</span>
        <input
          type="number"
          min={1}
          max={100}
          value={displayPercent}
          onChange={(e) => setFromPercent(Number(e.target.value) || 1)}
          className="stat-num-input"
        />
      </div>
    </div>
  );
}

/** Simple slider for toxic counter etc. */
interface SimpleSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function SimpleSlider({ label, value, min, max, onChange }: SimpleSliderProps) {
  return (
    <div className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-1.5 text-xs">
      <span className="stat-label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="stat-range accent-gold"
      />
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="stat-num-input"
      />
    </div>
  );
}
