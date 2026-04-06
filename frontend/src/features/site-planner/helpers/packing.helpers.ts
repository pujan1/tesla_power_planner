import { DeviceType, SiteDevice } from '@tesla/shared';
import { DEVICE_PROPERTIES } from '../constants/device.constants';
import { MAX_ROW_WIDTH_FT, DEVICE_GAP_FT } from '../constants/site-planner.constants';

/**
 * Packs an array of device types into a 2D grid layout using a
 * first-fit row-based bin packing algorithm.
 *
 * Devices are placed left-to-right in rows of `MAX_ROW_WIDTH_FT` width.
 * When a device doesn't fit in any existing row, a new row is created
 * below the last one with a `DEVICE_GAP_FT` vertical gap.
 *
 * @param allDevicesToPack - Ordered array of DeviceType values to place.
 * @returns Array of `SiteDevice` objects with computed `x` and `y` positions.
 *
 * @example
 * ```ts
 * const devices = packDevices([DeviceType.MEGAPACK, DeviceType.TRANSFORMER]);
 * // => [{ id: 'Megapack-0', type: 'Megapack', x: 0, y: 0 }, ...]
 * ```
 */
export const packDevices = (allDevicesToPack: DeviceType[]): SiteDevice[] => {
  const packedDevices: SiteDevice[] = [];
  const rows: { y: number; height: number; currentX: number }[] = [];

  allDevicesToPack.forEach((type, index) => {
    const props = DEVICE_PROPERTIES[type];

    // Find the first row where this device fits horizontally
    let targetRow = rows.find(r => r.currentX + props.width <= MAX_ROW_WIDTH_FT);

    if (!targetRow) {
      // Start a new row below the last one
      const lastRow = rows[rows.length - 1];
      const newY = lastRow ? lastRow.y + lastRow.height + DEVICE_GAP_FT : 0;

      targetRow = {
        y: newY,
        height: props.length,
        currentX: 0,
      };
      rows.push(targetRow);
    } else {
      // Update row height if this device is taller
      targetRow.height = Math.max(targetRow.height, props.length);
    }

    packedDevices.push({
      id: `${type}-${index}`,
      type,
      x: targetRow.currentX,
      y: targetRow.y,
    });

    targetRow.currentX += props.width + DEVICE_GAP_FT;
  });

  return packedDevices;
};

/**
 * Shape of the aggregate statistics computed from a packed site layout.
 */
export interface SiteStats {
  /** Total cost in USD of all placed devices. */
  totalCost: number;
  /** Net energy output in MWh (batteries positive, transformers negative). */
  totalEnergy: number;
  /** Total footprint area in square feet. */
  totalArea: number;
  /** Bounding dimensions of the packed layout in feet. */
  dimensions: { width: number; length: number };
  /** Number of auto-generated transformers. */
  transformerCount: number;
  /** Number of user-specified battery units. */
  batteryCount: number;
}

/**
 * Computes aggregate statistics from a packed device layout.
 *
 * @param packedDevices    - Array of placed `SiteDevice` objects.
 * @param totalBatteries   - Count of battery units (excluding transformers).
 * @param transformerCount - Count of auto-generated transformers.
 * @returns A `SiteStats` object with cost, energy, area, and dimension data.
 */
export const computeSiteStats = (
  packedDevices: SiteDevice[],
  totalBatteries: number,
  transformerCount: number
): SiteStats => {
  let totalCost = 0;
  let totalEnergy = 0;
  let maxWidthUsed = 0;
  let maxHeightUsed = 0;

  packedDevices.forEach(d => {
    const p = DEVICE_PROPERTIES[d.type];
    totalCost += p.cost;
    totalEnergy += p.energy;
    maxWidthUsed = Math.max(maxWidthUsed, d.x + p.width);
    maxHeightUsed = Math.max(maxHeightUsed, d.y + p.length);
  });

  return {
    totalCost,
    totalEnergy,
    totalArea: maxWidthUsed * maxHeightUsed,
    dimensions: { width: maxWidthUsed, length: maxHeightUsed },
    transformerCount,
    batteryCount: totalBatteries,
  };
};
