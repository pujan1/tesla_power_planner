import { useMemo, useState, useCallback, useEffect } from 'react';
import { DeviceType, SiteDevice } from '@tesla/shared';

import { DeviceCounts } from '../types/site-planner.types';
import { packDevices, computeSiteStats } from '../helpers/packing.helpers';
import { useSitePlannerContext } from '../context/SitePlannerContext';


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

  const { isManualMode, setIsManualMode } = useSitePlannerContext();
  const [manualDevices, setManualDevices] = useState<SiteDevice[]>([]);

  const [originalManualLayout, setOriginalManualLayout] = useState<SiteDevice[]>([]);
  const [hasCustomLayout, setHasCustomLayout] = useState(false);




  /**
   * Updates the count for a specific battery device type.
   * Clamps the value to a minimum of 0.
   *
   * @param type  - The `DeviceCounts` key to update.
   * @param count - The new count value (will be clamped to ≥ 0).
   */
  const updateCount = useCallback((type: keyof DeviceCounts, count: number) => {
    setCounts(prev => ({ ...prev, [type]: Math.max(0, count) }));
    setHasCustomLayout(false); // Reset to auto if counts change manually via sidebar
    setIsManualMode(false);
  }, []);


  /**
   * Toggles manual editing mode.
   * Copies current auto-packed positions to manual state when entering.
   */
  const toggleManualMode = useCallback((active: boolean, initialDevices?: SiteDevice[]) => {
    if (active && initialDevices) {
      setManualDevices([...initialDevices]);
      setOriginalManualLayout([...initialDevices]);
      setHasCustomLayout(true);
    }
    setIsManualMode(active);
  }, []);


  /**
   * Reverts manual layout to its state when the edit session began.
   */
  const revertManualLayout = useCallback(() => {
    setManualDevices([...originalManualLayout]);
  }, [originalManualLayout]);

  /**
   * Resets manual layout to a clean auto-packed arrangement.
   */
  const autoArrangeLayout = useCallback(() => {
    const batteryList: DeviceType[] = [];
    Object.entries(counts).forEach(([type, count]) => {
      for (let i = 0; i < count; i++) {
        batteryList.push(type as DeviceType);
      }
    });

    const totalBatteries = batteryList.length;
    const transformerCount = Math.ceil(totalBatteries / 2);
    const allDevicesToPack: DeviceType[] = [...batteryList];
    for (let i = 0; i < transformerCount; i++) {
      allDevicesToPack.push(DeviceType.TRANSFORMER);
    }

    setManualDevices(packDevices(allDevicesToPack));
  }, [counts]);

  /**
   * Automatically synchronizes transformer counts with battery deployment.
   * Requirement: 1 Transformer per 4 Megapacks OR 16 Powerpacks (weighted).
   */
  const syncTransformers = useCallback((currentDevices: SiteDevice[]) => {
    const megapacks = currentDevices.filter(d => 
      d.type === DeviceType.MEGAPACK_XL || 
      d.type === DeviceType.MEGAPACK_2 || 
      d.type === DeviceType.MEGAPACK
    ).length;
    const powerpacks = currentDevices.filter(d => d.type === DeviceType.POWERPACK).length;
    const required = Math.ceil(megapacks / 4 + powerpacks / 16);
    
    const existingTransformers = currentDevices.filter(d => d.type === DeviceType.TRANSFORMER);
    const existingCount = existingTransformers.length;

    if (existingCount < required) {
      // Add missing transformer at bottom right of current bounds
      const maxX = Math.max(...currentDevices.map(d => d.x), 50);
      const maxY = Math.max(...currentDevices.map(d => d.y), 0);
      const newId = `${DeviceType.TRANSFORMER}-${Date.now()}`;
      return [...currentDevices, { id: newId, type: DeviceType.TRANSFORMER, x: maxX + 10, y: maxY }];
    } else if (existingCount > required) {
      // Remove excess transformer (last one added)
      const lastTransformer = existingTransformers[existingCount - 1];
      return currentDevices.filter(d => d.id !== lastTransformer.id);
    }
    return currentDevices;
  }, []);


  /**
   * Appends a new battery to the layout manual.
   * Increments the global device counts and triggers transformer sync.
   */
  const addManualDevice = useCallback((type: DeviceType, x: number, y: number) => {
    if (type === DeviceType.TRANSFORMER) return; // Prevent manual transformer addition

    // 1. Update count
    setCounts(prev => ({ ...prev, [type]: prev[type as keyof DeviceCounts] + 1 }));

    // 2. Add battery + Sync Transformers
    const newId = `${type}-${Date.now()}`;
    setManualDevices(prev => {
      const nextDevices = [...prev, { id: newId, type, x, y }];
      return syncTransformers(nextDevices);
    });
  }, [syncTransformers]);

  /**
   * Removes a specific device from the manual layout.
   * Decrements corresponding global counts and triggers transformer sync.
   */
  const removeManualDevice = useCallback((id: string) => {
    const target = manualDevices.find(d => d.id === id);
    if (!target || target.type === DeviceType.TRANSFORMER) return; // Block manual removal of transformers

    // 1. Decrement count
    setCounts(prev => ({ 
      ...prev, 
      [target.type as keyof DeviceCounts]: Math.max(0, prev[target.type as keyof DeviceCounts] - 1) 
    }));

    // 2. Remove battery + Sync Transformers
    setManualDevices(prev => {
      const nextDevices = prev.filter(d => d.id !== id);
      return syncTransformers(nextDevices);
    });
  }, [manualDevices, syncTransformers]);




  /**
   * Updates the position of a specific device in manual mode.
   */
  const updateDevicePosition = useCallback((id: string, x: number, y: number) => {
    setManualDevices(prev => 
      prev.map(d => d.id === id ? { ...d, x, y } : d)
    );
  }, []);


  const { devices, stats } = useMemo(() => {
    // Expand counts into an ordered list of battery device types
    const batteryList: DeviceType[] = [];
    Object.entries(counts).forEach(([type, count]) => {
      for (let i = 0; i < count; i++) {
        batteryList.push(type as DeviceType);
      }
    });

    const megapacks = batteryList.filter(type => 
      type === DeviceType.MEGAPACK_XL || 
      type === DeviceType.MEGAPACK_2 || 
      type === DeviceType.MEGAPACK
    ).length;
    const powerpacks = batteryList.filter(type => type === DeviceType.POWERPACK).length;
    const transformerCount = Math.ceil(megapacks / 4 + powerpacks / 16);


    // Append auto-generated transformers
    const allDevicesToPack: DeviceType[] = [...batteryList];
    for (let i = 0; i < transformerCount; i++) {
      allDevicesToPack.push(DeviceType.TRANSFORMER);
    }

    const packedDevices = packDevices(allDevicesToPack);
    const resolvedDevices = hasCustomLayout ? manualDevices : packedDevices;

    const stats = computeSiteStats(
      resolvedDevices, 
      batteryList.length, 
      transformerCount
    );

    
    return { 
      devices: resolvedDevices, 
      stats 
    };
  }, [counts, isManualMode, manualDevices, hasCustomLayout]);


  return {
    counts,
    updateCount,
    toggleManualMode,
    updateDevicePosition,
    revertManualLayout,
    autoArrangeLayout,
    addManualDevice,
    removeManualDevice,
    setHasCustomLayout,
    devices,

    stats,
    isManualMode,
    hasCustomLayout,
  };
};
