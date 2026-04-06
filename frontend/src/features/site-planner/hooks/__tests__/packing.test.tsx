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
    
    // Total batteries = 4, so Transformers = ceil(4/2) = 2
    expect(result.current.stats.batteryCount).toBe(4);
    expect(result.current.stats.transformerCount).toBe(2);
    expect(devices.length).toBe(6);

    // Filter by type
    const mps = devices.filter(d => d.type === DeviceType.MEGAPACK);
    const trs = devices.filter(d => d.type === DeviceType.TRANSFORMER);

    // Row 1 (y=0): MP1, MP2, TR1, TR2
    // MP1: x=0, MP2: x=40, TR1: x=80, TR2: x=90
    // Row 2 (y=20): MP3, MP4
    // MP3: x=0, MP4: x=40

    const rowOffsets = Array.from(new Set(devices.map(d => d.y))).sort((a, b) => a - b);
    
    // BUG REPRODUCTION: Currently this might be 3 rows
    expect(rowOffsets.length).toBeLessThanOrEqual(2);
    
    // Verify that the 2nd Transformer is NOT on a 3rd row
    const lastTR = trs[1];
    expect(lastTR.y).toBeLessThan(40); // 40 would be Row 3 (0 + 20 + 20)
  });

  it('should fill gaps in earlier rows with smaller units (First-Fit)', () => {
    const { result } = renderHook(() => useSitePlanner(), { wrapper: SitePlannerProvider });
    
    act(() => {
      // Megapack (30ft)
      result.current.updateCount(DeviceType.MEGAPACK, 1);
      // Powerpack (10ft)
      result.current.updateCount(DeviceType.POWERPACK, 1);
    });

    // 1nd Battery (MP): x=0, nextX=40
    // 2nd Battery (PP): x=40, nextX=60
    // Transformers (ceil(2/2) = 1): x=60, nextX=80
    // All 3 should be on Row 1 (80 <= 100)

    const row1Devices = result.current.devices.filter(d => d.y === 0);
    expect(row1Devices.length).toBe(3); 
  });
});
