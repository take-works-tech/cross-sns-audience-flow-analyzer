// Commitlint config for cross-sns-audience-flow-analyzer — Conventional Commits 1.0.0.
// Install: npm i -D @commitlint/cli @commitlint/config-conventional
// Wire to commit-msg hook (see .pre-commit-config.yaml or husky).
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'perf', 'docs', 'test', 'refactor', 'chore', 'build', 'ci', 'style', 'revert'],
    ],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
    'body-max-line-length': [2, 'always', 100],
  },
};
