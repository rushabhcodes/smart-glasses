import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

// Independent release guards for this partial MCU core, based on module Table 3-1.
// These check the GENERATED connectivity, so an incorrect JLCPCB symbol cannot
// silently swap physical 3V3/GND pads while the TSX still compiles.
const circuit = JSON.parse(readFileSync("dist/src/main-board/main-board/circuit.json", "utf8"))
const all = (type) => circuit.filter((e) => e.type === type)
const components = new Map(all("source_component").map((e) => [e.name, e]))
const ports = all("source_port")
const parent = new Map()
function find(x) {
  if (!parent.has(x)) parent.set(x, x)
  if (parent.get(x) !== x) parent.set(x, find(parent.get(x)))
  return parent.get(x)
}
function join(ids) {
  if (!ids.length) return
  const root = find(ids[0])
  for (const id of ids.slice(1)) parent.set(find(id), root)
}
for (const c of components.values())
  for (const group of c.internally_connected_source_port_ids ?? []) join(group)
for (const t of all("source_trace"))
  join([...(t.connected_source_port_ids ?? []), ...(t.connected_source_net_ids ?? [])])
const nets = new Map(all("source_net").map((e) => [e.name, e.source_net_id]))
function pin(ref, number) {
  const component = components.get(ref)
  assert.ok(component, `Missing component ${ref}`)
  const matches = ports.filter((p) => p.source_component_id === component.source_component_id && p.pin_number === number)
  assert.ok(matches.length, `Missing ${ref} physical pad ${number}`)
  return matches
}
function connected(ref, number, net) {
  assert.ok(nets.has(net), `Missing ${net}`)
  for (const port of pin(ref, number))
    assert.equal(find(port.source_port_id), find(nets.get(net)), `${ref} physical pad ${number} must connect to ${net}`)
}
assert.notEqual(find(nets.get("GND")), find(nets.get("V3V3_CORE")), "3.3 V is shorted to GND")
for (const n of [1, 40, 41]) connected("U1", n, "GND")
connected("U1", 2, "V3V3_CORE")
assert.equal(pin("U1", 2)[0].name, "VDD3V3", "Regenerated import has the wrong physical pad-2 label")
assert.notEqual(pin("U1", 2)[0].requires_ground, true, "Imported ground attribute incorrectly marks the supply pad")
for (const [ref, a, b] of [["C1", "V3V3_CORE", "GND"], ["C2", "V3V3_CORE", "GND"],
  ["C3", "MCU_EN", "GND"], ["R1", "V3V3_CORE", "MCU_EN"], ["R2", "V3V3_CORE", "BOOT_N"],
  ["R3", "STRAP_GPIO46", "GND"], ["R4", "STRAP_GPIO45", "GND"]]) {
  connected(ref, 1, a); connected(ref, 2, b)
}
for (const [n, net] of [[3, "MCU_EN"], [16, "STRAP_GPIO46"], [26, "STRAP_GPIO45"],
  [27, "BOOT_N"], [36, "UART0_RX"], [37, "UART0_TX"]]) connected("U1", n, net)
for (const [ref, net] of [["TP1", "V3V3_CORE"], ["TP2", "GND"], ["TP3", "UART0_TX"],
  ["TP4", "UART0_RX"], ["TP5", "MCU_EN"], ["TP6", "BOOT_N"]]) connected(ref, 1, net)
for (const n of [13, 14, 28, 29, 30]) {
  const port = pin("U1", n)[0]
  assert.equal(port.do_not_connect, true, `Reserved USB/PSRAM pad ${n} must remain unconnected in this stage`)
  assert.ok(![...nets.values()].some((net) => find(net) === find(port.source_port_id)), `Reserved pad ${n} has a net`)
}
for (const [ref, id] of [["U1", "C2980300"], ["C1", "C45783"], ["C2", "C14663"], ["C3", "C15849"],
  ...["R1", "R2", "R3", "R4"].map((ref) => [ref, "C25804"])])
  assert.deepEqual(components.get(ref)?.supplier_part_numbers?.jlcpcb, [id], `${ref} must retain its verified import ID`)
const pcb = all("pcb_component").find((e) => e.source_component_id === components.get("U1").source_component_id)
const pads = all("pcb_smtpad").filter((e) => e.pcb_component_id === pcb.pcb_component_id)
assert.equal(pads.length, 49, "Expected 40 edge lands plus nine EPAD segments")
assert.equal(pads.filter((p) => p.port_hints.includes("pin41")).length, 9, "EPAD segmentation was lost")
assert.equal(all("pcb_trace").length, 0, "Routing must remain disabled during schematic development")
console.log("MCU core guards passed: physical supply/ground, EN/BOOT/straps, UART, reserved pins, JLCPCB IDs, segmented EPAD and no routing.")
