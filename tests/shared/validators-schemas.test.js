const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validate,
  createTransferActionSchema,
  toggleFeatureFlagActionSchema,
  validationErrorsToActionResult,
} = require('../../dist/packages/validators/src/index.js');

test('createTransferActionSchema accepts valid transfer payload', () => {
  const valid = validate(createTransferActionSchema, {
    fromAccountId: '11472f32-68d9-449f-8f8f-f5ec0a47d95d',
    toAccountId: 'a0d88eb8-83a4-45fa-a9cd-7ee95f47d181',
    amount: 1200,
    currency: 'BDT',
    note: 'Savings transfer',
  });

  assert.equal(valid.success, true);
  assert.equal(valid.errors.length, 0);
});

test('toggleFeatureFlagActionSchema rejects short reason and maps to action result', () => {
  const invalid = validate(toggleFeatureFlagActionSchema, {
    flagKey: 'CORE_MAINTENANCE_MODE',
    enabled: true,
    reason: 'x',
  });

  assert.equal(invalid.success, false);
  assert.ok(invalid.errors.length > 0);
  const mapped = validationErrorsToActionResult(invalid, 'trace-validators-1');
  assert.equal(mapped.ok, false);
  assert.equal(mapped.code, 'VALIDATION_ERROR');
  assert.equal(mapped.traceId, 'trace-validators-1');
  assert.match(mapped.message, /Reason is required|too long/i);
});
