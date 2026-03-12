/**
 * Central feature flag registry.
 *
 * All flags are defined here — adding a flag means it immediately
 * appears as a typed key in every app, service, and test that imports
 * this package. Rename or remove a flag → TypeScript  error everywhere
 * that still references the old name.
 *
 * Flags are scoped so teams can own their own flags:
 *   - CORE_*  : Platform-wide, controlled by platform team
 *   - USER_*  : User service / user management features
 *   - ORDER_* : Order service / checkout features
 *   - NOTIFY_*: Notification service features
 *   - UI_*    : Frontend visual / UX experiments
 */

export interface FeatureFlags {
  // ── Core platform ──────────────────────────────────────────────────────────
  CORE_MAINTENANCE_MODE: boolean; // Take entire platform offline for maintenance
  CORE_AUDIT_LOGGING: boolean; // Persist every state mutation to audit log

  // ── User service ──────────────────────────────────────────────────────────
  USER_SELF_REGISTRATION: boolean; // Allow users to sign up without invitation
  USER_ROLE_MANAGER_ENABLED: boolean; // Show/hide the MANAGER role in admin UI
  USER_PROFILE_PICTURE: boolean; // Allow profile picture uploads

  // ── Order service ─────────────────────────────────────────────────────────
  ORDER_BULK_OPERATIONS: boolean; // Allow bulk order status changes
  ORDER_REAL_TIME_TRACKING: boolean; // Live order tracking via WebSocket
  ORDER_PROMO_CODES: boolean; // Promotional code redemption at checkout

  // ── Notifications ─────────────────────────────────────────────────────────
  NOTIFY_SMS: boolean; // SMS delivery channel
  NOTIFY_DIGEST_EMAIL: boolean; // Batch daily digest instead of per-event emails

  // ── UI / UX experiments ───────────────────────────────────────────────────
  UI_DARK_MODE: boolean; // Dark theme toggle
  UI_NEW_DASHBOARD_LAYOUT: boolean; // A/B test — new dashboard layout
  UI_QUICK_ACTIONS_BAR: boolean; // Floating quick-actions toolbar
}

/**
 * The single source of flag values.
 *
 * To toggle a feature across ALL apps and services: change it here.
 * No environment variables to sync, no per-app config files to update.
 */
export const FEATURE_FLAGS: FeatureFlags = {
  // Core platform
  CORE_MAINTENANCE_MODE: true,
  CORE_AUDIT_LOGGING: true,

  // User service
  USER_SELF_REGISTRATION: true,
  USER_ROLE_MANAGER_ENABLED: true,
  USER_PROFILE_PICTURE: true, // ← Not built yet, flag is already wired

  // Order service
  ORDER_BULK_OPERATIONS: true,
  ORDER_REAL_TIME_TRACKING: true, // ← In development
  ORDER_PROMO_CODES: false, // ← Planned Q3

  // Notifications
  NOTIFY_SMS: false, // ← Awaiting SMS provider contract
  NOTIFY_DIGEST_EMAIL: true,

  // UI
  UI_DARK_MODE: true,
  UI_NEW_DASHBOARD_LAYOUT: false, // ← A/B test, 0% rollout
  UI_QUICK_ACTIONS_BAR: true,
};
