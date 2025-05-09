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
  // rules: {
  //   '@typescript-eslint/no-unused-vars': [
  //     'warn', // or "error"
  //     {
  //       argsIgnorePattern: '^_',
  //       varsIgnorePattern: '^_',
  //       caughtErrorsIgnorePattern: '^_',
  //     },
  //   ],
  // },
};
