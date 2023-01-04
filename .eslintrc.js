// prettier-ignore
module.exports = {
  root: true,
  extends: ['@react-native-community', 'eslint:recommended', 'prettier'],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  globals: {
    //   Atomics: 'readonly',
    //   SharedArrayBuffer: 'readonly',
    JSX: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'react-native'],
  rules: {
    'no-multi-spaces': 'error',
    'linebreak-style': 0,
    quotes: ['error', 'single'],
    'no-unused-vars': 'error',
  },
};
