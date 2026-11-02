import {mkdir,readFile,writeFile} from "node:fs/promises"
import {spawnSync} from "node:child_process"
import {slimHousingParts} from "../src/slim/slim-housing"
const {renderToJscadPlan}=await import(new URL("../node_modules/jscad-fiber/dist/headless.js",import.meta.resolve("@tscircuit/core")).href)
const out="dist/slim-housing-review"
await mkdir(`${out}/plans`,{recursive:true});await mkdir(`${out}/stl`,{recursive:true})
const manifest=[]
for(const p of slimHousingParts) {
  await writeFile(`${out}/plans/${p.name}.jscad.json`,JSON.stringify(renderToJscadPlan(p.element)))
  manifest.push({name:p.name,color:p.color,side:p.name.startsWith("main")?"main":"secondary",printTransform:null})
}
await writeFile(`${out}/part-manifest.json`,JSON.stringify(manifest))
const result=spawnSync(process.env.ENCLOSURE_PYTHON??"/workspace/.cloud-setup/host-tools/bin/python",
  ["scripts/export-glasses-meshes.py",out],{stdio:"inherit",timeout:180000})
if(result.status!==0)throw Error(`Envelope mesh export failed: ${result.status}`)
const report=JSON.parse(await readFile(`${out}/solid-mesh-review.json`,"utf8"))
if(report.parts.length!==4||report.parts.some((p:any)=>p.connectedSolids!==1||!p.stlReview.watertight))throw Error("Invalid envelope solids")
console.log("Four closed, oriented single-body envelope STLs exported; component clearance is checked by the separate actual-CAD profile assessment.")
