// Shared helpers for the exercise self-checks.
// These check STRUCTURE, not quality: they tell you something required is missing,
// they cannot tell you the work is good. Only you and the defence can do that.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export const results = [];
export const check = (name, ok, detail = '') => results.push({ name, ok: Boolean(ok), detail });

export const read = (path) => (existsSync(path) ? readFileSync(path, 'utf8') : null);

/** the body under a "## Heading", trimmed */
export const section = (text, heading) => {
  if (!text) return null;
  const re = new RegExp(`^##+\\s*${heading}\\s*$`, 'im');
  const start = text.search(re);
  if (start === -1) return null;
  const after = text.slice(start);
  const next = after.slice(after.indexOf('\n')).search(/^##\s/m);
  return (next === -1 ? after.slice(after.indexOf('\n')) : after.slice(after.indexOf('\n'), after.indexOf('\n') + next)).trim();
};

/** lines that carry content, ignoring HTML comments and empty bullets */
export const filled = (body) =>
  (body ?? '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .split('\n')
    .map((l) => l.replace(/^[-*\d.\s\[\]x]+/i, '').trim())
    .filter((l) => l.length > 2);

export const git = (args, fallback = '') => {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return fallback;
  }
};

export const findFile = (dir, test, depth = 3) => {
  if (!existsSync(dir) || depth < 0) return null;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      const found = findFile(full, test, depth - 1);
      if (found) return found;
    } else if (test(entry.name, full)) return full;
  }
  return null;
};

export function report(title) {
  const failed = results.filter((r) => !r.ok);
  console.log(`${title}\n`);
  for (const r of results) console.log(`${r.ok ? 'ok  ' : 'FAIL'} ${r.name}${r.ok || !r.detail ? '' : `\n       ${r.detail}`}`);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
  console.log(
    failed.length
      ? 'These are structural checks and they must all pass before you hand in. Passing them is the minimum, not the point.'
      : 'Structure is in place. Whether the work is any good is decided by your evidence and by the defence.',
  );
  process.exit(failed.length ? 1 : 0);
}
