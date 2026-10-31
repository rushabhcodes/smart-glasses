# Local flex-temple review — 31 October 2026

This is the first **local, unrouted flex installation study**, based on the electrical
checkpoint `27f7feab927d6391236d56bc8df1db0a380b343a`. The original rigid entrypoints
remain available and are checked against frozen generated contracts. This branch
has not been pushed or published. It does not replace the published rigid prototype.

Actual CAD: [assembled](progress/2026-10-31-flex-assembled.png) and
[exploded backing inspection](progress/2026-10-31-flex-exploded.png), captured
2026-10-31 at 18:52 UTC. Both populated boards are present. The blue front frame is
the earlier provisional reference; its camera pod is empty. The old rigid temple
trays are omitted because they do not fit these boards. No new temple housings,
installed hinge cable, battery, camera, or fitted antenna/coax are claimed.

## What changed

| Item | Main | Secondary |
|---|---|---|
| Rigid baseline outline | 80 × 18 × 1.4 mm | 100 × 18 × 1.4 mm |
| Flat flex outline | 97.892 × 20 × 0.20 mm | 134.537 × 20 × 0.20 mm |
| Component islands | Core/memory/clock/RF/mic/controls; regulator/FFC | Charger/switch/gauge/FFC; audio; touch |
| Blank necks | One, 16 mm long × 8 mm wide | Two, each 16 × 8 mm |
| Provisional static bends | −10°, R30 mm | Two × −8°, R30 mm |
| Component count | 76, including DNP/test features | 46, including DNP/test features |
| Imported CAD models loaded | 66/66 | 43/43 |

The four-layer electrical intent is retained. **0.20 mm is a CAD assumption, not
a supplier-approved four-layer flex stackup.** Copper thickness/type, dielectric,
neutral axis, coverlay, adhesive and tolerances remain unspecified. The extra flat
length creates component-free bend regions; the study is wider and longer than the
rigid baseline. Reduced substrate thickness alone does not establish a thinner or
better-fitting wearable. Connector heights and two-sided components still matter.

Functional blocks move together along X. Core/flash/crystal/RF relative geometry,
regulator-loop geometry, component layers, rotations and land patterns are retained.
No component or electrical feature was added or removed. The ESP32-S3R8, external
8 MB flash, in-package 8 MB PSRAM, ICS-43434, U.FL, TPS63070, BQ24075T,
audio/touch blocks and matching 20-contact interconnect remain the baseline.
Camera/USB/PSRAM reserved pins and charger default inhibit remain protected.

## Backing and bend restrictions

Native `pcbstiffener` geometry represents bottom FR4 **0.20 mm** with **0.05 mm**
adhesive, set back 0.4 mm from the island edges. Rectangular tiles describe cutouts
for underside courtyards, the microphone aperture, and protruding connector/switch
leads. Tiles are a CAD decomposition, not instructions to order 53 individual strips.

The main core has 24 underside components/test features. Its cutouts leave about
**66.7% backing coverage in ten disconnected patches**, so this is **not a verified
rigid core support**. The power island has full backing. Secondary backing is one
connected region per island: approximately 96.8% power, 98.2% audio and full touch
coverage. These are area/connectivity calculations, not stiffness measurements.
A board supplier must review bonded support, bottom-part access, acoustic sealing,
assembly order, via-in-pad/paste, and whether a true rigid-flex core is preferable.
The backing arrangement is an explicit open design issue.

Each bend has an all-four-layer keepout spanning the R×angle arc plus 2 mm at each
end. Traces may cross; component placement, vias and pours remain excluded.
Components, holes/vias, stiffeners and their apertures are checked against the
specified zones. Rounded outlines avoid sharp neck corners. Final routed copper
still needs smooth constant-width crossings, no pads/vias in bends, suitable return
paths and layer staggering based on the approved stackup.

These are **static flex-to-install curves**, not folding glasses hinges. The existing
FFC electrical contract is retained, but its physical contact side, bend envelope,
strain relief, resistance, current rating and replacement access are not established.
No hinge-cycle or fatigue claim follows from `pcbbend`: it transforms the CAD pose;
routing and component coordinates stay flat. Do not adopt the ring's much smaller
bend radii as a hinge qualification.

## Reference and possible component reuse

Inspected [abse/smart-ring-flex](https://tscircuit.com/abse/smart-ring-flex#3d)
**v0.0.23**, release `7ddbeb18-5829-4aa6-93e9-796b627aa7e8`. Its package reports
**Unset license**, and the inspected source list contains no LICENSE/COPYING grant.
No ring source or PCB layout was copied. This is original geometry using documented
tsCircuit APIs. The reference itself says it is not order-ready. Its two-layer
0.12 mm flex, 0.2 mm FR4 / 0.05 mm adhesive backing, and 2 mm / 1.21 mm radii are
reference facts, not our qualified stackup or bend specification.

| Reference item | Assessment for these glasses |
|---|---|
| [LIS2DW12TR](https://www.st.com/resource/en/datasheet/lis2dw12.pdf) | Plausible optional wake/tap accelerometer, 2 × 2 × 0.7 mm, 1.62–3.6 V, I²C/SPI. It is not a gyroscope. Add only if a motion requirement and pin/power budget justify it. |
| [TMP117AIDRVR](https://www.ti.com/product/TMP117) | Possible local thermal monitor in 2 × 2 mm WSON. It does not replace a cell-attached NTC, pack protection or thermal testing. |
| [BQ25186DLHR](https://www.ti.com/product/BQ25186) | Future 2.2 × 2 mm charger candidate, I²C power path and 5 mA–1 A charge range. Not substituted for BQ24075T: battery, peak/system load, heat, NTC behavior, register defaults and firmware must be reviewed first. |
| [TPS7A0218](https://www.ti.com/product/TPS7A02) | 1.8 V / 200 mA LDO; cannot replace the higher-current 3.3 V TPS63070 buck-boost rail. |
| [nRF52832](https://www.nordicsemi.com/Products/nRF52832) | BLE-only; does not retain the ESP32-S3 Wi-Fi/camera architecture. Keep the S3 baseline. |
| Johanson 2450AT18A100E / [successor antenna](https://www.johansontechnology.com/docs/3827/Antenna-2450AT18A0100001E-Rev4.0.pdf) | No antenna/match transplant. Ground, stackup, enclosure and on-head RF behavior need qualification; retain U.FL. |
| ZSPD4000QN / SFH7018A / SFH2704 optical stack | No established glasses requirement; not added. |
| BQ29700 / FS8205A protection | Not transplanted. Preserve the protected-LiPo strategy and unresolved pack choice. |

**No BOM additions or substitutions were made.** Candidate observations are not fresh
JLC assembly-stock checks or purchasing recommendations. Existing dated JLC audit
records remain dated observations, not allocations. Verify exact supplier IDs,
footprints, stock, process tier and manufacturer limits if a candidate is selected.

## Validation and limits

The native builds pass with routing disabled, without suppressing placement/DRC
errors. TypeScript, original generated core/peripheral guards, and the flex contract
check pass. The latter compares every part/pin/net and footprint with the frozen
rigid checkpoint; it also checks island-only translations, nine grounded MCU thermal
vias, bend keepouts, stiffener setbacks/apertures and the original rigid builds.
Actual CAD loading succeeded for all requested imported meshes.

This does not validate copper routing, power drop across flex necks, return paths,
signal integrity, RF, thermal performance, support stiffness, dynamic flex, battery
integration, camera sequencing, component tolerances, wearer fit or manufacturing.
The existing unresolved battery architecture and exact camera assembly remain open;
neither was selected by silence to make the render look complete.

The main-board native KiCad smoke export retains four copper layers and 0.20 mm
thickness, but did not retain bend/stiffener records, keepout zones or a qualified
coverlay/adhesive/stackup definition. See [mechanical review files](../mechanical/flex/README.md).
Native CAD support therefore does not establish a complete manufacturing export.

## Reproduce locally

Use the repository's locked environment; no new dependencies are required.

```sh
npm run typecheck
npm run build:main
npm run build:secondary
npm run build:flex
npm run check:flex
```

`src/flex/layout.json` is the reviewed placement/mechanics plan. `npm run plan:flex`
recomputes it from the original rigid builds; review the diff before accepting a new
plan. `baseline-contract.json` is frozen at the original commit, never regenerated
automatically from the design being tested.

For the combined view, generate the original frame/cache once with the existing
`npm run export:enclosure` and `npm run render:progress`, then `npm run render:flex`.
The renderer uses actual folded board CAD plus the original frame solids. The
exploded view moves stiffeners 6 mm solely for inspection, not as a tested removal
path. Generated PNG/GLB/circuit JSON files live in `dist/flex-review/`; captioned
milestone PNGs and provenance live in `docs/progress/`.

Sources: [pcbbend](https://docs.tscircuit.com/elements/pcbbend),
[pcbstiffener](https://docs.tscircuit.com/elements/pcbstiffener),
[Würth flex design guide](https://www.we-online.com/files/pdf1/design-guide-flex-solutions-cbt-en.pdf),
[reference board source](https://tscircuit.com/abse/smart-ring-flex/blob/src/ring-board.tsx),
[reference geometry](https://tscircuit.com/abse/smart-ring-flex/blob/src/integrated-geometry.ts).
