import React, { useState, useRef, Suspense } from 'react';
import { SiteDevice, DeviceType } from '@tesla/shared';
import { Canvas } from '@react-three/fiber';

import { useTheme } from '../../../context/ThemeContext';
import { snapToGrid } from '../helpers/validation.helpers';
import styles from '../styles/SiteCanvas.module.css';

import { SiteCanvas2D } from './SiteCanvas2D';
import { DevicePalette } from './DevicePalette';
import { TrashZone } from './TrashZone';

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

const SCALE = 8;
const GRID_SIZE = 5;

/**
 * Main Orchestrator for the 2D layout engine.
 * Renders the WebGL canvas, coordinate translations, floating HTML overlays,
 * and maintains local dragging/palette selections.
 */
export const SiteCanvas = ({ 
  devices, 
  dimensions, 
  is3D, // Maintained for backwards compatibility in parent 
  isManualMode, 
  onUpdatePosition,
  onAddDevice,
  onRemoveDevice
}: SiteCanvasProps) => {

  const { theme } = useTheme();
  
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isPaletteDragging, setIsPaletteDragging] = useState<DeviceType | null>(null);
  const [palettePos, setPalettePos] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    // 1. Handle adding new device from floating palette
    if (isPaletteDragging && onAddDevice && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const trashRect = trashRef.current?.getBoundingClientRect();

      const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.changedTouches[0].clientY : e.clientY;

      if (trashRect && 
          clientX >= trashRect.left && clientX <= trashRect.right && 
          clientY >= trashRect.top && clientY <= trashRect.bottom) {
        // Cancel add - dropped perfectly into trash zone
      } else {
        const centerViewX = dimensions.width / 2;
        const centerViewZ = dimensions.length / 2;
        
        // Pixel offset from center
        const offsetX = clientX - (rect.left + rect.width / 2);
        const offsetZ = clientY - (rect.top + rect.height / 2);
        
        // Translate DOM coordinates to orthographic WebGL layout
        const worldX = centerViewX + (offsetX / SCALE) - 5; 
        const worldZ = centerViewZ + (offsetZ / SCALE) - 5;
        
        onAddDevice(isPaletteDragging, snapToGrid(worldX, GRID_SIZE), snapToGrid(worldZ, GRID_SIZE));
      }
    }

    // 2. Handle dropping an existing device into the trash zone
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
      onMouseMove={handlePaletteMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsPaletteDragging(null)}
      onTouchMove={handlePaletteMove}
      onTouchEnd={handleMouseUp}
      style={{ overflow: 'hidden', position: 'relative', width: '100%', height: '100%' }}
      ref={containerRef}
    >
      <Suspense fallback={<div style={{ padding: 20 }}>Loading 2D Map...</div>}>
         <Canvas shadows={false} gl={{ antialias: false }}>
            <SiteCanvas2D 
               devices={devices}
               dimensions={dimensions}
               isManualMode={isManualMode}
               draggingId={draggingId}
               setDraggingId={setDraggingId}
               onUpdatePosition={onUpdatePosition}
               theme={theme}
            />
         </Canvas>
      </Suspense>

      {/* Manual Mode DOM Overlays (Palette & Trash) */}
      {isManualMode && <DevicePalette onStartDrag={handlePaletteStart} />}
      {isManualMode && <TrashZone ref={trashRef} isActive={!!(draggingId || isPaletteDragging)} />}

      {/* Ghost Block following cursor during add-from-palette */}
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
