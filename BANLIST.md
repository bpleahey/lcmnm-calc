# LCMNM Banlist

Source: Gen 9 Mix and Mega Little Cup `/challenge` ruleset.

Edit the files below when council updates the format:

- `data/banned-species.ts`
- `data/restricted-species.ts`
- `data/banned-items.ts`

Species dropdowns are built from Showdown LC eligibility:

1. **Base pool** — `tier: LC`, plus `tier: NFE` first-stage species with evolutions (Porygon, Shellder, Torchic, Vulpix, Magby, etc.).
2. **Minus** format species bans (with form exceptions).
3. **Restricted** — explicit `*species` from the challenge; legal but cannot hold mega stones. Includes Gligar and Qwilfish-Hisui (not in the base pool).

## Banned species

Bans apply to all formes sharing the same base species, except where listed in `BAN_EXCEPTIONS`.

- Basculin (incl. White-Striped)
- Diglett (Alolan form legal — see exceptions)
- Dunsparce
- Duraludon
- Meditite
- Rufflet
- Scyther
- Sneasel (incl. Hisui)
- Stantler

### Ban exceptions

- Diglett-Alola

## Restricted (no mega)

- Aipom, Buizel, Cutiefly, Dratini, Elekid, Gastly, Girafarig, Gligar
- Mienfoo, Misdreavus, Murkrow, Pawniard, Qwilfish-Hisui, Voltorb-Hisui, Wattrel, Yanma

## Banned items

- Absolite Z, Beedrillite, Blazikenite, Gengarite, Glimmoranite, Kangaskhanite
- Lucarionite, Lucarionite Z, Mawilite, Medichamite, Pidgeotite, Scovillainite
- Starminite, Victreebelite, Zygardite

## Format-legal extras (not bans)

- Red Orb, Blue Orb, Rusted Sword, Rusted Shield, Malamarite

## Other rules (not enforced in calc UI)

- Sticky Web banned
- Arena Trap and Shadow Tag unbanned
- Sleep Clause Mod / !Sleep Moves Clause
