/** Millimetres. Prototype assumptions, not measured user fit or qualified wearable clearances. */
export const frame = {
  lensCenters: [-34, 34],
  lensOpening: [48, 26] as [number, number],
  lensOuter: [56, 40] as [number, number],
  frontDepth: 4.5,
  templeX: 73,
  templeY: 12,
  boardFront: 27,
  wall: 1.6,
  xyClearance: 0.6,
  coverGap: 0.25,
  endBay: 8,
  screwPilotRadius: 0.8,
  screwClearanceRadius: 1.15,
  micPort: { x: -29.2349266, y: 4, diameter: 1.6 },
  camera: { width: 24, height: 18, depth: 14, lensDiameter: 12, y: 32 },
  batteryReserve: { length: 30, secondaryLength: 10, height: 10, depth: 6 },
} as const;
export const sides = {
  main: {
    length: 80,
    thickness: 1.4,
    minCadZ: -1.5,
    maxCadZ: 2.8,
    floor: -4.1,
    coverZ: 3.8,
    sign: 1,
    rotation: Math.PI / 2,
    color: "#173d49",
  },
  secondary: {
    length: 100,
    thickness: 1.4,
    minCadZ: -2.8,
    maxCadZ: 6.7,
    floor: -5.4,
    coverZ: 7.7,
    sign: -1,
    rotation: -Math.PI / 2,
    color: "#245365",
  },
} as const;
export type Side = keyof typeof sides;
export function boardToWorld(
  side: Side,
  p: readonly number[],
): [number, number, number] {
  const s = sides[side];
  return [
    s.sign * (frame.templeX + p[2]),
    frame.templeY + p[1],
    frame.boardFront + s.length / 2 - s.sign * p[0],
  ];
}
