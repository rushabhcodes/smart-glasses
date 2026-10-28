import { readFileSync, writeFileSync } from "node:fs"

// Public, read-only supplier checks. Run with Bun so inherited proxy/CA settings apply.
// No cart, quotation, reservation, purchase or publication endpoint is called.
const partMap = new Map()
for (const [board, file] of [["Left", "main-board"], ["Right", "secondary-board"]]) {
  const circuit = JSON.parse(readFileSync(`dist/src/${file}/${file}/circuit.json`, "utf8"))
  for (const source of circuit.filter(e => e.type === "source_component")) {
    const code = source.supplier_part_numbers?.jlcpcb?.[0]
    if (!code) continue // DNP test pads have no purchased-component ID.
    const part = partMap.get(code) ?? { code, mpn: source.manufacturer_part_number, placements: [] }
    if (part.mpn !== source.manufacturer_part_number) throw new Error(`${code}: conflicting MPNs`)
    const pcb = circuit.find(e => e.type === "pcb_component" && e.source_component_id === source.source_component_id)
    const pads = circuit.filter(e => e.type === "pcb_smtpad" && e.pcb_component_id === pcb.pcb_component_id)
    const span = pads.length ? {
      x: Math.max(...pads.map(p => p.x + p.width / 2)) - Math.min(...pads.map(p => p.x - p.width / 2)),
      y: Math.max(...pads.map(p => p.y + p.height / 2)) - Math.min(...pads.map(p => p.y - p.height / 2)),
    } : null
    part.placements.push({ board, reference: source.name, layer: pcb.layer, smtLandCount: pads.length,
      copperSpanMmInBoardAxes: span, note: "Measured imported/manually defined copper span; not body size or completed assembly qualification" })
    partMap.set(code, part)
  }
}
const jlcKeys = ["componentCode", "componentModelEn", "componentBrandEn", "componentSpecificationEn", "componentSource",
  "stockCount", "overseasStockCount", "componentLibraryType", "componentProductType", "xrayFlag", "fixtureFlag",
  "specialComponentFee", "assemblyMode", "assemblyProcess", "initialPrice", "prices", "leastPatchNumber", "lossNumber",
  "isBuyComponent", "noBuyReason", "needAuditFlag", "orderInstructionEnglish", "dataManualOfficialLink"]
const parts = [...partMap.values()].sort((a,b) => Number(a.code.slice(1))-Number(b.code.slice(1)))
function objects(x, out = []) {
  if (!x || typeof x !== "object") return out
  if (x.productCode && x.productModel) out.push(x)
  for (const v of Object.values(x)) objects(v, out)
  return out
}
async function inspect(part) {
  part.observedAtUTC = new Date().toISOString()
  const url = `https://jlcpcb.com/api/overseas-pcb-order/v1/smtComponentShopCart/getComponentDetail?componentCode=${part.code}`
  const jlcResponse = await fetch(url, { signal: AbortSignal.timeout(45000) })
  part.jlcpcb = { url, httpStatus: jlcResponse.status, exactIdentityVerified: false }
  if (jlcResponse.ok) {
    const result = await jlcResponse.json(), d = result.data
    part.jlcpcb.apiCode = result.code
    if (d?.componentCode === part.code && d?.componentModelEn === part.mpn) {
      part.jlcpcb.exactIdentityVerified = true
      part.jlcpcb.detail = Object.fromEntries(jlcKeys.filter(k => k in d).map(k => [k,d[k]]))
      part.jlcpcb.tier = ({base:"Basic", expand:"Extended"})[d.componentLibraryType] ?? d.componentLibraryType
      // Verified against the public product pages in this audit, including the three Standard-only RF/mic IDs.
      part.jlcpcb.pcbaType = ({0:"Economic and Standard",2:"Standard Only"})[d.componentProductType] ?? "Unresolved"
    }
  }
  const lcscURL = "https://wmsc.lcsc.com/ftps/wm/search/v3/global"
  const lcscResponse = await fetch(lcscURL, {method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({keyword:part.mpn}),signal:AbortSignal.timeout(45000)})
  part.lcsc = {url:lcscURL, query:part.mpn, httpStatus:lcscResponse.status, exactIdentityVerified:false}
  if (lcscResponse.ok) {
    const result = await lcscResponse.json()
    const match = objects(result.result).find(p => p.productCode === part.code && p.productModel === part.mpn)
    if (match) Object.assign(part.lcsc,{exactIdentityVerified:true,...Object.fromEntries(
      ["productCode","productModel","brandNameEn","encapStandard","stockNumber","isForeignOnsale"].map(k=>[k,match[k]]))})
  }
  part.geometryVerification = part.code === "C5357833" ?
    "Manufacturer ECX-1637B2 Rev2026 Fig2 land pattern; official import unavailable; maximum package-envelope CAD; mask/paste/fabrication review open" :
    "Official exact-footprint import; generated copper dimensions recorded; manufacturer drawing/assembly review remains part of release gates"
  if (["C133590","C23654","C72443"].includes(part.code)) part.geometryVerification += "; primary package/pin/function review and targeted generated guards added for this selection"
  console.log(`${part.code} ${part.mpn}: JLC ${part.jlcpcb.detail?.stockCount ?? "unknown"}; LCSC ${part.lcsc.exactIdentityVerified ? part.lcsc.stockNumber : "unverified"}`)
}
const cached=process.argv.includes("--cached") ? JSON.parse(readFileSync("bom/component-audit.json","utf8")) : null
if(cached) {
  for(const part of parts){const old=cached.parts.find(p=>p.code===part.code&&p.mpn===part.mpn);if(!old||(process.argv.includes("--refresh-unverified")&&!old.jlcpcb?.exactIdentityVerified)){await inspect(part);continue}
    Object.assign(part,{observedAtUTC:old.observedAtUTC,jlcpcb:old.jlcpcb,lcsc:old.lcsc,geometryVerification:old.geometryVerification})}
}
for (let offset=0;!cached&&offset<parts.length;offset+=3) {
  const batch=await Promise.allSettled(parts.slice(offset,offset+3).map(inspect))
  for(let i=0;i<batch.length;i++) if(batch[i].status==="rejected") parts[offset+i].error=String(batch[i].reason)
}
const report={schemaVersion:1,completedAtUTC:new Date().toISOString(),
  note:"Dated public catalog observations, not reserved inventory, an assembly allocation or a quote. JLC stockCount/overseasStockCount and LCSC stockNumber are separate source fields, may overlap and must not be added as independent pools. Special fee=0 does not waive Extended loading, X-ray, manual THT or via-in-pad processing charges. All release/physical gates remain open.",
  searchLimitation:"Official tsci JLCPCB search produced unrelated matches for some exact MPN queries; these were rejected. Exact JLC code/MPN records and official imports were used instead.",
  parts}
writeFileSync("bom/component-audit.json",JSON.stringify(report,null,2)+"\n")
function csv(v){const s=String(v??"");return /[\n\r,\"]/.test(s)?'"'+s.replaceAll('"','""')+'"':s}
const headings=["MPN","JLC/LCSC ID","Manufacturer","References","Quantity","JLC catalog stock","LCSC catalog stock","Observed UTC","JLC tier","PCBA type","Assembly process","X-ray required","Fixture required","Special fee raw","Initial catalog price raw","Geometry/release status"]
const rows=parts.map(p=>{const d=p.jlcpcb.detail??{};return [p.mpn,p.code,d.componentBrandEn,p.placements.map(x=>`${x.board}:${x.reference}`).join(" "),p.placements.length,d.stockCount,p.lcsc.exactIdentityVerified?p.lcsc.stockNumber:"unverified",p.observedAtUTC,p.jlcpcb.tier,p.jlcpcb.pcbaType,d.assemblyProcess,d.xrayFlag,d.fixtureFlag,d.specialComponentFee,d.initialPrice,p.geometryVerification]})
writeFileSync("bom/jlcpcb-recommendation.csv",[headings,...rows].map(r=>r.map(csv).join(",")).join("\n")+"\n")
const missing=parts.filter(p=>!p.jlcpcb.exactIdentityVerified||p.error)
console.log(`Audited ${parts.length} unique IDs, ${parts.reduce((s,p)=>s+p.placements.length,0)} placements; ${missing.length} unresolved JLC identities.`)
if(missing.length)process.exitCode=1
