import { FEATURE_FLAGS } from './flags';
import type { FeatureFlags } from './flags';

/**
 * Read a feature flag by name.
 * TypeScript enforces the flag name at compile time — typos are caught immediately.
 *
 * @example
 *   if (getFlag('ORDER_PROMO_CODES')) { ... }
 */
export function getFlag(name: keyof FeatureFlags): boolean {
  return FEATURE_FLAGS[name];
}

/**
 * Check that ALL listed flags are enabled.
 * Useful for features that depend on multiple capabilities.
 *
 * @example
 *   if (allFlagsEnabled('USER_SELF_REGISTRATION', 'NOTIFY_SMS')) { ... }
 */
export function allFlagsEnabled(...names: Array<keyof FeatureFlags>): boolean {
  return names.every(n => FEATURE_FLAGS[n]);
}

/**
 * Check that AT LEAST ONE of the listed flags is enabled.
 */
export function anyFlagEnabled(...names: Array<keyof FeatureFlags>): boolean {
  return names.some(n => FEATURE_FLAGS[n]);
}

/**
 * Return all currently enabled flag names.
 * Useful for logging, diagnostics, and the POC showcase dashboard.
 */
export function getEnabledFlags(): Array<keyof FeatureFlags> {
  return (Object.keys(FEATURE_FLAGS) as Array<keyof FeatureFlags>).filter(k => FEATURE_FLAGS[k]);
}

/**
 * Return the full flags snapshot.
 * Use this to send current feature state to a client in a health-check or
 * bootstrap API response.
 */
export function getAllFlags(): Readonly<FeatureFlags> {
  return Object.freeze({ ...FEATURE_FLAGS });
}
