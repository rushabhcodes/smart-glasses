import { jscad } from "tscircuit";
import type { ReactNode } from "react";
import { frame as p, sides, type Side } from "./glasses-parameters";
const B = ({
  size,
  center = [0, 0, 0],
}: {
  size: [number, number, number];
  center?: [number, number, number];
}) => <jscad.cuboid size={size} center={center} />;
const R = ({
  size,
  center = [0, 0, 0],
  radius = 1,
}: {
  size: [number, number, number];
  center?: [number, number, number];
  radius?: number;
}) => (
  <jscad.roundedCuboid
    size={size}
    center={center}
    roundRadius={Math.min(radius, ...size.map((v) => v * 0.45))}
  />
);
const C = ({
  r,
  h,
  center = [0, 0, 0],
}: {
  r: number;
  h: number;
  center?: [number, number, number];
}) => <jscad.cylinder radius={r} height={h} center={center} />;
export function WorldTemple({
  side,
  children,
  explode = 0,
}: {
  side: Side;
  children: ReactNode;
  explode?: number;
}) {
  const s = sides[side];
  return (
    <jscad.translate
      offset={[
        s.sign * (p.templeX + explode),
        p.templeY,
        p.boardFront + s.length / 2,
      ]}
    >
      <jscad.rotate angles={[0, s.rotation, 0]}>{children}</jscad.rotate>
    </jscad.translate>
  );
}
export function FrontFrame() {
  return (
    <jscad.subtract>
      <jscad.union>
        {p.lensCenters.map((x) => (
          <jscad.subtract key={x}>
            <R
              size={[p.lensOuter[0], p.lensOuter[1], p.frontDepth]}
              center={[x, -5, 0]}
              radius={6}
            />
            <R
              size={[p.lensOpening[0], p.lensOpening[1], 12]}
              center={[x, -5, 0]}
              radius={6}
            />
          </jscad.subtract>
        ))}
        <R size={[20, 9, 7]} center={[0, 12, 0]} radius={2} />
        <R size={[152, 17.5, 7]} center={[0, 20.25, 0]} radius={1.5} />
        {[-66, -22, 22, 66].map((x) => (
          <C key={x} r={3} h={7} center={[x, 29.5, 0]} />
        ))}
        <CameraPod />
        {(["main", "secondary"] as const).map((side) => {
          const s = sides[side];
          return (
            <jscad.union key={side}>
              {/* Fixed-open splice joint: frame and temple meet at Z=18.3 with 0.3 mm gap. */}
              <R
                size={[s.coverZ - s.floor, 22, 20.2]}
                center={[
                  s.sign * (p.templeX + (s.floor + s.coverZ) / 2),
                  14,
                  6.6,
                ]}
                radius={1.5}
              />
            </jscad.union>
          );
        })}
      </jscad.union>
      {/* Open-back brow cable raceway, closed by separate service strip. */}
      <B size={[145, 13.5, 6.5]} center={[0, 20, 1.35]} />
      {(["main", "secondary"] as const).map((side) => {
        const s = sides[side];
        return (
          <jscad.union key={side}>
            <jscad.hull>
              <B
                size={[1.6, 13.5, 6]}
                center={[s.sign * (p.templeX + 1.4), 12, 12]}
              />
              <B
                size={[1.6, 13.5, 4]}
                center={[s.sign * (p.templeX + 1.4), 20, 1]}
              />
            </jscad.hull>
            <B size={[8, 13.5, 2]} center={[s.sign * 71.5, 20, 1.8]} />
          </jscad.union>
        );
      })}
      {[-66, -22, 22, 66].map((x) => (
        <C key={x} r={p.screwPilotRadius} h={8} center={[x, 29.5, 0]} />
      ))}
      {/* Counterpart holes for external joint splints. */}
      {(["main", "secondary"] as const).map((side) => {
        const s = sides[side];
        return (
          <jscad.translate key={side} offset={[s.sign * p.templeX, 20.3, 11]}>
            <jscad.rotate angles={[0, Math.PI / 2, 0]}>
              <C r={1.35} h={32} />
            </jscad.rotate>
          </jscad.translate>
        );
      })}
    </jscad.subtract>
  );
}
export function BrowCover() {
  return (
    <jscad.subtract>
      <jscad.union>
        <R size={[151, 17, 1.6]} center={[0, 20.25, 4.55]} radius={0.5} />
        {[-66, -22, 22, 66].map((x) => (
          <C key={x} r={2.8} h={1.6} center={[x, 29.5, 4.55]} />
        ))}
      </jscad.union>
      {[-66, -22, 22, 66].map((x) => (
        <C key={x} r={p.screwClearanceRadius} h={4} center={[x, 29.5, 4.55]} />
      ))}
      {(["main", "secondary"] as const).map((side) => {
        const s = sides[side];
        return (
          <B
            key={side}
            size={[s.coverZ - s.floor + 0.5, 22.5, 8]}
            center={[s.sign * (p.templeX + (s.floor + s.coverZ) / 2), 14, 4.5]}
          />
        );
      })}
    </jscad.subtract>
  );
}
export function CameraPod() {
  const c = p.camera;
  return (
    <jscad.subtract>
      <jscad.union>
        <R
          size={[c.width + 10, c.height + 6, c.depth + 3.2]}
          center={[0, c.y, -c.depth / 2 - 2]}
          radius={1.5}
        />
        <B size={[22, 5, 5]} center={[0, 23, -3]} />
      </jscad.union>
      <B
        size={[c.width, c.height, c.depth + 2]}
        center={[0, c.y, -c.depth / 2 - 3]}
      />
      {/* Front service access plus a separate rear cable exit. No sensor selected. */}
      <B size={[9, 12, 10]} center={[0, 24, 0]} />
      {[-(p.camera.width / 2 + 2.5), p.camera.width / 2 + 2.5].flatMap((x) =>
        [-(p.camera.height / 2 - 3), p.camera.height / 2 - 3].map((y) => (
          <C
            key={`${x},${y}`}
            r={p.screwPilotRadius}
            h={15}
            center={[x, c.y + y, -c.depth + 2]}
          />
        )),
      )}
    </jscad.subtract>
  );
}
export function CameraCover() {
  return (
    <jscad.subtract>
      <R
        size={[p.camera.width + 10, p.camera.height + 6, 1.6]}
        center={[0, p.camera.y, -p.camera.depth - 4.65]}
        radius={0.6}
      />
      <C
        r={p.camera.lensDiameter / 2}
        h={5}
        center={[0, p.camera.y, -p.camera.depth - 4.65]}
      />
      {[-(p.camera.width / 2 + 2.5), p.camera.width / 2 + 2.5].flatMap((x) =>
        [-(p.camera.height / 2 - 3), p.camera.height / 2 - 3].map((y) => (
          <C
            key={`${x},${y}`}
            r={p.screwClearanceRadius}
            h={5}
            center={[x, p.camera.y + y, -p.camera.depth - 4.65]}
          />
        )),
      )}
    </jscad.subtract>
  );
}
export function TempleTray({ side }: { side: Side }) {
  const s = sides[side],
    l = s.length + 2 * p.endBay,
    w = 18 + 2 * (p.wall + p.xyClearance),
    h = s.coverZ - s.floor;
  const screws = [-1, 1].flatMap((a) =>
    [-6, 6].map((y) => [a * (s.length / 2 + 4), y] as const),
  );
  return (
    <jscad.subtract>
      <jscad.union>
        <jscad.subtract>
          <R size={[l, w, h]} center={[0, 0, s.floor + h / 2]} radius={1.2} />
          <B
            size={[l - 2 * p.wall, w - 2 * p.wall, h + 1]}
            center={[0, 0, s.floor + p.wall + (h + 1) / 2]}
          />
        </jscad.subtract>
        {screws.map(([x, y]) => (
          <C key={`${x},${y}`} r={2.7} h={h} center={[x, y, s.floor + h / 2]} />
        ))}
        {/* Tiny supports only at PCB corners. No drilled PCB mounting holes invented. */}
        {[-1, 1].flatMap((x) =>
          [-1, 1].map((y) => (
            <B
              key={`${x},${y}`}
              size={[2, 1.0, -0.7 - (s.floor + p.wall)]}
              center={[
                x * (s.length / 2 - 2),
                y * 8.9,
                (s.floor + p.wall - 0.7) / 2,
              ]}
            />
          )),
        )}
        {side === "main" && (
          <C r={2} h={1.4} center={[p.micPort.x, p.micPort.y, -1.8]} />
        )}
        {/* Non-folding front tongue, fastened using separate external splice strip. */}
        <B
          size={[5.2, 12, h]}
          center={[s.sign * (s.length / 2 + 7.4), 0, s.floor + h / 2]}
        />
      </jscad.union>
      {screws.map(([x, y]) => (
        <C
          key={`${x},${y}`}
          r={p.screwPilotRadius}
          h={h + 2}
          center={[x, y, s.floor + h / 2 + 1]}
        />
      ))}
      {/* Front cable outlet sized for 20-contact 0.5-pitch cable, unqualified bend radius. */}
      <B
        size={[20, 13.5, 2.5]}
        center={[s.sign * (s.length / 2 + 8), 0, 2.3]}
      />
      {/* Two tie slots in the front service bay for a soft strain-relief saddle. */}
      {[-6, 6].map((y) => (
        <B
          key={y}
          size={[1.2, 1.6, h + 4]}
          center={[s.sign * (s.length / 2 + 0.8), y, s.floor + h / 2]}
        />
      ))}
      {/* Joint bolt normal to the PCB plane. */}
      <C
        r={1.35}
        h={h + 4}
        center={[s.sign * (s.length / 2 + 4), 8.3, s.floor + h / 2]}
      />
      {side === "main" && (
        <C
          r={p.micPort.diameter / 2}
          h={5}
          center={[p.micPort.x, p.micPort.y, s.floor + 1]}
        />
      )}
    </jscad.subtract>
  );
}
export function TempleCover({ side }: { side: Side }) {
  const s = sides[side],
    z = s.coverZ + p.coverGap + 0.8,
    l = s.length + 2 * p.endBay,
    w = 18 + 2 * (p.wall + p.xyClearance);
  return (
    <jscad.subtract>
      <jscad.union>
        <R size={[l, w, 1.6]} center={[0, 0, z]} radius={0.6} />
        {/* End/corner retainers leave a 0.2 mm float above the real PCB face. */}
        {[-1, 1].flatMap((x) =>
          [-1, 1].map((y) => (
            <B
              key={`${x},${y}`}
              size={[2, 0.7, s.coverZ - 0.55]}
              center={[x * (s.length / 2 - 2), y * 8.9, (s.coverZ + 1.25) / 2]}
            />
          )),
        )}
      </jscad.union>
      {[-1, 1].flatMap((a) =>
        [-6, 6].map((y) => (
          <C
            key={`${a},${y}`}
            r={p.screwClearanceRadius}
            h={4}
            center={[a * (s.length / 2 + 4), y, z]}
          />
        )),
      )}
      <C r={1.35} h={4} center={[s.sign * (s.length / 2 + 4), 8.3, z]} />
      {side === "main" ? (
        <jscad.union>
          <B size={[6, 4, 4]} center={[-28, -5, z]} />
          <C r={1.6} h={4} center={[-6, -5, z]} />
          <B size={[7, 7, 4]} center={[-36, 0, z]} />
        </jscad.union>
      ) : (
        <jscad.union>
          {/* Real J2 battery/NTC, J3 charge and J4 speaker connectors: service openings. */}
          <B size={[10, 7, 4]} center={[-35, -5, z]} />
          <B size={[8, 7, 4]} center={[-35, 5, z]} />
          <B size={[8, 7, 4]} center={[24, 5, z]} />
          <B size={[11, 9, 4]} center={[-13, -2, z]} />
        </jscad.union>
      )}
    </jscad.subtract>
  );
}
export function JointSplint({ side }: { side: Side }) {
  const s = sides[side],
    x = s.sign * (p.templeX + s.coverZ + 2.9);
  return (
    <jscad.subtract>
      <jscad.union>
        <R size={[1.6, 8, 23]} center={[x, 20.3, 17]} radius={0.6} />
        <jscad.translate
          offset={[s.sign * (p.templeX + s.coverZ + 1.2), 20.3, 11]}
        >
          <jscad.rotate angles={[0, Math.PI / 2, 0]}>
            <C r={2.7} h={1.95} />
          </jscad.rotate>
        </jscad.translate>
      </jscad.union>
      {[11, 23].map((z) => (
        <jscad.translate key={z} offset={[x, 20.3, z]}>
          <jscad.rotate angles={[0, Math.PI / 2, 0]}>
            <C r={1.35} h={8} />
          </jscad.rotate>
        </jscad.translate>
      ))}
    </jscad.subtract>
  );
}
export function EarTail({ side }: { side: Side }) {
  const s = sides[side],
    start = p.boardFront + s.length + 10,
    br = {
      ...p.batteryReserve,
      length:
        side === "main"
          ? p.batteryReserve.length
          : p.batteryReserve.secondaryLength,
    };
  // Sealed-off architecture-neutral reserve, separated from electronics by >2 mm wall and service gap.
  return (
    <jscad.subtract>
      <jscad.union>
        <R
          size={[12, 16, br.length + 10]}
          center={[s.sign * p.templeX, 10, start + (br.length + 10) / 2]}
          radius={2}
        />
        <jscad.hullChain>
          {[
            [start + br.length + 4, 10],
            [start + br.length + 15, 5],
            [start + br.length + 29, -14],
          ].map(([z, y]) => (
            <jscad.sphere
              key={z}
              radius={4}
              center={[s.sign * (p.templeX - 2), y, z]}
            />
          ))}
        </jscad.hullChain>
      </jscad.union>
      <R
        size={[br.depth, br.height, br.length]}
        center={[s.sign * p.templeX, 10, start + br.length / 2 + 5]}
        radius={0.8}
      />
      {/* Reserve is open on the outward side for a separate removable access strip. */}
      <R
        size={[9, br.height, br.length]}
        center={[s.sign * (p.templeX + 5), 10, start + br.length / 2 + 5]}
        radius={0.8}
      />
      <B size={[3, 5, 12]} center={[s.sign * p.templeX, 10, start]} />
      {[2.5, br.length + 7.5].map((z) => (
        <jscad.translate key={z} offset={[s.sign * p.templeX, 10, start + z]}>
          <jscad.rotate angles={[0, Math.PI / 2, 0]}>
            <C r={p.screwPilotRadius} h={20} />
          </jscad.rotate>
        </jscad.translate>
      ))}
      {/* Speaker/ear acoustic outlet is provisional and deliberately not a fitted transducer. */}
      <jscad.translate offset={[s.sign * p.templeX, 5, start + br.length + 10]}>
        <jscad.rotate angles={[0, Math.PI / 2, 0]}>
          <C r={1.5} h={20} />
        </jscad.rotate>
      </jscad.translate>
    </jscad.subtract>
  );
}
export function TailCover({ side }: { side: Side }) {
  const s = sides[side],
    start = p.boardFront + s.length + 10,
    l =
      side === "main"
        ? p.batteryReserve.length
        : p.batteryReserve.secondaryLength,
    x = s.sign * (p.templeX + 7.05);
  return (
    <jscad.subtract>
      <R
        size={[1.6, 16, l + 10]}
        center={[x, 10, start + (l + 10) / 2]}
        radius={0.6}
      />
      {[2.5, l + 7.5].map((z) => (
        <jscad.translate key={z} offset={[x, 10, start + z]}>
          <jscad.rotate angles={[0, Math.PI / 2, 0]}>
            <C r={p.screwClearanceRadius} h={4} />
          </jscad.rotate>
        </jscad.translate>
      ))}
    </jscad.subtract>
  );
}
export const printedParts = [
  { name: "front-frame", element: <FrontFrame />, color: "#142c35" },
  { name: "brow-cover", element: <BrowCover />, color: "#427486" },
  { name: "camera-cover", element: <CameraCover />, color: "#427486" },
  ...(["main", "secondary"] as const).flatMap((side) => [
    {
      name: `${side}-tray`,
      element: (
        <jscad.subtract>
          <jscad.union>
            <WorldTemple side={side}>
              <TempleTray side={side} />
            </WorldTemple>
            <EarTail side={side} />
            <B
              size={[3, 8, 7]}
              center={[
                sides[side].sign * (p.templeX + sides[side].floor + 0.8),
                10,
                p.boardFront + sides[side].length + 9,
              ]}
            />
          </jscad.union>
          <B
            size={[3, 5, 14]}
            center={[
              sides[side].sign * p.templeX,
              10,
              p.boardFront + sides[side].length + 10,
            ]}
          />
        </jscad.subtract>
      ),
      color: sides[side].color,
    },
    {
      name: `${side}-cover`,
      element: (
        <WorldTemple side={side}>
          <TempleCover side={side} />
        </WorldTemple>
      ),
      color: "#427486",
    },
    {
      name: `${side}-joint-splint`,
      element: <JointSplint side={side} />,
      color: "#648894",
    },
    {
      name: `${side}-tail-cover`,
      element: <TailCover side={side} />,
      color: "#427486",
    },
  ]),
];
