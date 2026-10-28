import { readFile, writeFile, mkdir, rename } from "node:fs/promises"
import { createHash } from "node:crypto"
import { join } from "node:path"
import { convertCircuitJsonTo3D, convertSceneToGLTF, getBestCameraPosition } from "circuit-json-to-gltf"
import { renderGLTFToPNGFromGLB } from "poppygl"

// Uses the renderer libraries supplied by the pinned tsCircuit toolchain.
// The design is immutable here: only asset transport URLs in a render copy change.
const frozenAtUTC = new Date().toISOString()
const out = process.argv[2] ?? join("dist", "progress", frozenAtUTC.replaceAll(/[:.]/g,"-"))
const cache = join("dist", "progress-model-cache")
await mkdir(out,{recursive:true}); await mkdir(cache,{recursive:true})
const hash = b => createHash("sha256").update(b).digest("hex")
const boards=[]; const urls=new Set()
function canonicalModelURL(value) {
  const u=new URL(value)
  // An empty tool-added cache hint caused503 transport failures. Preserve asset UUID and all geometry.
  if(u.hostname==="modelcdn.tscircuit.com"&&u.searchParams.get("cachebust_origin")==="")u.searchParams.delete("cachebust_origin")
  return u.toString()
}
for(const [name,entry] of [["main","main-board"],["secondary","secondary-board"]]) {
  const bytes=await readFile(`dist/src/${entry}/${entry}/circuit.json`)
  const original=JSON.parse(bytes),render=structuredClone(original)
  for(const e of render)if(e.type==="cad_component"&&e.model_obj_url)urls.add(canonicalModelURL(e.model_obj_url))
  boards.push({name,original,render,sourceSHA256:hash(bytes)})
  await writeFile(join(out,`${name}.circuit.json`),bytes)
}
const assets=new Map(),assetRecords=[]
const list=[...urls]
for(let i=0;i<list.length;i+=2)await Promise.all(list.slice(i,i+2).map(async(url)=>{
  const file=join(cache,hash(url)+".obj");let bytes,fromCache=true
  try{bytes=await readFile(file)}catch{fromCache=false;const r=await fetch(url,{signal:AbortSignal.timeout(45000)});if(!r.ok)throw new Error(`CAD asset HTTP${r.status}: ${new URL(url).pathname}`);bytes=Buffer.from(await r.arrayBuffer())}
  const text=bytes.toString("utf8")
  if(!/^v\s/m.test(text)||!/^f\s/m.test(text))throw new Error(`Invalid OBJ geometry: ${new URL(url).pathname}`)
  if(!fromCache){await writeFile(file+".tmp",bytes);await rename(file+".tmp",file)}
  assets.set(url,`data:text/plain;base64,${bytes.toString("base64")}`)
  assetRecords.push({url,sha256:hash(bytes),bytes:bytes.length,fromCache})
  console.log(`Cached ${assets.size}/${list.length}: ${new URL(url).pathname.split("/").at(-1)}`)
}))
const results=[]
for(const b of boards) {
  const dir=join(out,"dist",b.name);await mkdir(dir,{recursive:true})
  let requestedMeshes=0
  for(const e of b.render)if(e.type==="cad_component"&&e.model_obj_url){e.model_obj_url=assets.get(canonicalModelURL(e.model_obj_url));requestedMeshes++}
  const scene=await convertCircuitJsonTo3D(b.render)
  const imported=scene.boxes.filter(box=>box.meshUrl?.startsWith("data:"))
  const missing=imported.filter(box=>!box.mesh?.triangles?.length)
  if(imported.length!==requestedMeshes||missing.length)throw new Error(`${b.name}: incomplete CAD geometry (${imported.length}/${requestedMeshes}, ${missing.length} empty)`)
  const glb=await convertSceneToGLTF(scene,{binary:true})
  if(!(glb instanceof ArrayBuffer))throw new Error("Expected binary GLB")
  await writeFile(join(dir,"board.glb"),new Uint8Array(glb))
  const png=await renderGLTFToPNGFromGLB(glb,{...getBestCameraPosition(b.original),width:720,height:480,supersampling:2,realistic:true})
  await writeFile(join(dir,"3d.png"),png)
  const board=b.original.find(e=>e.type==="pcb_board")
  const row={board:b.name,widthMm:board.width,heightMm:board.height,sourceComponents:b.original.filter(e=>e.type==="source_component").length,
    requestedMeshes,loadedImportedMeshes:imported.length,sourceSHA256:b.sourceSHA256,pngSHA256:hash(png),glbBytes:glb.byteLength}
  results.push(row);console.log(JSON.stringify(row))
}
await writeFile(join(out,"render-metadata.json"),JSON.stringify({frozenAtUTC,note:"Original supplier OBJ bytes cached; empty transport cache hint removed only in render copy; no component geometry/placement/net changes. Imported models remain subject to dimensional review.",assets:assetRecords,boards:results},null,2)+"\n")
console.log(`Complete CAD snapshots: ${out}`)
