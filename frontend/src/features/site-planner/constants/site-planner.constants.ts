/**
 * @module site-planner.constants
 * Domain constants for the site planner feature.
 */

/** Maximum total units (batteries + transformers) allowed before triggering the sales modal. */
export const MAX_TOTAL_UNITS = 50;

/** Default site layout ID used when only one layout is supported. */
export const DEFAULT_SITE_ID = 'main-layout';

/** Default site layout name for new saves. */
export const DEFAULT_SITE_NAME = 'My Energy Site';

/** Maximum row width in feet for the packing algorithm. */
export const MAX_ROW_WIDTH_FT = 100;

/** Safety gap in feet between devices during packing. */
export const DEVICE_GAP_FT = 10;
