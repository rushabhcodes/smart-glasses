import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

// Independent release guards for this partial MCU core, based on PICO-1 v1.2 Table 2-1.
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
assert.notEqual(find(nets.get("GND")), find(nets.get("VCORE3V3")), "3.3 V is shorted to GND")
connected("U1", 57, "GND")
for (const n of [2, 3, 20, 46, 55, 56]) connected("U1", n, "VCORE3V3")
assert.equal(pin("U1", 2)[0].name, "VDD3P31", "PICO physical pad-2 supply label changed")
assert.notEqual(pin("U1", 2)[0].requires_ground, true, "Imported ground attribute incorrectly marks the supply pad")
for (const [ref, a, b] of [["C1", "VCORE3V3", "GND"], ["C2", "VCORE3V3", "GND"],
  ["C3", "MCU_EN", "GND"], ["R1", "VCORE3V3", "MCU_EN"], ["R2", "VCORE3V3", "BOOT_N"],
  ["R3", "STRAP_GPIO46", "GND"], ["R4", "STRAP_GPIO45", "GND"]]) {
  connected(ref, 1, a); connected(ref, 2, b)
}
for (const [n, net] of [[4, "MCU_EN"], [52, "STRAP_GPIO46"], [51, "STRAP_GPIO45"],
  [5, "BOOT_N"], [50, "UART0_RX"], [49, "UART0_TX"], [36, "REC_LED"], [6, "USER_BUTTON"]]) connected("U1", n, net)
for (const [ref, a, b] of [["R5", "VCORE3V3", "USER_BUTTON"], ["C4", "USER_BUTTON", "GND"],
  ["SW1", "USER_BUTTON", "GND"], ["R6", "VCORE3V3", "REC_LED_ANODE"],
  ["R7", "REC_LED_BASE", "GND"], ["R8", "REC_LED", "REC_LED_BASE"],
  ["LED1", "REC_LED_CATHODE", "REC_LED_ANODE"]]) {
  connected(ref, 1, a); connected(ref, 2, b)
}
assert.notEqual(find(nets.get("USER_BUTTON")), find(nets.get("GND")), "Capture button is shorted while released")
connected("Q1", 1, "REC_LED_BASE"); connected("Q1", 2, "GND"); connected("Q1", 3, "REC_LED_CATHODE")
for (const [number, net] of [[1, "GND"], [2, "CORE_POWER_GOOD"], [3, "REG_VAUX"], [4, "GND"],
  [5, "REG_FB"], [7, "VCORE3V3"], [8, "VCORE3V3"], [9, "REG_L2"], [10, "GND"],
  [11, "REG_L1"], [12, "VSYS"], [13, "VSYS"], [14, "VSYS"], [15, "GND"]]) connected("U2", number, net)
assert.equal(pin("U2", 6)[0].do_not_connect, true, "Unused FB2 must not be a supply or feedback connection")
for (const [ref, a, b] of [["L1", "REG_L1", "REG_L2"], ["R9", "VCORE3V3", "REG_FB"],
  ["R10", "REG_FB", "GND"], ["R11", "VCORE3V3", "CORE_POWER_GOOD"], ["C5", "REG_VAUX", "GND"],
  ["C6", "VSYS", "GND"], ["C7", "VSYS", "GND"], ...["C8", "C9", "C10"].map(ref => [ref, "VCORE3V3", "GND"])]) {
  connected(ref, 1, a); connected(ref, 2, b)
}
assert.notEqual(find(nets.get("VSYS")), find(nets.get("VCORE3V3")), "Raw system voltage bypasses the regulator")
assert.notEqual(find(nets.get("REG_L1")), find(nets.get("REG_L2")), "Inductor is bypassed")
assert.equal(components.get("R9").resistance, 312000)
assert.equal(components.get("R10").resistance, 100000)
assert.equal(components.get("L1").inductance, "1.5uH")
// TI PWM reference tolerance plus 0.1% / 25 ppm/K divider error over ±65 K.
// The ripple/transient allowances are bench acceptance limits, not measured results.
const dividerError = 0.001 + 25e-6 * 65
const ratio = components.get("R9").resistance / components.get("R10").resistance
const railMin = 0.8 * 0.99 * (1 + ratio * (1 - dividerError) / (1 + dividerError))
const railMax = 0.8 * 1.01 * (1 + ratio * (1 + dividerError) / (1 - dividerError))
assert.ok(railMin - 0.1 >= 3.0 && railMax + 0.04 <= 3.6, "Regulator tolerance budget violates the reviewed rail envelope")
assert.notEqual(find(nets.get("VCORE3V3")), find(nets.get("REC_LED_ANODE")), "Recording LED current limiter is bypassed")
assert.notEqual(find(nets.get("REC_LED")), find(nets.get("REC_LED_BASE")), "Recording LED base current limiter is bypassed")
for (const [ref, net] of [["TP1", "VCORE3V3"], ["TP2", "GND"], ["TP3", "UART0_TX"],
  ["TP4", "UART0_RX"], ["TP5", "MCU_EN"], ["TP6", "BOOT_N"]]) connected(ref, 1, net)
for (const n of [8, 25, 26, 28, 29, 30, 31, 32, 33, 34, 35, 38, 39, 40, 41, 42, 53, 54]) {
  const port = pin("U1", n)[0]
  assert.equal(port.do_not_connect, true, `Reserved USB/PSRAM pad ${n} must remain unconnected in this stage`)
  assert.ok(![...nets.values()].some((net) => find(net) === find(port.source_port_id)), `Reserved pad ${n} has a net`)
}
for (const [ref, id] of [["U1", "C7545129"], ["C1", "C45783"], ["C2", "C14663"], ["C3", "C15849"],
  ["C4", "C14663"], ["SW1", "C398741"], ["LED1", "C3030991"], ["R6", "C21190"], ["R7", "C21190"], ["R8", "C21190"], ["Q1", "C81464"],
  ["U2", "C109322"], ["L1", "C3033018"], ["R9", "C861315"], ["R10", "C122538"], ["R11", "C122538"],
  ...["R1", "R2", "R3", "R4", "R5"].map((ref) => [ref, "C25804"])])
  assert.deepEqual(components.get(ref)?.supplier_part_numbers?.jlcpcb, [id], `${ref} must retain its verified import ID`)
const pcb = all("pcb_component").find((e) => e.source_component_id === components.get("U1").source_component_id)
const pads = all("pcb_smtpad").filter((e) => e.pcb_component_id === pcb.pcb_component_id)
assert.equal(pads.length, 57, "Expected 56 PICO LGA lands plus its ground EPAD")
assert.equal(pads.filter((p) => p.port_hints.includes("pin57")).length, 1, "PICO EPAD was lost")
assert.equal(all("pcb_via").length, 9, "Imported thermal via array changed; assembly review required")
assert.equal(all("pcb_trace").length, 0, "Routing must remain disabled during schematic development")
console.log("MCU and control guards passed: physical supplies, EN/BOOT/straps, UART, capture switch, LED polarity/current path, reserved pins, supplier IDs, PICO EPAD and no routing.")

// Selected replacement mic uses its OWN physical pin map.
for (const [n,net] of [[1,"AUDIO_LRCLK"],[2,"GND"],[3,"GND"],[4,"AUDIO_BCLK"],[5,"VCORE3V3"],[6,"MIC_SD_RAW"]]) connected("U3",n,net)
for (const [n,net] of [[43,"AUDIO_BCLK"],[44,"AUDIO_LRCLK"],[45,"MIC_SD"],[47,"AUDIO_DOUT"],[48,"AMP_ENABLE"],[7,"CTRL_SCL"],[37,"CTRL_SDA"],[27,"TOUCH_OUT"]]) connected("U1",n,net)
connected("C11",1,"VCORE3V3"); connected("C11",2,"GND")
connected("R12",1,"MIC_SD_RAW"); connected("R12",2,"GND")
assert.equal(components.get("R12").resistance,100000)
assert.deepEqual(components.get("U3").supplier_part_numbers.jlcpcb,["C5656610"])
const micPcb = all("pcb_component").find(e => e.source_component_id === components.get("U3").source_component_id)
const hole = all("pcb_hole").find(e => e.pcb_component_id === micPcb.pcb_component_id)
assert.ok(hole?.hole_diameter >= 0.5 || hole?.hole_diameter_mm >= 0.5, "TDK acoustic aperture minimum is 0.5 mm")
connected("U1",1,"RF_SIP"); connected("R13",1,"RF_SIP"); connected("R13",2,"RF_ANTENNA")
connected("J2",1,"GND");connected("J2",2,"RF_ANTENNA");connected("J2",3,"GND")
console.log("Compact microphone, shared audio/control GPIO map and RF connector connectivity passed; RF tuning and memory-rail droop remain bench gates.")

for (const via of all("pcb_via")) assert.equal(via.source_net_id, nets.get("GND"), "Thermal via is not grounded")

for (const [number, net] of [[1,"MIC_SD"],[2,"GND"],[3,"MIC_SD_RAW"],[4,"MIC_REF_HALF"],[5,"VCORE3V3"]]) connected("U4",number,net)
assert.notEqual(find(nets.get("MIC_SD_RAW")),find(nets.get("MIC_SD")),"Mic output bypasses threshold restoration")
for (const [ref,a,b] of [["C12","VCORE3V3","GND"],["R14","VCORE3V3","MIC_REF_HALF"],["R15","MIC_REF_HALF","GND"],["C13","MIC_REF_HALF","GND"]]) {connected(ref,1,a);connected(ref,2,b)}
assert.equal(components.get("R14").resistance,100000);assert.equal(components.get("R15").resistance,100000)
assert.deepEqual(components.get("U4").supplier_part_numbers.jlcpcb,["C130037"])
// TDK SD at .35/.65 VDD, half-rail divider including resistor/temperature error,
// TI max4mV offset plus10mV allowance for hysteresis/noise (bench acceptance).
const refLo=(1-dividerError)/((1-dividerError)+(1+dividerError))
const refHi=(1+dividerError)/((1+dividerError)+(1-dividerError))
assert.ok(0.35*(railMax+0.04)+0.014 < refLo*(railMin-0.1))
assert.ok(0.65*(railMin-0.1)-0.014 > refHi*(railMax+0.04))
// TI 2.7V corner swing at4mA; final routed load must be <=15pF for55ns bound.
assert.ok((railMin-0.1)-0.350 > 0.75*(railMax+0.04))
assert.ok(0.325 < 0.25*(railMin-0.1))
assert.ok(75+55+50 < 1e9/(16000*64)/2,"Mic+comparator+setup allowance exceeds half BCLK")
console.log("Mic SD restoration: threshold/swing/timing budget passed; <=15pF load and noise margin still require routed-board measurements.")

const ringPads = all("pcb_smtpad").filter(p => p.pcb_component_id === micPcb.pcb_component_id && p.port_hints?.includes("pin3"))
assert.equal(ringPads.length,4,"Expected four touching ground-ring sectors")
const micHole = all("pcb_hole").find(p => p.pcb_component_id === micPcb.pcb_component_id)
for (const pad of ringPads) for (const point of pad.points) {
  const radius = Math.hypot(point.x-micHole.x,point.y-micHole.y)
  assert.ok(Math.min(Math.abs(radius-0.5125),Math.abs(radius-0.8125)) < 1e-5,"Ground-ring geometry differs from TDK Fig13")
}
console.log("Mic copper ID/OD and acoustic aperture match the primary land drawing; final stencil review remains open.")

assert.equal(components.get("R7").resistance,1000);assert.equal(components.get("R8").resistance,1000)
