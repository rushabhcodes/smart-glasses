import assert from "node:assert/strict"
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { contract } from "./flex-contract.mjs"
const read=p=>JSON.parse(readFileSync(p,"utf8")), plan=read("src/slim/layout.json")
const near=(a,b,label)=>assert.ok(Math.abs(a-b)<1e-4,`${label}: ${a} != ${b}`)
const overlap=(a,b)=>a.x0<b.x1-1e-5&&a.x1>b.x0+1e-5&&a.y0<b.y1-1e-5&&a.y1>b.y0+1e-5
const rect=e=>({x0:e.center.x-e.width/2,x1:e.center.x+e.width/2,y0:e.center.y-e.height/2,y1:e.center.y+e.height/2})
const bbox=e=>e.outline?{x0:Math.min(...e.outline.map(p=>p.x)),x1:Math.max(...e.outline.map(p=>p.x)),
  y0:Math.min(...e.outline.map(p=>p.y)),y1:Math.max(...e.outline.map(p=>p.y))}:rect(e)
function segmentDistance(p,a,b) {
  const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy)))
  return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy)
}
function inside(p,poly) {
  let hit=false
  for(let i=0,j=poly.length-1;i<poly.length;j=i++) {
    const a=poly[i],b=poly[j]
    if((a.y>p.y)!==(b.y>p.y)&&p.x<(b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x)hit=!hit
  }
  return hit
}
const results={baselineCommit:plan.settings.baselineCommit,boards:{},routing:"outstanding",physicalFit:"unverified"}
for(const side of ["main","secondary"]) {
  const base=read(`dist/src/flex/${side}-flex/circuit.json`),a=read(`dist/src/slim/${side}-slim/circuit.json`)
  const expected=contract(base),actual=contract(a),b=plan.boards[side], changed=side==="secondary"?["J2","J3","J4"]:[]
  const all=t=>a.filter(e=>e.type===t)
  assert.deepEqual(a.filter(e=>e.type.includes("error")),[],`${side} native build errors`)
  assert.equal(actual.sourceComponents,expected.sourceComponents)
  assert.deepEqual(all("pcb_trace"),[],"Do not imply routing completion")
  const src=new Map(all("source_component").map(e=>[e.source_component_id,e]))
  const normalized=a.filter(e=>!(e.type==="source_port"&&changed.includes(src.get(e.source_component_id)?.name)&&e.port_hints?.includes("MP")))
    .map(e=>e.type==="source_port"&&changed.includes(src.get(e.source_component_id)?.name)?{...e,name:`pin${e.pin_number}`}:e)
  assert.equal(contract(normalized).connectivitySHA256,expected.connectivitySHA256,`${side}: physical pin/net connectivity changed`)
  for(const ref of Object.keys(expected.parts)) {
    if(!changed.includes(ref)) {
      assert.equal(actual.parts[ref],expected.parts[ref],`${side}:${ref} part/port metadata changed`)
      assert.equal(actual.footprints[ref],expected.footprints[ref],`${side}:${ref} land pattern changed`)
    }
    assert.equal(actual.placements[ref].rotation,expected.placements[ref].rotation,`${ref} rotation changed`)
    assert.equal(actual.placements[ref].layer,expected.placements[ref].layer,`${ref} layer changed`)
  }
  assert.deepEqual(actual.vias,expected.vias,`${side}: thermal vias changed`)
  const board=all("pcb_board")[0];assert.equal(all("pcb_board").length,1)
  near(board.height,17,"width");near(board.width,b.length,"length");near(board.thickness,.2,"flex thickness")
  assert.equal(board.material,"flex");assert.equal(board.num_layers,4)
  const pcs=all("pcb_component").filter(e=>src.has(e.source_component_id))
  let edge=Infinity
  for(const c of pcs) {
    const envs=[rect(c),...a.filter(e=>e.pcb_component_id===c.pcb_component_id&&e.type.startsWith("pcb_courtyard")).map(bbox)]
    for(const e of envs)for(const p of [{x:e.x0,y:e.y0},{x:e.x1,y:e.y0},{x:e.x1,y:e.y1},{x:e.x0,y:e.y1}]) {
      assert.ok(inside(p,board.outline),`${side}:${src.get(c.source_component_id).name} outside actual outline`)
      edge=Math.min(edge,...board.outline.map((q,i)=>segmentDistance(p,q,board.outline[(i+1)%board.outline.length])))
    }
  }
  assert.ok(edge>=.5-1e-4,`${side}: insufficient measured courtyard-to-outline margin ${edge}`)
  for(const bend of all("pcb_bend")) {
    const zone=all("pcb_keepout").find(e=>e.pcb_group_id===bend.pcb_group_id)
    const group=all("pcb_group").find(e=>e.pcb_group_id===bend.pcb_group_id)
    near(bend.start.x,zone.center.x,"bend/keepout alignment");near(group.center.x,zone.center.x,"group/keepout alignment")
    assert.equal(zone.allow_traces,true);assert.notEqual(zone.allow_placements,true)
    for(const c of pcs)assert.ok(!overlap(rect(c),rect(zone)),`${side}: component in static bend`)
    for(const e of a.filter(e=>e.type.startsWith("pcb_courtyard")))assert.ok(!overlap(bbox(e),rect(zone)),`${side}: courtyard in static bend`)
    for(const v of [...all("pcb_via"),...all("pcb_hole"),...all("pcb_plated_hole")]) {
      const rx=(v.outer_diameter??v.outer_width??v.hole_diameter??v.hole_width??0)/2,
        ry=(v.outer_diameter??v.outer_height??v.hole_diameter??v.hole_height??0)/2
      assert.ok(!overlap({x0:v.x-rx,x1:v.x+rx,y0:v.y-ry,y1:v.y+ry},rect(zone)),`${side}: via/hole in bend`)
    }
    for(const s of all("pcb_stiffener"))assert.ok(!overlap(rect(s),rect(zone)),`${side}: backing in bend`)
  }
  for(const s of all("pcb_stiffener")) {
    const r=rect(s),island=b.islands.find(i=>r.x0>=i.left&&r.x1<=i.right)
    assert.ok(island,`${side}: backing outside island`)
    assert.ok(r.x0>=island.left+.4-1e-4&&r.x1<=island.right-.4+1e-4&&r.y0>=-8.1-1e-4&&r.y1<=8.1+1e-4)
    for(const h of island.stiffenerWindows)assert.ok(!overlap(r,h),`${side}: backing enters ${h.ref} clearance`)
  }
  for(const ref of changed) {
    const c=pcs.find(c=>src.get(c.source_component_id).name===ref), count=ref==="J2"?3:2
    assert.equal(src.get(c.source_component_id).manufacturer_part_number,`BM0${count}B-ACHSS-GAN-ETF`)
    assert.ok(!src.get(c.source_component_id).supplier_part_numbers?.jlcpcb,"No verified JLC assembly listing")
    const pads=all("pcb_smtpad").filter(e=>e.pcb_component_id===c.pcb_component_id)
    assert.equal(pads.length,count+2)
    assert.equal(all("pcb_plated_hole").filter(e=>e.pcb_component_id===c.pcb_component_id).length,0)
    const signal=pads.filter(e=>e.width<.65).sort((a,b)=>a.x-b.x)
    for(let i=0;i<count;i++) {
      near(signal[i].x-c.center.x,(i-(count-1)/2)*1.2,`${ref} signal pitch/order`)
      near(signal[i].y-c.center.y,1.875,`${ref} signal row`)
      near(signal[i].width,.6,`${ref} pad width`);near(signal[i].height,.85,`${ref} pad height`)
      near(signal[i].corner_radius,.15,`${ref} signal pad corner radius`)
      const port=all("pcb_port").find(e=>e.pcb_port_id===signal[i].pcb_port_id)
      const sp=all("source_port").find(e=>e.source_port_id===port.source_port_id)
      assert.equal(sp.pin_number,i+1,`${ref} physical pad-to-pin mapping`)
    }
    const tabs=pads.filter(e=>e.width>.65).sort((a,b)=>a.x-b.x), tabOffset=count===3?2.35:1.75
    for(let i=0;i<2;i++) {
      near(tabs[i].x-c.center.x,i===0?-tabOffset:tabOffset,`${ref} mounting pad X`)
      near(tabs[i].y-c.center.y,-1.9,`${ref} mounting pad row`)
      near(tabs[i].width,.7,`${ref} mounting pad width`);near(tabs[i].height,.8,`${ref} mounting pad height`)
      near(tabs[i].corner_radius,.175,`${ref} mounting pad corner radius`)
    }
    const mp=all("source_port").filter(e=>e.source_component_id===c.source_component_id&&e.port_hints?.includes("MP"))
    assert.ok(mp.length>0 && mp.every(e=>e.do_not_connect),`${ref} mounting tabs must remain NC`)
  }
  results.boards[side]={components:actual.sourceComponents,lengthMm:b.length,widthMm:17,thicknessMm:.2,
    widthReductionPercent:15,changedConnectors:changed,allOtherLandPatternsAndMetadataPreserved:true,
    physicalPinConnectivityPreserved:true,thermalVias:actual.vias.length,minCourtyardToOutlineMm:edge,
    nativeErrors:0,bends:all("pcb_bend").length,stiffenerTiles:all("pcb_stiffener").length}
}
mkdirSync("dist/slim-review",{recursive:true})
writeFileSync("dist/slim-review/validation.json",JSON.stringify(results,null,2)+"\n")
console.log(JSON.stringify(results))
