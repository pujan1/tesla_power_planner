import { DeviceType } from '@tesla/shared';

export const DEVICE_PROPERTIES = {
  [DeviceType.MEGAPACK_XL]: { width: 40, length: 10, energy: 4, cost: 120000 },
  [DeviceType.MEGAPACK_2]: { width: 30, length: 10, energy: 3, cost: 80000 },
  [DeviceType.MEGAPACK]: { width: 30, length: 10, energy: 2, cost: 50000 },
  [DeviceType.POWERPACK]: { width: 10, length: 10, energy: 1, cost: 10000 },
  [DeviceType.TRANSFORMER]: { width: 10, length: 10, energy: -0.5, cost: 10000 },
};

export const DEVICE_COLORS: Record<string, string> = {
  [DeviceType.MEGAPACK_XL]: '#cc0000',
  [DeviceType.MEGAPACK_2]: '#222222',
  [DeviceType.MEGAPACK]: '#333333',
  [DeviceType.POWERPACK]: '#555555',
  [DeviceType.TRANSFORMER]: '#0070f3',
};

export const DEVICE_HEIGHTS: Record<string, number> = {
  [DeviceType.MEGAPACK_XL]: 10,
  [DeviceType.MEGAPACK_2]: 10,
  [DeviceType.MEGAPACK]: 10,
  [DeviceType.POWERPACK]: 10,
  [DeviceType.TRANSFORMER]: 6,
};
