'use client';

import { useMemo, useState } from 'react';
import { FieldPanel } from '@/components/FieldPanel';
import { PokemonPanel } from '@/components/PokemonPanel';
import { getSuggestedSet } from '@/data/suggested-sets';
import {
  defaultFieldState,
  pokemonStateFromSet,
} from '@/lib/calc';

export function Calculator() {
  const initialLeft = useMemo(
    () => pokemonStateFromSet(getSuggestedSet('Chinchou', 'Diancite')!),
    [],
  );
  const initialRight = useMemo(
    () => pokemonStateFromSet(getSuggestedSet('Vullaby', 'Sablenite')!),
    [],
  );

  const [left, setLeft] = useState(initialLeft);
  const [right, setRight] = useState(initialRight);
  const [field, setField] = useState(defaultFieldState());

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-4">
      <div className="grid gap-6 lg:grid-cols-2">
        <PokemonPanel
          state={left}
          opponentState={right}
          field={field}
          attackerOnLeft
          onChange={setLeft}
        />
        <PokemonPanel
          state={right}
          opponentState={left}
          field={field}
          attackerOnLeft={false}
          onChange={setRight}
        />
      </div>

      <FieldPanel field={field} onChange={setField} />

      <footer className="border-t border-[rgba(201,162,39,0.2)] pt-4 text-center text-xs text-gold-light">
        <p>
          Created by{' '}
          <span className="text-gold">bleahey</span>
          {' · '}Damage mechanics by{' '}
          <a
            href="https://github.com/smogon/damage-calc"
            className="text-rainbow-accent hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            @smogon/calc
          </a>{' '}
          (MIT)
          {' · '}Sprites by{' '}
          <a
            href="https://pokeapi.co"
            className="text-rainbow-accent hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            PokeAPI
          </a>
        </p>
      </footer>
    </div>
  );
}
