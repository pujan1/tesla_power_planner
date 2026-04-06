/**
 * @module packing.test
 * Integration tests for the packing algorithm via useSitePlanner hook.
 * Verifies that devices are correctly placed in rows, handle row transitions,
 * and fill gaps based on available space.
 */
import { renderHook, act } from '@testing-library/react';
import { useSitePlanner } from '../useSitePlanner';
import { DeviceType } from '@tesla/shared';
import { SitePlannerProvider } from '../../context/SitePlannerContext';

describe('useSitePlanner Packing Optimization', () => {
  it('should optimize 4 Megapacks and 2 Transformers into 2 rows', () => {
    const { result } = renderHook(() => useSitePlanner(), { wrapper: SitePlannerProvider });
    
    act(() => {
      // 4 Megapacks (30ft each)
      result.current.updateCount(DeviceType.MEGAPACK, 4);
    });

    const devices = result.current.devices;
    
    // Total batteries = 4, so Transformers = ceil(4 / 2) = 2
    expect(result.current.stats.batteryCount).toBe(4);
    expect(result.current.stats.transformerCount).toBe(2);
    expect(result.current.devices.length).toBe(6);

    // Filter by type
    const mps = devices.filter(d => d.type === DeviceType.MEGAPACK);
    const trs = devices.filter(d => d.type === DeviceType.TRANSFORMER);

    // With 1:2 interspersed logic: [TR1, MP1, MP2, TR2, MP3, MP4]
    // Row 1 (y=0): TR1 (x=0), MP1 (x=20), MP2 (x=60) -> Total width: 100
    // Row 2 (y=20): TR2 (x=0), MP3 (x=20), MP4 (x=60)

    const rowOffsets = Array.from(new Set(devices.map(d => d.y))).sort((a, b) => a - b);
    expect(rowOffsets.length).toBe(2);
    
    // Verify that the first device is a Transformer
    expect(devices[0].type).toBe(DeviceType.TRANSFORMER);
    expect(devices[0].x).toBe(0);
    expect(devices[0].y).toBe(0);

    // Verify that the fourth device is the second Transformer (interspersed every 2 batteries)
    expect(devices[3].type).toBe(DeviceType.TRANSFORMER);
    expect(devices[3].y).toBe(20);
  });


  it('should intersperse transformers every 2 units', () => {
    const { result } = renderHook(() => useSitePlanner(), { wrapper: SitePlannerProvider });
    
    act(() => {
      // 3 Megapacks -> should trigger 2 Transformers
      result.current.updateCount(DeviceType.MEGAPACK, 3);
    });

    // Strategy: [T1, MP1, MP2, T2, MP3]
    expect(result.current.stats.transformerCount).toBe(2);
    
    const devices = result.current.devices;
    expect(devices[0].type).toBe(DeviceType.TRANSFORMER); // 1st T
    expect(devices[3].type).toBe(DeviceType.TRANSFORMER); // 2nd T (after 2 batteries)
  });
});
