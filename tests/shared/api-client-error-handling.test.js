const test = require('node:test');
const assert = require('node:assert/strict');

const {
  ApiClientError,
  mapApiErrorToActionResult,
} = require('../../dist/packages/api-client/src/index.js');

test('mapApiErrorToActionResult maps ApiClientError fields and traceId', () => {
  const error = new ApiClientError('HTTP 422', 422, {
    errors: [
      {
        code: 'VALIDATION_ERROR',
        message: 'Invalid transfer payload',
        details: { traceId: 'trace-api-422' },
      },
    ],
    statusCode: 422,
    path: '/transfers',
    timestamp: new Date().toISOString(),
  });

  const result = mapApiErrorToActionResult(error, 'fallback-trace');
  assert.equal(result.ok, false);
  assert.equal(result.code, 'VALIDATION_ERROR');
  assert.equal(result.message, 'Invalid transfer payload');
  assert.equal(result.traceId, 'trace-api-422');
});

test('mapApiErrorToActionResult falls back for generic errors', () => {
  const result = mapApiErrorToActionResult(new Error('Network down'), 'trace-fallback');
  assert.equal(result.ok, false);
  assert.equal(result.code, 'UNEXPECTED_ERROR');
  assert.equal(result.message, 'Network down');
  assert.equal(result.traceId, 'trace-fallback');
});
