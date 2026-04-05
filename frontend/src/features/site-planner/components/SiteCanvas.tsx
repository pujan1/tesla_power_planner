import React from 'react';
import { SiteDevice, DeviceType } from '@tesla/shared';
import { DEVICE_PROPERTIES } from '../hooks/useSitePlanner';
import styles from '../styles/SitePlanner.module.css';

interface SiteCanvasProps {
  devices: SiteDevice[];
  dimensions: { width: number; length: number };
}

export const SiteCanvas: React.FC<SiteCanvasProps> = ({ devices, dimensions }) => {
  // Scale factor to convert feet to pixels (e.g., 5px per foot)
  const SCALE = 8;
  const canvasWidth = dimensions.width * SCALE;
  const canvasHeight = dimensions.length * SCALE;

  return (
    <div className={styles.canvasContainer}>
      <div 
        className={styles.layoutCanvas}
        style={{ 
          width: Math.max(canvasWidth, 100 * SCALE), 
          height: Math.max(canvasHeight, 40 * SCALE),
          padding: '20px'
        }}
      >
        {devices.map((device) => {
          const props = DEVICE_PROPERTIES[device.type];
          return (
            <div
              key={device.id}
              className={`${styles.deviceBlock} ${styles[device.type.toLowerCase()]}`}
              style={{
                left: device.x * SCALE,
                top: device.y * SCALE,
                width: props.width * SCALE,
                height: props.length * SCALE,
              }}
            >
              {device.type}
              <span>{props.energy} MWh</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
