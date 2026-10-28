# Initialization validation

Validation date: 2026-10-28. This report covers repository/toolchain scaffolding only.
No physical device, functional smart-glasses schematic or Muse pairing was validated.

## Environment and bootstrap

- Location: `/home/rushabh/Dev/smart-glasses`; target did not exist before initialization.
- Official `tsci init -y --no-install` used with `tscircuit@0.0.3033`.
- Host: Linux; Node v26.12.1, npm 12.2.1, Bun 1.3.3. Node 24.x is the recommended
  upstream engine and is recorded in `.nvmrc`; the original host runtime was not replaced.
- Exact direct package versions and transitive resolution are in `package-lock.json`.
- An initial install was blocked by npm's URL-package policy. A per-command
  `--allow-remote=all` allowed tsCircuit's CDN dependency; no global npm setting changed.
- Initial TypeScript errors were resolved with ESNext library declarations and explicit Node
  types. Project strict checking remains on; dependencies were not patched or broadly cast.
- Initial schematic advice requested a vertical rail capacitor. C1 was rotated and both
  schematic checks rerun with no reported issues.
- Added explicit schematic sheets and marked bare probe pads/DNP review capacitor as
  `doNotPlace`. Build/render scripts disable the parts engine rather than assigning unverified
  supplier parts or suppressing diagnostics.

## Results

| Check | Result | Scope |
| --- | --- | --- |
| Dependency installation | PASS, with upstream warnings below | Project-local installed packages and lockfile |
| `npm ls --depth=0` | PASS | Five expected direct packages at exact versions |
| `npm run typecheck` | PASS | All source TS/TSX; no emitted files |
| `npm run check:netlist` | PASS | Both boards: 0 errors, 0 warnings |
| `npm run check:schematic` | PASS after orientation correction | Both boards: no schematic placement issues |
| `npm run check:placement` | PASS | Both boards: no placement issues; 0 DRC errors/warnings |
| `npm run build` | PASS | Independent Circuit JSON outputs, routing disabled; no build warnings/errors |
| `npm run render` | PASS | Schematic and PCB SVG/PNG outputs for both boards |
| Local preview HTTP smoke check | PASS | Main on 3020 and secondary on 3021 returned HTTP 200 HTML; both servers stopped afterward |
| `npm run check:source` | PASS | Both entries: 0 errors, 0 warnings |
| `npm audit` | FAIL: 29 vulnerable-package entries | 23 high, 4 moderate, 2 low; no critical |
| Git initialization | PASS | Local `main` branch; no remote/publication |

`npm run validate` completed successfully on the final source. Each built JSON contains
one PCB, three scaffold items, two logical nets, zero routed PCB traces and zero warning/error
records. Source pads remain copper features; the example capacitor is DNP. The two boards'
PNG previews are byte-identical because their current scaffolds and review outlines match;
their source entries and Circuit JSON artifacts remain independent. The schematic/PCB PNGs
were visually inspected for the intended minimal contents and separation.

Generated review artifacts:

- `dist/src/main-board/main-board/{circuit.json,pcb.svg,pcb.png,schematic.svg,schematic.png}`
- `dist/src/secondary-board/secondary-board/{circuit.json,pcb.svg,pcb.png,schematic.svg,schematic.png}`

The check wrapper treats nonempty schematic-placement reports as failures even when this
CLI revision exits with 0. A successful check applies only to the implemented scaffold.

## Dependency limitations

npm reports upstream advisories through Zod 3.x, Sharp, React Router and deepmerge. Its
suggested root-package resolution is a breaking change/downgrade to tsCircuit 0.0.527,
not a compatible repair for this current project. No `audit fix --force` was applied and
Zod was not overridden across a major version that the tsCircuit APIs do not declare.
Track upstream fixes and re-run this audit when updating the locked toolchain.

The installed tree also reports transitive 3D-package peer-range warnings and Node 24.x
engine warnings on this Node 26 host. npm blocked Sharp's install script under the host's
script policy; no global script approval or policy setting was changed. Snapshot-diff/3D
workflows that depend on that package are not claimed as validated.

## Engineering and service checks deferred

- All candidate IC footprints/package pins, sourcing, actual FPC continuity and final bench-verified GPIO map.
- Battery/charger protection, safe charging current, thermal/current transients and true off.
- Antenna matching, final enclosure fit, acoustic performance and hinge endurance.
- Muse account/token eligibility, ESP-IDF build/flash, pairing and custom audio/camera drivers.
- Actual JPEG upload to Muse and spoken replies on the proposed peripherals.
- PCB routing, copper-short checks, fabrication export, assembly or ordering.

No functional circuitry, tokens, firmware flashing, external publishing or fabrication output
was added by this initialization. See [roadmap](development-roadmap.md) for the next gates.

## Muse peripheral plan review — 2026-10-28

This follow-up reviewed the official SDK at the same pinned revision, the S3 module pad
lookup, INMP441 framing and supplies, MAX98357A rates/SD_MODE behavior and Espressif
camera release 2.1.8. It updates documentation and the preliminary BOM; all TSX source
files have identical SHA-256 hashes to their pre-review contents. Circuit checks above are
the initialization results, not new hardware or firmware validation.

Review checks completed:

- Proposed GPIO CSV: 25 unique, exposed, output-capable GPIOs where required; no collision
  with reserved PSRAM, boot-strap, USB or UART pins; module pad lookups match the reviewed
  Table 3-1. GPIO1 user button and GPIO21 touch output are RTC-capable; actual wake behavior
  remains to be configured/tested.
- FPC allocation: 20 studied contacts including 8 ground returns; no contact order assigned,
  no microphone data/MCLK crossing, and no extra gauge/charger alert GPIOs claimed.
- Audio arithmetic: 16 kHz × 64 clocks/frame = 1.024 MHz BCLK. The manufacturer excludes
  24 kHz amplifier LRCLK, so SDK realtime resampling remains in the proposed path.
- Camera memory arithmetic: the project-selected 32 KiB initial JPEG cap encodes to
  43,692 base64 bytes, before terminator, JSON/transport copies and driver buffers. This is
  a starting experiment limit, not a verified service limit or a measured maximum frame size.
- Preliminary BOM: 36 rows with consistent columns and all LCSC fields blank. Added concrete
  microphone/amp support requirements, SD_MODE interface and a camera-specific connector.
- All local Markdown file links resolve; README/architecture/roadmap reference the new plan.

Not performed: ESP-IDF installation/build, driver execution, flashing, device pairing,
logic-analyzer measurements, camera frame capture, spoken response, acoustic/power/thermal
or combined-load testing. No token or attached hardware was used. Realtime voice admission,
no-display application support and image context delivery are explicit bench acceptance gates.

The initial dependency audit limitations above remain open; this documentation-only change
neither updates those packages nor claims to resolve their advisories.

## Firmware port follow-up

The earlier “not performed” statements above describe the repository initialization and
source-review stages. The subsequent displayless port now has separate
[firmware build and test evidence](firmware-validation.md). No flashing or hardware
validation has taken place.

## First tsCircuit hardware block

The left board has subsequently advanced to a JLCPCB-imported ESP32-S3 core with
regulated-input, reset/boot and UART-pad connections. The right board remains its
original scaffold. Current component/import details, checks and limits are in
[the MCU-core review](main-board-core.md). No physical hardware has been built or tested.
