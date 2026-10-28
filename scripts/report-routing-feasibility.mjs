import { readFileSync, mkdirSync, writeFileSync } from "node:fs"

// Reads generated geometry only. Does not run a router or change either board.
const boards = {}
for (const side of ["main", "secondary"]) {
  const path = `dist/src/${side}-board/${side}-board/circuit.json`
  const circuit = JSON.parse(readFileSync(path, "utf8"))
  const all = type => circuit.filter(e => e.type === type)
  const parent = new Map()
  function root(id) {
    if (!parent.has(id)) parent.set(id, id)
    if (parent.get(id) !== id) parent.set(id, root(parent.get(id)))
    return parent.get(id)
  }
  function join(ids) { for (const id of ids.slice(1)) parent.set(root(id), root(ids[0])) }
  const components = new Map(all("source_component").map(e => [e.source_component_id, e]))
  for (const c of components.values()) for (const group of c.internally_connected_source_port_ids ?? []) join(group)
  for (const t of all("source_trace")) join([...(t.connected_source_port_ids ?? []), ...(t.connected_source_net_ids ?? [])])
  const sourcePorts = new Map(all("source_port").map(e => [e.source_port_id, e]))
  const pcbPorts = all("pcb_port")
  const nets = all("source_net").map(net => {
    const ports = pcbPorts.filter(p => p.source_port_id && root(p.source_port_id) === root(net.source_net_id))
    const refs = [...new Set(ports.map(p => components.get(sourcePorts.get(p.source_port_id)?.source_component_id)?.name).filter(Boolean))]
    return { name: net.name, placedPortCount: ports.length, refs,
      straightExtentMm: ports.length ? +(Math.max(...ports.map(p => p.x))-Math.min(...ports.map(p => p.x)) +
        Math.max(...ports.map(p => p.y))-Math.min(...ports.map(p => p.y))).toFixed(3) : 0 }
  }).filter(net => net.refs.length >= 2)
  const placed = all("pcb_component").filter(p => components.has(p.source_component_id))
  const outline = all("pcb_board")[0]
  boards[side] = { input: path, outlineMm: { width: outline.width, height: outline.height },
    sourceComponents: components.size,
    placedComponentsByLayer: Object.fromEntries(["top", "bottom"].map(layer => [layer, placed.filter(p => p.layer === layer).length])),
    pads: all("pcb_smtpad").length, vias: all("pcb_via").length,
    routedTraces: all("pcb_trace").length, connectedNetsWithMultipleComponents: nets.length,
    nets: nets.sort((a,b) => b.straightExtentMm-a.straightExtentMm) }
}
const report = { generatedAtUTC: new Date().toISOString(),
  stage: "Placement feasibility only; detailed routing disabled",
  notes: ["Extent is a geometric span, not trace length, a routed topology or a timing result.",
    "A netlist and clear courtyards do not establish routability or manufacturing clearance.",
    "Final stack-up, planes, RF impedance, power return paths and escape geometry remain unverified."], boards }
mkdirSync("dist", { recursive: true })
writeFileSync("dist/routing-feasibility.json", JSON.stringify(report, null, 2)+"\n")
for (const [side,b] of Object.entries(boards)) console.log(side, JSON.stringify({ ...b, nets: undefined }))
