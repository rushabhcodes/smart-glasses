import assert from "node:assert/strict"
import { readFileSync, writeFileSync } from "node:fs"

// Conditional screening only. This is not a camera netlist or measured timing test.
// See docs/camera-voltage-review.md for test conditions, sources and unresolved gates.
const circuit = JSON.parse(readFileSync("dist/src/main-board/main-board/circuit.json", "utf8"))
const parts = new Map(circuit.filter(e => e.type === "source_component").map(e => [e.name, e]))
assert.equal(parts.get("U1")?.manufacturer_part_number, "ESP32-S3R8")
const dividerError = 0.001 + 25e-6 * 65
const ratio = parts.get("R9").resistance / parts.get("R10").resistance
const coreNominal = 0.8 * (1 + ratio)
const coreMin = 0.8 * 0.99 * (1 + ratio * (1 - dividerError) / (1 + dividerError)) - 0.1
const coreMax = 0.8 * 1.01 * (1 + ratio * (1 + dividerError) / (1 - dividerError)) + 0.04
const ioMin = 1.8 * 0.99
const ioMax = 1.8 * 1.01
const margins = []
function high(path, outputMin, inputRequired) {
  margins.push({ path, level: "high", outputMinV: outputMin, inputRequiredV: inputRequired,
    screeningMarginV: outputMin - inputRequired })
}
function low(path, outputMax, inputAllowed) {
  margins.push({ path, level: "low", outputMaxV: outputMax, inputAllowedV: inputAllowed,
    screeningMarginV: inputAllowed - outputMax })
}
high("OV5640 -> AXC A", 1.62, 0.65 * ioMax)
low("OV5640 -> AXC A", 0.18, 0.35 * ioMin)
high("AXC B -> S3", coreMin - 0.1, 0.75 * coreMax)
low("AXC B -> S3", 0.1, 0.25 * coreMin)
high("S3 -> AXC B", 0.8 * coreMin, 2)
low("S3 -> AXC B", 0.1 * coreMax, 0.8)
high("AXC A -> OV5640", ioMin - 0.1, 1.26)
low("AXC A -> OV5640", 0.1, 0.54)
high("OV5640 -> TCA9517 A", 1.62, 0.7 * ioMax)
low("OV5640 -> TCA9517 A", 0.18, 0.3 * ioMin)
low("TCA9517 A -> OV5640", 0.2, 0.54)
low("TCA9517 B -> S3", 0.6, 0.25 * coreMin)
high("S3 -> TCA9517 B", 0.8 * coreMin, 0.7 * coreMax)
low("S3 -> TCA9517 B contention", 0.1 * coreMax, 0.4)
// TCA9517's open-drain outputs use separate local pull-ups. Its 10uA maximum
// high-state output leakage gives a 0.1V allowance at 10k, excluding other loads.
high("TCA9517 A pull-up -> OV5640", ioMin - 10e-6 * 10000, 1.26)
high("TCA9517 B pull-up -> S3", coreMin - 10e-6 * 10000, 0.75 * coreMax)
for (const m of margins) assert.ok(m.screeningMarginV > 0, `${m.path}: negative screening margin`)
const rejected = [
  { path: "Untranslated OV5640 -> S3", marginV: 1.62 - 0.75 * coreMax },
  { path: "OV5640 -> TCA9406 input-low", marginV: 0.15 - 0.18 },
]
for (const m of rejected) assert.ok(m.marginV < 0)
const report = {
  status: "Conditional static screening; no selected/wired camera, rail sequencer or hardware verification",
  regulatorBudgetV: { nominal: coreNominal, min: coreMin, max: coreMax },
  proposedCameraIORailBudgetV: { nominal: 1.8, min: ioMin, max: ioMax },
  assumptions: [
    "OV5640 DC levels are specified at DOVDD1.8V; application over +/-1% is an unverified extrapolation.",
    "S3 Table5-4 is labelled3.3V/25C; output levels use a high-impedance load. Actual pull-up current/temperature require validation.",
    "AXC outputs use the <=100uA DC-load condition; AC timing is separate and requires <=15pF for the cited delay limits.",
    "TCA9517 A faces the sensor, B faces MCU. Include all leakage/current in the final pull-up budget.",
    "100pF is an assumed total bus capacitance on each SCCB side, not a measured value.",
    "Compatible regulated rails, power sequencing, reset, OE defaults and routed setup/hold/skew are not implemented by this calculation.",
  ],
  margins,
  rejected,
  sccbRiseTimeUs: 0.8473 * 10000 * 100e-12 * 1e6,
  translatorDelayMaxNs: { cameraToMCU: 7, MCUToCamera: 6, loadPf: 15 },
  primaryDocuments: {
    camera: "OV5640 v2.03 Table8-3, DOVDD1.8V, standard25pF output loading",
    mcu: "ESP32-S3 series v2.2 Table5-4,3.3V/25C",
    dvpTranslator: "TI SN74AXC4T774 SCES898C sections5.3/5.5/5.11",
    controlTranslator: "TI TCA9517 SCPS242D sections7.3/7.5/10/11",
    rejectedControlTranslator: "TI TCA9406 SCPS221G sections6.3/6.5",
  },
}
writeFileSync("dist/camera-interface-budget.json", JSON.stringify(report, null, 2) + "\n")
console.log(report.status)
console.table(margins.map(m => ({ path: m.path, level: m.level, marginV: +m.screeningMarginV.toFixed(4) })))
console.log(`SCCB assumed RC rise: ${report.sccbRiseTimeUs.toFixed(3)}us. Rejected direct DVP and TCA9406 input-low cases recorded.`)
console.log("Output: dist/camera-interface-budget.json. These assumptions do not establish worst-case qualification or a completed camera implementation.")
