# Compact revision validation — 28 October 2026

Current branch: `codex/smart-glasses-circuits`. The R8 main has75 source components
(51 top,24 bottom), the secondary46, including DNP test pads. Each has one independent
PCB and zero routed traces. Outlines80 ×18 mm /100 ×18 mm and four-layer settings
are provisional. PICO milestone139a02a and its snapshot remain preserved.

| Check actually run | Result and limit |
| --- | --- |
| `npm run validate` | PASS: strict TypeScript, both netlists, schematic and PCB placement, both builds, main-core and peripheral guards |
| `npm run check:source` at preceding crystal/memory checkpoint |0 errors and6 warnings per board: remote datasheet metadata lookup returnedHTTP500 for six parts on each board. These metadata fetches did not complete; primary-document and physical-pin review is separate |
| Physical-pin invariants | PASS: R8 supplies/EPAD/nine grounded vias, reserved camera/USB/PSRAM pins, straps/recovery, external flash/clock/RF, regulator, controls, mic/restorer, charger/NTC, switch, gauge, amplifier/touch buffer, both20-contact contracts |
| Flash geometry | PASS: nine WSON lands, underside placement and absence of exposed vias beneath its center pad; paste/assembly review remains open |
| Mic geometry | PASS:0.5 mm aperture and continuous1.025/1.625 mm copper annulus; exact ring stencil remains an assembly gate |
| Voltage/timing/NTC calculations | PASS as design budgets; no measurements. Comparator load/noise/settling and memory-rail burst margins remain untested |
| Routing feasibility report | Current geometry report regenerated after GPIO3 bias;0 PCB traces, not proof of routability |
| Actual3D snapshot | Both boards rendered from frozen Circuit JSON. Pad/via/outline geometry was compared with the final validated build and matches;1100 ×690 composite in `docs/progress/2026-10-28-boot-review.png` |
| Board/schematic images | Earlier crystal checkpoint exported all12 schematic sheets individually; current frozen builds exported both PCB/schematic SVGs and actual3D PNGs. Current main-core SVG/PNG includes R26 and was visually inspected |
| Development previews | Both HTML, health `ok:true`, exact served entry source and independent compiled Circuit JSON verified:75/46 components. Only owned preview process groups stopped |
| Parametric CAD | OpenSCAD main/secondary tray and lid exports succeed as simple geometry. Main housing83.2 ×21.2 ×12.0 mm, secondary103.2 ×21.2 ×16.6 mm with lids; clearances and openings remain provisional |
| Original firmware baseline | Earlier build/profile/size and host suites passed: upstream826 passed,3 optional skips, plus3 port tests. Firmware was unchanged; no hardware test or Muse account pairing occurred |

The final crystal-symbol readability correction was rechecked with TypeScript, main
netlist/schematic placement/build and physical-pin guards. PCB geometry still matches
the frozen render.

The raw renders, frozen JSON, SHA256 values and UTC timestamp are recorded in the
snapshot metadata. External camera, battery, antenna, speaker and frame assemblies
are absent. The new crystal import is modeled as a passive four-pin crystal with
its manufacturer pin map; X1/X2 aliases correct the importer/core naming mismatch.

No hardware was assembled, flashed, powered, charged or paired here. Detailed routing
is disabled. Crystal sourcing/measurement, JLC assembly availability, final camera/cell/frame,
RF/clock/thermal/current budgets and manufacture/bench/fit gates remain open. Charge
stays disabled by default. No purchase, fabrication order or publication occurred.

The exact-crystal/common-memory-feed revision passed full validation and both previews
again (74/46 components). Those source diagnostics were0 errors/6 remote-metadata HTTP500
warnings per board; those failed metadata fetches were not retried for this strap-only change. No new firmware or physical tests were run.

Latest actual board image: `docs/progress/2026-10-28-boot-review.png`
(75/46 components,80×18/100×18 mm,19:46:50 UTC,1100×690 pixels).
Both frozen JSON files matched the validated builds before rendering. Source/preview
component counts and independent health/source responses passed again at19:50 UTC.
GPIO3 now has a10 kΩ external pull-up; the generated guard also rejects any peripheral
connection to this reserved strap. The boot/memory matrix records compatible3.3 V
states and incompatible1.8 V overrides. No physical eFuse read or programming occurred.

`npm run report:camera-interface` reproduces conditional static voltage screening
and rejects direct camera-to-S3 and TCA9406 low-level cases. This is a design budget,
not an implemented camera netlist or timing/rail-sequence qualification. Camera,
battery architecture and frame inputs remain pending. Previous R8, PICO, clock/memory
and pack-envelope images remain preserved.
