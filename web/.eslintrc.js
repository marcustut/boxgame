const prettierrc = require('rc')('./prettier')

module.exports = {
  extends: ['react-app'],
  plugins: ['prettier'],
  rules: {
    // 'no-restricted-imports': [
    //   'error',
    //   {
    //     patterns: ['@/features/*/*']
    //   }
    // ],
    'linebreak-style': ['error', 'unix'],

    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true }
      }
    ],
    'import/default': 'off',
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',

    '@typescript-eslint/no-explicit-any': 2,
    'prettier/prettier': ['error', prettierrc]
  },
  ignorePatterns: ['node_modules/*', 'src/types/supabase.ts']
}
