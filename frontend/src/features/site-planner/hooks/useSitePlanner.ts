import { useMemo, useState, useCallback } from 'react';
import { DeviceType } from '@tesla/shared';

import { DeviceCounts } from '../types/site-planner.types';
import { packDevices, computeSiteStats } from '../helpers/packing.helpers';

/**
 * Core state management hook for the site planner.
 *
 * Manages device counts, runs the packing algorithm, and computes
 * aggregate statistics whenever counts change.
 *
 * @returns An object containing:
 *  - `counts`      — Current `DeviceCounts` for each battery type.
 *  - `updateCount` — Callback to update the count for a specific device type.
 *  - `devices`     — Array of `SiteDevice` objects with computed positions.
 *  - `stats`       — Aggregate `SiteStats` (cost, energy, area, dimensions).
 *
 * @example
 * ```tsx
 * const { counts, updateCount, devices, stats } = useSitePlanner();
 * updateCount(DeviceType.MEGAPACK, 3);
 * ```
 */
export const useSitePlanner = () => {
  const [counts, setCounts] = useState<DeviceCounts>({
    [DeviceType.MEGAPACK_XL]: 0,
    [DeviceType.MEGAPACK_2]: 0,
    [DeviceType.MEGAPACK]: 0,
    [DeviceType.POWERPACK]: 0,
  });

  /**
   * Updates the count for a specific battery device type.
   * Clamps the value to a minimum of 0.
   *
   * @param type  - The `DeviceCounts` key to update.
   * @param count - The new count value (will be clamped to ≥ 0).
   */
  const updateCount = useCallback((type: keyof DeviceCounts, count: number) => {
    setCounts(prev => ({ ...prev, [type]: Math.max(0, count) }));
  }, []);

  const { devices, stats } = useMemo(() => {
    // Expand counts into an ordered list of battery device types
    const batteryList: DeviceType[] = [];
    Object.entries(counts).forEach(([type, count]) => {
      for (let i = 0; i < count; i++) {
        batteryList.push(type as DeviceType);
      }
    });

    const totalBatteries = batteryList.length;
    const transformerCount = Math.ceil(totalBatteries / 2);

    // Append auto-generated transformers
    const allDevicesToPack: DeviceType[] = [...batteryList];
    for (let i = 0; i < transformerCount; i++) {
      allDevicesToPack.push(DeviceType.TRANSFORMER);
    }

    const packedDevices = packDevices(allDevicesToPack);
    const stats = computeSiteStats(packedDevices, totalBatteries, transformerCount);

    return { devices: packedDevices, stats };
  }, [counts]);

  return {
    counts,
    updateCount,
    devices,
    stats,
  };
};
