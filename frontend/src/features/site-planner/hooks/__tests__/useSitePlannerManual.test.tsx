import { renderHook, act } from '@testing-library/react';
import { useSitePlanner } from '../useSitePlanner';
import { DeviceType } from '@tesla/shared';
import { SitePlannerProvider } from '../../context/SitePlannerContext';

describe('useSitePlanner Manual Layout Integration', () => {
  it('should enter manual mode and backup the initial layout', () => {
    const { result } = renderHook(() => useSitePlanner(), { wrapper: SitePlannerProvider });
    
    act(() => {
      result.current.updateCount(DeviceType.MEGAPACK_XL, 1);
    });

    const initialDevices = result.current.devices;
    
    act(() => {
      // Toggle manual mode on
      result.current.toggleManualMode(true, initialDevices);
    });

    expect(result.current.isManualMode).toBe(true);
    expect(result.current.hasCustomLayout).toBe(true);
    expect(result.current.devices).toEqual(initialDevices);
  });

  it('should update device positions in manual mode', () => {
    const { result } = renderHook(() => useSitePlanner(), { wrapper: SitePlannerProvider });
    
    act(() => {
      result.current.updateCount(DeviceType.MEGAPACK_XL, 1);
    });

    const devices = result.current.devices;
    const targetId = devices[0].id;
    
    act(() => {
      result.current.toggleManualMode(true, devices);
      result.current.updateDevicePosition(targetId, 50, 50);
    });

    const updated = result.current.devices.find(d => d.id === targetId);
    expect(updated?.x).toBe(50);
    expect(updated?.y).toBe(50);
  });

  it('should revert manual changes using the backup', () => {
    const { result } = renderHook(() => useSitePlanner(), { wrapper: SitePlannerProvider });
    
    act(() => {
      result.current.updateCount(DeviceType.MEGAPACK_XL, 1);
    });

    const initialDevices = result.current.devices;
    const targetId = initialDevices[0].id;
    
    act(() => {
      result.current.toggleManualMode(true, initialDevices);
      result.current.updateDevicePosition(targetId, 999, 999);
    });

    expect(result.current.devices[0].x).toBe(999);

    act(() => {
      result.current.revertManualLayout();
    });

    expect(result.current.devices[0].x).toBe(initialDevices[0].x);
  });

  it('should add a new device manually and increment counts', () => {
    const { result } = renderHook(() => useSitePlanner(), { wrapper: SitePlannerProvider });
    
    act(() => {
      result.current.updateCount(DeviceType.MEGAPACK_XL, 1);
    });

    act(() => {
      result.current.toggleManualMode(true, result.current.devices);
      // Add a 2nd Megapack XL at (100, 100)
      result.current.addManualDevice(DeviceType.MEGAPACK_XL, 100, 100);
    });

    expect(result.current.counts[DeviceType.MEGAPACK_XL]).toBe(2);
    expect(result.current.devices.length).toBe(3); // 2 Batteries + 1 Transformer
    
    const newDevice = result.current.devices.find(d => d.x === 100);
    expect(newDevice?.type).toBe(DeviceType.MEGAPACK_XL);
  });

  it('should reset manual mode if counts are updated via sidebar', () => {
    const { result } = renderHook(() => useSitePlanner(), { wrapper: SitePlannerProvider });
    
    act(() => {
      result.current.updateCount(DeviceType.MEGAPACK_XL, 1);
      result.current.toggleManualMode(true, result.current.devices);
    });

    expect(result.current.hasCustomLayout).toBe(true);

    act(() => {
      // User changes counts from the sidebar
      result.current.updateCount(DeviceType.MEGAPACK_XL, 5);
    });

    expect(result.current.isManualMode).toBe(false);
    expect(result.current.hasCustomLayout).toBe(false);
  });
});
