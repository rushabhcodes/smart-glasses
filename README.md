# smart-glasses

A tsCircuit/TypeScript research repository for custom AI-powered glasses with independent
left and right temple PCBs. The intended assistant is **Meta's Muse personal agent**, using
the official **Muse Gadgets SDK**. Inference stays off the glasses.

**Current state:** the left board now has an initial ESP32-S3 MCU-core schematic built from
five verified JLCPCB import identifiers: module, bulk/bypass/reset capacitors and bias
resistors. The right board still contains its original power-rail scaffold. See
[MCU-core review and import corrections](docs/main-board-core.md).

The [displayless Muse firmware port](firmware/README.md) compiles for S3 N8R8, but **no
physical hardware has been assembled, flashed or tested**. Camera, microphone, audio,
charger/regulator, recording controls and inter-board connectors are still schematic work
in progress. Detailed PCB routing remains disabled. Board outlines are review space;
these designs are not fabrication-ready or a verified fit inside glasses temples.

## Intended features

- User-triggered photo capture and microphone input.
- Push-to-talk voice interaction and a miniature speaker response.
- 2.4 GHz Wi-Fi, BLE setup/control and smartphone connectivity.
- Muse personal-agent processing through a connected cloud session.
- One protected rechargeable LiPo battery.
- Capture/talk button, touch input, physical power control and a visible recording indicator.

Continuous video, always-listening wake words, standard Bluetooth headset calls, and
consumer-frame fit are not established by this prototype plan.

## Hardware architecture

| Board | Responsibilities | Preliminary candidates |
| --- | --- | --- |
| Left main PCB | Muse client, radio, photo capture, microphone, 3.3 V regulation, capture control and recording indication | ESP32-S3-WROOM-1U-N8R8, exact OV2640 DVP module TBD, INMP441, TPS63031, button, LED, FPC connector and external antenna |
| Right power/audio PCB | Charging, protected battery interface, battery gauge, speaker drive, touch and power control | BQ24074, MAX17048, MAX98357A, AT42QT1010, speaker/battery connectors, power button/switch, FPC connector and charging contacts |

All components remain candidates. Five LCSC/JLCPCB identifiers for the initial MCU core
are now verified and imported; other supplier fields remain blank rather than guessed.
See [candidate compatibility review](docs/hardware-requirements.md) and the
[preliminary BOM](bom/preliminary-bom.csv). Required passives, protection, camera supplies,
power-switch circuitry and programming access are explicitly included as unresolved items.

The S3 module's nominal 18 × 19.2 × 3.2 mm body may be too wide for conventional temples.
Both 60 × 25 mm starter outlines are arbitrary review space, not a fit claim.
[Mechanical constraints](docs/mechanical-constraints.md) records the required envelope work.

## Communication between PCBs

The right board supplies the proposed switched system rail `VSYS` through the inter-temple
FPC to the left regulator. The left supplies a proposed 3.3 V control rail back to the right.
Common ground, I2S speaker data/clocks, I2C and control GPIO share that cable. The camera
uses a separate, local DVP connection on the left. The speaker and battery stay local to the
right, and the RF antenna uses its own compatible coax connection.

The [logical interconnect contract](docs/pin-mapping.md) contains a 20-contact allocation
study with no physical pin order. Cable length, conductor/contact current, ground returns,
connector orientation, hinge bending and signal integrity remain open. Equal net names in
two compiled circuits do not create or validate a physical interconnect.

## Smartphone, Muse and cloud architecture

The official [Muse Gadgets SDK](https://github.com/facebookincubator/muse-gadget-sdk)
provides a path for custom ESP32 and Linux hardware to join the user's personal Muse.
Its S3 DevKitC profile explicitly includes WROOM-1U-N8R8. This supports the initial module
choice as a firmware starting point. Our initial peripheral port is in `firmware/`;
board layout and hardware validation are still pending.

The Muse app performs developer-mode pairing, while the glasses' Wi-Fi client maintains
the runtime connection. The agent runs remotely. A separate phone media-relay architecture
would be extra work and is not assumed to be part of the SDK. A working internet/hotspot
path, SDK token and eligible real account must be demonstrated on a bench board.

The initial target is record question → transmit audio/photo → Muse processes it → receive
and play a response, with recording status shown during capture. Prove actual photo upload;
SDK features that display images received from Muse do not establish camera support.
Read [Muse integration and supported hardware](docs/muse-integration.md) for setup prerequisites.
The [camera/audio integration plan](docs/peripheral-integration.md) records the reviewed SDK
paths, shared-clock bus, power constraints and remaining custom-port work.

The media baseline is I2S0 at **16 kHz with two 32-bit wire slots** for INMP441 and
MAX98357A, plus a separate LCD_CAM/DVP OV2640 interface. The SDK's realtime session
resamples to/from 24 kHz network audio; MAX98357A does not accept 24 kHz LRCLK. Ordinary
voice-note replies currently return text, so spoken output needs an admitted experimental
realtime voice session or an explicit TTS integration. The initial firmware adds OV2640
capture commands and a displayless INMP441/MAX98357A audio backend. See
[firmware setup and limitations](firmware/README.md) and [build checks](docs/firmware-validation.md).

## Electrical decisions that remain open

- Complete peak-current budget: TPS63031 headroom is uncertain for camera plus Wi-Fi load.
- Exact camera module, lens, supply rails, FPC connector and physical pinout.
- Review and bench-test the [25-GPIO allocation proposal](docs/proposed-gpio-map.csv),
  preserving PSRAM, boot, USB and UART reservations; camera connector contacts remain TBD.
- True power-off topology, pack capacity/protection/NTC and safe charging current.
- Actual IC ordering suffixes, verified symbols/land patterns, supplier stock and cable rating.
- Frame envelope, antenna integration, acoustic ports, speaker output and thermal behavior.

ESP32-S3 is BLE-only; ordinary A2DP/HFP headset audio is unavailable. It needs external
speaker conversion/amplification, a suitable SDK audio driver and verified I2S configuration.
The candidate charger and fuel gauge do not replace battery overcharge/overdischarge/
overcurrent protection. Detailed constraints are in [hardware requirements](docs/hardware-requirements.md).

## Repository layout

```text
smart-glasses/
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── tscircuit.config.json
├── .npmrc
├── .nvmrc
├── .gitignore
├── src/
│   ├── main-board/main-board.circuit.tsx
│   ├── secondary-board/secondary-board.circuit.tsx
│   └── components/power-rail-scaffold.tsx
├── imports/                        # JLCPCB components imported by tsci
├── firmware/                       # pinned SDK port; see its README
├── scripts/check-boards.mjs
├── docs/
│   ├── architecture.md
│   ├── hardware-requirements.md
│   ├── pin-mapping.md
│   ├── mechanical-constraints.md
│   ├── development-roadmap.md
│   ├── muse-integration.md
│   ├── peripheral-integration.md
│   ├── proposed-gpio-map.csv
│   ├── main-board-core.md
│   ├── firmware-validation.md
│   ├── research-sources.md
│   └── validation.md
├── bom/preliminary-bom.csv
└── assets/README.md
```

`node_modules/`, `dist/`, `checks/` and caches are generated/ignored. The local `.git/`
is initialized separately. The public GitHub repository is
[**rushabhcodes/smart-glasses**](https://github.com/rushabhcodes/smart-glasses).
The npm package remains private; no npm or tsCircuit-registry publication is configured.

## Development setup

Use **Node.js 24.x**, npm, and **Bun 1.3.3 or later** on PATH. Bun is required by the installed
tsCircuit CLI's launcher even when npm manages packages. `.nvmrc` specifies Node 24; if
using nvm, run `nvm use`. The host originally had Node 26; see validation notes for warnings.

```sh
git clone https://github.com/rushabhcodes/smart-glasses.git
cd smart-glasses
npm ci --allow-remote=all
npm run validate
npm run render
```

The per-command `--allow-remote=all` is needed on this host because the dependency tree
includes a tarball from tsCircuit's JS CDN and the host npm configuration blocks URL
packages by default. The lockfile records its resolved URL/integrity. No global npm settings
were changed. `.npmrc` retains the official `@tsci` component registry configuration.

This repository was bootstrapped with official `tsci init -y --no-install`, then adapted for
two source entries. Versions are exact and locked; no global tsCircuit install is needed.
TypeScript 5.9.3 satisfies tsCircuit's declared 5.x peer range. Strict checking remains enabled;
ESNext libraries and Node types are needed by the published toolchain declarations.

| Direct dependency | Version | Role |
| --- | --- | --- |
| react | 19.3.1 | Circuit JSX runtime |
| tscircuit (dev) | 0.0.3033 | tsci CLI, evaluator and real circuit primitives |
| typescript (dev) | 5.9.3 | Type checking |
| @tscircuit/props (dev) | 0.0.712 | Types used by JLCPCB-imported components |
| @types/react (dev) | 19.3.0 | React/JSX types |
| @types/node (dev) | 24.10.0 | Node globals referenced by toolchain types |

Firmware dependencies live in the existing `firmware/` subtree and its local caches.
They remain separate from npm. ESP-IDF and a Muse token are not needed to edit these
tsCircuit hardware files; a token is required later for actual device pairing.

## Development and review commands

| Command | Behavior |
| --- | --- |
| `npm run dev` or `npm run dev:main` | Main-board preview on port 3020 (or CLI-selected free port) |
| `npm run dev:secondary` | Secondary-board preview on port 3021 |
| `npm run typecheck` | Strict TypeScript check, no emitted JS |
| `npm run check:netlist` | Check both independent board netlists |
| `npm run check:schematic` | Check schematic placement for both boards |
| `npm run check:placement` | Check PCB placement for both boards |
| `npm run check:source` | Check source diagnostics for both boards |
| `npm run build` | Build both Circuit JSON outputs with routing disabled |
| `npm run render` | Generate schematic/PCB SVG and PNG previews for both |
| `npm run check:main-core` | Verify generated physical-pad connectivity, supplier IDs and reserved pins |
| `npm run validate` | Typecheck → netlist → schematic placement → PCB placement → build → MCU-core guards |

Per-board `build:main`, `build:secondary`, `render:main` and `render:secondary` scripts are
also available. Every command supplies the source path explicitly; `tscircuit.config.json`
sets the main board as the default for direct CLI invocations. Two `<board>` roots are never
merged into one board. Shared TSX components are helpers, not additional circuit entries.

Build/render outputs are under `dist/`, with per-entry directories reported by the CLI.
Review both schematic and PCB images after changes. The script wrapper propagates CLI
failure and treats reported schematic placement issues as failures even if the CLI returns 0.
Passing checks covers the implemented left MCU core and right scaffold. It does not
validate absent peripherals, supply margins, RF performance, enclosure fit or physical hardware.

No routing/shorts/manufacturing release check is claimed while copper routing is disabled.
Do not manufacture the scaffold. When functional circuitry is reviewed and routing begins,
add routing/shorts/fabrication checks appropriate to the actual implementation.

## Incremental implementation workflow

1. Build the displayless media port and prove Muse pairing, realtime/TTS spoken responses
   and actual OV2640 JPEG delivery on the exact bench hardware.
2. Measure frame, antenna/camera space, power peaks, battery/runtime and thermal constraints.
3. Select exact components, review footprints/pins and freeze the cable/GPIO contracts.
4. Replace TODOs with one verified subsystem at a time; keep board entries independent.
5. Re-run netlist and placement checks and inspect renders before proceeding to routing.

The full [development roadmap](docs/development-roadmap.md) defines exit criteria.
[Validation results](docs/validation.md) records the checks actually run and upstream issues.
[Source register](docs/research-sources.md) links the evidence for technical assumptions.

## Firmware build (no flashing)

```sh
npm run firmware:bootstrap
npm run firmware:build
npm run firmware:test
npm run firmware:size
```

ESP-IDF and its Python/toolchain dependencies are separate from the npm/tsCircuit stack.
The scripts keep downloads in ignored repository-local caches and accept no flash target.
The checked-in profile has no credentials; real Muse pairing remains a future bench task.
See [firmware documentation](firmware/README.md) for source layout, pins and controls.

## Hardware work in tsCircuit

Start the left-board editor with `npm run dev:main` and the right-board editor with
`npm run dev:secondary`. The left entry now uses checked-in JLCPCB imports in `imports/`.
The module's generated symbol needed pin-map corrections; preserve the review recorded
in [main-board core](docs/main-board-core.md) when re-importing. Run `npm run validate`
after schematic changes, then `npm run render:main` to regenerate the visual review.
Do not treat a successful firmware or tsCircuit build as physical hardware validation.
