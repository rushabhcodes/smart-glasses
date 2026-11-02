/** Real CAD thumbnail for an assembly without a PCB-derived camera envelope. */
import {readFile,writeFile} from "node:fs/promises"
import {createHash} from "node:crypto"
import {renderGLTFToPNGFromGLB} from "poppygl"
import profile from "../src/slim/housing-profile.json"

const dir="dist/src/slim/slim-housing"
const bytes=await readFile(`${dir}/3d.glb`)
const circuit=JSON.parse(await readFile(`${dir}/circuit.json`,"utf8"))
if(circuit.filter((e:any)=>e.type==="cad_component").length!==4 || circuit.some((e:any)=>e.type.includes("error")))
  throw Error("Expected four valid native housing CAD parts")
// Native GLB maps the source's longitudinal Z to world Y and height Y to Z.
// Preserve the authored world coordinates and inspect the complete native mesh.
const centerY=(profile.settings.frontZ+profile.settings.backZ)/2
const camera={width:480,height:320,camPos:[245,centerY-275,187],lookAt:[0,centerY,12],
  up:"z+" as const,projection:"orthographic" as const,orthographicHeight:225,
  supersampling:2,realistic:true,backgroundColor:"#edf1f3"}
const glb=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)
const png=await renderGLTFToPNGFromGLB(glb,camera)
if(png.byteLength<2000)throw Error("Housing thumbnail unexpectedly empty")
await writeFile(`${dir}/3d.png`,png)
const sha=(b:Uint8Array)=>createHash("sha256").update(b).digest("hex")
const report={scope:"Explicit camera around unchanged native CAD; no synthetic PCB or geometry scaling",
  glbSHA256:sha(bytes),pngSHA256:sha(png),...camera}
await writeFile(`${dir}/preview-metadata.json`,JSON.stringify(report,null,2)+"\n")
console.log("Housing gallery preview rendered from native GLB:",png.byteLength,"bytes")
