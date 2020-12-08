module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-underscore-dangle': ['off', { allow: ['foo_', '_bar'] }],
    'no-console': ['off', { allow: ['warn', 'error'] }],
  },
};
