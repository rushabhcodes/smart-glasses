import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { createHash } from "node:crypto"
const settings = {
  baselineCommit: "27f7feab927d6391236d56bc8df1db0a380b343a",
  thickness: 0.2,
  layers: 4,
  islandHeight: 20,
  neckWidth: 8,
  neckLength: 16,
  componentEdgeMargin: 1.2,
  stiffenerEdgeMargin: 0.4,
  stiffenerThickness: 0.2,
  adhesiveThickness: 0.05,
  undersideClearance: 0.4,
  minStiffenerWeb: 0.6,
  bendRadius: 30,
  bendClearance: 2,
  usage: "static flex-to-install only; not a qualified dynamic hinge or manufacturing stackup"
}
const hash = (b) => createHash("sha256").update(b).digest("hex")
const box = (c) => ({
  x0: c.center.x - c.width / 2,
  x1: c.center.x + c.width / 2,
  y0: c.center.y - c.height / 2,
  y1: c.center.y + c.height / 2
})
function rounded(points) {
  const out = []
  for (let i = 0; i < points.length; i++) {
    const A = points[(i + points.length - 1) % points.length],
      B = points[i],
      C = points[(i + 1) % points.length],
      la = Math.hypot(A.x - B.x, A.y - B.y),
      lc = Math.hypot(C.x - B.x, C.y - B.y),
      u = [(A.x - B.x) / la, (A.y - B.y) / la],
      v = [(C.x - B.x) / lc, (C.y - B.y) / lc],
      cross = -u[0] * v[1] - -u[1] * v[0],
      r = Math.min(cross > 0 ? 2 : 0.8, la * 0.4, lc * 0.4),
      d = r,
      center = { x: B.x + (u[0] + v[0]) * r, y: B.y + (u[1] + v[1]) * r },
      start = Math.atan2(B.y + u[1] * d - center.y, B.x + u[0] * d - center.x),
      end = Math.atan2(B.y + v[1] * d - center.y, B.x + v[0] * d - center.x)
    let sweep = end - start
    if (cross > 0 && sweep < 0) sweep += Math.PI * 2
    if (cross < 0 && sweep > 0) sweep -= Math.PI * 2
    for (let k = 0; k <= 8; k++) {
      const a = start + (sweep * k) / 8
      out.push({
        x: +(center.x + r * Math.cos(a)).toFixed(6),
        y: +(center.y + r * Math.sin(a)).toFixed(6)
      })
    }
  }
  return out
}
function tilePlate(plate, holes) {
  const xs = [
      ...new Set(
        [
          plate.x0,
          plate.x1,
          ...holes.flatMap((h) => [Math.max(plate.x0, h.x0), Math.min(plate.x1, h.x1)])
        ].map((x) => +x.toFixed(5))
      )
    ]
      .filter((x) => x >= plate.x0 - 1e-4 && x <= plate.x1 + 1e-4)
      .sort((a, b) => a - b),
    rects = [],
    active = new Map()
  for (let i = 0; i < xs.length - 1; i++) {
    const x0 = xs[i],
      x1 = xs[i + 1],
      mid = (x0 + x1) / 2
    let ys = [[plate.y0, plate.y1]]
    for (const h of holes.filter((h) => mid > h.x0 && mid < h.x1)) {
      ys = ys.flatMap(([a, b]) =>
        h.y1 <= a || h.y0 >= b
          ? [[a, b]]
          : [
              [a, Math.min(b, h.y0)],
              [Math.max(a, h.y1), b]
            ].filter(([lo, hi]) => hi - lo > 1e-5)
      )
    }
    const next = new Map()
    for (const [y0, y1] of ys) {
      const key = `${y0.toFixed(5)},${y1.toFixed(5)}`,
        prev = active.get(key)
      if (prev && Math.abs(prev.x1 - x0) < 1e-4) {
        prev.x1 = x1
        next.set(key, prev)
      } else {
        const r = { x0, x1, y0, y1 }
        rects.push(r)
        next.set(key, r)
      }
    }
    active.clear()
    for (const [k, v] of next) active.set(k, v)
  }
  // These rectangles are a decomposition, not separately manufactured strips.
  // Removing narrow slabs here can disconnect a physically wide backing rail.
  return rects.filter((r) => r.x1 - r.x0 > 1e-5 && r.y1 - r.y0 > 1e-5)
}
mkdirSync("src/flex", { recursive: true })
const plans = { settings, boards: {} }
for (const side of ["main", "secondary"]) {
  const bytes = readFileSync(`dist/src/${side}-board/${side}-board/circuit.json`),
    a = JSON.parse(bytes),
    groups = new Map(a.filter((e) => e.type === "source_group").map((e) => [e.source_group_id, e])),
    src = new Map(a.filter((e) => e.type === "source_component").map((e) => [e.source_component_id, e]))
  const defs =
    side === "main"
      ? [
          {
            key: "core",
            sections: ["Core", "Flash", "ClockRF", "Controls", "Mic"]
          },
          { key: "power", sections: ["Regulator", "Frame"] }
        ]
      : [
          { key: "power", sections: ["Power", "Gauge", "Frame"] },
          { key: "audio", sections: ["Audio"] },
          { key: "touch", sections: ["Touch"] }
        ]
  const pcs = a.filter((e) => e.type === "pcb_component" && src.has(e.source_component_id))
  const envelopes = new Map(
    pcs.map((c) => {
      const points = [
        { x: box(c).x0, y: box(c).y0 },
        { x: box(c).x1, y: box(c).y1 }
      ]
      for (const e of a.filter(
        (e) => e.pcb_component_id === c.pcb_component_id && e.type.includes("courtyard")
      )) {
        if (e.outline) points.push(...e.outline)
        else if (e.center && e.width && e.height)
          points.push(
            { x: e.center.x - e.width / 2, y: e.center.y - e.height / 2 },
            { x: e.center.x + e.width / 2, y: e.center.y + e.height / 2 }
          )
      }
      return [
        c.pcb_component_id,
        {
          x0: Math.min(...points.map((p) => p.x)),
          x1: Math.max(...points.map((p) => p.x)),
          y0: Math.min(...points.map((p) => p.y)),
          y1: Math.max(...points.map((p) => p.y))
        }
      ]
    })
  )
  const bounds = (c) => envelopes.get(c.pcb_component_id)
  for (const d of defs) {
    d.parts = pcs
      .filter((c) =>
        d.sections.some((s) =>
          (groups.get(src.get(c.source_component_id)?.source_group_id)?.name ?? "").startsWith(s + "Part")
        )
      )
      .map((c) => ({ ...c, ref: src.get(c.source_component_id).name }))
    if (!d.parts.length) throw Error("Empty island " + d.key)
    const boxes = d.parts.map(bounds)
    d.oldMin = Math.min(...boxes.map((b) => b.x0))
    d.oldMax = Math.max(...boxes.map((b) => b.x1))
    d.length = d.oldMax - d.oldMin + 2 * settings.componentEdgeMargin
  }
  if (defs.reduce((n, x) => n + x.parts.length, 0) !== pcs.length) throw Error("Unassigned component")
  const length = defs.reduce((n, d) => n + d.length, 0) + (defs.length - 1) * settings.neckLength
  let cursor = -length / 2
  const islands = defs.map((d) => {
    const left = cursor,
      right = left + d.length,
      offsetX = left + settings.componentEdgeMargin - d.oldMin
    cursor = right + settings.neckLength
    return {
      name: d.key,
      sections: d.sections,
      left,
      right,
      length: d.length,
      offsetX,
      references: d.parts.map((c) => c.ref),
      bottomReferences: d.parts.filter((c) => c.layer === "bottom").map((c) => c.ref)
    }
  })
  const bends = islands.slice(0, -1).map((d, i) => ({
    name: `STATIC_${i + 1}`,
    x: (d.right + islands[i + 1].left) / 2,
    radius: settings.bendRadius,
    angle: side === "main" ? -10 : -8,
    movingSide: side === "main" ? "left" : "right",
    zoneWidth:
      settings.bendRadius * Math.abs(((side === "main" ? 10 : 8) * Math.PI) / 180) +
      2 * settings.bendClearance
  }))
  const upper = []
  for (let i = 0; i < islands.length; i++) {
    const d = islands[i]
    upper.push({ x: d.left, y: 10 }, { x: d.right, y: 10 })
    if (i < islands.length - 1) upper.push({ x: d.right, y: 4 }, { x: islands[i + 1].left, y: 4 })
  }
  const lower = []
  for (let i = islands.length - 1; i >= 0; i--) {
    const d = islands[i]
    lower.push({ x: d.right, y: -10 }, { x: d.left, y: -10 })
    if (i > 0) lower.push({ x: d.left, y: -4 }, { x: islands[i - 1].right, y: -4 })
  }
  const stiffeners = []
  for (let i = 0; i < islands.length; i++) {
    const d = islands[i],
      def = defs[i],
      plate = { x0: d.left + 0.4, x1: d.right - 0.4, y0: -9.6, y1: 9.6 },
      holes = def.parts
        .filter((c) => c.layer === "bottom")
        .map((c) => {
          const b = bounds(c)
          return {
            ref: c.ref,
            x0: b.x0 + d.offsetX - 0.4,
            x1: b.x1 + d.offsetX + 0.4,
            y0: b.y0 - 0.4,
            y1: b.y1 + 0.4
          }
        })
    for (const hole of a.filter((e) => e.type === "pcb_hole" || e.type === "pcb_plated_hole")) {
      const x = hole.x + d.offsetX
      const owner = def.parts.find((c) => c.pcb_component_id === hole.pcb_component_id)
      if (x > plate.x0 && x < plate.x1 && owner) {
        const rx = Math.max(
            0.8,
            (hole.outer_width ?? hole.outer_diameter ?? hole.hole_width ?? hole.hole_diameter ?? 1) / 2 + 0.4
          ),
          ry = Math.max(
            0.8,
            (hole.outer_height ?? hole.outer_diameter ?? hole.hole_height ?? hole.hole_diameter ?? 1) / 2 +
              0.4
          )
        holes.push({
          ref: `${owner.ref} board/lead aperture`,
          x0: x - rx,
          x1: x + rx,
          y0: hole.y - ry,
          y1: hole.y + ry
        })
      }
    }
    const tiles = tilePlate(plate, holes)
    for (let k = 0; k < tiles.length; k++)
      stiffeners.push({ name: `${d.name}_${k}`, island: d.name, ...tiles[k] })
    d.stiffenerCoverage =
      tiles.reduce((n, r) => n + (r.x1 - r.x0) * (r.y1 - r.y0), 0) /
      ((plate.x1 - plate.x0) * (plate.y1 - plate.y0))
    d.stiffenerWindows = holes
  }
  plans.boards[side] = {
    length,
    height: 20,
    originalCircuitSHA256: hash(bytes),
    sourceComponents: src.size,
    pcbComponents: pcs.length,
    islands,
    bends,
    outline: rounded([...upper, ...lower]),
    stiffeners
  }
  console.log(
    side,
    JSON.stringify({
      length,
      width: 20,
      islands: islands.map((d) => ({
        name: d.name,
        length: d.length,
        offset: d.offsetX,
        stiffenerCoverage: d.stiffenerCoverage,
        bottomComponents: d.bottomReferences.length
      })),
      bends: bends.length,
      stiffenerTiles: stiffeners.length
    })
  )
}
writeFileSync("src/flex/layout.json", JSON.stringify(plans, null, 2) + "\n")
