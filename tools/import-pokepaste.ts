#!/usr/bin/env npx tsx
/**
 * Import Showdown / Pokepaste sets into LCMNM suggested-set format.
 *
 * Usage:
 *   npx tsx tools/import-pokepaste.ts --text "$(pbpaste)"
 *   npx tsx tools/import-pokepaste.ts --url https://pokepast.es/xxxxxxxx
 *   npx tsx tools/import-pokepaste.ts --file team.txt
 *   cat team.txt | npx tsx tools/import-pokepaste.ts
 *
 * Options:
 *   --json     Output JSON
 *   --ts       Output TypeScript for suggested-sets.ts (default)
 *   --summary  Human-readable summary
 */

import { readFileSync } from 'fs';
import {
  fetchPokepaste,
  formatForSuggestedSets,
  formatSetSummary,
  parseShowdownPaste,
} from '../lib/pokepasteParser';

async function readInput(): Promise<string> {
  const args = process.argv.slice(2);
  const urlIdx = args.indexOf('--url');
  if (urlIdx >= 0 && args[urlIdx + 1]) {
    return fetchPokepaste(args[urlIdx + 1]);
  }
  const fileIdx = args.indexOf('--file');
  if (fileIdx >= 0 && args[fileIdx + 1]) {
    return readFileSync(args[fileIdx + 1], 'utf8');
  }
  const textIdx = args.indexOf('--text');
  if (textIdx >= 0 && args[textIdx + 1]) {
    return args[textIdx + 1];
  }
  if (!process.stdin.isTTY) {
    return readFileSync(0, 'utf8');
  }
  console.error('Provide --url, --file, --text, or pipe stdin.');
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  const mode = args.includes('--json') ? 'json' : args.includes('--summary') ? 'summary' : 'ts';
  const text = await readInput();
  const sets = parseShowdownPaste(text);

  if (sets.length === 0) {
    console.error('No Pokémon sets found in input.');
    process.exit(1);
  }

  if (mode === 'json') {
    console.log(JSON.stringify(sets, null, 2));
  } else if (mode === 'summary') {
    for (const set of sets) {
      console.log(formatSetSummary(set));
      console.log('---');
    }
  } else {
    console.log('// Paste into data/suggested-sets.ts SUGGESTED_SETS array:\n');
    console.log(formatForSuggestedSets(sets));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
