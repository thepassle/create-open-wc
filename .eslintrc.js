module.exports = {
  extends: ['@open-wc/eslint-config', 'eslint-config-prettier'].map(require.resolve),
  rules: {
    'no-console': 'off',
  },
};
