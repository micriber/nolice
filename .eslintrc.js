module.exports = {
  root: true,
  extends: ['universe/native', 'universe/shared/typescript-analysis'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
  rules: {
    // `@typescript-eslint/no-floating-promises` wants intentional
    // fire-and-forget calls marked with `void`; allow that form so the
    // two rules don't conflict.
    'no-void': ['warn', {allowAsStatement: true}],
  },
};
