// Exercise 4 self-check: is the project deployable and is the report honest?
//   node checks/ex4.mjs                      structure only
//   node checks/ex4.mjs https://your-app.url  also checks the live site
import { check, filled, read, report, section } from './lib.mjs';

check('a Dockerfile exists', read('Dockerfile') !== null, 'the image builds and runs your app');
const env = read('.env.example');
check('.env.example lists your variables', filled(env).length >= 2, 'every variable your app needs, with placeholder values');
check('no .env is committed', read('.env') === null, 'real values never enter the repository');

const ci = read('.github/workflows/ci.yml');
check('CI runs on every push', ci !== null && /on:\s*[\s\S]{0,40}push/.test(ci), 'the template ships a workflow that runs your tests');

const readiness = read('READINESS.md');
check('READINESS.md exists', readiness !== null, 'the main deliverable of this exercise');
if (readiness) {
  for (const [label, heading] of [
    ['the live URL and how to verify it', 'Live URL'],
    ['the environment variables table', 'Environment variables'],
    ['what happens when things fail', 'fail'],
    ['the four states of one screen', 'states'],
    ['the request waterfall', 'waterfall'],
    ['the security basics checked', 'Security'],
    ['known gaps, ranked by risk', 'gaps'],
  ]) {
    check(label, filled(section(readiness, `.*${heading}.*`)).length >= 1, `section about ${heading} is missing or empty`);
  }
  check('gaps are listed honestly', !/no gaps|nothing is missing|everything is ready/i.test(readiness), 'a project with no gaps is a report nobody believes');
  check('every claim says how you checked it', /how i checked|как проверих/i.test(readiness), 'add a "How I checked" note to the claims');
}

const url = process.argv[2];
if (url) {
  const base = url.replace(/\/$/, '');
  check('the URL is https', base.startsWith('https://'), 'a public deployment must be https');
  try {
    const started = Date.now();
    const res = await fetch(`${base}/health`, { signal: AbortSignal.timeout(90000) });
    const seconds = Math.round((Date.now() - started) / 1000);
    check(`GET ${base}/health returns 200`, res.status === 200, `got ${res.status}`);
    if (seconds > 5) console.log(`       (it took ${seconds}s: a free service was asleep, which is expected)`);
  } catch (error) {
    check(`GET ${base}/health returns 200`, false, error.name === 'TimeoutError' ? 'no answer within 90s' : error.message);
  }
} else {
  console.log('Tip: pass your public URL to check the deployment too, e.g. node checks/ex4.mjs https://your-app.onrender.com\n');
}

report('Exercise 4 · deployment and readiness');
