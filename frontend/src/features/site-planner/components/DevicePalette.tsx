import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { DeviceType } from '@tesla/shared';
import styles from '../styles/SiteCanvas.module.css';

interface DevicePaletteProps {
  onStartDrag: (type: DeviceType) => void;
}

/**
 * Renders the floating dock palette of hardware devices for drag-and-drop actions.
 * Only visible when the site is unlocked for manual editing.
 */
export const DevicePalette = ({ onStartDrag }: DevicePaletteProps) => {
  const { t } = useLanguage();
  
  return (
    <div className={styles.mobilePalette}>
      {(Object.values(DeviceType) as DeviceType[]).filter(v => v !== DeviceType.TRANSFORMER).map((type) => (
        <div 
          key={type} 
          className={styles.paletteItem}
          onMouseDown={() => onStartDrag(type)}
          onTouchStart={() => onStartDrag(type)}
        >
          <div 
            className={`${styles.paletteIcon} ${styles[type.toLowerCase()]}`}
          >
            {type === DeviceType.MEGAPACK_XL ? 'XL' : type[0]}
          </div>
          <span>{t(`device.${type.toLowerCase()}`)}</span>
        </div>
      ))}
    </div>
  );
};
