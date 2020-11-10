module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "semi": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/semi": [2, "never"],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 2,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 1,
    '@typescript-eslint/no-unused-vars': [1, {"varsIgnorePattern": "^_"}],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-types': 1,
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/member-delimiter-style': [2, {
      "multiline": {
          "delimiter": "comma",
          "requireLast": false
      },
      "singleline": {
          "delimiter": "comma",
          "requireLast": false
      }
    }]
  },
}
