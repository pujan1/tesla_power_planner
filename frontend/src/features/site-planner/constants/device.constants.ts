import { DeviceType } from '@tesla/shared';

export const DEVICE_PROPERTIES = {
  [DeviceType.MEGAPACK_XL]: { width: 40, length: 10, energy: 4, cost: 120000 },
  [DeviceType.MEGAPACK_2]: { width: 30, length: 10, energy: 3, cost: 80000 },
  [DeviceType.MEGAPACK]: { width: 30, length: 10, energy: 2, cost: 50000 },
  [DeviceType.POWERPACK]: { width: 10, length: 10, energy: 1, cost: 10000 },
  [DeviceType.TRANSFORMER]: { width: 10, length: 10, energy: -0.5, cost: 10000 },
};

export const DEVICE_COLORS: Record<string, string> = {
  [DeviceType.MEGAPACK_XL]: '#cc0000', // Signature Red
  [DeviceType.MEGAPACK_2]: '#8e8e93', // Industrial silver
  [DeviceType.MEGAPACK]: '#4d4d4d',   // Space gray
  [DeviceType.POWERPACK]: '#2c2c2e',  // Matte dark
  [DeviceType.TRANSFORMER]: '#176df2', // Tesla Energy blue
};

export const DEVICE_HEIGHTS: Record<string, number> = {
  [DeviceType.MEGAPACK_XL]: 10,
  [DeviceType.MEGAPACK_2]: 10,
  [DeviceType.MEGAPACK]: 10,
  [DeviceType.POWERPACK]: 10,
  [DeviceType.TRANSFORMER]: 6,
};
