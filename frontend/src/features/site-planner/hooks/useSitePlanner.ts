import { useMemo, useState, useCallback, useEffect } from 'react';
import { DeviceType, SiteDevice } from '@tesla/shared';

import { DeviceCounts } from '../types/site-planner.types';
import { packDevices, computeSiteStats } from '../helpers/packing.helpers';
import { useSitePlannerContext } from '../context/SitePlannerContext';
import { expandCountsToList } from '../helpers/site-planner.helpers';


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
    const allDevicesToPack = expandCountsToList(counts);
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
    // Align with latest requirement: 1 Transformer for every 2 batteries
    const required = Math.ceil((megapacks + powerpacks) / 2);
    
    const existingTransformers = currentDevices.filter(d => d.type === DeviceType.TRANSFORMER);
    const existingCount = existingTransformers.length;

    if (existingCount < required) {
      // Add missing transformer near the last added device to keep it in context
      const lastDevice = currentDevices[currentDevices.length - 1];
      const newId = `Transformer-${Date.now()}`;
      
      // Place it to the right of the last device, or below if it would be "outside"
      const newX = lastDevice.x + 40; 
      const newY = lastDevice.y;

      return [...currentDevices, { id: newId, type: DeviceType.TRANSFORMER, x: newX, y: newY }];
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
    // Use unified helper to generate the interleaved device types
    const allDevicesToPack = expandCountsToList(counts);

    // Calculate transformer count for stats (matching the expanded list)
    const transformerCount = allDevicesToPack.filter(t => t === DeviceType.TRANSFORMER).length;

    const packedDevices = packDevices(allDevicesToPack);
    const resolvedDevices = hasCustomLayout ? manualDevices : packedDevices;

    const stats = computeSiteStats(
      resolvedDevices, 
      allDevicesToPack.length - transformerCount, 
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
