const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const flagsPageFile = path.join(__dirname, '../../apps/team-angular/src/app/pages/flags-page.component.ts');
const flagsPage = fs.readFileSync(flagsPageFile, 'utf8');

const userServiceFile = path.join(__dirname, '../../services/user-service/src/user.routes.ts');
const userService = fs.readFileSync(userServiceFile, 'utf8');

test('admin flag flow validates payload with shared schema', () => {
  assert.match(flagsPage, /validate\(toggleFeatureFlagActionSchema,/);
});

test('admin flag flow calls shared API client action', () => {
  assert.match(flagsPage, /this\.api\.toggleFeatureFlag\(/);
});

test('admin status and credential actions are gated server-side by maintenance flag', () => {
  assert.match(userService, /Status changes are disabled during maintenance/);
  assert.match(userService, /Credential resets are disabled during maintenance/);
});
