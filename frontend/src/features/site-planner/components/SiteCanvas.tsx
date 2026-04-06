import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { SiteDevice } from '@tesla/shared';
import { DEVICE_PROPERTIES } from '../hooks/useSitePlanner';
import styles from '../styles/SiteCanvas.module.css';

interface SiteCanvasProps {
  devices: SiteDevice[];
  dimensions: { width: number; length: number };
  is3D: boolean;
}

const SCALE = 8; // 8px per foot
const GUTTER = 10; // 10ft safety gutter

export const SiteCanvas: React.FC<SiteCanvasProps> = ({ devices, dimensions, is3D }) => {
  const { t } = useLanguage();
  const canvasWidth = (dimensions.width + GUTTER * 2) * SCALE;
  const canvasHeight = (dimensions.length + GUTTER * 2) * SCALE;

  return (
    <div className={styles.canvasContainer}>
      <div 
        className={`${styles.layoutCanvas} ${is3D ? styles.is3D : ''}`}
        style={{ 
          width: Math.max(canvasWidth, 100 * SCALE), 
          height: Math.max(canvasHeight, 40 * SCALE),
          padding: `${GUTTER * SCALE}px`,
          '--limit-label': `"${t('site.limit')}"`
        } as any}
      >
        {devices.map((device: SiteDevice) => {
          const props = DEVICE_PROPERTIES[device.type as keyof typeof DEVICE_PROPERTIES];
          return (
            <div 
              key={device.id}
              className={`${styles.deviceBlock} ${styles[device.type.toLowerCase()]} ${is3D ? styles.is3DMode : ''}`}
              style={{
                left: (device.x + GUTTER) * SCALE,
                top: (device.y + GUTTER) * SCALE,
                width: props.width * SCALE,
                height: props.length * SCALE,
              }}
            >
              <div className={styles.labelGroup}>
                {t(`device.${device.type.toLowerCase()}`)}
                <span>{props.energy} MWh</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
