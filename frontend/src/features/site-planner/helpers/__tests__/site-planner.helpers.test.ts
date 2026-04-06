import { DeviceType } from '@tesla/shared';
import { expandCountsToList, isLayoutManual } from '../site-planner.helpers';
import { DeviceCounts } from '../../types/site-planner.types';
import { packDevices } from '../../helpers/packing.helpers';


describe('Site Planner Helpers', () => {
  describe('expandCountsToList', () => {
    it('should expand battery counts and append appropriate transformer counts', () => {
      const counts: DeviceCounts = {
        [DeviceType.MEGAPACK_XL]: 2,
        [DeviceType.MEGAPACK_2]: 0,
        [DeviceType.MEGAPACK]: 1,
        [DeviceType.POWERPACK]: 0,
      };
      
      const list = expandCountsToList(counts);
      
      // 2 MPXL + 1 MP = 3 Batteries
      // ceil(3/2) = 2 Transformers
      expect(list.length).toBe(5);
      expect(list.filter(t => t === DeviceType.TRANSFORMER).length).toBe(2);
      expect(list[0]).toBe(DeviceType.MEGAPACK_XL);
      expect(list[4]).toBe(DeviceType.TRANSFORMER);
    });
  });

  describe('isLayoutManual', () => {
    const counts: DeviceCounts = {
      [DeviceType.MEGAPACK_XL]: 2,
      [DeviceType.MEGAPACK_2]: 0,
      [DeviceType.MEGAPACK]: 0,
      [DeviceType.POWERPACK]: 0,
    };

    it('should return false if the layout matches the auto-packed default', () => {
      // Dynamically generate the "correct" pack to ensure we match algorithm changes
      const baseline = packDevices(expandCountsToList(counts));
      const result = isLayoutManual(baseline, counts);
      expect(result).toBe(false);
    });

    it('should return true if even one device coordinate is modified', () => {
      const baseline = packDevices(expandCountsToList(counts));
      const modified = [...baseline];
      modified[0] = { ...modified[0], x: modified[0].x + 1 }; // Drift by 1ft
      
      const result = isLayoutManual(modified, counts);
      expect(result).toBe(true);
    });


    it('should return true if the device count differs from the input counts', () => {
      const devices = [
        { id: '1', type: DeviceType.MEGAPACK_XL, x: 0, y: 0 },
      ]; // Missing 1 MPXL and 1 TR
      
      const result = isLayoutManual(devices, counts);
      expect(result).toBe(true);
    });
  });
});
