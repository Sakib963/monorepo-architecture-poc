// This file simply exports the package metadata — the real value of this
// package is the tsconfig.json and .eslintrc.js files that other packages
// extend/inherit from.
export const CONFIG_VERSION = '1.0.0';

export const PACKAGE_CONVENTIONS = {
  namingPattern: '@poc/<name>',
  sourceDir: 'src',
  outputDir: 'dist',
  indexFile: 'src/index.ts',
} as const;
