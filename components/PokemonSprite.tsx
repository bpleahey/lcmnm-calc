'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  getItemSpriteUrl,
  getPokemonSpriteCandidates,
  getSpeciesMonogram,
} from '@/lib/speciesLookup';

interface PokemonSpriteProps {
  species: string;
  item?: string;
  compact?: boolean;
}

function imageLoads(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = url;
  });
}

export function PokemonSprite({ species, item, compact = false }: PokemonSpriteProps) {
  const [spriteUrl, setSpriteUrl] = useState<string | null>(null);
  const [itemSpriteUrl, setItemSpriteUrl] = useState<string | null>(null);
  const spriteCandidates = useMemo(() => getPokemonSpriteCandidates(species), [species]);

  useEffect(() => {
    let active = true;
    setSpriteUrl(null);

    (async () => {
      for (const url of spriteCandidates) {
        if (!active) return;
        if (await imageLoads(url)) {
          if (active) setSpriteUrl(url);
          return;
        }
      }
      if (active) setSpriteUrl('');
    })();

    return () => {
      active = false;
    };
  }, [species, spriteCandidates]);

  const tryNextSprite = () => {
    setSpriteUrl((current) => {
      if (!current) return '';
      const index = spriteCandidates.indexOf(current);
      const next = index >= 0 ? spriteCandidates[index + 1] : undefined;
      return next ?? '';
    });
  };

  useEffect(() => {
    let active = true;
    if (!item) {
      setItemSpriteUrl(null);
      return undefined;
    }
    setItemSpriteUrl(null);
    getItemSpriteUrl(item).then((url) => {
      if (active) setItemSpriteUrl(url);
    });
    return () => {
      active = false;
    };
  }, [item]);

  const shellClass = compact ? 'h-20 w-20' : 'h-36 w-36';
  const imgClass = compact ? 'h-16 w-16' : 'h-28 w-28';
  const itemClass = compact
    ? 'right-0 top-0 h-7 w-7'
    : 'right-2 top-2 h-10 w-10';
  const itemImgClass = compact ? 'h-5 w-5' : 'h-7 w-7';
  const monogram = getSpeciesMonogram(species);
  const showItemPlaceholder = !item || itemSpriteUrl === '';

  return (
    <div className={`relative mx-auto shrink-0 ${shellClass}`}>
      <div className="sprite-ring flex h-full w-full items-center justify-center overflow-hidden rounded-full">
        {spriteUrl === null ? (
          <div className={`${imgClass} animate-pulse rounded-full bg-panel-light`} />
        ) : spriteUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={spriteUrl}
            alt={species}
            className={`${imgClass} object-contain`}
            onError={tryNextSprite}
          />
        ) : (
          <span
            className={`flex ${imgClass} items-center justify-center text-center font-semibold text-gold-light ${
              compact ? 'text-sm' : 'text-lg'
            }`}
          >
            {monogram}
          </span>
        )}
      </div>
      <div
        className={`item-badge absolute z-10 flex items-center justify-center rounded-md border border-[rgba(201,162,39,0.4)] bg-[rgba(22,22,31,0.9)] p-0.5 shadow-md ${itemClass}`}
        title={item || 'No item'}
      >
        {showItemPlaceholder ? (
          <span
            className={`item-placeholder font-bold leading-none text-gold ${compact ? 'text-sm' : 'text-base'}`}
            aria-hidden
          >
            ?
          </span>
        ) : itemSpriteUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={itemSpriteUrl}
            alt={item}
            className={`${itemImgClass} object-contain`}
            onError={() => setItemSpriteUrl('')}
          />
        ) : (
          <span
            className={`item-placeholder font-bold leading-none text-gold ${compact ? 'text-sm' : 'text-base'}`}
            aria-hidden
          >
            ?
          </span>
        )}
      </div>
    </div>
  );
}
