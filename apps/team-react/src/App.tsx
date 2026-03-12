import { useState, useEffect, useCallback } from 'react';
import type { User, FeatureFlags } from './types';
import type { FieldError } from '@poc/validators';
import { validate, createUserSchema } from './validation';
import { api } from './api';

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [flags, setFlags] = useState<Partial<FeatureFlags>>({});

  // Load flags once on mount — every component reads from this shared state
  useEffect(() => {
    api.getFlags()
      .then(f => setFlags(f))
      .catch(() => {/* gateway not yet up — keep empty defaults */});
  }, []);

  const dark        = !!flags.UI_DARK_MODE;
  const maintenance = !!flags.CORE_MAINTENANCE_MODE;

  return (
    <div className={`app${dark ? ' dark' : ''}`}>
      <header className="app-header">
        <h1>Team React App</h1>
        <span className="badge">React 18 + Vite</span>
        {dark && <span className="badge badge-dark">🌙 Dark Mode ON</span>}
        {maintenance && <span className="badge badge-maint">🔧 Maintenance</span>}
      </header>

      <div className="tag-row">
        <span className="tag">@poc/types</span>
        <span className="tag">@poc/validators</span>
        <span className="tag">@poc/api-client</span>
        <span className="tag">@poc/feature-flags</span>
      </div>

      {/* ── CORE_MAINTENANCE_MODE ─────────────────────────────────────────── */}
      {maintenance && (
        <div className="maintenance-banner">
          <span className="maint-icon">🔧</span>
          <div>
            <strong>Platform under maintenance — CORE_MAINTENANCE_MODE: true</strong>
            <p>Write operations are disabled. Read-only access is still available.</p>
            <code>packages/feature-flags/src/flags.ts → CORE_MAINTENANCE_MODE: false to restore</code>
          </div>
        </div>
      )}

      {/* ── USER_SELF_REGISTRATION gates the create-user form ─────────────── */}
      {flags.USER_SELF_REGISTRATION !== false ? (
        <CreateUserForm disabled={maintenance} />
      ) : (
        <div className="card flag-blocked">
          <span className="flag-blocked-icon">🚫</span>
          <div>
            <strong>USER_SELF_REGISTRATION: OFF — Create User form is hidden</strong>
            <p>Set <code>USER_SELF_REGISTRATION: true</code> in <code>packages/feature-flags/src/flags.ts</code> to re-enable.</p>
          </div>
        </div>
      )}

      {/* ── User list (flags control layout + columns) ────────────────────── */}
      <UserList flags={flags} />

      {/* ── Feature flags panel ───────────────────────────────────────────── */}
      <FeatureFlagsPanel flags={flags} onLoad={setFlags} />

      {/* ── UI_QUICK_ACTIONS_BAR — floating toolbar ───────────────────────── */}
      {flags.UI_QUICK_ACTIONS_BAR && (
        <div className="quick-actions-bar">
          <span className="qa-label">⚡ Quick Actions</span>
          <button className="qa-btn" disabled={maintenance}>+ User</button>
          <button className="qa-btn">📋 Export</button>
          <button className="qa-btn">🔔 Notify</button>
          <span className="qa-flag">UI_QUICK_ACTIONS_BAR: ON</span>
        </div>
      )}
    </div>
  );
}

// ── Create User Form ──────────────────────────────────────────────────────────

function CreateUserForm({ disabled }: { disabled?: boolean }) {
  const [fields, setFields] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  function set(k: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setFields(prev => ({ ...prev, [k]: e.target.value }));
      setErrors(prev => { const n = { ...prev }; delete n[k]; return n; });
    };
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (disabled) return;
    setStatus(null);

    // ── CLIENT-SIDE VALIDATION using @poc/validators ────────────────────────
    // The EXACT same Zod schema runs here in the browser AND in user-service.
    // If the schema changes, both sides stay in sync automatically.
    const result = validate(createUserSchema, fields);
    if (!result.success) {
      const map: Record<string, string> = {};
      result.errors.forEach((err: FieldError) => { map[err.field] = err.message; });
      setErrors(map);
      return;
    }

    setLoading(true);
    try {
      await api.createUser(result.data!);
      setStatus({ type: 'success', text: `✅ User "${fields.firstName} ${fields.lastName}" created! Same Zod schema validated both client + server.` });
      setFields({ email: '', password: '', firstName: '', lastName: '' });
    } catch (err: unknown) {
      setStatus({ type: 'error', text: err instanceof Error ? err.message : 'Create failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Create User — Shared Validation (<code>@poc/validators</code>)</h2>
      <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '1rem' }}>
        Client-side Zod schema = server-side schema. Zero duplication.{' '}
        Password requires: <strong>8+ chars · 1 uppercase · 1 number · 1 symbol</strong>
        {disabled && <span style={{ color: '#c53030', marginLeft: '0.5rem' }}>⚠️ Disabled — maintenance mode</span>}
      </p>

      {status && <div className={`alert alert-${status.type}`}>{status.text}</div>}

      <form onSubmit={submit} style={{ opacity: disabled ? 0.6 : 1 }}>
        <div className="form-grid">
          <div className="field">
            <label>First Name</label>
            <input value={fields.firstName} onChange={set('firstName')} disabled={disabled}
              className={errors.firstName ? 'error' : ''} placeholder="Alice" />
            {errors.firstName && <span className="err">{errors.firstName}</span>}
          </div>
          <div className="field">
            <label>Last Name</label>
            <input value={fields.lastName} onChange={set('lastName')} disabled={disabled}
              className={errors.lastName ? 'error' : ''} placeholder="Chen" />
            {errors.lastName && <span className="err">{errors.lastName}</span>}
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={fields.email} onChange={set('email')} disabled={disabled}
              className={errors.email ? 'error' : ''} placeholder="alice@example.com" />
            {errors.email && <span className="err">{errors.email}</span>}
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={fields.password} onChange={set('password')} disabled={disabled}
              className={errors.password ? 'error' : ''} placeholder="e.g. Secret1!" />
            {errors.password && <span className="err">{errors.password}</span>}
          </div>
        </div>
        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={loading || disabled}>
            {loading ? 'Creating…' : 'Create User'}
          </button>
          {disabled && <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>Unlock: set CORE_MAINTENANCE_MODE: false</span>}
        </div>
      </form>
    </div>
  );
}

// ── User List ─────────────────────────────────────────────────────────────────

function UserList({ flags }: { flags: Partial<FeatureFlags> }) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getUsers();
      setUsers(result.items);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const bulkOps  = !!flags.ORDER_BULK_OPERATIONS;
  const cardView = !!flags.UI_NEW_DASHBOARD_LAYOUT;
  const avatars  = !!flags.USER_PROFILE_PICTURE;

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h2 style={{ margin: 0 }}>Users — <code>@poc/types</code></h2>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {cardView  && <span className="flag-badge flag-on-badge">📊 UI_NEW_DASHBOARD_LAYOUT</span>}
          {bulkOps   && <span className="flag-badge flag-on-badge">☑️ ORDER_BULK_OPERATIONS</span>}
          {avatars   && <span className="flag-badge flag-on-badge">🖼 USER_PROFILE_PICTURE</span>}
          <button className="btn btn-ghost" onClick={load} disabled={loading}>↻ Refresh</button>
        </div>
      </div>

      {bulkOps && selected.size > 0 && (
        <div className="bulk-actions-bar">
          <span>{selected.size} user(s) selected</span>
          <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>Suspend selected</button>
          <button className="btn btn-ghost" style={{ fontSize: '0.8rem', color: '#c53030' }}>Delete selected</button>
          <button className="btn btn-ghost" style={{ fontSize: '0.8rem' }} onClick={() => setSelected(new Set())}>Clear</button>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading users…</div>
      ) : cardView ? (
        /* ── UI_NEW_DASHBOARD_LAYOUT: card grid ────────────────────────────── */
        <div className="user-card-grid">
          {users.map(u => (
            <div key={u.id} className="user-card">
              {avatars && (
                <div className="avatar">{u.firstName[0]}{u.lastName[0]}</div>
              )}
              <div className="user-card-info">
                <strong>{u.firstName} {u.lastName}</strong>
                <span className="user-card-email">{u.email}</span>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem' }}>
                  <span className={`role-badge role-${u.role.toLowerCase()}`}>{u.role}</span>
                  <span className={`status-dot dot-${u.status.toLowerCase()}`}></span>
                  <span style={{ fontSize: '0.75rem', color: '#718096' }}>{u.status}</span>
                </div>
              </div>
              {bulkOps && (
                <input type="checkbox" className="bulk-check"
                  checked={selected.has(u.id)} onChange={() => toggleSelect(u.id)} />
              )}
            </div>
          ))}
        </div>
      ) : (
        /* ── Default table layout ─────────────────────────────────────────── */
        <table className="user-table">
          <thead>
            <tr>
              {bulkOps && <th style={{ width: '2rem' }}></th>}
              {avatars && <th style={{ width: '2.5rem' }}></th>}
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className={selected.has(u.id) ? 'row-selected' : ''}>
                {bulkOps && (
                  <td>
                    <input type="checkbox" checked={selected.has(u.id)} onChange={() => toggleSelect(u.id)} />
                  </td>
                )}
                {avatars && (
                  <td>
                    <div className="avatar avatar-sm">{u.firstName[0]}{u.lastName[0]}</div>
                  </td>
                )}
                <td>{u.firstName} {u.lastName}</td>
                <td>{u.email}</td>
                <td><span className={`role-badge role-${u.role.toLowerCase()}`}>{u.role}</span></td>
                <td>
                  <span className={`status-dot dot-${u.status.toLowerCase()}`}></span>
                  {u.status}
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── Feature Flags Panel ───────────────────────────────────────────────────────

const FLAG_EFFECTS: Partial<Record<keyof FeatureFlags, string>> = {
  CORE_MAINTENANCE_MODE:    'Red banner, disables write ops',
  USER_SELF_REGISTRATION:   'Show/hide Create User form',
  USER_ROLE_MANAGER_ENABLED:'Show/hide MANAGER badges (Angular)',
  USER_PROFILE_PICTURE:     'Show avatar initials in user rows',
  ORDER_BULK_OPERATIONS:    'Add checkbox column + bulk-action bar',
  UI_DARK_MODE:             'Apply .dark class to root element',
  UI_NEW_DASHBOARD_LAYOUT:  'Switch user list to card grid',
  UI_QUICK_ACTIONS_BAR:     'Floating quick-actions toolbar',
};

function FeatureFlagsPanel({
  flags,
  onLoad,
}: {
  flags: Partial<FeatureFlags>;
  onLoad: (f: Partial<FeatureFlags>) => void;
}) {
  const [loading, setLoading] = useState(Object.keys(flags).length === 0);

  useEffect(() => {
    if (Object.keys(flags).length > 0) { setLoading(false); return; }
    api.getFlags()
      .then(f => { onLoad(f); setLoading(false); })
      .catch(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card">
      <h2>Feature Flags — <code>@poc/feature-flags</code> via api-gateway</h2>
      <p style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '1rem' }}>
        Toggle flags in <code>packages/feature-flags/src/flags.ts</code> and restart the gateway. Each flag below lists its <strong>actual UI effect</strong> in this app.
      </p>
      {loading ? (
        <div className="loading">Loading flags…</div>
      ) : (
        <div className="flag-grid">
          {(Object.entries(flags) as [keyof FeatureFlags, boolean][]).map(([k, v]) => (
            <div key={k} className={`flag-item${v ? ' flag-item-on' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{k}</span>
                <span className={v ? 'flag-on' : 'flag-off'}>{v ? 'ON' : 'OFF'}</span>
              </div>
              {FLAG_EFFECTS[k] && (
                <div style={{ fontSize: '0.7rem', color: '#718096', marginTop: '0.2rem' }}>
                  {v ? '↳ ' : '✗ '}{FLAG_EFFECTS[k]}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

