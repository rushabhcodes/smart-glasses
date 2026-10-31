import { createHash } from "node:crypto"

const round = (n) => Math.round(Math.round(n * 1e6) / 100) / 1e4
export const sha = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex")
const sorted = (values) => values.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
function clean(value) {
  if (Array.isArray(value)) return value.map(clean)
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([key]) =>
            !/(^|_)ids?$/.test(key) && !key.includes("connectivity_map") && key !== "member_source_group_ids"
        )
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, v]) => [key, clean(v)])
    )
  return value
}
// Quantize only geometry in mm; electrical values (including pF/nF) stay exact.
function geometry(value) {
  if (Array.isArray(value)) return value.map(geometry)
  if (value && typeof value === "object")
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, geometry(v)]))
  return typeof value === "number" ? round(value) : value
}
function relative(value, center) {
  if (Array.isArray(value)) return value.map((v) => relative(v, center))
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => [
        key,
        typeof v === "number" && (key === "x" || key === "y") ? v - center[key] : relative(v, center)
      ])
    )
  return value
}

/** Compare physical pins/nets, part metadata and land patterns without generated IDs. */
export function contract(data) {
  const all = (type) => data.filter((e) => e.type === type)
  const components = new Map(all("source_component").map((e) => [e.source_component_id, e]))
  const parent = new Map()
  function find(id) {
    if (!parent.has(id)) parent.set(id, id)
    if (parent.get(id) !== id) parent.set(id, find(parent.get(id)))
    return parent.get(id)
  }
  function join(ids) {
    for (const id of ids.slice(1)) parent.set(find(id), find(ids[0]))
  }
  for (const c of components.values())
    for (const ids of c.internally_connected_source_port_ids ?? []) join(ids)
  for (const c of all("source_component_internal_connection")) join(c.source_port_ids)
  for (const t of all("source_trace"))
    join([...(t.connected_source_port_ids ?? []), ...(t.connected_source_net_ids ?? [])])
  const labels = [
    ...all("source_port")
      .filter((p) => components.has(p.source_component_id))
      .map((p) => [
        p.source_port_id,
        `pin:${components.get(p.source_component_id).name}.${p.pin_number}:${p.name}`
      ]),
    ...all("source_net").map((n) => [n.source_net_id, `net:${n.name}`])
  ]
  const classes = new Map()
  for (const [id, label] of labels) {
    const root = find(id)
    if (!classes.has(root)) classes.set(root, [])
    classes.get(root).push(label)
  }
  const connectivity = sorted([...classes.values()].map((x) => x.sort()))
  const metadata = sorted([...components.values()].map(clean))
  const ports = sorted(
    all("source_port")
      .filter((p) => components.has(p.source_component_id))
      .map((p) => ({
        ...clean(p),
        ref: components.get(p.source_component_id).name
      }))
  )
  const nets = sorted(all("source_net").map(clean))
  const placements = {},
    footprints = {},
    parts = {}
  for (const [id, c] of components) {
    const pcb = all("pcb_component").find((p) => p.source_component_id === id)
    placements[c.name] = geometry(
      clean({
        center: pcb.center,
        rotation: pcb.rotation,
        layer: pcb.layer,
        width: pcb.width,
        height: pcb.height
      })
    )
    const lands = data.filter(
      (e) =>
        e.pcb_component_id === pcb.pcb_component_id &&
        ["pcb_smtpad", "pcb_plated_hole", "pcb_hole", "pcb_courtyard_rect", "pcb_courtyard_outline"].includes(
          e.type
        )
    )
    footprints[c.name] = sha(sorted(lands.map((e) => geometry(clean(relative(e, pcb.center))))))
    parts[c.name] = sha({
      component: clean(c),
      ports: sorted(ports.filter((p) => p.ref === c.name))
    })
  }
  return {
    electricalSHA256: sha({ metadata, ports, nets, connectivity }),
    connectivitySHA256: sha(connectivity),
    sourceComponents: components.size,
    parts: Object.fromEntries(Object.entries(parts).sort()),
    footprints: Object.fromEntries(Object.entries(footprints).sort()),
    placements: Object.fromEntries(Object.entries(placements).sort()),
    vias: sorted(
      all("pcb_via").map((v) => ({
        ...geometry(clean(v)),
        net: all("source_net").find((n) => n.source_net_id === v.source_net_id)?.name
      }))
    )
  }
}
