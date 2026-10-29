/** Actual tsCircuit/JSCAD CAD. No image generation, network publication or design mutation. */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  convertCircuitJsonTo3D,
  convertSceneToGLTF,
} from "circuit-json-to-gltf";
import { renderGLTFToPNGFromGLB } from "poppygl";
import { printedParts } from "../src/enclosure/glasses-geometry";
import {
  frame,
  sides,
  boardToWorld,
  type Side,
} from "../src/enclosure/glasses-parameters";
// Reuse tsCircuit's pinned nested headless compiler; this package exposes import-only exports.
const { renderToJscadPlan } = await import(
  new URL(
    "../node_modules/jscad-fiber/dist/headless.js",
    import.meta.resolve("@tscircuit/core"),
  ).href
);
const out =
  process.argv.find((a) => a.startsWith("--out="))?.slice(6) ??
  "dist/mechanical/glasses";
await mkdir("dist/progress-model-cache", { recursive: true });
await mkdir(out, { recursive: true });
await mkdir(`${out}/stl`, { recursive: true });
await mkdir(`${out}/plans`, { recursive: true });
const sha = (b: any) => createHash("sha256").update(b).digest("hex");
const normal = (v: number[][]) => {
  const a = v[1].map((x, i) => x - v[0][i]),
    b = v[2].map((x, i) => x - v[0][i]);
  const n = [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
  const l = Math.hypot(...n);
  return n.map((x) => x / (l || 1));
};
const point = (v: number[]) => ({ x: v[0], y: v[1], z: v[2] });
const boundsOf = (pts: number[][]) =>
  pts.reduce(
    (b, p) => {
      for (let i = 0; i < 3; i++) {
        b[0][i] = Math.min(b[0][i], p[i]);
        b[1][i] = Math.max(b[1][i], p[i]);
      }
      return b;
    },
    [
      [Infinity, Infinity, Infinity],
      [-Infinity, -Infinity, -Infinity],
    ],
  );
function sceneBox(tris: number[][][], label: string, color: string) {
  // circuit-json-to-gltf reflects scene X. Cancel that reflection here; exported GLB remains in documented world XYZ.
  // Scene mesh API uses clockwise vertices with outward normals; its GLB exporter reverses indices.
  const triangles = tris.map((t) => {
    const v = t.map((p) => [-p[0], p[1], p[2]]),
      n = normal(t);
    return { vertices: v.map(point), normal: point([-n[0], n[1], n[2]]) };
  });
  const pts = triangles.flatMap((t) => t.vertices),
    min = point(
      [0, 1, 2].map((_, i) => Math.min(...pts.map((p) => [p.x, p.y, p.z][i]))),
    ),
    max = point(
      [0, 1, 2].map((_, i) => Math.max(...pts.map((p) => [p.x, p.y, p.z][i]))),
    );
  return {
    label,
    color,
    center: { x: 0, y: 0, z: 0 },
    size: { x: max.x - min.x, y: max.y - min.y, z: max.z - min.z },
    mesh: { triangles, boundingBox: { min, max } },
  };
}
const parts: any[] = [],
  report: any = {
    generatedAtUTC: new Date().toISOString(),
    units: "mm",
    assumptions: frame,
    boards: [],
    assets: [],
    limitations: [
      "Prototype assumptions: no measured wearer fit or folding hinge.",
      "Camera/battery are empty configurable reserves, not selected assemblies.",
      "Supplier CAD is a visualization, not a qualified tolerance model.",
    ],
  };
const manifest = [];
for (const p of printedParts) {
  const plan = renderToJscadPlan(p.element);
  await writeFile(
    `${out}/plans/${p.name}.jscad.json`,
    JSON.stringify(plan, null, 2),
  );
  const side = p.name.startsWith("main-")
    ? "main"
    : p.name.startsWith("secondary-")
      ? "secondary"
      : null;
  manifest.push({
    name: p.name,
    color: p.color,
    side,
    printTransform: side
      ? {
          translate: [
            -sides[side].sign * frame.templeX,
            -frame.templeY,
            -(frame.boardFront + sides[side].length / 2),
          ],
          rotateYDegrees: -sides[side].sign * 90,
        }
      : null,
  });
  parts.push({ ...p });
}
await writeFile(`${out}/part-manifest.json`, JSON.stringify(manifest, null, 2));
const boardBoxes: any[] = [],
  componentBounds: any[] = [];
function rotateScene(v: number[], r: any = {}) {
  let [x, y, z] = v;
  const cy = Math.cos(r.y ?? 0),
    sy = Math.sin(r.y ?? 0);
  [x, z] = [x * cy - z * sy, x * sy + z * cy];
  const cz = Math.cos(r.z ?? 0),
    sz = Math.sin(r.z ?? 0);
  [x, y] = [x * cz + y * sz, -x * sz + y * cz];
  const cx = Math.cos(r.x ?? 0),
    sx = Math.sin(r.x ?? 0);
  [y, z] = [y * cx + z * sx, -y * sx + z * cx];
  return [x, y, z];
}
for (const side of ["main", "secondary"] as const) {
  const bytes = await readFile(
      `dist/src/${side}-board/${side}-board/circuit.json`,
    ),
    a = JSON.parse(bytes.toString());
  let requested = 0;
  for (const e of a)
    if (e.type === "cad_component" && e.model_obj_url) {
      const u = new URL(e.model_obj_url);
      if (u.searchParams.get("cachebust_origin") === "")
        u.searchParams.delete("cachebust_origin");
      const file = `dist/progress-model-cache/${sha(u.toString())}.obj`;
      let b;
      try {
        b = await readFile(file);
      } catch {
        const r = await fetch(u, { signal: AbortSignal.timeout(45000) });
        if (!r.ok) throw Error(`CAD asset HTTP${r.status}: ${u.pathname}`);
        b = Buffer.from(await r.arrayBuffer());
        if (!/^v\s/m.test(b.toString()) || !/^f\s/m.test(b.toString()))
          throw Error(`Invalid OBJ: ${u.pathname}`);
        await writeFile(file, b);
      }
      report.assets.push({ url: u.toString(), sha256: sha(b) });
      e.model_obj_url = `data:text/plain;base64,${b.toString("base64")}`;
      requested++;
    }
  const scene = await convertCircuitJsonTo3D(a, { renderBoardTextures: false }),
    loaded = scene.boxes.filter(
      (b) => b.meshUrl?.startsWith("data:") && b.mesh?.triangles.length,
    ).length;
  if (loaded !== requested)
    throw Error(`${side} missing imported CAD (${loaded}/${requested})`);
  const localPts: number[][] = [];
  for (const b of scene.boxes) {
    if (!b.mesh?.triangles.length) continue;
    const local = b.mesh.triangles.map((t) =>
      t.vertices.map((v) => {
        const r = rotateScene([v.x, v.y, v.z], b.rotation);
        return [r[0] + b.center.x, r[2] + b.center.z, r[1] + b.center.y];
      }),
    );
    localPts.push(...local.flat());
    const tris = local.map((t) => t.map((v) => boardToWorld(side, v)));
    boardBoxes.push(
      sceneBox(
        tris,
        `${side}:${b.label ?? "PCB"}`,
        (b.color as string) ?? "#245e3a",
      ),
    );
    const flat = tris.flat(),
      bounds = [0, 1].map((v) =>
        [0, 1, 2].map((i) =>
          v
            ? Math.max(...flat.map((p) => p[i]))
            : Math.min(...flat.map((p) => p[i])),
        ),
      );
    componentBounds.push({ side, label: b.label ?? "PCB", bounds });
  }
  const pcb = a.find((e: any) => e.type === "pcb_board"),
    holes = a.filter((e: any) => e.type === "pcb_hole");
  const localBounds = boundsOf(localPts);
  if (
    Math.abs(pcb.thickness - sides[side].thickness) > 0.001 ||
    pcb.width !== sides[side].length ||
    pcb.height !== 18
  )
    throw Error(`${side} board dimensions changed: update prototype`);
  if (
    localBounds[0][2] < sides[side].minCadZ - 0.01 ||
    localBounds[1][2] > sides[side].maxCadZ + 0.01
  )
    throw Error(`${side} envelope grew: update prototype`);
  if (
    side === "main" &&
    !holes.some(
      (h: any) =>
        Math.abs(h.x - frame.micPort.x) < 0.001 &&
        Math.abs(h.y - frame.micPort.y) < 0.001 &&
        h.hole_diameter === 0.5,
    )
  )
    throw Error(
      "Microphone enclosure port no longer aligns to PCB acoustic drill",
    );
  report.boards.push({
    side,
    length: pcb.width,
    height: pcb.height,
    thickness: pcb.thickness,
    localBounds,
    sourceSHA256: sha(bytes),
    loadedImportedModels: loaded,
    expectedImportedModels: requested,
    holes,
  });
}
await writeFile(
  `${out}/component-bounds.json`,
  JSON.stringify(componentBounds),
);
const python =
  process.env.ENCLOSURE_PYTHON ??
  "/workspace/.cloud-setup/host-tools/bin/python";
const result = spawnSync(
  python,
  [
    "scripts/export-glasses-meshes.py",
    out,
    ...(process.argv.includes("--verify") ? ["--check"] : []),
  ],
  { stdio: "inherit", timeout: 180000 },
);
if (result.status !== 0)
  throw Error(`Solid export failed (${result.status}): ${result.error ?? ""}`);
const solid = JSON.parse(
    await readFile(`${out}/solid-mesh-review.json`, "utf8"),
  ),
  triangles = JSON.parse(await readFile(`${out}/world-triangles.json`, "utf8"));
for (const p of parts) p.tris = triangles[p.name];
report.solid = solid;
if (process.argv.includes("--verify") && solid.interference.length)
  throw Error(`Enclosure interference: ${JSON.stringify(solid.interference)}`);
for (const path of [
  "src/enclosure/glasses-parameters.ts",
  "src/enclosure/glasses-geometry.tsx",
  "src/enclosure/glasses-enclosure.circuit.tsx",
  "scripts/build-glasses-enclosure.ts",
  "scripts/export-glasses-meshes.py",
])
  report.sourceHashes = {
    ...report.sourceHashes,
    [path]: sha(await readFile(path)),
  };
await writeFile(
  `${out}/mesh-review.json`,
  JSON.stringify(report, null, 2) + "\n",
);
for (const mode of ["assembled", "exploded"]) {
  const boxes = parts.map((p) => {
    let delta = [0, 0, 0];
    if (mode === "exploded") {
      if (p.name === "brow-cover") delta = [0, 0, 18];
      else if (p.name === "camera-cover") delta = [0, 0, -18];
      else if (p.name.endsWith("cover"))
        delta = [(p.name.startsWith("main") ? 1 : -1) * 30, 0, 0];
      else if (p.name.includes("splint"))
        delta = [(p.name.startsWith("main") ? 1 : -1) * 16, 0, 0];
    }
    return sceneBox(
      p.tris.map((t: number[][]) =>
        t.map((v) => v.map((x, i) => x + delta[i])),
      ),
      p.name,
      p.color,
    );
  });
  const glb = (await convertSceneToGLTF(
    { boxes: [...boxes, ...boardBoxes] },
    { binary: true },
  )) as ArrayBuffer;
  await writeFile(`${out}/${mode}.glb`, new Uint8Array(glb));
  const png = await renderGLTFToPNGFromGLB(glb, {
    width: 1200,
    height: 900,
    camPos: [245, 160, -265],
    lookAt: [0, 9, 65],
    up: "y+",
    projection: "orthographic",
    orthographicHeight: 270,
    supersampling: 2,
    realistic: true,
    backgroundColor: "#eaf0f3",
  });
  await writeFile(`${out}/${mode}.png`, png);
  console.log("Rendered", mode, png.byteLength);
}
console.log(`Actual glasses prototype exported: ${out}`);
