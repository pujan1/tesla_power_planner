import React, { forwardRef } from 'react';
import styles from '../styles/SiteCanvas.module.css';

interface TrashZoneProps {
  isActive: boolean;
}

/**
 * Trash zone receptor. Evaluates drop collisions via bounding box ref.
 */
export const TrashZone = forwardRef<HTMLDivElement, TrashZoneProps>(
  ({ isActive }, ref) => {
    return (
      <div 
        ref={ref} 
        className={`
          ${styles.trashZone} 
          ${isActive ? styles.trashVisible : ''}
        `}
        aria-label="Trash Bin - Drop here to remove device"
      >
        <div className={styles.trashIcon}>🗑️</div>
        <span>Remove</span>
      </div>
    );
  }
);
// Necessary for React DevTools to correctly label wrapped components
TrashZone.displayName = 'TrashZone';
