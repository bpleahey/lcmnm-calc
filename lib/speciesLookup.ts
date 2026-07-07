import { gen } from '@/lib/calc';

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

async function urlExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

function getShowdownSpriteCandidates(speciesName: string): string[] {
  const slugs = new Set<string>();
  const species = gen.species.get(toId(speciesName) as never);
  if (species?.id) slugs.add(species.id);
  slugs.add(showdownSlugFromName(speciesName));
  slugs.add(normalizeSpeciesName(speciesName));

  return [...slugs].map(
    (slug) => `https://play.pokemonshowdown.com/sprites/gen5/${slug}.png`,
  );
}

async function getShowdownSpriteUrl(speciesName: string): Promise<string> {
  for (const url of getShowdownSpriteCandidates(speciesName)) {
    if (await urlExists(url)) return url;
  }
  return '';
}

export async function getPokemonArtworkUrl(speciesName: string): Promise<string> {
  const cached = artworkCache.get(speciesName);
  if (cached !== undefined) return cached;

  const slug = normalizeSpeciesName(speciesName);
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${slug}`);
    if (response.ok) {
      const data = await response.json();
      const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;
      artworkCache.set(speciesName, url);
      return url;
    }

    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${slug}`);
    if (speciesResponse.ok) {
      const speciesData = await speciesResponse.json();
      const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${speciesData.id}.png`;
      artworkCache.set(speciesName, url);
      return url;
    }
  } catch {
    // fall through to Showdown sprites (CAP / custom species)
  }

  const showdownUrl = await getShowdownSpriteUrl(speciesName);
  artworkCache.set(speciesName, showdownUrl);
  return showdownUrl;
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
