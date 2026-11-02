import { readFile, writeFile, mkdir } from "node:fs/promises"
import { createHash } from "node:crypto"
import { convertCircuitJsonTo3D, convertSceneToGLTF } from "circuit-json-to-gltf"
import { renderGLTFToPNGFromGLB } from "poppygl"
const variant = process.argv[3] ?? "flex"
if (!["flex", "slim"].includes(variant)) throw Error("Expected flex or slim variant")
const housingFit = process.argv.includes("--housing-fit")
const plan = JSON.parse(await readFile(`src/${variant}/layout.json`, "utf8"))
const out = process.argv[2] ?? "dist/flex-review"
await mkdir(out, { recursive: true })
const sha = (b: any) => createHash("sha256").update(b).digest("hex")
const norm = (t: number[][]) => {
  const a = t[1].map((x, i) => x - t[0][i]),
    b = t[2].map((x, i) => x - t[0][i])
  const n = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
    d = Math.hypot(...n) || 1
  return n.map((x) => x / d)
}
function sceneBox(tris: number[][][], label: string, color: string) {
  const triangles = tris.map((t) => {
    const n = norm(t)
    return {
      vertices: t.map((p) => ({ x: -p[0], y: p[1], z: p[2] })),
      normal: { x: -n[0], y: n[1], z: n[2] }
    }
  })
  let min = [Infinity, Infinity, Infinity],
    max = [-Infinity, -Infinity, -Infinity]
  for (const t of triangles)
    for (const p of t.vertices)
      for (const [i, v] of [p.x, p.y, p.z].entries()) {
        min[i] = Math.min(min[i], v)
        max[i] = Math.max(max[i], v)
      }
  return {
    label,
    color,
    center: { x: 0, y: 0, z: 0 },
    size: { x: max[0] - min[0], y: max[1] - min[1], z: max[2] - min[2] },
    mesh: {
      triangles,
      boundingBox: {
        min: { x: min[0], y: min[1], z: min[2] },
        max: { x: max[0], y: max[1], z: max[2] }
      }
    }
  }
}
function rot(v: number[], r: any = {}) {
  let [x, y, z] = v
  const cy = Math.cos(r.y ?? 0),
    sy = Math.sin(r.y ?? 0)
  ;[x, z] = [x * cy - z * sy, x * sy + z * cy]
  const cz = Math.cos(r.z ?? 0),
    sz = Math.sin(r.z ?? 0)
  ;[x, y] = [x * cz + y * sz, -x * sz + y * cz]
  const cx = Math.cos(r.x ?? 0),
    sx = Math.sin(r.x ?? 0)
  ;[y, z] = [y * cx + z * sx, -y * sx + z * cx]
  return [x, y, z]
}
const bodies: any[] = [],
  reports: any[] = []
for (const side of ["main", "secondary"] as const) {
  const bytes = await readFile(`dist/src/${variant}/${side}-${variant}/circuit.json`),
    original = JSON.parse(bytes.toString()),
    a = structuredClone(original)
  const errors = a.filter((x: any) => x.type.includes("error"))
  if (errors.length) throw Error(`${side}: ${errors.length} native errors; render paused until corrected`)
  let requested = 0
  for (const e of a)
    if (e.type === "cad_component" && e.model_obj_url) {
      if (!e.model_obj_url.startsWith("data:")) {
        const u = new URL(e.model_obj_url)
        if (u.searchParams.get("cachebust_origin") === "") u.searchParams.delete("cachebust_origin")
        const b = await readFile(`dist/progress-model-cache/${sha(u.toString())}.obj`)
        e.model_obj_url = `data:text/plain;base64,${b.toString("base64")}`
      }
      requested++
    }
  const scene = await convertCircuitJsonTo3D(a, {
      foldPcbs: true,
      renderBoardTextures: false,
      pcbColor: "#b98530"
    }),
    loaded = scene.boxes.filter((b) => b.meshUrl?.startsWith("data:") && b.mesh?.triangles?.length).length
  if (loaded !== requested) throw Error(`${side}: missing model geometry ${loaded}/${requested}`)
  if (variant === "slim") {
    const flat = await convertCircuitJsonTo3D(a, {foldPcbs:false,renderBoardTextures:false,pcbColor:"#b98530"})
    await writeFile(`${out}/${side}-flat.glb`, new Uint8Array((await convertSceneToGLTF(flat,{binary:true})) as ArrayBuffer))
  }
  const sources = new Map(
      a.filter((e: any) => e.type === "source_component").map((e: any) => [e.source_component_id, e.name])
    ),
    j1 = a.find((e: any) => e.type === "pcb_component" && sources.get(e.source_component_id) === "J1")
  const sign = side === "main" ? 1 : -1,
    map = (p: number[]) => [sign * (73 + p[2]), 12 + p[1], 33 + sign * (j1.center.x - p[0])]
  for (const b of scene.boxes) {
    if (!b.mesh?.triangles.length) continue
    const tris = b.mesh.triangles.map((t) =>
      t.vertices.map((p) => {
        const v = rot([p.x, p.y, p.z], b.rotation)
        return map([v[0] + b.center.x, v[2] + b.center.z, v[1] + b.center.y])
      })
    )
    const label = b.label ?? "PCB",
      stiff = label.toLowerCase().includes("stiff")
    bodies.push({
      tris,
      label: `${side}:${label}`,
      side,
      stiff,
      color: stiff
        ? "#d8d6b9"
        : label === "PCB"
          ? "#b98530"
          : typeof b.color === "string"
            ? b.color
            : "#4b5054"
    })
  }
  const r = {
    side,
    sourceComponents: a.filter((x: any) => x.type === "source_component").length,
    loadedModels: loaded,
    requestedModels: requested,
    bends: a.filter((x: any) => x.type === "pcb_bend").length,
    stiffenerTiles: a.filter((x: any) => x.type === "pcb_stiffener").length,
    flatLengthMm: plan.boards[side].length,
    flatWidthMm: plan.boards[side].height,
    sourceSHA256: sha(bytes),
    folded: true
  }
  reports.push(r)
  console.log(JSON.stringify(r))
  console.log(
    "Stiffener mesh labels:",
    scene.boxes.filter((b) => b.label?.toLowerCase().includes("stiff")).length
  )
  await writeFile(`${out}/${side}.circuit.json`, bytes)
}
// Reuse only our frozen, existing front-frame solids; old rigid board trays are not shown.
if (housingFit) {
  const envelopes=JSON.parse(await readFile("dist/slim-housing-review/world-triangles.json","utf8"))
  for (const [name,tris] of Object.entries(envelopes)) bodies.push({
    tris,label:`envelope:${name}`,side:name.startsWith("main")?"main":"secondary",stiff:false,
    color:name.includes("outer")?"#2d525e":"#46717c"
  })
}
const frame = JSON.parse(await readFile("dist/mechanical/glasses/world-triangles.json", "utf8"))
for (const [name, color] of [
  ["front-frame", "#183e4b"],
  ["brow-cover", "#427486"],
  ["camera-cover", "#427486"]
])
  bodies.push({
    tris: frame[name],
    label: `reference:${name}`,
    side: "reference",
    stiff: false,
    color
  })
for (const mode of ["assembled", "exploded"]) {
  const boxes = bodies.map((b) => {
    const dx = mode === "exploded"
      ? b.stiff ? (b.side === "main" ? -6 : 6)
        : b.label.startsWith("envelope:") && b.label.includes("outer") ? (b.side === "main" ? 20 : -20) : 0
      : 0
    return sceneBox(
      b.tris.map((t: number[][]) => t.map((p) => [p[0] + dx, p[1], p[2]])),
      b.label,
      b.color
    )
  })
  const glb = (await convertSceneToGLTF({ boxes }, { binary: true })) as ArrayBuffer
  await writeFile(`${out}/${mode}.glb`, new Uint8Array(glb))
  const png = await renderGLTFToPNGFromGLB(glb, {
    width: 1200,
    height: 900,
    camPos: mode === "assembled" ? [245, 175, -275] : [-245, 175, -260],
    lookAt: [0, 12, 65],
    up: "y+",
    projection: "orthographic",
    orthographicHeight: 275,
    supersampling: 2,
    realistic: true,
    backgroundColor: "#edf1f3"
  })
  await writeFile(`${out}/${mode}.png`, png)
  console.log("Rendered", mode, png.byteLength)
}
await writeFile(
  `${out}/render-metadata.json`,
  JSON.stringify(
    {
      savedAtUTC: new Date().toISOString(),
      boards: reports,
      housingFit,
      housingNote: housingFit ? "Static split envelopes fitted to actual folded CAD with stated allowances; retention, fastening, port access, harness, battery, camera and physical fit remain unfinished." : undefined,
      note: "Actual native pcbbend CAD; static curvature only. Stiffeners translated 6 mm for exploded inspection. Front frame is the earlier provisional reference; trays/hinge/pack/camera assembly are not fitted. JST ACH models, when present, are manufacturer-backed mated bounding envelopes, not detailed vendor models."
    },
    null,
    2
  ) + "\n"
)
