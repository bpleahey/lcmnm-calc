import type { NatureName, StatsTable, StatusName } from '@/lib/types';

export interface PokemonSet {
  name: string;
  species: string;
  item: string;
  ability: string;
  nature: NatureName;
  suggestedNatures?: NatureName[];
  evs: Partial<StatsTable>;
  ivs: Partial<StatsTable>;
  moves: [string, string, string, string];
  moveSlotOptions?: [string[], string[], string[], string[]];
  status: StatusName | '';
  boosts: Partial<StatsTable>;
  gender: 'M' | 'F' | 'N';
  hpPercent: number;
  toxicCounter?: number;
}

export interface SuggestedSetEntry {
  pokemon: string;
  variants: PokemonSet[];
}

export const SUGGESTED_SETS: SuggestedSetEntry[] = [
{
    pokemon: 'Shellos',
    variants: [
      {
        name: 'Wall',
        species: 'Shellos',
        item: 'Chimechite',
        ability: 'Levitate',
        nature: 'Bold',
        evs: { hp: 228, def: 132, spd: 100, spe: 4 },
        ivs: { atk: 0 },
        moves: ['Stealth Rock', 'Earth Power', 'Ice Beam', 'Recover'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Chinchou',
    variants: [
      {
        name: 'Diancite',
        species: 'Chinchou',
        item: 'Diancite',
        ability: 'Magic Bounce',
        nature: 'Timid',
        evs: { def: 52, spa: 228, spe: 220 },
        ivs: { atk: 0 },
        moves: ['Scald', 'Ice Beam', 'Volt Switch', 'Flip Turn'] as [string, string, string, string],
        moveSlotOptions: [
          [
            'Hydro Pump',
            'Scald'
          ],
          [
            'Ice Beam'
          ],
          [
            'Volt Switch'
          ],
          [
            'Flip Turn',
            'Substitute'
          ]
        ] as [string[], string[], string[], string[]],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
      {
        name: 'Defensive Pivot',
        species: 'Chinchou',
        item: 'Eviolite',
        ability: 'Volt Absorb',
        nature: 'Sassy',
        evs: { hp: 76, def: 132, spa: 68, spd: 228 },
        ivs: { atk: 0, spe: 0 },
        moves: ['Scald', 'Volt Switch', 'Rest', 'Sleep Talk'] as [string, string, string, string],
        moveSlotOptions: [
          [
            'Scald',
            'Thunderbolt'
          ],
          [
            'Volt Switch',
            'Flip Turn'
          ],
          [
            'Rest'
          ],
          [
            'Sleep Talk'
          ]
        ] as [string[], string[], string[], string[]],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Stunky',
    variants: [
      {
        name: 'Metagrossite',
        species: 'Stunky',
        item: 'Metagrossite',
        ability: 'Tough Claws',
        nature: 'Jolly',
        evs: { hp: 12, atk: 252, spe: 244 },
        ivs: {},
        moves: ['Poison Jab', 'Knock Off', 'Sucker Punch', 'Temper Flare'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Drifloon',
    variants: [
      {
        name: 'Wallbreaker',
        species: 'Drifloon',
        item: 'Red Orb',
        ability: 'Desolate Land',
        nature: 'Modest',
        evs: { hp: 116, spa: 196, spe: 196 },
        ivs: { atk: 0 },
        moves: ['Weather Ball', 'Shadow Ball', 'Thunderbolt', 'Substitute'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Vullaby',
    variants: [
      {
        name: 'Sablenite',
        species: 'Vullaby',
        item: 'Sablenite',
        ability: 'Magic Bounce',
        nature: 'Relaxed',
        evs: { hp: 196, def: 156, spd: 156 },
        ivs: { spe: 0 },
        moves: ['Knock Off', 'Brave Bird', 'U-Turn', 'Roost'] as [string, string, string, string],
        moveSlotOptions: [
          [
            'Knock Off'
          ],
          [
            'Brave Bird',
            'Defog'
          ],
          [
            'U-Turn',
            'Defog'
          ],
          [
            'Roost'
          ]
        ] as [string[], string[], string[], string[]],
        status: '',
        boosts: {},
        gender: 'F',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Sandshrew-Alola',
    variants: [
      {
        name: 'Snowshrew',
        species: 'Sandshrew-Alola',
        item: 'Scizorite',
        ability: 'Technician',
        nature: 'Jolly',
        evs: { hp: 36, atk: 236, def: 36, spe: 196 },
        ivs: {},
        moves: ['Triple Axel', 'Earthquake', 'Rapid Spin', 'Ice Shard'] as [string, string, string, string],
        moveSlotOptions: [
          [
            'Triple Axel'
          ],
          [
            'Earthquake'
          ],
          [
            'Rapid Spin',
            'Stealth Rock'
          ],
          [
            'Ice Shard',
            'Stealth Rock',
            'Swords Dance'
          ]
        ] as [string[], string[], string[], string[]],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Tentacool',
    variants: [
      {
        name: 'Zeraorite',
        species: 'Tentacool',
        item: 'Zeraorite',
        ability: 'Volt Absorb',
        nature: 'Timid',
        evs: { hp: 36, def: 76, spa: 156, spd: 36, spe: 196 },
        ivs: {},
        moves: ['Sludge Bomb', 'Flip Turn', 'Rest', 'Sleep Talk'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Grookey',
    variants: [
      {
        name: 'Lopunnite',
        species: 'Grookey',
        item: 'Lopunnite',
        ability: 'Scrappy',
        nature: 'Jolly',
        evs: { atk: 236, def: 36, spe: 236 },
        ivs: {},
        moves: ['Wood Hammer', 'Grassy Glide', 'Drain Punch', 'U-Turn'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Larvesta',
    variants: [
      {
        name: 'Defensive Pivot',
        species: 'Larvesta',
        item: 'Eviolite',
        ability: 'Flame Body',
        nature: 'Impish',
        evs: { hp: 76, def: 236, spd: 76, spe: 116 },
        ivs: {},
        moves: ['Flare Blitz', 'U-Turn', 'Will-O-Wisp', 'Morning Sun'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Wingull',
    variants: [
      {
        name: 'Diancite',
        species: 'Wingull',
        item: 'Diancite',
        ability: 'Magic Bounce',
        nature: 'Modest',
        evs: { def: 36, spa: 236, spe: 236 },
        ivs: { hp: 19, atk: 0 },
        moves: ['Surf', 'Hurricane', 'Ice Beam', 'Substitute'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Foongus',
    variants: [
      {
        name: 'Eviolite',
        species: 'Foongus',
        item: 'Eviolite',
        ability: 'Regenerator',
        nature: 'Bold',
        evs: { hp: 124, def: 156, spd: 156 },
        ivs: { atk: 0 },
        moves: ['Giga Drain', 'Sludge Bomb', 'Spore', 'Synthesis'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Qwilfish-Hisui',
    variants: [
      {
        name: 'Defensive',
        species: 'Qwilfish-Hisui',
        item: 'Eviolite',
        ability: 'Intimidate',
        nature: 'Timid',
        evs: { def: 76, spa: 156, spe: 236 },
        ivs: { atk: 0 },
        moves: ['Sludge Bomb', 'Ice Beam', 'Mud Shot', 'Spikes'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
      {
        name: 'Rain Sweeper',
        species: 'Qwilfish-Hisui',
        item: 'Life Orb',
        ability: 'Swift Swim',
        nature: 'Adamant',
        evs: { atk: 236, spe: 236 },
        ivs: {},
        moves: ['Gunk Shot', 'Liquidation', 'Crunch', 'Rain Dance'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Arrokuda',
    variants: [
      {
        name: 'Wallbreaker',
        species: 'Arrokuda',
        item: 'Lopunnite',
        ability: 'Scrappy',
        nature: 'Jolly',
        evs: { atk: 252, def: 28, spe: 228 },
        ivs: {},
        moves: ['Liquidation', 'Close Combat', 'Aqua Jet', 'Flip Turn'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Gligar',
    variants: [
      {
        name: 'Eviolite',
        species: 'Gligar',
        item: 'Eviolite',
        ability: 'Hyper Cutter',
        nature: 'Adamant',
        suggestedNatures: ['Adamant', 'Jolly'],
        evs: { hp: 156, atk: 76, spe: 236 },
        ivs: {},
        moves: ['Dual Wingbeat', 'High Horsepower', 'Stealth Rock', 'U-Turn'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Glimmet',
    variants: [
      {
        name: 'Offesive Hazard Setter',
        species: 'Glimmet',
        item: 'Diancite',
        ability: 'Magic Bounce',
        nature: 'Timid',
        evs: { def: 20, spa: 236, spd: 36, spe: 196 },
        ivs: { atk: 0 },
        moves: ['Power Gem', 'Sludge Wave', 'Mud Shot', 'Spikes'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Slowpoke',
    variants: [
      {
        name: 'Eviolite',
        species: 'Slowpoke',
        item: 'Eviolite',
        ability: 'Regenerator',
        nature: 'Bold',
        evs: { hp: 196, def: 236, spa: 36, spd: 36 },
        ivs: { atk: 0 },
        moves: ['Surf', 'Psychic', 'Flamethrower', 'Slack Off'] as [string, string, string, string],
        moveSlotOptions: [
          [
            'Surf'
          ],
          [
            'Psychic'
          ],
          [
            'Flamethrower',
            'Thunder Wave'
          ],
          [
            'Slack Off'
          ]
        ] as [string[], string[], string[], string[]],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Tadbulb',
    variants: [
      {
        name: 'Pivot',
        species: 'Tadbulb',
        item: 'Red Orb',
        ability: 'Desolate Land',
        nature: 'Timid',
        evs: { hp: 28, def: 28, spa: 44, spd: 156, spe: 236 },
        ivs: { atk: 0 },
        moves: ['Weather Ball', 'Volt Switch', 'Rest', 'Sleep Talk'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Toedscool',
    variants: [
      {
        name: 'Anti Skunk',
        species: 'Toedscool',
        item: 'Gyaradosite',
        ability: 'Mold Breaker',
        nature: 'Timid',
        evs: { hp: 36, def: 236, spd: 36, spe: 196 },
        ivs: {},
        moves: ['Earth Power', 'Knock Off', 'Spikes', 'Spore'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Sandygast',
    variants: [
      {
        name: 'Anti-Shrew',
        species: 'Sandygast',
        item: 'Chimechite',
        ability: 'Levitate',
        nature: 'Calm',
        evs: { hp: 236, def: 36, spd: 236 },
        ivs: { atk: 0 },
        moves: ['Stealth Rock', 'Scorching Sands', 'Hex', 'Shore Up'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Tinkatink',
    variants: [
      {
        name: 'Clefablite',
        species: 'Tinkatink',
        item: 'Clefablite',
        ability: 'Cute Charm',
        nature: 'Timid',
        evs: { hp: 116, def: 236, spe: 132 },
        ivs: {},
        moves: ['Stealth Rock', 'Draining Kiss', 'Knock Off', 'Thunder Wave'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'F',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Salandit',
    variants: [
      {
        name: 'Diancite',
        species: 'Salandit',
        item: 'Diancite',
        ability: 'Magic Bounce',
        nature: 'Timid',
        evs: { hp: 52, def: 36, spa: 188, spe: 220 },
        ivs: { atk: 0 },
        moves: ['Sludge Wave', 'Fire Blast', 'Will-O-Wisp', 'Substitute'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Mienfoo',
    variants: [
      {
        name: 'Choice Scarf',
        species: 'Mienfoo',
        item: 'Choice Scarf',
        ability: 'Reckless',
        nature: 'Jolly',
        evs: { atk: 236, def: 36, spe: 236 },
        ivs: {},
        moves: ['High Jump Kick', 'Close Combat', 'Knock Off', 'U-Turn'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
      {
        name: 'Eviolite',
        species: 'Mienfoo',
        item: 'Eviolite',
        ability: 'Regenerator',
        nature: 'Jolly',
        evs: { hp: 196, def: 36, spd: 196, spe: 76 },
        ivs: {},
        moves: ['Fake Out', 'Knock Off', 'High Jump Kick', 'U-Turn'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Munchlax',
    variants: [
      {
        name: 'Sablenite',
        species: 'Munchlax',
        item: 'Sablenite',
        ability: 'Magic Bounce',
        nature: 'Impish',
        evs: { hp: 76, def: 196, spd: 236 },
        ivs: {},
        moves: ['Body Slam', 'Fire Blast', 'Rest', 'Sleep Talk'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Vulpix',
    variants: [
      {
        name: 'Sun Setter',
        species: 'Vulpix',
        item: 'Heat Rock',
        ability: 'Drought',
        nature: 'Timid',
        evs: { def: 36, spa: 196, spe: 236 },
        ivs: { hp: 23, atk: 0 },
        moves: ['Weather Ball', 'Will-O-Wisp', 'Encore', 'Healing Wish'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
      {
        name: 'Choice Scarf',
        species: 'Vulpix',
        item: 'Choice Scarf',
        ability: 'Drought',
        nature: 'Timid',
        evs: { hp: 52, spa: 196, spe: 236 },
        ivs: { atk: 0 },
        moves: ['Fire Blast', 'Energy Ball', 'Extrasensory', 'Healing Wish'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Bulbasaur',
    variants: [
      {
        name: 'Sun Sweeper',
        species: 'Bulbasaur',
        item: 'Life Orb',
        ability: 'Chlorophyll',
        nature: 'Timid',
        evs: { spa: 236, spe: 236 },
        ivs: { atk: 0 },
        moves: ['Growth', 'Solar Beam', 'Sludge Bomb', 'Weather Ball'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Finizen',
    variants: [
      {
        name: 'Wallbreaker',
        species: 'Finizen',
        item: 'Gardevoirite',
        ability: 'Pixilate',
        nature: 'Timid',
        evs: { def: 36, spa: 236, spe: 236 },
        ivs: {},
        moves: ['Surf', 'Ice Beam', 'Boomburst', 'Draining Kiss'] as [string, string, string, string],
        moveSlotOptions: [
          [
            'Surf'
          ],
          [
            'Ice Beam'
          ],
          [
            'Boomburst'
          ],
          [
            'Draining Kiss',
            'Aqua Jet'
          ]
        ] as [string[], string[], string[], string[]],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Voltorb',
    variants: [
      {
        name: 'Glalitite',
        species: 'Voltorb',
        item: 'Glalitite',
        ability: 'Refrigerate',
        nature: 'Timid',
        evs: { hp: 36, def: 36, spa: 236, spe: 196 },
        ivs: {},
        moves: ['Thunderbolt', 'Tera Blast', 'Volt Switch', 'Thunder Wave'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Dewpider',
    variants: [
      {
        name: 'Eviolite',
        species: 'Dewpider',
        item: 'Eviolite',
        ability: 'Water Bubble',
        nature: 'Modest',
        evs: { hp: 132, def: 180, spa: 196 },
        ivs: { atk: 0 },
        moves: ['Hydro Pump', 'Surf', 'Ice Beam', 'Mirror Coat'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Murkrow',
    variants: [
      {
        name: 'Choice Scarf',
        species: 'Murkrow',
        item: 'Choice Scarf',
        ability: 'Super Luck',
        nature: 'Rash',
        evs: { atk: 76, spa: 236, spe: 188 },
        ivs: {},
        moves: ['Brave Bird', 'Dark Pulse', 'Heat Wave', 'U-Turn'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Mudbray',
    variants: [
      {
        name: 'Metagrossite',
        species: 'Mudbray',
        item: 'Metagrossite',
        ability: 'Tough Claws',
        nature: 'Jolly',
        evs: { hp: 36, atk: 196, def: 36, spe: 236 },
        ivs: {},
        moves: ['High Horsepower', 'Stone Edge', 'Heavy Slam', 'Stealth Rock'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Koffing',
    variants: [
      {
        name: 'Manectite',
        species: 'Koffing',
        item: 'Manectite',
        ability: 'Intimidate',
        nature: 'Bold',
        evs: { hp: 36, def: 236, spd: 76, spe: 156 },
        ivs: { atk: 0 },
        moves: ['Sludge Bomb', 'Thunderbolt', 'Pain Split', 'Will-O-Wisp'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Squirtle',
    variants: [
      {
        name: 'Rain Sweeper',
        species: 'Squirtle',
        item: 'Swampertite',
        ability: 'Swift Swim',
        nature: 'Adamant',
        evs: { hp: 4, atk: 212, spd: 4, spe: 252 },
        ivs: {},
        moves: ['Wave Crash', 'Flip Turn', 'Aqua Jet', 'Rain Dance'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Drilbur',
    variants: [
      {
        name: 'Offensive Spinner',
        species: 'Drilbur',
        item: 'Pinsirite',
        ability: 'Aerilate',
        nature: 'Jolly',
        evs: { hp: 36, atk: 236, spe: 212 },
        ivs: {},
        moves: ['Rapid Spin', 'Double-Edge', 'Earthquake', 'Stealth Rock'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Shellder',
    variants: [
      {
        name: 'Shell Smash',
        species: 'Shellder',
        item: 'Altarianite',
        ability: 'Pixilate',
        nature: 'Timid',
        evs: { spa: 236, spd: 76, spe: 196 },
        ivs: {},
        moves: ['Shell Smash', 'Tera Blast', 'Hydro Pump', 'Ice Beam'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
      {
        name: 'Pinsirite',
        species: 'Shellder',
        item: 'Pinsirite',
        ability: 'Aerilate',
        nature: 'Timid',
        evs: { spa: 236, spd: 76, spe: 196 },
        ivs: {},
        moves: ['Shell Smash', 'Tera Blast', 'Hydro Pump', 'Ice Beam'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Axew',
    variants: [
      {
        name: 'Rusted Sword',
        species: 'Axew',
        item: 'Rusted Sword',
        ability: 'Intrepid Sword',
        nature: 'Jolly',
        evs: { atk: 220, spd: 36, spe: 220 },
        ivs: {},
        moves: ['Dragon Dance', 'Iron Head', 'Dragon Claw', 'Stomping Tantrum'] as [string, string, string, string],
        status: '',
        boosts: { atk: 1 },
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Cutiefly',
    variants: [
      {
        name: 'Quiver Dance',
        species: 'Cutiefly',
        item: 'Life Orb',
        ability: 'Sweet Veil',
        nature: 'Timid',
        evs: { spa: 236, spe: 244 },
        ivs: { hp: 0, atk: 0 },
        moves: ['Quiver Dance', 'Moonblast', 'Psychic', 'Draining Kiss'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Trapinch',
    variants: [
      {
        name: 'Skunk Trap',
        species: 'Trapinch',
        item: 'Staraptite',
        ability: 'Intimidate',
        nature: 'Adamant',
        evs: { hp: 236, atk: 196, def: 76 },
        ivs: {},
        moves: ['Feint', 'Superpower', 'Earthquake', 'First Impression'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Misdreavus',
    variants: [
      {
        name: 'Choice Scarf',
        species: 'Misdreavus',
        item: 'Choice Scarf',
        ability: 'Levitate',
        nature: 'Timid',
        evs: { hp: 36, spa: 236, spe: 236 },
        ivs: { atk: 0 },
        moves: ['Shadow Ball', 'Burning Jealousy', 'Thunderbolt', 'Destiny Bond'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
      {
        name: 'Offensive',
        species: 'Misdreavus',
        item: 'Eviolite',
        ability: 'Levitate',
        nature: 'Timid',
        evs: { hp: 36, spa: 236, spe: 236 },
        ivs: { atk: 0 },
        moves: ['Calm Mind', 'Shadow Ball', 'Thunderbolt', 'Dazzling Gleam'] as [string, string, string, string],
        moveSlotOptions: [
          [
            'Calm Mind'
          ],
          [
            'Shadow Ball'
          ],
          [
            'Thunderbolt'
          ],
          [
            'Dazzling Gleam',
            'Burning Jealousy'
          ]
        ] as [string[], string[], string[], string[]],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
      {
        name: 'Utility',
        species: 'Misdreavus',
        item: 'Eviolite',
        ability: 'Levitate',
        nature: 'Calm',
        evs: { def: 36, spa: 156, spd: 76, spe: 236 },
        ivs: { atk: 0 },
        moves: ['Hex', 'Dazzling Gleam', 'Thunder Wave', 'Pain Split'] as [string, string, string, string],
        moveSlotOptions: [
          [
            'Hex'
          ],
          [
            'Dazzling Gleam'
          ],
          [
            'Thunder Wave',
            'Will-O-Wisp'
          ],
          [
            'Pain Split'
          ]
        ] as [string[], string[], string[], string[]],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Mareanie',
    variants: [
      {
        name: 'Eviolite',
        species: 'Mareanie',
        item: 'Eviolite',
        ability: 'Regenerator',
        nature: 'Bold',
        evs: { hp: 196, def: 180, spa: 12, spd: 20, spe: 76 },
        ivs: { atk: 0 },
        moves: ['Surf', 'Sludge Bomb', 'Iron Defense', 'Recover'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Girafarig',
    variants: [
      {
        name: 'Eviolite',
        species: 'Girafarig',
        item: 'Eviolite',
        ability: 'Sap Sipper',
        nature: 'Timid',
        evs: { def: 76, spa: 196, spe: 236 },
        ivs: {},
        moves: ['Hyper Voice', 'Psychic', 'Double Kick', 'Thunder Wave'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Diglett-Alola',
    variants: [
      {
        name: 'Metagrossite',
        species: 'Diglett-Alola',
        item: 'Metagrossite',
        ability: 'Tough Claws',
        nature: 'Jolly',
        evs: { hp: 36, atk: 236, def: 36, spd: 4, spe: 196 },
        ivs: {},
        moves: ['Swords Dance', 'Stomping Tantrum', 'Iron Head', 'Sucker Punch'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
  {
    pokemon: 'Porygon',
    variants: [
      {
        name: 'Ap Csa',
        species: 'Porygon',
        item: 'Altarianite',
        ability: 'Pixilate',
        nature: 'Timid',
        evs: { hp: 76, spa: 236, spe: 196 },
        ivs: { atk: 0 },
        moves: ['Tri Attack', 'Thunder', 'Shadow Ball', 'Agility'] as [string, string, string, string],
        status: '',
        boosts: {},
        gender: 'M',
        hpPercent: 100,
      },
    ],
  },
];

export function getSuggestedSet(pokemon: string, nameOrItem?: string): PokemonSet | undefined {
  const entry = SUGGESTED_SETS.find((s) => s.pokemon === pokemon);
  if (!entry) return undefined;
  if (nameOrItem) {
    return (
      entry.variants.find((v) => v.name === nameOrItem || v.item === nameOrItem) ??
      entry.variants[0]
    );
  }
  return entry.variants[0];
}

export function getSuggestedVariants(pokemon: string): PokemonSet[] {
  return SUGGESTED_SETS.find((s) => s.pokemon === pokemon)?.variants ?? [];
}
