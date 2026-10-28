import { readFileSync, writeFileSync, mkdirSync } from "node:fs"

// Design scenarios, not measured consumption or a hardware qualification test.
const main=JSON.parse(readFileSync("dist/src/main-board/main-board/circuit.json","utf8"))
const right=JSON.parse(readFileSync("dist/src/secondary-board/secondary-board/circuit.json","utf8"))
const part=(c,ref)=>c.find(p=>p.type==="source_component"&&p.name===ref)
const voltage=.8*(1+part(main,"R9").resistance/part(main,"R10").resistance)
const chargeMaxA=975/(part(right,"R30").resistance*.99)
const scenarios=[]
for(const logicA of [.35,.7,1]) for(const sharedPathOhm of [.2,.4]) {
  // Conservative scenario: logic and full-scale ideal 8-ohm BTL amplifier both
  // see the lowest common path voltage. Real right/left path resistances differ.
  const batteryV=3, efficiency=.85, audioEfficiency=.85, iq=.005
  const a=voltage*logicA/efficiency, b=1/(2*8*audioEfficiency)
  const discriminant=(batteryV-sharedPathOhm*iq)**2-4*(1+sharedPathOhm*b)*sharedPathOhm*a
  const vsys=(batteryV-sharedPathOhm*iq+Math.sqrt(discriminant))/(2*(1+sharedPathOhm*b))
  const batteryA=(batteryV-vsys)/sharedPathOhm
  scenarios.push({logicA,sharedPathOhm,batteryV,vsysV:+vsys.toFixed(3),batteryA:+batteryA.toFixed(3),
    amplifierAbove2p5V:vsys>=2.5,measured:false})
}
const dutyStates=[
  {state:"idle connected",seconds:54,logicA:.05,speakerW:0},
  {state:"capture",seconds:2,logicA:.30,speakerW:0},
  {state:"transmit",seconds:2,logicA:.40,speakerW:0},
  {state:"short reply",seconds:2,logicA:.15,speakerW:.10},
]
const cycleS=dutyStates.reduce((n,x)=>n+x.seconds,0)
const meanLogicA=dutyStates.reduce((n,x)=>n+x.seconds*x.logicA,0)/cycleS
const meanSpeakerW=dutyStates.reduce((n,x)=>n+x.seconds*x.speakerW,0)/cycleS
const dutyExample={implemented:false,measured:false,states:dutyStates,cycleSeconds:cycleS,
  averageLogicA:meanLogicA,averageSpeakerW:meanSpeakerW,
  averageBatteryAAt3VWithoutPathLoss:(voltage*meanLogicA/.85+meanSpeakerW/.85)/3+.005,
  txBatteryAAt3VWithoutPathLoss:voltage*.40/(.85*3)+.005,
  note:"Assumed non-overlapping states with camera power gating; not a runtime prediction or pulse-current qualification"}
const report={generatedAtUTC:new Date().toISOString(),
  status:"Conditional design calculations; no measured current, efficiency, temperature or runtime",
  assumptions:{logicRailV:voltage,logicLoadIncludesCamera:true,buckBoostEfficiency:.85,audioEfficiency:.85,
    speakerOhm:8,auxiliaryCurrentA:.005,cellMinimumV:3,thermalMetricsAreReferenceBoardOnly:true},
  scenarios,dutyExample,
  charge:{isetOhm:part(right,"R30").resistance,maxCurrentA:+chargeMaxA.toFixed(4),
    worstLinearChargeLossW:+((5.25-3)*chargeMaxA).toFixed(3),
    referenceThetaJaKPerW:45.8,referenceJunctionRiseC:+((5.25-3)*chargeMaxA*45.8).toFixed(1),
    jauch2050ColdChargeLimitA:.42,coldChargeLimitMet:chargeMaxA<=.42,chargingEnabled:false},
  boost:{lossAt1ALogicW:+(voltage*(1/.85-1)).toFixed(3),referenceThetaJaKPerW:63,
    referenceJunctionRiseC:+(voltage*(1/.85-1)*63).toFixed(1)},
  openGates:["Measure combined radio/camera/audio transients and actual efficiency",
    "Bound connector/cable/PCM/FET resistance and conductor current balance",
    "Select pack, NTC, application undervoltage cutoff and upstream fault limiting",
    "Validate common3.3V memory feed, factory/boot voltage mode and local rail droop",
    "Measure actual PCB/enclosure temperatures; JEDEC thetaJA does not establish wearer temperature"]}
mkdirSync("dist",{recursive:true});writeFileSync("dist/power-budget.json",JSON.stringify(report,null,2)+"\n")
console.log(JSON.stringify(report,null,2))
