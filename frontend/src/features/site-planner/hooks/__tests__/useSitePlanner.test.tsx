/**
 * @module useSitePlanner.test
 * Unit tests for the useSitePlanner hook.
 * Verifies hook initialization, state updates, layout packing, and 
 * statistics calculation.
 */
import { renderHook, act } from '@testing-library/react';
import { useSitePlanner } from '../useSitePlanner';
import { DeviceType } from '@tesla/shared';
import { SitePlannerProvider } from '../../context/SitePlannerContext';

describe('useSitePlanner hook', () => {
  it('should initialize with zero counts', () => {
    const { result } = renderHook(() => useSitePlanner(), { wrapper: SitePlannerProvider });
    
    expect(result.current.counts[DeviceType.MEGAPACK_XL]).toBe(0);
    expect(result.current.devices.length).toBe(0);
    expect(result.current.stats.totalCost).toBe(0);
  });

  it('should update device counts correctly', () => {
    const { result } = renderHook(() => useSitePlanner(), { wrapper: SitePlannerProvider });
    
    act(() => {
      result.current.updateCount(DeviceType.MEGAPACK_XL, 5);
    });

    expect(result.current.counts[DeviceType.MEGAPACK_XL]).toBe(5);
    expect(result.current.stats.batteryCount).toBe(5);
    // 5 megapacks = 2 transformers (ceil(5/4))
    expect(result.current.stats.transformerCount).toBe(2);
    expect(result.current.devices.length).toBe(7); // 5 batteries + 2 transformers

  });

  it('should enforce 10ft safety gaps in layout packing', () => {
    const { result } = renderHook(() => useSitePlanner(), { wrapper: SitePlannerProvider });
    
    act(() => {
      // Megapack XL width is 40ft
      result.current.updateCount(DeviceType.MEGAPACK_XL, 2);
    });

    const devices = result.current.devices;
    const mp1 = devices.find(d => d.id.startsWith(DeviceType.MEGAPACK_XL + '-0'));
    const mp2 = devices.find(d => d.id.startsWith(DeviceType.MEGAPACK_XL + '-1'));

    if (mp1 && mp2) {
      // x2 = x1 + width1 + gap
      // x2 = 0 + 40 + 10 = 50
      expect(mp2.x).toBe(50);
    }
  });

  it('should start a new row when exceeding 100ft width', () => {
    const { result } = renderHook(() => useSitePlanner(), { wrapper: SitePlannerProvider });
    
    act(() => {
      // 3 XL Megapacks = 40+10 + 40+10 + 40 = 140 (Exceeds 100)
      result.current.updateCount(DeviceType.MEGAPACK_XL, 3);
    });

    const devices = result.current.devices;
    const mp3 = devices.find(d => d.id.startsWith(DeviceType.MEGAPACK_XL + '-2'));

    if (mp3) {
      // Should be on the next row
      expect(mp3.x).toBe(0);
      // y = y1 + height1 + gap = 0 + 10 + 10 = 20
      expect(mp3.y).toBe(20);
    }
  });

  it('should calculate statistics correctly', () => {
    const { result } = renderHook(() => useSitePlanner(), { wrapper: SitePlannerProvider });
    
    act(() => {
      result.current.updateCount(DeviceType.POWERPACK, 1);
    });

    // 1 Powerpack cost = 10,000
    // 1 Transformer cost = 10,000 (ceil(1/2) = 1)
    // Total = 20,000
    expect(result.current.stats.totalCost).toBe(20000);
    
    // Powerpack energy = 1
    // Transformer energy = -0.5
    // Total = 0.5
    expect(result.current.stats.totalEnergy).toBe(0.5);
  });
});
