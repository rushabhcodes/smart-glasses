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
for (const n of [20, 46, 55, 56]) connected("U1", n, "VCORE3V3")
for (const n of [2, 3]) connected("U1", n, "VDD_RF")
assert.equal(pin("U1", 2)[0].name, "VDD3P31", "R8 physical pad-2 supply label changed")
assert.notEqual(pin("U1", 2)[0].requires_ground, true, "Imported ground attribute incorrectly marks the supply pad")
for (const [ref, a, b] of [["C1", "VCORE3V3", "GND"], ["C2", "VDD_RF", "GND"],
  ["C3", "MCU_EN", "GND"], ["R1", "VCORE3V3", "MCU_EN"], ["R2", "VCORE3V3", "BOOT_N"],
  ["R3", "STRAP_GPIO46", "GND"], ["R4", "STRAP_GPIO45", "GND"]]) {
  connected(ref, 1, a); connected(ref, 2, b)
}
for (const [n, net] of [[4, "MCU_EN"], [52, "STRAP_GPIO46"], [51, "STRAP_GPIO45"],
  [5, "BOOT_N"], [50, "UART0_RX"], [49, "UART0_TX"], [36, "REC_LED"], [6, "USER_BUTTON"]]) connected("U1", n, net)
for (const [ref, a, b] of [["R5", "VCORE3V3", "USER_BUTTON"], ["C4", "USER_BUTTON", "GND"],
  ["R6", "VCORE3V3", "REC_LED_ANODE"],
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
for (const n of [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 28, 38, 39, 40, 41, 42]) {
  const port = pin("U1", n)[0]
  assert.equal(port.do_not_connect, true, `Reserved camera/USB/PSRAM pad ${n} must remain unconnected in this stage`)
  assert.ok(![...nets.values()].some((net) => find(net) === find(port.source_port_id)), `Reserved pad ${n} has a net`)
}
for (const [ref, id] of [["U1", "C2913194"], ["C1", "C45783"], ["C2", "C14663"], ["C3", "C15849"],
  ["C4", "C14663"], ["SW1", "C72443"], ["LED1", "C3030991"], ["R6", "C21190"], ["R7", "C21190"], ["R8", "C21190"], ["Q1", "C81464"],
  ["U2", "C109322"], ["L1", "C3033018"], ["R9", "C861315"], ["R10", "C122538"], ["R11", "C122538"],
  ...["R1", "R2", "R3", "R4"].map((ref) => [ref, "C25804"])])
  assert.deepEqual(components.get(ref)?.supplier_part_numbers?.jlcpcb, [id], `${ref} must retain its verified import ID`)
const pcb = all("pcb_component").find((e) => e.source_component_id === components.get("U1").source_component_id)
const pads = all("pcb_smtpad").filter((e) => e.pcb_component_id === pcb.pcb_component_id)
assert.equal(pads.length, 57, "Expected 56 R8 QFN lands plus its ground EPAD")
assert.equal(pads.filter((p) => p.port_hints.includes("pin57")).length, 1, "R8 EPAD was lost")
assert.equal(all("pcb_via").length, 9, "Imported thermal via array changed; assembly review required")
assert.equal(all("pcb_trace").length, 0, "Routing must remain disabled during schematic development")
console.log("MCU and control guards passed: physical supplies, EN/BOOT/straps, UART, capture switch, LED polarity/current path, reserved pins, supplier IDs, R8 EPAD and no routing.")

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
connected("U1",1,"RF_CHIP"); connected("R13",1,"RF_MATCHED"); connected("R13",2,"RF_ANTENNA")
connected("J2",1,"GND");connected("J2",2,"RF_ANTENNA");connected("J2",3,"GND")
console.log("Compact microphone, shared audio/control GPIO map and RF connector connectivity passed; RF tuning and memory-rail droop remain bench gates.")

for (const via of all("pcb_via")) assert.equal(via.source_net_id, nets.get("GND"), "Thermal via is not grounded")

for (const [number, net] of [[1,"MIC_SD"],[2,"GND"],[3,"MIC_SD_RAW"],[4,"MIC_REF_HALF"],[5,"VCORE3V3"]]) connected("U4",number,net)
assert.notEqual(find(nets.get("MIC_SD_RAW")),find(nets.get("MIC_SD")),"Mic output bypasses threshold restoration")
for (const [ref,a,b] of [["C12","VCORE3V3","GND"],["R14","VCORE3V3","MIC_REF_HALF"],["R15","MIC_REF_HALF","GND"],["C13","MIC_REF_HALF","GND"]]) {connected(ref,1,a);connected(ref,2,b)}
assert.equal(components.get("R14").resistance,100000);assert.equal(components.get("R15").resistance,100000)
assert.deepEqual(components.get("U4").supplier_part_numbers.jlcpcb,["C133590"])
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

// R8 retains 8MB in-package octal PSRAM and adds the verified 8MB quad flash.
for (const [n,net] of [[29,"VDD_SPI"],[30,"SPIHD"],[31,"SPIWP"],[32,"SPICS0"],[33,"SPICLK"],[34,"SPIQ"],[35,"SPID"],[53,"XTAL_N"],[54,"XTAL_P_CHIP"]]) connected("U1",n,net)
for (const [n,net] of [[1,"FLASH_CS"],[2,"FLASH_IO1"],[3,"FLASH_IO2"],[4,"GND"],[5,"FLASH_IO0"],[6,"FLASH_CLK"],[7,"FLASH_IO3"],[8,"VDD_SPI"],[9,"GND"]]) connected("U5",n,net)
for (const [i,[a,b]] of [["SPICS0","FLASH_CS"],["SPICLK","FLASH_CLK"],["SPIQ","FLASH_IO1"],["SPID","FLASH_IO0"],["SPIWP","FLASH_IO2"],["SPIHD","FLASH_IO3"]].entries()) {
  connected(`R${16+i}`,1,a); connected(`R${16+i}`,2,b)
  assert.equal(components.get(`R${16+i}`).resistance,0)
}
for (const [ref,net] of [["R22","FLASH_CS"],["R23","FLASH_IO2"],["R24","FLASH_IO3"]]) {
  connected(ref,1,"VDD_SPI");connected(ref,2,net);assert.equal(components.get(ref).resistance,10000)
}
connected("R25",1,"VCORE3V3");connected("R25",2,"VDD_SPI")
assert.equal(components.get("R25").resistance,0,"R8 memory feed must use the reviewed common3.3 V supply")
connected("TP9",1,"VDD_SPI")
assert.notEqual(find(nets.get("VDD_SPI")),find(nets.get("GND")),"Memory supply is shorted to ground")
for(const ref of ["C21","C22","C23"]) {connected(ref,1,"VDD_SPI");connected(ref,2,"GND")}
for(const [n,net] of [[1,"XTAL_P"],[2,"GND"],[3,"XTAL_N"],[4,"GND"]]) connected("Y1",n,net)
assert.equal(components.get("Y1").ftype,"simple_crystal","Crystal must remain passive, not a powered oscillator")
assert.equal(components.get("Y1").frequency,40e6,"ESP32-S3 requires a 40 MHz crystal")
for(const [ref,a,b] of [["L4","XTAL_P_CHIP","XTAL_P"],["C24","XTAL_P","GND"],["C25","XTAL_N","GND"],
 ["L3","VCORE3V3","VDD_RF"],["C16","VDD_RF","GND"],["C17","VCORE3V3","GND"],["C18","VCORE3V3","GND"],
 ["C19","VCORE3V3","GND"],["C20","VCORE3V3","GND"],["C14","RF_CHIP","GND"],["L2","RF_CHIP","RF_MATCHED"],["C15","RF_MATCHED","GND"]]) {connected(ref,1,a);connected(ref,2,b)}
for(const [ref,id] of [["R25","C21189"],["U5","C2940197"],["Y1","C5357833"],["L2","C86109"],["L3","C18216"],["L4","C167472"],
 ["C14","C85897"],["C15","C85897"],["C24","C106997"],["C25","C106997"]])
 assert.deepEqual(components.get(ref).supplier_part_numbers.jlcpcb,[id])
const flashPcb=all("pcb_component").find(p=>p.source_component_id===components.get("U5").source_component_id)
const flashPads=all("pcb_smtpad").filter(p=>p.pcb_component_id===flashPcb.pcb_component_id)
assert.equal(flashPcb.layer,"bottom","Review underside placement changed; update mechanical cavity")
assert.equal(flashPads.length,9)
const flashEP=flashPads.find(p=>p.port_hints.includes("pin9"))
for(const via of all("pcb_via")) {
 assert.ok(Math.abs(via.x-flashEP.x)>(flashEP.width+via.outer_diameter)/2 || Math.abs(via.y-flashEP.y)>(flashEP.height+via.outer_diameter)/2,
 "Winbond requires no exposed vias underneath its center pad")
}
console.log("R8 external flash/clock/RF guards passed; power integrity, timing, crystal and RF tuning are unmeasured.")

assert.equal(components.get("Y1").load_capacitance,10e-12)
const crystalPcb=all("pcb_component").find(p=>p.source_component_id===components.get("Y1").source_component_id)
const crystalPads=all("pcb_smtpad").filter(p=>p.pcb_component_id===crystalPcb.pcb_component_id)
assert.equal(crystalPads.length,4)
for(const pad of crystalPads) {assert.ok(Math.abs(pad.width-.85)<1e-8);assert.ok(Math.abs(pad.height-.75)<1e-8)}
const px=crystalPads.map(p=>p.x);const py=crystalPads.map(p=>p.y)
assert.ok(Math.abs(Math.max(...px)-Math.min(...px)-1.35)<1e-8)
assert.ok(Math.abs(Math.max(...py)-Math.min(...py)-1.05)<1e-8)
console.log("Exact ECS crystal option, ground-case pins and corrected manufacturer land pattern passed.")

connected("U1",8,"STRAP_GPIO3");connected("R26",1,"VCORE3V3");connected("R26",2,"STRAP_GPIO3")
assert.equal(components.get("R26").resistance,10000)
assert.deepEqual(components.get("R26").supplier_part_numbers.jlcpcb,["C25804"])
assert.notEqual(find(nets.get("STRAP_GPIO3")),find(nets.get("GND")),"GPIO3 must select USB JTAG when strapping is enabled")
const gpio3Ports=ports.filter(p=>find(p.source_port_id)===find(nets.get("STRAP_GPIO3")))
assert.deepEqual(gpio3Ports.map(p=>[p.source_component_id,p.pin_number]).sort(),
 [[components.get("U1").source_component_id,8],[components.get("R26").source_component_id,2]].sort(),
 "GPIO3 must not be used by another peripheral")
console.log("GPIO3 has a deterministic external pull-up and remains reserved from peripherals.")

for(const n of [1,2]) connected("SW1",n,"CAPTURE_CONTACT")
for(const n of [3,4,5]) connected("SW1",n,"GND")
assert.equal(components.get("R5").resistance,2700)
assert.deepEqual(components.get("R5").supplier_part_numbers.jlcpcb,["C13167"])
connected("R27",1,"USER_BUTTON");connected("R27",2,"CAPTURE_CONTACT")
assert.equal(components.get("R27").resistance,150)
assert.deepEqual(components.get("R27").supplier_part_numbers.jlcpcb,["C22808"])
assert.ok((railMin-.1)/((2700+150)*1.01+.1)>.001,"KMR silver contacts need at least1mA closed current")
assert.ok((railMax+.04)/(150*.99)<.05,"C4 discharge must stay below the50mA switch rating")
assert.ok((railMax+.04)**2/(150*.99)<.1,"R27 peak power exceeds its100mW rating")
assert.ok((railMax+.04)*(150*1.01+.1)/(2700*.99+150*1.01+.1)<.25*(railMin-.1),"Closed switch fails MCU low threshold")
assert.equal(components.get("C24").capacitance,15e-12)
assert.equal(components.get("C25").capacitance,15e-12)
console.log("KMR contact groups/ground lug, minimum steady current, capacitor-discharge current, GPIO low and15pF initial crystal loads passed.")

const comparatorPcb=all("pcb_component").find(p=>p.source_component_id===components.get("U4").source_component_id)
const comparatorPads=all("pcb_smtpad").filter(p=>p.pcb_component_id===comparatorPcb.pcb_component_id)
assert.equal(comparatorPads.length,5)
for(const p of comparatorPads){assert.ok(Math.abs(p.width-.4)<1e-8);assert.ok(Math.abs(p.height-.95)<1e-8)}
assert.ok(Math.abs(Math.max(...comparatorPads.map(p=>p.y))-Math.min(...comparatorPads.map(p=>p.y))-2.2)<1e-8)
console.log("Selected comparator DCK0005A land dimensions and row spacing match the TI drawing.")
