import assert from "node:assert/strict"
import { readFileSync } from "node:fs"

function graph(path) {
  const data = JSON.parse(readFileSync(path, "utf8"))
  const all = type => data.filter(e => e.type === type)
  const components = new Map(all("source_component").map(e => [e.name, e]))
  const nets = new Map(all("source_net").map(e => [e.name, e.source_net_id]))
  const parents = new Map()
  const find = id => {
    if (!parents.has(id)) parents.set(id, id)
    if (parents.get(id) !== id) parents.set(id, find(parents.get(id)))
    return parents.get(id)
  }
  const join = ids => ids.slice(1).forEach(id => parents.set(find(id), find(ids[0])))
  for (const c of components.values()) for (const ids of c.internally_connected_source_port_ids ?? []) join(ids)
  for (const t of all("source_trace")) join([...(t.connected_source_port_ids ?? []), ...(t.connected_source_net_ids ?? [])])
  function connected(ref, pin, net) {
    const c = components.get(ref)
    assert.ok(c, `Missing ${ref}`)
    const ports = all("source_port").filter(p => p.source_component_id === c.source_component_id && p.pin_number === pin)
    assert.ok(ports.length && nets.has(net), `Missing ${ref}.${pin} or ${net}`)
    for (const p of ports) assert.equal(find(p.source_port_id), find(nets.get(net)), `${ref}.${pin} must be ${net}`)
  }
  const separate = (a, b) => assert.notEqual(find(nets.get(a)), find(nets.get(b)), `${a} shorted to ${b}`)
  const pins = (ref, contract) => Object.entries(contract).forEach(([pin, net]) => connected(ref, Number(pin), net))
  assert.equal(all("pcb_board").length, 1, "Each entry must build an independent board")
  assert.equal(all("pcb_trace").length, 0, "Detailed routing remains disabled")
  return { all, components, connected, pins, separate }
}
const left = graph("dist/src/main-board/main-board/circuit.json")
const right = graph("dist/src/secondary-board/secondary-board/circuit.json")
// Independent physical contact contract, deliberately not imported from the TSX.
const cable = ["GND", "VSYS", "VSYS", "GND", "VSYS", "VSYS", "GND", "VCORE3V3", "GND",
  "AUDIO_BCLK", "GND", "AUDIO_LRCLK", "GND", "AUDIO_DOUT", "GND", "CTRL_SCL", "CTRL_SDA",
  "TOUCH_OUT", "AMP_ENABLE", "GND"]
for (const board of [left, right]) {
  cable.forEach((net, i) => board.connected("J1", i + 1, net))
  for (const [a,b] of [["GND","VSYS"],["GND","VCORE3V3"],["VSYS","VCORE3V3"]]) board.separate(a,b)
  assert.deepEqual(board.components.get("J1").supplier_part_numbers.jlcpcb, ["C596730"])
}
right.pins("U1", {1:"CHARGE_TS",2:"VBAT",3:"VBAT",4:"CHARGE_CE_N",5:"GND",6:"VOUT_ALWAYS",
  8:"GND",10:"VOUT_ALWAYS",11:"VOUT_ALWAYS",12:"CHARGE_ILIM",13:"CHARGE_5V",14:"CHARGE_TMR",
  15:"GND",16:"CHARGE_ISET",17:"GND"})
right.pins("J2", {1:"VBAT",2:"GND",3:"PACK_NTC"})
right.pins("J3", {1:"CHARGE_5V",2:"GND"})
for (const [ref,a,b] of [["R30","CHARGE_ISET","GND"],["R31","CHARGE_TMR","GND"],
  ["R32","CHARGE_ILIM","GND"],["R33","CHARGE_5V","PACK_NTC"],["R34","PACK_NTC","GND"],
  ["R35","PACK_NTC","CHARGE_TS"],["R36","VOUT_ALWAYS","CHARGE_CE_N"],
  ["R37","SYSTEM_ON","GND"],["C33","SWITCH_CT","GND"]]) right.pins(ref,{1:a,2:b})
right.separate("CHARGE_CE_N","GND")
for (const [a,b] of [["VBAT","GND"],["VBAT","VSYS"],["VBAT","VOUT_ALWAYS"],
  ["VOUT_ALWAYS","VSYS"],["CHARGE_5V","VBAT"],["PACK_NTC","GND"]]) right.separate(a,b)
right.pins("SW2",{1:"SWITCH_BIAS",2:"SYSTEM_ON",3:"GND"})
right.pins("U2",{1:"VOUT_ALWAYS",2:"VOUT_ALWAYS",3:"SYSTEM_ON",4:"VOUT_ALWAYS",5:"GND",
  6:"SWITCH_CT",7:"VSYS",8:"VSYS",9:"GND"})
right.pins("U3",{1:"GND",2:"VBAT",3:"VBAT",4:"GND",6:"GND",7:"CTRL_SCL",8:"CTRL_SDA",9:"GND"})
right.pins("R21",{1:"VCORE3V3",2:"CTRL_SCL"}); right.pins("R22",{1:"VCORE3V3",2:"CTRL_SDA"})
right.pins("U4",{1:"AUDIO_DOUT",2:"AMP_GAIN",3:"GND",4:"AMP_SD_MODE",7:"VSYS",8:"VSYS",
  9:"SPK_P",10:"SPK_N",11:"GND",14:"AUDIO_LRCLK",15:"GND",16:"AUDIO_BCLK",17:"GND"})
right.pins("J4",{1:"SPK_P",2:"SPK_N"});right.separate("SPK_P","GND");right.separate("SPK_N","GND")
right.pins("Q2",{1:"AMP_NPN_BASE",2:"GND",3:"AMP_PNP_SINK"})
right.pins("Q3",{1:"AMP_PNP_BASE",2:"VSYS",3:"AMP_SD_MODE"})
for (const [ref,a,b] of [["R23","VSYS","AMP_GAIN"],["R24","AMP_ENABLE","AMP_NPN_BASE"],
  ["R25","AMP_NPN_BASE","GND"],["R27","AMP_PNP_BASE","AMP_PNP_SINK"],
  ["R28","VSYS","AMP_PNP_BASE"],["R29","AMP_SD_MODE","GND"]]) right.pins(ref,{1:a,2:b})
right.separate("AMP_ENABLE","AMP_SD_MODE")
right.pins("U5",{1:"TOUCH_RAW",2:"GND",3:"TOUCH_SNSK",4:"TOUCH_SNS",5:"VCORE3V3",6:"GND"})
right.pins("C26",{1:"TOUCH_SNSK",2:"TOUCH_SNS"});right.pins("R26",{1:"TOUCH_SNSK",2:"TOUCH_ELECTRODE"})
for (const [ref,r] of [["R30",2210],["R31",68000],["R32",4700],["R33",30900],["R34",18700],
  ["R35",100000],["R36",10000],["R23",100000]]) assert.equal(right.components.get(ref).resistance,r)
for (const [ref,id] of [["U1","C544783"],["U2","C122837"],["U3","C2682616"],["U4","C910544"],["U5","C74512"],
  ["Q2","C81464"],["Q3","C53444"]]) assert.deepEqual(right.components.get(ref).supplier_part_numbers.jlcpcb,[id])
// Charge-current tolerance, not a measured charge result. Pack benchmark allows up to 2 A quick charge.
assert.ok(975 / (2210 * 0.99) < 0.45)
console.log("Both boards: cable contact contract, charger default inhibit/NTC network, switched power, gauge, audio bridge/enable and touch connectivity passed. Physical cable/NTC/thermal validation remains unrun.")

// TI TS comparator limits + Vishay material9 nominal R/T fit and tolerance model.
// This proves chosen electrical corners at 0/45 C; it cannot prove thermal coupling.
const rup = right.components.get("R33").resistance
const rparallel = right.components.get("R34").resistance
function senseBounds(celsius) {
  const kelvin = celsius + 273.15
  const nominal = 10000 * Math.exp(-14.6337 + 4791.842/kelvin - 115334/kelvin**2 - 3.730535e6/kelvin**3)
  const values = []
  for (const r25 of [0.95,1.05]) for (const beta of [-0.0075,0.0075])
    for (const top of [rup*0.99,rup*1.01]) for (const parallel of [rparallel*0.99,rparallel*1.01]) {
      const ntc = nominal*r25*Math.exp(3977*beta*(1/kelvin - 1/298.15))
      const bottom = 1/(1/ntc + 1/parallel)
      values.push(bottom/(top+bottom))
    }
  return { min:Math.min(...values),max:Math.max(...values) }
}
const cold=senseBounds(0), hot=senseBounds(45)
assert.ok(cold.min > 0.255, "0 C must inhibit even at the highest cold comparator threshold")
assert.ok(hot.max < 0.12, "45 C must inhibit even at the lowest hot comparator threshold")
assert.ok((rparallel*0.99)/(rup*1.01+rparallel*0.99) > 0.255, "Open NTC must inhibit")
const shortedBottom = 1 / (1 / 1 + 1 / rparallel) // 1 ohm sensor short fault
assert.ok(shortedBottom / (rup * 0.99 + shortedBottom) < 0.12, "Shorted NTC must inhibit")
console.log(`TS model: 0 C ratio ${cold.min.toFixed(4)}..${cold.max.toFixed(4)}; 45 C ${hot.min.toFixed(4)}..${hot.max.toFixed(4)}. Charge remains default-disabled pending physical validation.`)

right.pins("R38",{1:"VOUT_ALWAYS",2:"SWITCH_BIAS"});assert.equal(right.components.get("R38").resistance,10000)
right.pins("U6",{1:"GND",2:"TOUCH_RAW",3:"GND",4:"TOUCH_OUT",5:"VCORE3V3"})
right.pins("C27",{1:"VCORE3V3",2:"GND"});right.separate("TOUCH_RAW","TOUCH_OUT")
assert.deepEqual(right.components.get("U6").supplier_part_numbers.jlcpcb,["C7833"])
// QT1010 VOH>=2.3V / VOL<=0.5V; LVC thresholds 2.0V / 0.8V at3.0..3.6V.
const logicNominal = 0.8 * (1 + left.components.get("R9").resistance / left.components.get("R10").resistance)
assert.ok(logicNominal * 0.97 - 0.1 >= 3 && logicNominal * 1.03 + 0.04 <= 3.6, "Touch buffer rail must stay within its 3.0..3.6 V TTL-threshold range")
console.log("Touch TTL buffer and current-limited hardware-switch bias connectivity passed.")

assert.equal(right.components.get("R24").resistance,1000);assert.equal(right.components.get("R25").resistance,1000)
