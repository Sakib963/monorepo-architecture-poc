const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

function readDistDts(relativePath) {
  const filePath = path.join(__dirname, '../../dist/packages/types/src', relativePath);
  return fs.readFileSync(filePath, 'utf8');
}

test('types package index exports required contract modules', () => {
  const indexDts = readDistDts('index.d.ts');
  assert.match(indexDts, /export \* from '\.\/actions\.types';/);
  assert.match(indexDts, /export \* from '\.\/api\.types';/);
  assert.match(indexDts, /export \* from '\.\/notification\.types';/);
});

test('action contract declarations exist in public d.ts output', () => {
  const actionsDts = readDistDts('actions.types.d.ts');
  assert.match(actionsDts, /export interface ActionResult/);
  assert.match(actionsDts, /export interface CreateTransferAction/);
  assert.match(actionsDts, /export interface ToggleFeatureFlagAction/);
  assert.match(actionsDts, /export interface ExportAuditLogAction/);
});
