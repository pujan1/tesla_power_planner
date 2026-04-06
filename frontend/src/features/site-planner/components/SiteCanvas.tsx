import { useLanguage } from '../../../context/LanguageContext';
import { SiteDevice } from '@tesla/shared';
import { DEVICE_PROPERTIES } from '../constants/device.constants';
import styles from '../styles/SiteCanvas.module.css';

interface SiteCanvasProps {
  /** Array of placed devices with computed x/y positions. */
  devices: SiteDevice[];
  /** Bounding dimensions of the packed layout in feet. */
  dimensions: { width: number; length: number };
  /** Whether 3D mode is active (used for CSS class toggling). */
  is3D: boolean;
}

/** Pixels per foot for the 2D canvas rendering. */
const SCALE = 8;

/** Safety gutter in feet added around the perimeter of the layout. */
const GUTTER = 10;

/**
 * 2D top-down visualization of the energy site layout.
 *
 * Renders each device as a colored, labeled block positioned according
 * to the packing algorithm's output. Includes a safety gutter border.
 *
 * @param props.devices    - Array of placed `SiteDevice` objects.
 * @param props.dimensions - Bounding `{ width, length }` in feet.
 * @param props.is3D       - Whether 3D mode is active (for CSS class styling).
 * @returns A scrollable 2D canvas element.
 */
export const SiteCanvas = ({ devices, dimensions, is3D }: SiteCanvasProps) => {
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
