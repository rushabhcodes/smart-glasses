import assert from "node:assert/strict"
import { readFileSync, writeFileSync } from "node:fs"
const data = JSON.parse(readFileSync("dist/src/camera-carrier/camera-carrier/circuit.json", "utf8"))
const all = type => data.filter(x => x.type === type)
const components = new Map(all("source_component").map(x => [x.name,x]))
const nets = new Map(all("source_net").map(x => [x.name,x.source_net_id]))
const parent = new Map()
const find = id => { if (!parent.has(id)) parent.set(id,id); if (parent.get(id)!==id) parent.set(id,find(parent.get(id))); return parent.get(id) }
const join = ids => ids.slice(1).forEach(x => parent.set(find(x),find(ids[0])))
for (const c of components.values()) for (const ids of c.internally_connected_source_port_ids ?? []) join(ids)
for (const t of all("source_trace")) join([...(t.connected_source_port_ids ?? []),...(t.connected_source_net_ids ?? [])])
function port(ref,n) { const c=components.get(ref);assert.ok(c,ref); const p=all("source_port").find(p=>p.source_component_id===c.source_component_id&&p.pin_number===n);assert.ok(p,`${ref}.${n}`);return p }
function pin(ref,n,net) { assert.ok(nets.has(net),net);assert.equal(find(port(ref,n).source_port_id),find(nets.get(net)),`${ref}.${n} must be ${net}`) }
const pins=(ref,m)=>Object.entries(m).forEach(([n,net])=>pin(ref,Number(n),net))
// Independent transcription from MJY5OAF-F3M-V1, 20 June 2023, not imported from TSX.
pins("J_CAM",{2:"GND",3:"RAW_SDA",4:"CAM_AVDD",5:"RAW_SCL",6:"RAW_RESETB",7:"RAW_VSYNC",8:"RAW_PWDN",9:"RAW_HREF",10:"CAM_DVDD",11:"CAM_DOVDD",12:"RAW_D7",13:"RAW_XCLK",14:"RAW_D6",15:"GND",16:"RAW_D5",17:"RAW_PCLK",18:"RAW_D4",19:"RAW_D0",20:"RAW_D3",21:"RAW_D1",22:"RAW_D2",23:"GND",24:"AF_EXTERNAL_2V8"})
for (const n of [1,25,26]) assert.ok(![...nets.values()].some(net=>find(net)===find(port("J_CAM",n).source_port_id)),`Reserved/mount ${n} connected`)
for (const [ref,n] of [["U_CORE",4],["U_IO",4],["U_DVP4",11],["U_DVP4",12]])
 assert.ok(![...nets.values()].some(net=>find(net)===find(port(ref,n).source_port_id)),`${ref}.${n} must remain NC`)
for (const a of ["HOST_3V3","CAM_DOVDD","CAM_AVDD","CAM_DVDD","AF_EXTERNAL_2V8","GND"])
 for (const b of ["HOST_3V3","CAM_DOVDD","CAM_AVDD","CAM_DVDD","AF_EXTERNAL_2V8","GND"])
  if(a!==b)assert.notEqual(find(nets.get(a)),find(nets.get(b)),`${a}/${b} short`)
for(const [ref,en,out] of [["U_IO","EN_IO","CAM_DOVDD"],["U_CORE","EN_CORE","CAM_DVDD"],["U_ANALOG","EN_ANALOG","CAM_AVDD"]])
 pins(ref,{1:"HOST_3V3",2:"GND",3:en,5:out})
const channels=[['D0','D1','D2','D3'],['D4','D5','D6','D7'],['PCLK','HREF','VSYNC','XCLK'],['PWDN','RESETB',null,null]]
for(let i=0;i<4;i++){
 const ref=`U_DVP${i+1}`;pins(ref,{9:"CAM_OE_N_1V8",10:"GND",15:"HOST_3V3",16:"CAM_DOVDD"})
 for(let ch=0;ch<4;ch++){
  const signal=channels[i][ch],output=signal&&!['XCLK','PWDN','RESETB'].includes(signal)
  pin(ref,[1,2,7,8][ch],output||!signal?"CAM_DOVDD":"GND")
  pin(ref,[3,4,5,6][ch],signal?`RAW_${signal}`:"GND")
  if(signal)pin(ref,[14,13,12,11][ch],`HOST_${signal}`)
 }
 assert.deepEqual(components.get(ref).supplier_part_numbers.jlcpcb,["C1849453"])
}
pins("U_SCCB",{1:"CAM_DOVDD",2:"RAW_SCL",3:"RAW_SDA",4:"GND",5:"SCCB_ENABLE_3V3",6:"HOST_SDA",7:"HOST_SCL",8:"HOST_3V3"})
for(const s of ['IO','ANALOG','CORE']){pins(`R_EN_${s}`,{1:`EN_${s}`,2:"GND"});assert.equal(components.get(`R_EN_${s}`).resistance,100000)}
pins("R_OE_OFF",{1:"CAM_DOVDD",2:"CAM_OE_N_1V8"});pins("R_PWDN_SAFE",{1:"CAM_DOVDD",2:"RAW_PWDN"});pins("R_RESET_SAFE",{1:"RAW_RESETB",2:"GND"});pins("R_SCCB_OFF",{1:"SCCB_ENABLE_3V3",2:"GND"});assert.equal(components.get("R_SCCB_OFF").resistance,10000)
for(const [ref,id] of [["J_CAM","C262276"],["U_CORE","C2867152"],["U_IO","C2877863"],["U_ANALOG","C2865893"],["U_SCCB","C544515"]])assert.deepEqual(components.get(ref).supplier_part_numbers.jlcpcb,[id])
assert.equal(all("pcb_board").length,1);const board=all("pcb_board")[0];assert.equal(board.width,58);assert.equal(board.height,18);assert.equal(all("pcb_trace").length,0)
const errors=data.filter(x=>x.type.includes("error"));assert.deepEqual(errors,[],`native errors: ${errors.map(x=>x.message).join('; ')}`)
const warnings=data.filter(x=>x.type.includes("warning"));assert.ok(warnings.every(x=>["source_refdes_convention_warning","schematic_sheet_styling_warning"].includes(x.type)),"Unresolved non-importer warnings")
const byId = new Map([...components.values()].map(c=>[c.source_component_id,c.name]))
for(const p of all("pcb_component")) {
 const ref=byId.get(p.source_component_id)
 if(ref.startsWith('C_')||ref.startsWith('R_'))assert.equal(p.layer,'bottom',`${ref} bottom`)
 assert.ok(Math.abs(p.center.x)+p.width/2<=29.01 && Math.abs(p.center.y)+p.height/2<=9.01,`${ref} outside board`)
}
const raw=readFileSync('imports/AFC01_S24FCC_00.tsx','utf8')
const pads=[...raw.matchAll(/<smtpad portHints=\{\["pin(\d+)"\]\} pcbX="([-.\d]+)mm" pcbY="([-.\d]+)mm" width="([.\d]+)mm" height="([.\d]+)mm"/g)].map(m=>m.slice(1).map(Number))
assert.equal(pads.length,26);const signal=pads.filter(p=>p[0]<=24).sort((a,b)=>a[0]-b[0]);for(let i=1;i<24;i++)assert.ok(Math.abs(signal[i][1]-signal[i-1][1]-.5)<.001)
assert.ok(signal.every(p=>Math.abs(p[3]-.3)<.001&&Math.abs(p[4]-1.3)<.001))
// Base-accuracy arithmetic only, not a complete line/load/transient rail bound.
for(const [v,e,min,max] of [[1.5,.015,1.425,1.575],[1.8,.015,1.71,3],[2.85,.02,2.66,2.94]])assert.ok(v*(1-e)>=min && v*(1+e)<=max)
const result={passed:true,sourceComponents:components.size,physicalCameraContactsAudited:24,mountingPadsNotWired:[25,26],widthMm:58,heightMm:18,thicknessMm:board.thickness,nativeErrors:0,nativeWarnings:warnings.map(x=>({type:x.type,message:x.message})),detailedRouting:false,batteryInstantiated:false,afRegulatorInstantiated:false,hostIntegration:false,footprintAudit:'import pad numbering/pitch/dimensions checked; manufacturer drawing access blocked, mating/land qualification remains open',hardwareTested:false,checkedAtUTC:new Date().toISOString()}
writeFileSync('dist/camera-carrier-checks.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2))
