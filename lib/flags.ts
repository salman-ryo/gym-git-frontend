/**
 * Central Feature Flags & Development Configuration
 *
 * This file is the single, authoritative source of truth for enabling or disabling feature flags.
 * Toggle the boolean flags directly below in FEATURE_FLAGS.
 */

export const FEATURE_FLAGS = {
  /**
   * Master switch for mock testing suite and simulated data.
   * - When true: Displays mock data testing toolbar and allows 365-day graph population.
   * - When false: Mock UI and mock logic are completely disabled; the dashboard displays only actual live data.
   */
  ENABLE_MOCK_DATA: false,

  /**
   * Automatically populate 365 days of mock workouts on dashboard load when ENABLE_MOCK_DATA is true.
   * - When true: Dashboard starts pre-filled with 365-day mock data (< 2h sessions).
   * - When false: Dashboard loads real data by default until user clicks the toolbar preview button.
   */
  AUTO_LOAD_MOCK_ON_STARTUP: false,
} as const;

/**
 * Direct boolean flag exports derived exclusively from FEATURE_FLAGS above.
 * No external environment variables or files can override these flags.
 */
export const enable_mock_data: boolean = FEATURE_FLAGS.ENABLE_MOCK_DATA;
export const auto_load_mock_on_startup: boolean = FEATURE_FLAGS.AUTO_LOAD_MOCK_ON_STARTUP;

export default FEATURE_FLAGS;
