import assert from "node:assert/strict"
import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { contract, sha } from "./flex-contract.mjs"

const read = (path) => JSON.parse(readFileSync(path, "utf8"))
const plan = read("src/flex/layout.json")
const baseline = read("src/flex/baseline-contract.json")
const near = (a, b, label) => assert.ok(Math.abs(a - b) < 1e-4, `${label}: ${a} != ${b}`)
const rect = (e) => ({
  x0: e.center.x - e.width / 2,
  x1: e.center.x + e.width / 2,
  y0: e.center.y - e.height / 2,
  y1: e.center.y + e.height / 2
})
const overlap = (a, b) => a.x0 < b.x1 - 1e-5 && a.x1 > b.x0 + 1e-5 && a.y0 < b.y1 - 1e-5 && a.y1 > b.y0 + 1e-5
const result = { baselineCommit: baseline.baselineCommit, boards: {} }
for (const side of ["main", "secondary"]) {
  const expected = baseline.boards[side],
    config = plan.boards[side]
  // Refactoring shared sheets must also preserve the original rigid entrypoints.
  const rigid = contract(read(`dist/src/${side}-board/${side}-board/circuit.json`))
  assert.deepEqual(rigid, expected, `${side}: original rigid checkpoint changed`)
  const data = read(`dist/src/flex/${side}-flex/circuit.json`),
    actual = contract(data)
  const all = (type) => data.filter((e) => e.type === type)
  assert.deepEqual(all("pcb_trace"), [], "Flex routing is deliberately outstanding")
  assert.deepEqual(
    data.filter((e) => e.type.includes("error")),
    [],
    `${side}: native build errors`
  )
  assert.equal(
    actual.electricalSHA256,
    expected.electricalSHA256,
    `${side}: electrical connectivity or metadata changed`
  )
  assert.deepEqual(actual.parts, expected.parts, `${side}: supplier or pin metadata changed`)
  assert.deepEqual(actual.footprints, expected.footprints, `${side}: land pattern changed`)
  const islandFor = (ref) => config.islands.find((i) => i.references.includes(ref))
  for (const [ref, old] of Object.entries(expected.placements)) {
    const island = islandFor(ref),
      now = actual.placements[ref]
    assert.ok(island, `Unassigned ${ref}`)
    near(now.center.x, old.center.x + island.offsetX, `${side}:${ref} X`)
    near(now.center.y, old.center.y, `${side}:${ref} Y`)
    for (const key of ["rotation", "layer", "width", "height"])
      assert.equal(now[key], old[key], `${side}:${ref} ${key}`)
  }
  const coreOffset = side === "main" ? islandFor("U1").offsetX : 0
  assert.equal(actual.vias.length, expected.vias.length, `${side}: thermal vias lost`)
  for (let i = 0; i < actual.vias.length; i++) {
    const now = actual.vias[i],
      old = expected.vias[i]
    near(now.x, old.x + coreOffset, `${side}: via X`)
    near(now.y, old.y, `${side}: via Y`)
    for (const key of ["hole_diameter", "outer_diameter", "net"]) assert.equal(now[key], old[key])
  }
  const board = all("pcb_board")[0]
  assert.equal(all("pcb_board").length, 1)
  assert.equal(board.material, "flex")
  assert.equal(board.num_layers, 4)
  near(board.thickness, 0.2, "Flex thickness")
  assert.equal(all("pcb_bend").length, config.bends.length)
  assert.equal(all("pcb_keepout").length, config.bends.length)
  assert.equal(all("pcb_stiffener").length, config.stiffeners.length)
  const sources = new Map(all("source_component").map((c) => [c.source_component_id, c.name]))
  const components = all("pcb_component").filter((c) => sources.has(c.source_component_id))
  for (const bend of all("pcb_bend")) {
    const planned = config.bends.find((b) => b.name === bend.name)
    assert.ok(planned, "Unexpected bend")
    near(bend.start.x, planned.x, "Bend location")
    near(bend.end.x, planned.x, "Bend location")
    near(bend.bend_radius, planned.radius, "Bend radius")
    near(bend.bend_angle, planned.angle, "Bend angle")
    assert.equal(bend.bend_side, planned.movingSide)
  }
  for (const keepout of all("pcb_keepout")) {
    assert.equal(keepout.allow_traces, true)
    assert.notEqual(keepout.allow_placements, true)
    assert.notEqual(keepout.warning_only, true)
    assert.deepEqual(keepout.layers, ["top", "inner1", "inner2", "bottom"])
    const zone = rect(keepout)
    for (const c of components)
      assert.ok(!overlap(zone, rect(c)), `${side}:${sources.get(c.source_component_id)} in bend`)
    for (const e of data.filter((e) => e.type.startsWith("pcb_courtyard"))) {
      const box = e.outline
        ? {
            x0: Math.min(...e.outline.map((p) => p.x)),
            x1: Math.max(...e.outline.map((p) => p.x)),
            y0: Math.min(...e.outline.map((p) => p.y)),
            y1: Math.max(...e.outline.map((p) => p.y))
          }
        : rect(e)
      assert.ok(!overlap(zone, box), `${side}: courtyard in bend`)
    }
    for (const e of [...all("pcb_via"), ...all("pcb_hole"), ...all("pcb_plated_hole")]) {
      const rx = (e.outer_diameter ?? e.outer_width ?? e.hole_diameter ?? e.hole_width ?? 0) / 2
      const ry = (e.outer_diameter ?? e.outer_height ?? e.hole_diameter ?? e.hole_height ?? 0) / 2
      assert.ok(
        !overlap(zone, { x0: e.x - rx, x1: e.x + rx, y0: e.y - ry, y1: e.y + ry }),
        `${side}: hole/via in bend`
      )
    }
    for (const stiff of all("pcb_stiffener"))
      assert.ok(!overlap(zone, rect(stiff)), `${side}: stiffener crosses bend`)
  }
  for (const stiff of all("pcb_stiffener")) {
    assert.equal(stiff.layer, "bottom")
    assert.equal(stiff.material, "fr4")
    near(stiff.thickness, 0.2, "FR4 thickness")
    near(stiff.adhesive_thickness, 0.05, "Adhesive")
    assert.ok(Math.min(stiff.width, stiff.height) >= 0.6 - 1e-5, "Narrow stiffener tile")
    const tile = rect(stiff),
      island = config.islands.find((i) => tile.x0 >= i.left - 1e-4 && tile.x1 <= i.right + 1e-4)
    assert.ok(island, "Stiffener outside component island")
    assert.ok(
      tile.x0 >= island.left + 0.4 - 1e-4 &&
        tile.x1 <= island.right - 0.4 + 1e-4 &&
        tile.y0 >= -9.6 - 1e-4 &&
        tile.y1 <= 9.6 + 1e-4,
      "Backing edge setback"
    )
    for (const window of island.stiffenerWindows)
      assert.ok(!overlap(tile, window), `${side}:${stiff.name} blocks ${window.ref}`)
  }
  const backing = {}
  for (const island of config.islands) {
    const tiles = all("pcb_stiffener").filter((e) => e.name.startsWith(`STIFF_${island.name}_`)),
      parents = tiles.map((_, i) => i)
    const find = (i) => (parents[i] === i ? i : (parents[i] = find(parents[i])))
    for (let i = 0; i < tiles.length; i++)
      for (let j = i + 1; j < tiles.length; j++) {
        const a = rect(tiles[i]),
          b = rect(tiles[j])
        const x = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0),
          y = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0)
        if ((x > 1e-4 && y >= -1e-4) || (y > 1e-4 && x >= -1e-4)) parents[find(i)] = find(j)
      }
    backing[island.name] = {
      connectedPatches: new Set(tiles.map((_, i) => find(i))).size,
      coverage: Math.min(
        1,
        tiles.reduce((n, t) => n + t.width * t.height, 0) / ((island.length - 0.8) * 19.2)
      )
    }
  }
  result.boards[side] = {
    sourceComponents: actual.sourceComponents,
    electricalSHA256: actual.electricalSHA256,
    rigidCheckpointPreserved: true,
    landPatternsPreserved: true,
    bends: config.bends.length,
    thermalVias: actual.vias.length,
    stiffenerTiles: config.stiffeners.length,
    flatLengthMm: config.length,
    flatWidthMm: config.height,
    routedTraces: 0,
    backing
  }
  console.log(
    `${side}: ${actual.sourceComponents} components and every physical-pin connection/land pattern preserved; bend keepouts and backing apertures clear.`
  )
}
mkdirSync("dist/flex-review", { recursive: true })
writeFileSync(
  "dist/flex-review/validation.json",
  JSON.stringify({ ...result, contractSHA256: sha(result) }, null, 2) + "\n"
)
