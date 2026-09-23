// Exercise 5 self-check: is the review evidenced and were the fixes test-first?
//   node checks/ex5.mjs
import { check, filled, git, read, report, section } from './lib.mjs';

const review = read('REVIEW.md');
check('REVIEW.md exists', review !== null, 'the review of your partner\'s project lives in your repository');

if (review) {
  const rows = (review.match(/^\|\s*R\d+\s*\|/gm) ?? []).length;
  check('the findings table has rows', rows >= 4, `found ${rows} finding(s) with an id like R1`);
  const verdicts = /confirmed|false positive|unsure|потвърден|фалшив/i.test(review);
  check('every finding carries a verdict', verdicts, 'confirmed, false positive or unsure');
  check('evidence is recorded', /evidence|доказателств/i.test(review), 'a file and line, a request, or a failing test');
  check('precision per pass is written', filled(section(review, '.*[Pp]recision.*|.*[Тт]очност.*')).length >= 1, 'how many of each pass\'s findings were real');
  check('you noted what no agent found', /no agent|никой агент|не откри/i.test(review), 'the miss is the interesting part');
  check('you replied to the review of your own project', filled(section(review, '.*[Rr]eplies.*|.*[Оо]тговор.*')).length >= 1, 'fixed with a commit, or disputed with evidence');
}

const log = git(['log', '--oneline', '-n', '200']);
const tests = [...log.matchAll(/^\w+\s+test\((R\d+)\)/gim)].map((m) => m[1].toUpperCase());
const fixes = [...log.matchAll(/^\w+\s+fix\((R\d+)\)/gim)].map((m) => m[1].toUpperCase());
check('failing tests are committed before their fixes', tests.length >= 1, 'commit test(Rn) first, watch CI go red, then fix(Rn)');
const unpaired = fixes.filter((f) => !tests.includes(f));
check('every fix has its test', unpaired.length === 0, unpaired.length ? `no test commit for ${unpaired.join(', ')}` : '');

report('Exercise 5 · adversarial review');
