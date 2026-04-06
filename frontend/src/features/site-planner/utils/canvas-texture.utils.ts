import * as THREE from 'three';
import {
  LABEL_PX_PER_FOOT,
  LABEL_MIN_WIDTH,
  LABEL_MIN_HEIGHT,
  LABEL_BG_OPACITY,
  LABEL_CORNER_RADIUS,
  PARKING_CANVAS_SIZE,
  PARKING_BG_OPACITY,
} from '../constants/canvas.constants';

/**
 * Creates a `THREE.CanvasTexture` displaying a device label and energy value.
 * Used as the top-face label on 3D battery/transformer meshes.
 *
 * @param label       - The device name (e.g., "MEGAPACK XL").
 * @param energyLabel - The energy string (e.g., "4 MWH").
 * @param width       - Device width in feet (determines canvas width).
 * @param length      - Device length in feet (determines canvas height).
 * @returns A `THREE.CanvasTexture` ready to be applied as a material map.
 *
 * @example
 * ```ts
 * const texture = createDeviceLabelTexture('MEGAPACK', '2 MWH', 30, 10);
 * <meshBasicMaterial transparent map={texture} />
 * ```
 */
export const createDeviceLabelTexture = (
  label: string,
  energyLabel: string,
  width: number,
  length: number
): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  const cvWidth = Math.max(width * 0.8 * LABEL_PX_PER_FOOT, LABEL_MIN_WIDTH);
  const cvHeight = Math.max(length * 0.8 * LABEL_PX_PER_FOOT, LABEL_MIN_HEIGHT);

  canvas.width = cvWidth;
  canvas.height = cvHeight;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    // High-contrast industrial backing
    ctx.fillStyle = `rgba(0, 0, 0, ${LABEL_BG_OPACITY})`;
    ctx.beginPath();
    ctx.roundRect(0, 0, cvWidth, cvHeight, LABEL_CORNER_RADIUS);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';

    // Device name (centered upper)
    const baseFontSize = Math.min(cvHeight * 0.35, 64);
    ctx.font = `bold ${baseFontSize}px "Inter", sans-serif`;
    ctx.fillText(label, cvWidth / 2, cvHeight * 0.38);

    // Energy value (centered lower)
    ctx.font = `500 ${baseFontSize * 0.75}px "Inter", sans-serif`;
    ctx.fillText(energyLabel, cvWidth / 2, cvHeight * 0.68);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

/**
 * Creates a `THREE.CanvasTexture` displaying a parking bay "P" symbol.
 * Used on the ground plane of engineer parking bays in the 3D scene.
 *
 * @returns A `THREE.CanvasTexture` with a white "P" on a dark circular backing.
 */
export const createParkingTexture = (): THREE.CanvasTexture => {
  const size = PARKING_CANVAS_SIZE;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    const center = size / 2;
    const radius = center - 18; // ~110 at 256px

    // Dark circle backing
    ctx.fillStyle = `rgba(0, 0, 0, ${PARKING_BG_OPACITY})`;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fill();

    // White border
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 12;
    ctx.stroke();

    // "P" symbol
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.font = `bold ${Math.floor(size * 0.547)}px "Inter", sans-serif`;
    ctx.fillText('P', center, center);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
};
