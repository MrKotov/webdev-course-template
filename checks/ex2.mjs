// Exercise 2 self-check: is the spec written and does the repository carry it?
//   node checks/ex2.mjs
import { check, filled, read, report, section } from './lib.mjs';

const spec = read('SPEC.md');
check('SPEC.md exists', spec !== null, 'the template ships one, fill it in');

if (spec) {
  const goals = filled(section(spec, 'Goals'));
  const nonGoals = filled(section(spec, 'Non-goals'));
  const constraints = filled(section(spec, 'Constraints'));
  const criteria = filled(section(spec, 'Acceptance criteria'));
  check('Goals are written', goals.length >= 2, `found ${goals.length}, write at least 2`);
  check('Non-goals are written', nonGoals.length >= 3, `found ${nonGoals.length}, write at least 3: this is the part that saves you`);
  check('Constraints are written', constraints.length >= 2, `found ${constraints.length}`);
  check('Acceptance criteria are written', criteria.length >= 3, `found ${criteria.length}, write at least 3`);
  const vague = criteria.filter((c) => /^(it )?(works|is done|is ready|looks good|работи)/i.test(c));
  check('no vague acceptance criterion', vague.length === 0, vague.length ? `"${vague[0]}" cannot be checked in a minute` : '');
  check('the project name replaces the placeholder', !/<\s*project name\s*>/i.test(spec), 'the first line still says <Project name>');
  check('the spec vs result note is filled in', filled(section(spec, 'Spec vs result')).length >= 1, 'write what the agent missed or reinterpreted');
}

const agents = read('AGENTS.md');
check('AGENTS.md exists', agents !== null);
if (agents) {
  check('commands are filled in', filled(section(agents, 'Commands')).length >= 2, 'install, run and test must be exact and working');
  check('conventions are written', filled(section(agents, 'Conventions')).length >= 1);
  check('the always-ask list is kept', filled(section(agents, 'Always ask before')).length >= 3);
}

const log = read('AGENT_LOG.md');
check('AGENT_LOG.md has at least one entry', (log ?? '').includes('## ') && filled(log).length > 4, 'one entry per agent session');
const usage = read('USAGE.md');
check('USAGE.md has at least one row', ((usage ?? '').match(/^\|\s*\d{4}-\d{2}-\d{2}/gm) ?? []).length >= 1, 'one row per session, tokens from /stats');

report('Exercise 2 · spec and project setup');
