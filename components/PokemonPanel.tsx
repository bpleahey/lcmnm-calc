'use client';

import { useEffect, useMemo, useState } from 'react';
import type { StatID } from '@/lib/types';
import { Autocomplete } from '@/components/Autocomplete';
import { MoveDamageRow } from '@/components/MoveDamageRow';
import { PokemonSprite } from '@/components/PokemonSprite';
import { HpControl, SimpleSlider, StatRow } from '@/components/StatSlider';
import { ALL_LEGAL_SPECIES, getSpeciesFormes, isSpeciesRestricted } from '@/data/legal';
import { getSuggestedVariants } from '@/data/suggested-sets';
import { buildItemOptions } from '@/data/mega-stones';
import { applyMixAndMega, isAutoTransformItem, isToggleMegaStone } from '@/lib/mixMega';
import { mergeSwitchInBoosts } from '@/lib/displayStats';
import {
  calcMoveDamage,
  defaultPokemonState,
  gen,
  getAbilitiesForSpecies,
  getBaseStatTotal,
  getCalculatedStats,
  getEffectiveMixedState,
  getSpeciesTypes,
  pokemonStateFromSet,
  STAT_LABELS,
  type PokemonState,
} from '@/lib/calc';
import {
  buildMoveSlotOptions,
  buildNatureSelectOptions,
  getLegalMovesForSpecies,
} from '@/lib/learnset';
import {
  MAX_EV_PER_STAT,
  MAX_EV_TOTAL,
  STAT_IDS,
  STATUS_OPTIONS,
} from '@/lib/constants';
import type { FieldState } from '@/lib/calc';

interface PokemonPanelProps {
  state: PokemonState;
  opponentState: PokemonState;
  field: FieldState;
  attackerOnLeft: boolean;
  onChange: (state: PokemonState) => void;
}

export function PokemonPanel({
  state,
  opponentState,
  field,
  attackerOnLeft,
  onChange,
}: PokemonPanelProps) {
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const restricted = isSpeciesRestricted(state.species);
  const itemOptions = useMemo(
    () => buildItemOptions(gen, state.species, restricted),
    [state.species, restricted],
  );
  const formes = getSpeciesFormes(state.species);
  const abilities = getAbilitiesForSpecies(state.species);
  const canMega = Boolean(state.item && isToggleMegaStone(gen, state.item) && !restricted);
  const isAutoTransform = Boolean(state.item && isAutoTransformItem(state.item));
  const mixed = getEffectiveMixedState(state);
  const itemMixed = state.item ? applyMixAndMega(gen, state.species, state.item as never) : null;
  const abilityOptions = mixed?.ability
    ? [mixed.ability, ...abilities.filter((a) => a !== mixed.ability)]
    : itemMixed?.ability && (canMega || isAutoTransform)
      ? [itemMixed.ability, ...abilities.filter((a) => a !== itemMixed.ability)]
      : abilities;
  const stats = getCalculatedStats(state);
  const maxHp = Math.max(1, stats.hp);
  const bst = getBaseStatTotal(state);
  const types = getSpeciesTypes(state);
  const variants = getSuggestedVariants(state.species);
  const natureOptions = useMemo(
    () => buildNatureSelectOptions(state.suggestedNatures ?? []),
    [state.suggestedNatures],
  );

  useEffect(() => {
    let active = true;
    getLegalMovesForSpecies(state.species).then((moves) => {
      if (active) setLegalMoves(moves);
    });
    return () => {
      active = false;
    };
  }, [state.species]);

  const moveOptionsBySlot = useMemo(
    () =>
      state.moves.map((move, index) => {
        const suggested = state.moveSlotOptions?.[index] ?? (move ? [move] : []);
        return buildMoveSlotOptions(suggested, legalMoves);
      }),
    [legalMoves, state.moveSlotOptions, state.moves],
  );

  const evTotal = STAT_IDS.reduce((sum, stat) => sum + (state.evs[stat] ?? 0), 0);

  const update = (patch: Partial<PokemonState>) => onChange({ ...state, ...patch });

  const setEv = (stat: StatID, value: number) => {
    const current = state.evs[stat] ?? 0;
    const next = Math.max(0, Math.min(MAX_EV_PER_STAT, value));
    const delta = next - current;
    if (evTotal + delta > MAX_EV_TOTAL) return;
    update({ evs: { ...state.evs, [stat]: next } });
  };

  const setIv = (stat: StatID, value: number) => {
    update({ ivs: { ...state.ivs, [stat]: Math.max(0, Math.min(31, value)) } });
  };

  const setBoost = (stat: StatID, value: number) => {
    update({ boosts: { ...state.boosts, [stat]: value } });
  };

  const loadSuggested = (name?: string) => {
    const variant = variants.find((v) => (name ? v.name === name : true));
    if (variant) onChange(pokemonStateFromSet(variant));
  };

  const damages = state.moves.map((move) =>
    calcMoveDamage(state, opponentState, field, move, attackerOnLeft),
  );

  return (
    <section className="panel flex flex-col gap-1.5 p-3">
      <div className="pokemon-header flex shrink-0 gap-2">
        <PokemonSprite species={state.species} item={state.item} compact />

        <div className="min-w-0 flex-1">
          <div className="pokemon-name-row">
            <Autocomplete
              value={state.species}
              options={ALL_LEGAL_SPECIES}
              strict
              className="pokemon-name-input"
              inputClassName="input-field-compact"
              onChange={(species) => {
                const suggested = getSuggestedVariants(species)[0];
                if (suggested) {
                  onChange(pokemonStateFromSet(suggested));
                  return;
                }
                onChange(defaultPokemonState(species));
              }}
              placeholder="Pokemon"
            />
            {canMega && (
              <button
                type="button"
                className={`mega-toggle toggle-btn shrink-0 ${state.megaEvolved ? 'toggle-btn-active' : ''}`}
                onClick={() => {
                  const next = !state.megaEvolved;
                  const nextMixed =
                    next && state.item
                      ? applyMixAndMega(gen, state.species, state.item as never)
                      : null;
                  update({
                    megaEvolved: next,
                    ability: next && nextMixed ? nextMixed.ability : '',
                  });
                }}
                title={state.megaEvolved ? 'Mega evolved' : 'Not mega evolved'}
              >
                Mega
              </button>
            )}
            {variants.length > 0 && (
              <div className="set-variant-row">
                {variants.map((v) => (
                  <button
                    key={v.name}
                    type="button"
                    className="set-variant-btn toggle-btn"
                    onClick={() => loadSuggested(v.name)}
                    title={v.name}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="truncate text-[10px] leading-tight text-gold-light">
            {types.join(' / ')} · BST {bst}
            {restricted && ' · No Mega'}
          </p>
          <div className="mt-1 grid grid-cols-2 gap-1">
            <div className="min-w-0">
              <label className="label">Nature</label>
              <select
                className="input-field input-field-compact w-full"
                value={state.nature}
                onChange={(e) => update({ nature: e.target.value as PokemonState['nature'] })}
              >
                {natureOptions.map((n, index) => (
                  <option
                    key={`${n.name || 'divider'}-${index}`}
                    value={n.disabled ? '' : n.name}
                    disabled={n.disabled}
                  >
                    {n.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label className="label">Gender</label>
              <select
                className="input-field input-field-compact w-full"
                value={state.gender}
                onChange={(e) => update({ gender: e.target.value as PokemonState['gender'] })}
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="N">Genderless</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {formes.length > 1 && (
        <div className="shrink-0">
          <label className="label">Form</label>
          <select
            className="input-field input-field-compact w-full"
            value={state.species}
            onChange={(e) => update({ species: e.target.value })}
          >
            {formes.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid shrink-0 grid-cols-3 gap-1.5">
        <div className="min-w-0">
          <label className="label">Item</label>
          <Autocomplete
            value={state.item}
            options={itemOptions}
            strict
            allowEmpty
            listClassName="max-h-56"
            onChange={(item) => {
              const isToggleStone = Boolean(item && isToggleMegaStone(gen, item));
              const isAuto = Boolean(item && isAutoTransformItem(item));
              const mixed = item ? applyMixAndMega(gen, state.species, item as never) : null;
              const ability = !item
                ? ''
                : isAuto && mixed
                  ? mixed.ability
                  : isToggleStone
                    ? ''
                    : state.ability;
              update({
                item,
                megaEvolved: false,
                ability,
                boosts: item
                  ? mergeSwitchInBoosts(
                      isAuto || isToggleStone ? {} : state.boosts,
                      ability || mixed?.ability || '',
                    )
                  : {},
              });
            }}
            placeholder="Item"
            className="input-field-compact-wrap"
            inputClassName="input-field-compact"
          />
        </div>
        <div className="min-w-0">
          <label className="label">Ability</label>
          <select
            className="input-field input-field-compact w-full truncate"
            value={state.ability}
            onChange={(e) => update({ ability: e.target.value })}
          >
            <option value="">Auto</option>
            {abilityOptions.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="min-w-0">
          <label className="label">Status</label>
          <select
            className="input-field input-field-compact w-full"
            value={state.status}
            onChange={(e) => update({ status: e.target.value as PokemonState['status'] })}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.label} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {state.status === 'tox' && (
        <div className="shrink-0">
          <SimpleSlider
            label="Toxic"
            value={state.toxicCounter}
            min={1}
            max={15}
            onChange={(v) => update({ toxicCounter: v })}
          />
        </div>
      )}

      <div className="shrink-0 space-y-1">
        <p className="label mb-0">Moves & damage</p>
        <div className="space-y-1">
          {state.moves.map((move, i) => (
            <MoveDamageRow
              key={i}
              move={move}
              damage={damages[i]}
              moveOptions={moveOptionsBySlot[i]}
              onChange={(m) => {
                const moves = [...state.moves] as PokemonState['moves'];
                moves[i] = m;
                update({ moves });
              }}
            />
          ))}
        </div>
      </div>

      <div className="shrink-0">
        <HpControl compact hpPercent={state.hpPercent} maxHp={maxHp} onChange={(hpPercent) => update({ hpPercent })} />
      </div>

      <div className="shrink-0">
        <div className="mb-0.5 flex items-center justify-between">
          <p className="label mb-0">Stats</p>
          <span className="text-[10px] text-gold-light">
            EVs {evTotal}/{MAX_EV_TOTAL}
          </span>
        </div>
        <div className="space-y-0.5">
          {STAT_IDS.map((stat) => (
            <StatRow
              key={stat}
              stat={stat}
              label={STAT_LABELS[stat]}
              state={state}
              finalStat={stats[stat]}
              evTotal={evTotal}
              onEvChange={setEv}
              onIvChange={setIv}
              onBoostChange={setBoost}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
