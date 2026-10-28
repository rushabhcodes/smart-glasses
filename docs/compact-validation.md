# Compact revision validation — 28 October 2026

The current review branch is `codex/smart-glasses-circuits`. Each board has46 source
components, including DNP test pads, with one independent PCB and zero routed traces.
Main outline80×18mm; secondary100×18mm; four-layer settings are provisional.

| Check actually run | Result and limit |
| --- | --- |
| `npm run validate` | PASS: strict TypeScript, both netlists, schematic and PCB placement, both builds, main-core and peripheral guards |
| `npm run check:source` | Latest run0 errors/0 warnings for both; earlier external datasheet metadata calls returnedHTTP500, so this is not a claim that remote metadata is reliable |
| Physical-pin invariants | PASS: SiP supplies/EPAD/9ground vias, memory/USB reservations, straps/recovery, regulator, controls, mic/restorer, charger/NTC, hardware switch, gauge, amplifier/touch buffer, both20-contact contracts |
| Mic geometry | PASS: generated0.5mm aperture and continuous1.025/1.625mm ground annulus; exact ring stencil remains an assembly gate |
| Voltage/timing/NTC calculations | PASS as design budgets; not measurements. Comparator output load≤15pF and noise/settling limits remain to be verified |
| Board images | Both PCB and schematic SVG/PNG exported; all10 schematic sheets exported individually; main PCB/core/mic and right PCB/charger/touch inspected |
| Actual3D images | Both boards rendered from frozen Circuit JSON; no frame, battery, antenna, camera or speaker assembly invented |
| Development previews | Both HTML, healthOK, exact served source and independent compiled Circuit JSON verified;46 source components each. Only the owned preview processes were stopped |
| Parametric CAD | OpenSCAD exports succeed, simple geometry;44 STL triangles per open carrier. Dimensions are adjustable assumptions, not verified frame fit |
| Original firmware baseline | Earlier build/profile/size and host suites passed; upstream826 passed,3 optional skips, plus3 port tests. No firmware logic changed in this hardware revision |

The preview smoke test initially used the wrong response field (`files` instead of
`file_list`); after correcting the harness against the CLI API it passed both targets.
The latest complete validation ran after switch symbol/common-contact and mounting-hole
corrections. Final text formatting and BOM refresh do not change electrical connectivity.

The previous WROOM design remains at `c45edaa` / `codex/wroom-power-baseline`.
Its49-land/9EPAD-segment module is distinct from the new57-land PICO footprint.

No hardware has been assembled, flashed, powered, charged or paired to Muse here.
No finished-product, routing, manufacturability, hinge endurance, RF/thermal/acoustic or
wearable-fit validation is claimed. Charge remains default-disabled. Required next
inputs and release gates are in [the current design](compact-design.md) and
[roadmap](development-roadmap.md). PICO catalog stock is zero; other low-stock parts
also require rechecking before any assembly commitment. No order or publication occurred.
