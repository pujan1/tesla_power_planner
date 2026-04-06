/**
 * @module scene.helpers
 * Pure computation helpers for the 3D scene layout.
 */

/**
 * Calculates the visual center target point for the OrbitControls camera,
 * accounting for both the device area and the road infrastructure below it.
 *
 * @param dimensions - The bounding dimensions of the packed device layout.
 * @param dimensions.width  - Total width of the layout in feet.
 * @param dimensions.length - Total length (depth) of the layout in feet.
 * @returns A `[x, y, z]` tuple for the camera's orbit target.
 */
export const computeViewTarget = (
  dimensions: { width: number; length: number }
): [number, number, number] => {
  return [dimensions.width / 2, 0, (dimensions.length + 65) / 2];
};
