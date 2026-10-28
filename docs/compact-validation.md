# Compact revision validation — 28 October 2026

Current branch: `codex/smart-glasses-circuits`. The R8 main has74 source components
(51 top,23 bottom), the secondary46, including DNP test pads. Each has one independent
PCB and zero routed traces. Outlines80 ×18 mm /100 ×18 mm and four-layer settings
are provisional. PICO milestone139a02a and its snapshot remain preserved.

| Check actually run | Result and limit |
| --- | --- |
| `npm run validate` | PASS: strict TypeScript, both netlists, schematic and PCB placement, both builds, main-core and peripheral guards |
| `npm run check:source` |0 errors and6 warnings per board: remote datasheet metadata lookup returnedHTTP500 for six parts on each board. These metadata fetches did not complete; primary-document and physical-pin review is separate |
| Physical-pin invariants | PASS: R8 supplies/EPAD/nine grounded vias, reserved camera/USB/PSRAM pins, straps/recovery, external flash/clock/RF, regulator, controls, mic/restorer, charger/NTC, switch, gauge, amplifier/touch buffer, both20-contact contracts |
| Flash geometry | PASS: nine WSON lands, underside placement and absence of exposed vias beneath its center pad; paste/assembly review remains open |
| Mic geometry | PASS:0.5 mm aperture and continuous1.025/1.625 mm copper annulus; exact ring stencil remains an assembly gate |
| Voltage/timing/NTC calculations | PASS as design budgets; no measurements. Comparator load/noise/settling and memory-rail burst margins remain untested |
| Routing feasibility report |74/46 components,49/33 named multi-component nets and0 PCB traces; a geometry report, not proof of routability |
| Actual3D snapshot | Both boards rendered from frozen Circuit JSON. Pad/via/outline geometry was compared with the final validated build and matches;1100 ×690 composite in `docs/progress/2026-10-28-r8-review.png` |
| Board/schematic images | Both PCB and schematic SVG/PNG exported; all12 schematic sheets exported individually. New flash and clock/RF sheets inspected |
| Development previews | Both HTML, health `ok:true`, exact served entry source and independent compiled Circuit JSON verified:74/46 components. Only owned preview process groups stopped |
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
is disabled. Exact crystal option, JLC assembly availability, final camera/cell/frame,
RF/clock/thermal/current budgets and manufacture/bench/fit gates remain open. Charge
stays disabled by default. No purchase, fabrication order or publication occurred.

The exact-crystal/common-memory-feed revision passed full validation and both previews
again (74/46 components). Source diagnostics remain0 errors/6 remote-metadata HTTP500
warnings per board. No new firmware or physical tests were run.

Latest actual board image: `docs/progress/2026-10-28-clock-memory-review.png`
(74/46 components,80×18/100×18 mm,18:47:19 UTC). The prior R8 and PICO
images remain unchanged. A separate pack-envelope CAD image shows candidate
bounding volumes only; neither battery direction has been selected.
