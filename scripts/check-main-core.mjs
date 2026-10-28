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
assert.notEqual(find(nets.get("GND")), find(nets.get("VCORE3V2")), "3.3 V is shorted to GND")
for (const n of [1, 40, 41]) connected("U1", n, "GND")
connected("U1", 2, "VCORE3V2")
assert.equal(pin("U1", 2)[0].name, "VDD3V3", "Regenerated import has the wrong physical pad-2 label")
assert.notEqual(pin("U1", 2)[0].requires_ground, true, "Imported ground attribute incorrectly marks the supply pad")
for (const [ref, a, b] of [["C1", "VCORE3V2", "GND"], ["C2", "VCORE3V2", "GND"],
  ["C3", "MCU_EN", "GND"], ["R1", "VCORE3V2", "MCU_EN"], ["R2", "VCORE3V2", "BOOT_N"],
  ["R3", "STRAP_GPIO46", "GND"], ["R4", "STRAP_GPIO45", "GND"]]) {
  connected(ref, 1, a); connected(ref, 2, b)
}
for (const [n, net] of [[3, "MCU_EN"], [16, "STRAP_GPIO46"], [26, "STRAP_GPIO45"],
  [27, "BOOT_N"], [36, "UART0_RX"], [37, "UART0_TX"], [25, "REC_LED"], [39, "USER_BUTTON"]]) connected("U1", n, net)
for (const [ref, a, b] of [["R5", "VCORE3V2", "USER_BUTTON"], ["C4", "USER_BUTTON", "GND"],
  ["SW1", "USER_BUTTON", "GND"], ["R6", "VCORE3V2", "REC_LED_ANODE"],
  ["R7", "REC_LED_BASE", "GND"], ["R8", "REC_LED", "REC_LED_BASE"],
  ["LED1", "REC_LED_CATHODE", "REC_LED_ANODE"]]) {
  connected(ref, 1, a); connected(ref, 2, b)
}
assert.notEqual(find(nets.get("USER_BUTTON")), find(nets.get("GND")), "Capture button is shorted while released")
connected("Q1", 1, "REC_LED_BASE"); connected("Q1", 2, "GND"); connected("Q1", 3, "REC_LED_CATHODE")
for (const [number, net] of [[1, "GND"], [2, "CORE_POWER_GOOD"], [3, "REG_VAUX"], [4, "GND"],
  [5, "REG_FB"], [7, "VCORE3V2"], [8, "VCORE3V2"], [9, "REG_L2"], [10, "GND"],
  [11, "REG_L1"], [12, "VSYS"], [13, "VSYS"], [14, "VSYS"], [15, "GND"]]) connected("U2", number, net)
assert.equal(pin("U2", 6)[0].do_not_connect, true, "Unused FB2 must not be a supply or feedback connection")
for (const [ref, a, b] of [["L1", "REG_L1", "REG_L2"], ["R9", "VCORE3V2", "REG_FB"],
  ["R10", "REG_FB", "GND"], ["R11", "VCORE3V2", "CORE_POWER_GOOD"], ["C5", "REG_VAUX", "GND"],
  ["C6", "VSYS", "GND"], ["C7", "VSYS", "GND"], ...["C8", "C9", "C10"].map(ref => [ref, "VCORE3V2", "GND"])]) {
  connected(ref, 1, a); connected(ref, 2, b)
}
assert.notEqual(find(nets.get("VSYS")), find(nets.get("VCORE3V2")), "Raw system voltage bypasses the regulator")
assert.notEqual(find(nets.get("REG_L1")), find(nets.get("REG_L2")), "Inductor is bypassed")
assert.equal(components.get("R9").resistance, 300000)
assert.equal(components.get("R10").resistance, 100000)
assert.equal(components.get("L1").inductance, "1.5uH")
// TI PWM reference tolerance plus 0.1% / 25 ppm/K divider error over ±65 K.
// The ripple/transient allowances are bench acceptance limits, not measured results.
const dividerError = 0.001 + 25e-6 * 65
const ratio = components.get("R9").resistance / components.get("R10").resistance
const railMin = 0.8 * 0.99 * (1 + ratio * (1 - dividerError) / (1 + dividerError))
const railMax = 0.8 * 1.01 * (1 + ratio * (1 + dividerError) / (1 - dividerError))
assert.ok(railMin - 0.1 >= 3.0 && railMax + 0.04 <= 3.3, "Regulator tolerance budget violates the reviewed rail envelope")
assert.notEqual(find(nets.get("VCORE3V2")), find(nets.get("REC_LED_ANODE")), "Recording LED current limiter is bypassed")
assert.notEqual(find(nets.get("REC_LED")), find(nets.get("REC_LED_BASE")), "Recording LED base current limiter is bypassed")
for (const [ref, net] of [["TP1", "VCORE3V2"], ["TP2", "GND"], ["TP3", "UART0_TX"],
  ["TP4", "UART0_RX"], ["TP5", "MCU_EN"], ["TP6", "BOOT_N"]]) connected(ref, 1, net)
for (const n of [13, 14, 28, 29, 30]) {
  const port = pin("U1", n)[0]
  assert.equal(port.do_not_connect, true, `Reserved USB/PSRAM pad ${n} must remain unconnected in this stage`)
  assert.ok(![...nets.values()].some((net) => find(net) === find(port.source_port_id)), `Reserved pad ${n} has a net`)
}
for (const [ref, id] of [["U1", "C2980300"], ["C1", "C45783"], ["C2", "C14663"], ["C3", "C15849"],
  ["C4", "C14663"], ["SW1", "C398741"], ["LED1", "C3030991"], ["R6", "C21190"], ["R7", "C25803"], ["Q1", "C81464"],
  ["U2", "C109322"], ["L1", "C3033018"], ["R9", "C705762"], ["R10", "C122538"], ["R11", "C122538"],
  ...["R1", "R2", "R3", "R4", "R5", "R8"].map((ref) => [ref, "C25804"])])
  assert.deepEqual(components.get(ref)?.supplier_part_numbers?.jlcpcb, [id], `${ref} must retain its verified import ID`)
const pcb = all("pcb_component").find((e) => e.source_component_id === components.get("U1").source_component_id)
const pads = all("pcb_smtpad").filter((e) => e.pcb_component_id === pcb.pcb_component_id)
assert.equal(pads.length, 49, "Expected 40 edge lands plus nine EPAD segments")
assert.equal(pads.filter((p) => p.port_hints.includes("pin41")).length, 9, "EPAD segmentation was lost")
assert.equal(all("pcb_trace").length, 0, "Routing must remain disabled during schematic development")
console.log("MCU and control guards passed: physical supplies, EN/BOOT/straps, UART, capture switch, LED polarity/current path, reserved pins, supplier IDs, segmented EPAD and no routing.")
