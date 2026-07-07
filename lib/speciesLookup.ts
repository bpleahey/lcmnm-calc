import { Dex } from '@pkmn/dex';

const dex = Dex.forGen(9);

const artworkCache = new Map<string, string>();
const itemSpriteCache = new Map<string, string>();

function toId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function normalizeSpeciesName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/['\s]/g, '-')
    .replace(/-+/g, '-');
}

function showdownSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/['']/g, '')
    .replace(/\s+/g, '-');
}

function itemNameToSlug(itemName: string): string {
  return itemName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/['.]/g, '')
    .replace(/-+/g, '-');
}

function getShowdownSlugCandidates(speciesName: string): string[] {
  const slugs = new Set<string>();
  const species = dex.species.get(toId(speciesName));
  if (species?.id) slugs.add(species.id);
  slugs.add(showdownSlugFromName(speciesName));
  slugs.add(normalizeSpeciesName(speciesName));
  return [...slugs];
}

export function getPokemonSpriteCandidates(speciesName: string): string[] {
  const urls: string[] = [];
  const species = dex.species.get(toId(speciesName));

  if (species?.num) {
    urls.push(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${species.num}.png`,
    );
  }

  for (const slug of getShowdownSlugCandidates(speciesName)) {
    urls.push(`https://play.pokemonshowdown.com/sprites/gen5/${slug}.png`);
  }

  return [...new Set(urls)];
}

function getItemSpriteCandidates(itemName: string): string[] {
  const hyphenSlug = itemNameToSlug(itemName);
  const compactSlug = toId(itemName);

  return [
    ...new Set([
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${hyphenSlug}.png`,
      `https://play.pokemonshowdown.com/sprites/itemicons/${hyphenSlug}.png`,
      `https://www.serebii.net/itemdex/sprites/${compactSlug}.png`,
    ]),
  ];
}

function imageLoads(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = url;
  });
}

export async function getPokemonArtworkUrl(speciesName: string): Promise<string> {
  const cached = artworkCache.get(speciesName);
  if (cached !== undefined) return cached;

  for (const url of getPokemonSpriteCandidates(speciesName)) {
    if (await imageLoads(url)) {
      artworkCache.set(speciesName, url);
      return url;
    }
  }

  artworkCache.set(speciesName, '');
  return '';
}

/** Resolve item artwork via PokeAPI, Showdown, then Serebii fallbacks. */
export async function getItemSpriteUrl(itemName: string): Promise<string> {
  if (!itemName) return '';

  const cached = itemSpriteCache.get(itemName);
  if (cached !== undefined) return cached;

  const slug = itemNameToSlug(itemName);

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/item/${slug}`);
    if (response.ok) {
      const data = await response.json();
      const apiUrl = data.sprites?.default as string | null;
      if (apiUrl && (await imageLoads(apiUrl))) {
        itemSpriteCache.set(itemName, apiUrl);
        return apiUrl;
      }
    }
  } catch {
    // fall through to direct sprite candidates
  }

  for (const url of getItemSpriteCandidates(itemName)) {
    if (await imageLoads(url)) {
      itemSpriteCache.set(itemName, url);
      return url;
    }
  }

  itemSpriteCache.set(itemName, '');
  return '';
}

export function getSpeciesMonogram(speciesName: string): string {
  if (!speciesName) return '?';
  const parts = speciesName.split(/[\s-]+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}
