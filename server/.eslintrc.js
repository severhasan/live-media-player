module.exports = {
  "env": {
    "node": true,
    "es2020": true
  },
  "parser": "@typescript-eslint/parser",
  "extends": ["plugin:@typescript-eslint/recommended"],
  "parserOptions": { "ecmaVersion": 2018, "sourceType": "module" },
  "rules": {
    "no-multiple-empty-lines": "warn",
    "no-var": "error",
    "prefer-const": "error"
  }
};
