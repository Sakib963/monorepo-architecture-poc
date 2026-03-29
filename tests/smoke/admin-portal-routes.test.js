const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const routesFile = path.join(__dirname, '../../apps/team-angular/src/app/app.routes.ts');
const source = fs.readFileSync(routesFile, 'utf8');

const requiredRoutes = ['dashboard', 'users', 'users/:id', 'approvals', 'flags', 'audit-logs'];

test('admin portal declares all required Phase 7 routes', () => {
  for (const route of requiredRoutes) {
    assert.match(source, new RegExp(`path:\\s*'${route.replace('/', '\\/')}'`));
  }
});

test('admin portal has fallback redirect to dashboard', () => {
  assert.match(source, /path:\s*'\*\*'\s*,\s*redirectTo:\s*'dashboard'/);
});
