'use client';

import type { FieldState, SideState } from '@/lib/calc';
import { TERRAIN_OPTIONS, WEATHER_OPTIONS } from '@/lib/constants';

interface FieldPanelProps {
  field: FieldState;
  onChange: (field: FieldState) => void;
}

function ToggleButton({
  active,
  onClick,
  children,
  className = '',
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`toggle-btn ${active ? 'toggle-btn-active' : ''} ${className}`}
    >
      {children}
    </button>
  );
}

function SpikesControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="spikes-control">
      <span className="spikes-control-label">Spikes</span>
      <div className="spikes-stepper" role="group" aria-label="Spikes layers">
        {[0, 1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={value === n}
            onClick={() => onChange(n)}
            className={`spikes-step ${value === n ? 'spikes-step-active' : ''}`}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function SidePanel({
  label,
  side,
  onChange,
}: {
  label: string;
  side: SideState;
  onChange: (side: SideState) => void;
}) {
  const toggle = (key: keyof SideState) => {
    onChange({ ...side, [key]: !side[key] });
  };

  return (
    <div className="field-side-box">
      <h4 className="field-side-title">{label}</h4>

      <div className="field-subsection">
        <p className="field-subsection-label">Hazards</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <ToggleButton active={side.isSR} onClick={() => toggle('isSR')}>
            Stealth Rock
          </ToggleButton>
          <SpikesControl value={side.spikes} onChange={(spikes) => onChange({ ...side, spikes })} />
        </div>
      </div>

      <div className="field-subsection">
        <p className="field-subsection-label">Screens</p>
        <div className="flex flex-wrap gap-1">
          <ToggleButton active={side.isReflect} onClick={() => toggle('isReflect')}>
            Reflect
          </ToggleButton>
          <ToggleButton active={side.isLightScreen} onClick={() => toggle('isLightScreen')}>
            Light Screen
          </ToggleButton>
          <ToggleButton active={side.isAuroraVeil} onClick={() => toggle('isAuroraVeil')}>
            Aurora Veil
          </ToggleButton>
        </div>
      </div>

      <div className="field-subsection">
        <p className="field-subsection-label">Effects</p>
        <div className="flex flex-wrap gap-1">
          <ToggleButton active={side.isProtected} onClick={() => toggle('isProtected')}>
            Protect
          </ToggleButton>
          <ToggleButton active={side.isSeeded} onClick={() => toggle('isSeeded')}>
            Leech Seed
          </ToggleButton>
          <ToggleButton active={side.isSaltCured} onClick={() => toggle('isSaltCured')}>
            Salt Cure
          </ToggleButton>
          <ToggleButton active={side.isForesight} onClick={() => toggle('isForesight')}>
            Foresight
          </ToggleButton>
          <ToggleButton active={side.isPowerTrick} onClick={() => toggle('isPowerTrick')}>
            Power Trick
          </ToggleButton>
        </div>
      </div>
    </div>
  );
}

export function FieldPanel({ field, onChange }: FieldPanelProps) {
  const setGlobal = (patch: Partial<FieldState>) => onChange({ ...field, ...patch });

  return (
    <section className="panel space-y-3 p-3">
      <h3 className="section-title">Field</h3>

      <div className="field-global-box space-y-2">
        <h4 className="field-section-title">Global</h4>

        <div className="field-subsection">
          <p className="field-subsection-label">Weather</p>
          <div className="flex flex-wrap gap-1">
            {WEATHER_OPTIONS.map((w) => (
              <ToggleButton
                key={w.label}
                active={field.weather === w.value}
                onClick={() => setGlobal({ weather: w.value })}
              >
                {w.label}
              </ToggleButton>
            ))}
          </div>
        </div>

        <div className="field-subsection">
          <p className="field-subsection-label">Terrain</p>
          <div className="flex flex-wrap gap-1">
            {TERRAIN_OPTIONS.map((t) => (
              <ToggleButton
                key={t.label}
                active={field.terrain === t.value}
                onClick={() => setGlobal({ terrain: t.value })}
              >
                {t.label}
              </ToggleButton>
            ))}
          </div>
        </div>

        <div className="field-subsection">
          <p className="field-subsection-label">Rooms & Gravity</p>
          <div className="flex flex-wrap gap-1">
            <ToggleButton
              active={field.isMagicRoom}
              onClick={() => setGlobal({ isMagicRoom: !field.isMagicRoom })}
            >
              Magic Room
            </ToggleButton>
            <ToggleButton
              active={field.isWonderRoom}
              onClick={() => setGlobal({ isWonderRoom: !field.isWonderRoom })}
            >
              Wonder Room
            </ToggleButton>
            <ToggleButton
              active={field.isGravity}
              onClick={() => setGlobal({ isGravity: !field.isGravity })}
            >
              Gravity
            </ToggleButton>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <SidePanel
          label="Left side"
          side={field.leftSide}
          onChange={(leftSide) => onChange({ ...field, leftSide })}
        />
        <SidePanel
          label="Right side"
          side={field.rightSide}
          onChange={(rightSide) => onChange({ ...field, rightSide })}
        />
      </div>
    </section>
  );
}
