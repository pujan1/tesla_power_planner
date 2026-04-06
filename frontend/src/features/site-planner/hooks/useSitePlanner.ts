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
    const rows: { y: number; height: number; currentX: number }[] = [];
    const MAX_WIDTH = 100;

    allDevicesToPack.forEach((type, index) => {
      const props = DEVICE_PROPERTIES[type];
      
      // Find the first row where this device fits horizontally
      let targetRow = rows.find(r => r.currentX + props.width <= MAX_WIDTH);
      
      if (!targetRow) {
        // Start a new row below the last one
        const lastRow = rows[rows.length - 1];
        const newY = lastRow ? lastRow.y + lastRow.height + 10 : 0;
        
        targetRow = {
          y: newY,
          height: props.length,
          currentX: 0
        };
        rows.push(targetRow);
      } else {
        // If the NEW device is taller than current row max, we'd technically need to shift 
        // subsequent rows. But since all current equipment is 10ft, we'll keep it simple:
        targetRow.height = Math.max(targetRow.height, props.length);
      }

      packedDevices.push({
        id: `${type}-${index}`,
        type,
        x: targetRow.currentX,
        y: targetRow.y,
      });

      targetRow.currentX += props.width + 10;
    });

    // Calculate stats based on actual packed bounds
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

    const totalLengthUsed = maxHeightUsed;

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
