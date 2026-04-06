import { useMemo, useState, useCallback } from 'react';
import { DeviceType, SiteDevice } from '@tesla/shared';

import { DEVICE_PROPERTIES } from '../constants/device.constants';
import { DeviceCounts } from '../types/site-planner.types';

export const useSitePlanner = () => {
  const [counts, setCounts] = useState<DeviceCounts>({
    [DeviceType.MEGAPACK_XL]: 0,
    [DeviceType.MEGAPACK_2]: 0,
    [DeviceType.MEGAPACK]: 0,
    [DeviceType.POWERPACK]: 0,
  });

  const updateCount = useCallback((type: keyof DeviceCounts, count: number) => {
    setCounts(prev => ({ ...prev, [type]: Math.max(0, count) }));
  }, []);

  const { devices, stats } = useMemo(() => {
    const batteryList: DeviceType[] = [];
    Object.entries(counts).forEach(([type, count]) => {
      for (let i = 0; i < count; i++) {
        batteryList.push(type as DeviceType);
      }
    });

    const totalBatteries = batteryList.length;
    const transformerCount = Math.ceil(totalBatteries / 2);
    
    // Create full list of devices to pack
    const allDevicesToPack: DeviceType[] = [...batteryList];
    for (let i = 0; i < transformerCount; i++) {
      allDevicesToPack.push(DeviceType.TRANSFORMER);
    }

    const packedDevices: SiteDevice[] = [];
    let currentX = 0;
    let currentY = 0;
    let maxRowHeight = 0;
    const MAX_WIDTH = 100;

    allDevicesToPack.forEach((type, index) => {
      const props = DEVICE_PROPERTIES[type];
      
      // If adding this device exceeds 100ft, start a new row
      if (currentX + props.width > MAX_WIDTH) {
        currentX = 0;
        currentY += maxRowHeight + 10; // 10ft safety gap between rows
        maxRowHeight = 0;
      }

      packedDevices.push({
        id: `${type}-${index}`,
        type,
        x: currentX,
        y: currentY,
      });

      currentX += props.width + 10; // 10ft safety gap between hardware units
      maxRowHeight = Math.max(maxRowHeight, props.length);
    });

    // Calculate stats
    let totalCost = 0;
    let totalEnergy = 0;
    let maxWidthUsed = 0;
    let totalLengthUsed = currentY + maxRowHeight;

    packedDevices.forEach(d => {
      const p = DEVICE_PROPERTIES[d.type];
      totalCost += p.cost;
      totalEnergy += p.energy;
      maxWidthUsed = Math.max(maxWidthUsed, d.x + p.width);
    });

    return {
      devices: packedDevices,
      stats: {
        totalCost,
        totalEnergy,
        totalArea: maxWidthUsed * totalLengthUsed,
        dimensions: { width: maxWidthUsed, length: totalLengthUsed },
        transformerCount,
        batteryCount: totalBatteries
      }
    };
  }, [counts]);

  return {
    counts,
    updateCount,
    devices,
    stats
  };
};
