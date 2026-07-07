# LCMNM Damage Calculator

A damage calculator for **Little Cup Mix and Mega** (Gen 9), built for level 5 singles.

## Features

- Attacker vs defender damage calculation with exact roll lists
- Mix and Mega stone support (stat, typing, and ability changes)
- LCMNM legal species filtering (banned / restricted / unrestricted)
- S-tier suggested sets (Chinchou, Stunky, Sandshrew-Alola, Vullaby)
- Gen 9 field toggles (weather, terrain, hazards, screens, etc.)
- PokeAPI Pokémon artwork with item overlay
- Mega Ring-inspired theme

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Banlist

Banlists are sourced from the [LCMNM forum thread](https://www.smogon.com/forums/threads/sv-lc-mix-and-mega-survey.3749640/) and live in:

- `data/banned-species.ts`
- `data/restricted-species.ts`
- `data/banned-items.ts`

Update these files when the council changes the format.

## Attribution

- Created by **bleahey**
- Damage mechanics: [@smogon/calc](https://github.com/smogon/damage-calc) (MIT)
- Sprites: [PokeAPI](https://pokeapi.co)

## License

MIT
