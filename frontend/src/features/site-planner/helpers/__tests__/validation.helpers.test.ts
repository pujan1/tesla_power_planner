import { DeviceType } from '@tesla/shared';
import { checkIntersections, snapToGrid } from '../validation.helpers';

describe('Validation Helpers', () => {
  describe('snapToGrid', () => {
    it('should snap coordinates to the nearest multi-foot increment', () => {
      expect(snapToGrid(3.2, 5)).toBe(5);
      expect(snapToGrid(1.8, 5)).toBe(0);
      expect(snapToGrid(6, 5)).toBe(5);
      expect(snapToGrid(7.5, 5)).toBe(10);
      expect(snapToGrid(-1, 5)).toBe(0);
    });
  });

  describe('checkIntersections (AABB)', () => {
    const mpXL = { width: 40, length: 10 }; // Megapack XL properties
    
    it('should return an empty set when devices are properly spaced', () => {
      const devices: any[] = [
        { id: '1', type: DeviceType.MEGAPACK_XL, x: 0, y: 0 },
        { id: '2', type: DeviceType.MEGAPACK_XL, x: 50, y: 0 }, // 10ft gap
      ];
      
      const results = checkIntersections(devices);
      expect(results.size).toBe(0);
    });

    it('should identify both IDs if two devices overlap by 1 foot', () => {
      const devices: any[] = [
        { id: '1', type: DeviceType.MEGAPACK_XL, x: 0, y: 0 },
        { id: '2', type: DeviceType.MEGAPACK_XL, x: 44, y: 0 }, // 4ft gap (44 < 45)
      ];
      
      const results = checkIntersections(devices);
      expect(results.size).toBe(2);
    });

    it('should NOT allow edge-to-edge (0ft gap) contact', () => {
      const devices: any[] = [
        { id: '1', type: DeviceType.MEGAPACK_XL, x: 0, y: 0 },
        { id: '2', type: DeviceType.MEGAPACK_XL, x: 40, y: 0 }, // 0ft gap (40 < 45)
      ];
      
      const results = checkIntersections(devices);
      expect(results.size).toBe(2);
    });

    it('should allow exactly 5ft of clearance', () => {
      const devices: any[] = [
        { id: '1', type: DeviceType.MEGAPACK_XL, x: 0, y: 0 },
        { id: '2', type: DeviceType.MEGAPACK_XL, x: 45, y: 0 }, // 5ft gap (45 = 40 + 5)
      ];
      
      const results = checkIntersections(devices);
      expect(results.size).toBe(0);
    });


    it('should detect overlap in the Y axis', () => {
      const devices: any[] = [
        { id: '1', type: DeviceType.MEGAPACK_XL, x: 0, y: 0 },
        { id: '2', type: DeviceType.MEGAPACK_XL, x: 0, y: 5 }, // 5ft overlap on Y
      ];
      
      const results = checkIntersections(devices);
      expect(results.size).toBe(2);
    });
  });
});
