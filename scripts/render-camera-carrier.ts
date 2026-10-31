import { readFile, writeFile, mkdir } from "node:fs/promises"
import { createHash } from "node:crypto"
import { convertCircuitJsonTo3D, convertSceneToGLTF, getBestCameraPosition } from "circuit-json-to-gltf"
import { renderGLTFToPNGFromGLB } from "poppygl"
const out="dist/camera-carrier-review", cache="dist/progress-model-cache"
await mkdir(out,{recursive:true});await mkdir(cache,{recursive:true});await mkdir("docs/progress",{recursive:true})
const hash=(b:any)=>createHash("sha256").update(b).digest("hex")
const bytes=await readFile("dist/src/camera-carrier/camera-carrier/circuit.json"), original=JSON.parse(bytes.toString()), data=structuredClone(original)
if(data.some((x:any)=>x.type.includes("error")))throw Error("Native errors: render blocked")
await writeFile(`${out}/circuit.json`,bytes)
let requested=0;const assets=new Map<string,string>()
for(const e of data)if(e.type==="cad_component"&&e.model_obj_url){
 const u=new URL(e.model_obj_url)
 if(u.hostname==="modelcdn.tscircuit.com"&&u.searchParams.get("cachebust_origin")==="")u.searchParams.delete("cachebust_origin")
 const url=u.toString(),file=`${cache}/${hash(url)}.obj`
 if(!assets.has(url)){
  let b:Buffer
  try{b=await readFile(file)}catch{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`CAD ${r.status}: ${u.pathname}`);b=Buffer.from(await r.arrayBuffer());await writeFile(file,b)}
  if(!/^v\s/m.test(b.toString())||!/^f\s/m.test(b.toString()))throw Error(`Invalid OBJ: ${u.pathname}`)
  assets.set(url,`data:text/plain;base64,${b.toString("base64")}`)
  console.log(`Loaded CAD ${u.pathname.split('/').at(-1)}`)
 }
 e.model_obj_url=assets.get(url);requested++
}
const scene=await convertCircuitJsonTo3D(data)
const loaded=scene.boxes.filter(b=>b.meshUrl?.startsWith('data:')&&b.mesh?.triangles?.length).length
if(loaded!==requested)throw Error(`Missing meshes: ${loaded}/${requested}`)
const views:any[]=[]
for(const mode of ['assembled','exploded'] as const){
 const copy=structuredClone(scene)
 if(mode==='exploded')for(const b of copy.boxes){
  if(b.meshUrl?.startsWith('data:')) b.center.y += b.center.y>=0 ? 3 : -3
 }
 const glb=await convertSceneToGLTF(copy,{binary:true}) as ArrayBuffer
 await writeFile(`${out}/${mode}.glb`,new Uint8Array(glb))
 const camera=getBestCameraPosition(original)
 const png=await renderGLTFToPNGFromGLB(glb,{...camera,width:1100,height:600,supersampling:2,realistic:true,backgroundColor:'#eef2f4'})
 const path=`docs/progress/2026-10-31-camera-carrier-${mode}.png`
 await writeFile(path,png)
 views.push({mode,path,pngSha256:hash(png),bytes:png.byteLength,camera})
 console.log(`Rendered ${mode}: ${png.byteLength} bytes`)
}
const report={capturedAtUTC:new Date().toISOString(),boardMm:[58,18,.8],sourceSha256:hash(bytes),requestedMeshes:requested,loadedMeshes:loaded,uniqueAssets:assets.size,views,note:'Actual independent unrouted carrier CAD. Exploded component meshes separated 3mm from PCB; no camera head/flex/heat sink or glasses-frame fit is depicted. Imported models need dimensional qualification.'}
await writeFile('docs/progress/2026-10-31-camera-carrier-snapshot.json',JSON.stringify(report,null,2)+'\n')
console.log(JSON.stringify({capturedAtUTC:report.capturedAtUTC,requested,loaded,views:views.map(v=>v.path)}))
