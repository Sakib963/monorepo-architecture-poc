# Config Package

Shared tooling configuration for TypeScript, ESLint, and other tools.

## Contents

- `tsconfig.json` - Base TypeScript configuration
- `eslint.js` - Base ESLint configuration (to be added)

## Usage

Extend this configuration in other packages:

```json
{
  "extends": "@monorepo/config/tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```
