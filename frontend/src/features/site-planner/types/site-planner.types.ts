import { SiteDevice, DeviceType } from '@tesla/shared';

export interface SiteCanvas3DProps {
  devices: SiteDevice[];
  dimensions: { width: number; length: number };
}

export type DeviceCounts = {
  [key in DeviceType.MEGAPACK_XL | DeviceType.MEGAPACK_2 | DeviceType.MEGAPACK | DeviceType.POWERPACK]: number;
};

export interface BatteryMeshProps {
  type: DeviceType;
  position: [number, number, number];
  args: [number, number, number]; // width, height, length
  color: string;
  energy: number;
  isFlat?: boolean;
}
