import { SiteDevice } from '@tesla/shared';
import { DEVICE_PROPERTIES } from '../constants/device.constants';

/** Mandatory minimum separation distance in feet between devices. */
const MIN_SAFE_GAP_FT = 5;


/**
 * Checks for intersections (overlaps) between all devices in the layout.
 * Uses Axis-Aligned Bounding Box (AABB) intersection detection.
 *
 * @param devices - Array of SiteDevice objects to check.
 * @returns A Set of device IDs that are currently overlapping with at least one other device.
 */
export const checkIntersections = (devices: SiteDevice[]): Set<string> => {
  const invalidIds = new Set<string>();

  for (let i = 0; i < devices.length; i++) {
    for (let j = i + 1; j < devices.length; j++) {
      const d1 = devices[i];
      const d2 = devices[j];
      const p1 = DEVICE_PROPERTIES[d1.type as keyof typeof DEVICE_PROPERTIES];
      const p2 = DEVICE_PROPERTIES[d2.type as keyof typeof DEVICE_PROPERTIES];

      const overlap = 
        d1.x < d2.x + p2.width + MIN_SAFE_GAP_FT &&
        d1.x + p1.width + MIN_SAFE_GAP_FT > d2.x &&
        d1.y < d2.y + p2.length + MIN_SAFE_GAP_FT &&
        d1.y + p1.length + MIN_SAFE_GAP_FT > d2.y;

      if (overlap) {
        invalidIds.add(d1.id);
        invalidIds.add(d2.id);
      }

    }
  }

  return invalidIds;
};

/**
 * Snaps a coordinate value to the nearest grid increment.
 *
 * @param value    - The raw coordinate value (in feet).
 * @param gridSize - The grid step size (in feet, e.g., 5).
 * @returns The snapped value.
 */
export const snapToGrid = (value: number, gridSize: number): number => {
  const result = Math.round(value / gridSize) * gridSize;
  return result === 0 ? 0 : result; // Prevent -0
};

