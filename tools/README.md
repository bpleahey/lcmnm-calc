# Pokepaste set importer

Converts [Pokepaste](https://pokepast.es) / Showdown export text into `PokemonSet` entries for `data/suggested-sets.ts`.

## Quick use

```bash
# From clipboard text
npx tsx tools/import-pokepaste.ts --text "Chinchou @ Diancite
Ability: Volt Absorb
EVs: 52 Def / 228 SpA / 220 Spe
Timid Nature
IVs: 0 Atk
- Scald
- Ice Beam
- Volt Switch
- Substitute"

# From pokepast.es URL
npx tsx tools/import-pokepaste.ts --url https://pokepast.es/xxxxxxxx

# From file
npx tsx tools/import-pokepaste.ts --file team.txt

# Human-readable check
npx tsx tools/import-pokepaste.ts --summary --text "..."
```

Or via npm script:

```bash
npm run import-set -- --url https://pokepast.es/xxxxxxxx
```

## Behaviour

- **Ignores** `Level`, `Shiny`, `Happiness`, `Tera Type`
- **Ability** is taken from the mega stone (Mix and Mega) when the item is a stone/orb — not the pasted ability line
- **IVs** default to 31 where omitted in output TS (only non-31 IVs are written)
- **Moves** use the first option when slash-separated (`Protect / Detect` → `Protect`)

## Example output (`--summary`)

```
pokemon: Chinchou
item: Diancite
ability: Magic Bounce
nature: Timid
evs: 52 DEF / 228 SPA / 220 SPE
ivs: 0 atk
moves: Scald, Ice Beam, Volt Switch, Substitute
```

## Agent workflow

1. Fetch or paste the set
2. Run `npm run import-set -- --summary --url <pokepaste>`
3. Verify ability/item resolution
4. Run `npm run import-set -- --url <pokepaste>` and paste the TypeScript block into `data/suggested-sets.ts`

Programmatic API: `lib/pokepasteParser.ts` exports `parseShowdownSet`, `parseShowdownPaste`, `fetchPokepaste`, `formatForSuggestedSets`.
