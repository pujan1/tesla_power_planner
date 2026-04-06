import { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { SiteDevice, DeviceType } from '@tesla/shared';

import { DEVICE_PROPERTIES } from '../constants/device.constants';
import { checkIntersections, snapToGrid } from '../helpers/validation.helpers';
import styles from '../styles/SiteCanvas.module.css';

interface SiteCanvasProps {
  devices: SiteDevice[];
  dimensions: { width: number; length: number };
  is3D: boolean;
  isManualMode?: boolean;
  onUpdatePosition?: (id: string, x: number, y: number) => void;
  onRevert?: () => void;
  onAutoArrange?: () => void;
  onAddDevice?: (type: DeviceType, x: number, y: number) => void;
  onRemoveDevice?: (id: string) => void;
}


/** Pixels per foot for the 2D canvas rendering. */
const SCALE = 8;
const GRID_SIZE = 5;

export const SiteCanvas = ({ 
  devices, 
  dimensions, 
  is3D, 
  isManualMode, 
  onUpdatePosition,
  onRevert,
  onAutoArrange,
  onAddDevice,
  onRemoveDevice
}: SiteCanvasProps) => {

  const { t } = useLanguage();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isPaletteDragging, setIsPaletteDragging] = useState<DeviceType | null>(null);
  const [palettePos, setPalettePos] = useState({ x: 0, y: 0 });
  
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);



  // Dynamic gutter: Expand workspace by 100ft during manual edit
  const currentGutter = isManualMode ? 100 : 10;
  
  const canvasWidth = (dimensions.width + currentGutter * 2) * SCALE;
  const canvasHeight = (dimensions.length + currentGutter * 2) * SCALE;

  const invalidIds = useMemo(() => checkIntersections(devices), [devices]);

  const handleMouseDown = (e: React.MouseEvent, device: SiteDevice) => {
    if (!isManualMode) return;
    setDraggingId(device.id);
    
    // Calculate hit offset within the block to prevent jumping to corner
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    dragOffset.current = {
      x: (e.clientX - rect.left) / SCALE,
      y: (e.clientY - rect.top) / SCALE,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !onUpdatePosition || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    
    // Convert mouse to local canvas ft, accounting for gutter
    const rawX = (e.clientX - rect.left) / SCALE - currentGutter - dragOffset.current.x;
    const rawY = (e.clientY - rect.top) / SCALE - currentGutter - dragOffset.current.y;

    onUpdatePosition(draggingId, snapToGrid(rawX, GRID_SIZE), snapToGrid(rawY, GRID_SIZE));
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    if (isPaletteDragging && onAddDevice && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const trashRect = trashRef.current?.getBoundingClientRect();

      const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.changedTouches[0].clientY : e.clientY;

      // Check for trash drop first
      if (trashRect && 
          clientX >= trashRect.left && clientX <= trashRect.right && 
          clientY >= trashRect.top && clientY <= trashRect.bottom) {
        // Just cancel add
      } else {
        const rawX = (clientX - rect.left) / SCALE - currentGutter - 2;
        const rawY = (clientY - rect.top) / SCALE - currentGutter - 2;
        onAddDevice(isPaletteDragging, snapToGrid(rawX, GRID_SIZE), snapToGrid(rawY, GRID_SIZE));
      }
    }

    if (draggingId && onRemoveDevice) {
      const trashRect = trashRef.current?.getBoundingClientRect();
      const clientX = 'touches' in e ? ('changedTouches' in e ? e.changedTouches[0].clientX : (e as any).clientX) : (e as any).clientX;
      const clientY = 'touches' in e ? ('changedTouches' in e ? e.changedTouches[0].clientY : (e as any).clientY) : (e as any).clientY;

      if (trashRect && 
          clientX >= trashRect.left && clientX <= trashRect.right && 
          clientY >= trashRect.top && clientY <= trashRect.bottom) {
        onRemoveDevice(draggingId);
      }
    }


    setDraggingId(null);
    setIsPaletteDragging(null);
  };

  const handlePaletteStart = (type: DeviceType) => {
    setIsPaletteDragging(type);
  };

  const handlePaletteMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isPaletteDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setPalettePos({ x: clientX, y: clientY });
  };


  return (
    <div 
      className={styles.canvasContainer}
      onMouseMove={(e) => { handleMouseMove(e); handlePaletteMove(e); }}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { setDraggingId(null); setIsPaletteDragging(null); }}
      onTouchMove={handlePaletteMove}
      onTouchEnd={handleMouseUp}
    >
      <div className={styles.viewportWrapper}>
        <div
          ref={containerRef}
          className={`${styles.layoutCanvas} ${is3D ? styles.is3D : ''} ${isManualMode ? styles.manualMode : ''}`}
          style={{
            width: Math.max(canvasWidth, 100 * SCALE),
            height: Math.max(canvasHeight, 40 * SCALE),
            padding: `${currentGutter * SCALE}px`,
          } as any}
        >
          {devices.map((device: SiteDevice) => {
            const props = DEVICE_PROPERTIES[device.type as keyof typeof DEVICE_PROPERTIES];
            const isInvalid = invalidIds.has(device.id);
            const isDragging = draggingId === device.id;

            return (
              <div
                key={device.id}
                className={`
                  ${styles.deviceBlock} 
                  ${styles[device.type.toLowerCase()]} 
                  ${is3D ? styles.is3DMode : ''} 
                  ${isInvalid ? styles.invalid : ''} 
                  ${isDragging ? styles.dragging : ''}
                `}
                style={{
                  left: (device.x + currentGutter) * SCALE,
                  top: (device.y + currentGutter) * SCALE,
                  width: props.width * SCALE,
                  height: props.length * SCALE,
                  zIndex: isDragging ? 100 : 1,
                } as any}
                onMouseDown={(e) => handleMouseDown(e, device)}
              >
                <div className={styles.labelGroup}>
                  {t(`device.${device.type.toLowerCase()}`)}
                  {isManualMode && <span>{device.x}' , {device.y}'</span>}
                  {!isManualMode && <span>{props.energy} MWh</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isManualMode && (
        <div className={styles.mobilePalette}>
          {(Object.values(DeviceType) as DeviceType[]).filter(v => v !== DeviceType.TRANSFORMER).map(type => (
            <div 
              key={type} 
              className={styles.paletteItem}
              onMouseDown={() => handlePaletteStart(type)}
              onTouchStart={() => handlePaletteStart(type)}
            >
              <div 
                className={styles.paletteIcon} 
                style={{ '--grad': DEVICE_PROPERTIES[type].cost > 1000000 ? 'linear-gradient(135deg, #cc0000, #990000)' : 'linear-gradient(135deg, #444, #222)' } as any}
              >
                {type[0]}
              </div>
              <span>{t(`device.${type.toLowerCase()}`)}</span>
            </div>
          ))}
        </div>
      )}

      {isManualMode && (
        <div 
          ref={trashRef} 
          className={`
            ${styles.trashZone} 
            ${(draggingId || isPaletteDragging) ? styles.trashVisible : ''}
          `}
          aria-label="Trash Bin - Drop here to remove device"
        >
          <div className={styles.trashIcon}>🗑️</div>
          <span>Remove</span>
        </div>
      )}

      {isPaletteDragging && (
        <div 
          className={`${styles.deviceBlock} ${styles.dragging}`} 
          style={{ 
            position: 'fixed',
            left: palettePos.x - 20, 
            top: palettePos.y - 20,
            width: 40,
            height: 40,
            pointerEvents: 'none',
            zIndex: 9999,
            background: 'rgba(62, 148, 255, 0.5)',
            border: '2px dashed #3e94ff'
          }}
        >
          +
        </div>
      )}
    </div>
  );
};

