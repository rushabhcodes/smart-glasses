import { readFileSync, writeFileSync, mkdirSync } from "node:fs"

const plan = JSON.parse(readFileSync("src/flex/layout.json", "utf8"))
const baseline = JSON.parse(readFileSync("src/flex/baseline-contract.json", "utf8"))
const out = "mechanical/flex"
mkdirSync(out, { recursive: true })
for (const [side, b] of Object.entries(plan.boards)) {
  const path = b.outline.map((p, i) => `${i ? "L" : "M"} ${p.x} ${p.y}`).join(" ") + " Z"
  const zones = b.bends
    .map(
      (x) =>
        `<rect x="${x.x - x.zoneWidth / 2}" y="-10" width="${x.zoneWidth}" height="20" fill="#f9c9d4" opacity=".7"/><path d="M ${x.x} -10 V 10" stroke="#b5214b" stroke-dasharray="1 .6"/>`
    )
    .join("")
  const tiles = b.stiffeners
    .map(
      (t) =>
        `<rect x="${t.x0}" y="${t.y0}" width="${t.x1 - t.x0}" height="${t.y1 - t.y0}" fill="#cdd3a2" stroke="#68733b" stroke-width=".08"/>`
    )
    .join("")
  const parts = Object.entries(baseline.boards[side].placements)
    .map(([ref, c]) => {
      const island = b.islands.find((i) => i.references.includes(ref)),
        x = c.center.x + island.offsetX,
        y = c.center.y
      return `<g><title>${ref}: ${island.name}, ${c.layer}</title><rect x="${x - c.width / 2}" y="${y - c.height / 2}" width="${c.width}" height="${c.height}" fill="none" stroke="${c.layer === "bottom" ? "#2769a0" : "#594a40"}" stroke-width=".12"/></g>`
    })
    .join("")
  const width = b.length + 8
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}mm" height="46mm" viewBox="${-width / 2} -18 ${width} 46">
<title>${side} flex mechanical review; not fabrication data</title>
<rect x="${-width / 2}" y="-18" width="${width}" height="46" fill="white"/>
<text x="${-width / 2 + 2}" y="-14" font-family="sans-serif" font-size="2.5">${side.toUpperCase()} / FLAT FLEX STUDY / NOT ROUTED</text>
<g transform="scale(1,-1)" stroke-width=".16"><path d="${path}" fill="#f4e6b5" stroke="#715513"/>${zones}${tiles}${parts}</g>
<g font-family="sans-serif" font-size="1.8" fill="#222">
<text x="${-width / 2 + 2}" y="17">${b.length.toFixed(3)} × 20 mm; 4-layer 0.20 mm stackup provisional; static R30 only</text>
<text x="${-width / 2 + 2}" y="21">Olive: backing tiles; pink: bend keepout; blue: underside component envelope</text>
<text x="${-width / 2 + 2}" y="25">Connected backing pattern; stiffness, supplier process, hinge life and fit unqualified</text>
</g></svg>\n`
  writeFileSync(`${out}/${side}-layout.svg`, svg)
}
console.log("Exported editable flat review drawings to mechanical/flex; no fabrication release.")
