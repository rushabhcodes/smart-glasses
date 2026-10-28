import { spawnSync } from "node:child_process"

const allowed = new Set(["netlist", "schematic-placement", "placement", "source"])
const check = process.argv[2]
if (!allowed.has(check)) {
  console.error(`Expected one of: ${[...allowed].join(", ")}`)
  process.exit(2)
}
const boards = [
  "src/main-board/main-board.circuit.tsx",
  "src/secondary-board/secondary-board.circuit.tsx",
]
for (const board of boards) {
  console.log(`Checking ${check}: ${board}`)
  const result = spawnSync("tsci", ["check", check, board], { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 })
  process.stdout.write(result.stdout ?? "")
  process.stderr.write(result.stderr ?? "")
  if (result.error) {
    console.error(result.error.message)
    process.exit(1)
  }
  if (result.status !== 0) process.exit(result.status ?? 1)
  // This CLI revision can report recommendations while exiting successfully.
  const issues = result.stdout?.match(/<SchematicPlacementIssues>([\s\S]*?)<\/SchematicPlacementIssues>/)?.[1]
  if (issues?.trim()) {
    console.error("Unresolved schematic placement issues; review the report above.")
    process.exit(1)
  }
}
