import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { createHash } from "node:crypto"

// Local placement study. No electrical or manufacturing stackup inference.
const read = (p) => JSON.parse(readFileSync(p, "utf8"))
const save = (p, v) => writeFileSync(p, JSON.stringify(v, null, 2) + "\n")
const mode = process.argv[2] ?? "placement"
const box = (c) => ({ x0: c.center.x-c.width/2, x1:c.center.x+c.width/2,
  y0:c.center.y-c.height/2, y1:c.center.y+c.height/2 })
function envelope(c, data) {
  const b = box(c)
  for (const e of data.filter(e => e.pcb_component_id === c.pcb_component_id && e.type.startsWith("pcb_courtyard"))) {
    const points = e.outline ?? [{x:e.center.x-e.width/2,y:e.center.y-e.height/2},
      {x:e.center.x+e.width/2,y:e.center.y+e.height/2}]
    for (const p of points) { b.x0=Math.min(b.x0,p.x); b.x1=Math.max(b.x1,p.x);
      b.y0=Math.min(b.y0,p.y); b.y1=Math.max(b.y1,p.y) }
  }
  return b
}
function tile(plate, holes) {
  const xs=[...new Set([plate.x0,plate.x1,...holes.flatMap(h=>[Math.max(plate.x0,h.x0),Math.min(plate.x1,h.x1)])])]
    .filter(x=>x>=plate.x0 && x<=plate.x1).sort((a,b)=>a-b)
  const tiles=[], active=new Map()
  for(let i=0;i<xs.length-1;i++) {
    const x0=xs[i],x1=xs[i+1],mid=(x0+x1)/2
    if(x1-x0<1e-7) continue
    let ys=[[plate.y0,plate.y1]]
    for(const h of holes.filter(h=>mid>h.x0 && mid<h.x1))
      ys=ys.flatMap(([a,b])=>h.y1<=a||h.y0>=b?[[a,b]]:[[a,Math.min(b,h.y0)],[Math.max(a,h.y1),b]].filter(([a,b])=>b-a>1e-7))
    const next=new Map()
    for(const [y0,y1] of ys) {
      const key=JSON.stringify([y0,y1]), prev=active.get(key)
      if(prev && Math.abs(prev.x1-x0)<1e-7) { prev.x1=x1;next.set(key,prev) }
      else {const t={x0,x1,y0,y1};tiles.push(t);next.set(key,t)}
    }
    active.clear();for(const [k,v] of next) active.set(k,v)
  }
  return tiles
}
mkdirSync("src/slim",{recursive:true})
if(mode==="placement") {
  const plan=read("src/flex/layout.json")
  Object.assign(plan.settings,{baselineCommit:"7aef3782d619b0daf21f56876a795cf06a5ba2c8",islandHeight:17,
    componentEdgeMarginY:.7,usage:"LOCAL slim static-flex study; unrouted, unqualified stackup and fit"})
  for(const side of ["main","secondary"]) {
    const data=read(`dist/src/flex/${side}-flex/circuit.json`), b=plan.boards[side]
    const src=new Map(data.filter(e=>e.type==="source_component").map(e=>[e.source_component_id,e.name]))
    const positions=[]
    for(const c of data.filter(e=>e.type==="pcb_component" && src.has(e.source_component_id))) {
      const ref=src.get(c.source_component_id), env=envelope(c,data)
      const ach=side==="secondary" && ["J2","J3","J4"].includes(ref)
      const half=ach?2.8:Math.max(c.center.y-env.y0,env.y1-c.center.y)
      const max=8.5-.7-half
      if(max<0) throw Error(`${side}:${ref} cannot fit 17mm`)
      const y=Math.max(-max,Math.min(max,c.center.y))
      // Keep R27's intact courtyard clear of SW1 after moving it inward.
      const x=c.center.x-(side==="main" && ref==="R27"?2:0)
      positions.push({selector:ref,center:{x,y},relative_to:"group_center"})
    }
    save(`src/slim/${side}-placements.json`,positions)
    b.height=17;b.stiffeners=[]
    b.originalCircuitSHA256=createHash("sha256").update(JSON.stringify(data)).digest("hex")
    b.outline=b.outline.map(p=>({x:p.x,y:Math.abs(p.y)<=4?p.y:Math.sign(p.y)*(4+(Math.abs(p.y)-4)*.75)}))
    for(const island of b.islands) {
      island.stiffenerWindows=[]
      delete island.stiffenerContours; delete island.stiffenerRefinement
    }
  }
  save("src/slim/layout.json",plan)
} else if(mode==="backing") {
  const plan=read("src/slim/layout.json"),s=plan.settings
  for(const side of ["main","secondary"]) {
    const data=read(`dist/src/slim/${side}-slim/circuit.json`),b=plan.boards[side]
    const src=new Map(data.filter(e=>e.type==="source_component").map(e=>[e.source_component_id,e.name]))
    b.stiffeners=[]
    for(const island of b.islands) {
      const pcs=data.filter(e=>e.type==="pcb_component" && island.references.includes(src.get(e.source_component_id)))
      const plate={x0:island.left+s.stiffenerEdgeMargin,x1:island.right-s.stiffenerEdgeMargin,
        y0:-b.height/2+s.stiffenerEdgeMargin,y1:b.height/2-s.stiffenerEdgeMargin}
      const windows=pcs.filter(c=>c.layer==="bottom").map(c=>{
        const e=envelope(c,data),d=s.undersideClearance
        return {ref:src.get(c.source_component_id),x0:e.x0-d,x1:e.x1+d,y0:e.y0-d,y1:e.y1+d}
      })
      for(const h of data.filter(e=>["pcb_hole","pcb_plated_hole"].includes(e.type))) {
        const owner=pcs.find(c=>c.pcb_component_id===h.pcb_component_id)
        if(!owner) continue
        const rx=Math.max(.8,(h.outer_width??h.outer_diameter??h.hole_width??h.hole_diameter??1)/2+.4)
        const ry=Math.max(.8,(h.outer_height??h.outer_diameter??h.hole_height??h.hole_diameter??1)/2+.4)
        windows.push({ref:src.get(owner.source_component_id)+" lead aperture",x0:h.x-rx,x1:h.x+rx,y0:h.y-ry,y1:h.y+ry})
      }
      island.stiffenerWindows=windows
      delete island.stiffenerContours;delete island.stiffenerRefinement
      const tiles=tile(plate,windows)
      b.stiffeners.push(...tiles.map((t,i)=>({name:`${island.name}_${i}`,island:island.name,...t})))
      island.stiffenerCoverage=tiles.reduce((n,t)=>n+(t.x1-t.x0)*(t.y1-t.y0),0)/((plate.x1-plate.x0)*(plate.y1-plate.y0))
    }
  }
  save("src/slim/layout.json",plan)
} else throw Error("Use placement or backing")
