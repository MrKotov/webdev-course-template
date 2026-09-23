// Exercise 3 self-check: is the feature delivered through every layer?
//   node checks/ex3.mjs
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { check, filled, findFile, git, read, report, section } from './lib.mjs';

const migration = findFile('.', (name, full) => /\.(sql|js|ts|py)$/.test(name) && /migrat/i.test(full));
check('a migration file exists', migration !== null, 'the data model change is delivered as a numbered migration');

const test = findFile('.', (name) => /(\.test\.|_test\.|test_|\.spec\.)/.test(name));
check('automated tests exist', test !== null, 'at least one test for the rule and one for the API');

const pkg = read('package.json');
if (pkg && /"test"\s*:/.test(pkg)) {
  let passed = true;
  let output = '';
  try {
    output = execSync('npm test', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 180000 });
  } catch (error) {
    passed = false;
    output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
  }
  check('the test suite passes', passed, passed ? '' : output.split('\n').filter(Boolean).slice(-3).join(' | '));
} else {
  check('the test suite passes', existsSync('pytest.ini') || existsSync('pyproject.toml') || test !== null, 'run your tests yourself: no npm test script found');
}

const note = read('SPEC.md');
const hasNote = (note && section(note, 'Architecture')) || findFile('docs', (name) => /feature/i.test(name));
check('the architecture note exists', Boolean(hasNote), 'trace one request through the layers, in SPEC.md or docs/');

const log = git(['log', '--oneline']);
const commits = log ? log.split('\n').length : 0;
check('you committed in small steps', commits >= 5, `${commits} commit(s) in this repository, aim for one per working step`);

const agents = read('AGENTS.md');
check('the always-ask list is written', filled(section(agents ?? '', 'Always ask before')).length >= 3, 'the agent must know what to never do unasked');

const plan = read('AGENT_LOG.md');
check('the plan and what you changed are logged', (plan ?? '').length > 400, 'paste the reviewed plan and what you corrected in it');

report('Exercise 3 · a full feature');
