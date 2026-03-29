const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const transactionsFile = path.join(__dirname, '../../apps/user-portal/src/app/pages/transactions-page.component.ts');
const source = fs.readFileSync(transactionsFile, 'utf8');

test('user transfer flow validates payload with shared schema', () => {
  assert.match(source, /validate\(createTransferActionSchema,/);
});

test('user transfer flow calls shared API client service action', () => {
  assert.match(source, /this\.api\.createTransfer\(/);
});

test('user transfer flow handles success and error UI states', () => {
  assert.match(source, /this\.successMessage\.set\(/);
  assert.match(source, /this\.errorMessage\.set\(/);
});

test('user transfer flow includes feature-flag gate fallback', () => {
  assert.match(source, /getFlag\('CORE_MAINTENANCE_MODE'\)/);
  assert.match(source, /Transfers are disabled/);
});
