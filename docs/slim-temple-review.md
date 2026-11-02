# Local slimmer temple-board study — 2 November 2026

This is the board-only checkpoint. The later [arm-envelope assessment](slim-housing-fit.md)
adds separate provisional housing geometry and actual folded-CAD containment checks.

This local revision preserves the ESP32-S3R8 camera/Wi-Fi/audio architecture and
both independent flex boards. It narrows their component islands and replaces
three tall headers. It is separate from the published **0.1.2 / 7aef378** release.
The default preview and older rigid/flex entrypoints retain that baseline.

| Actual flat CAD measurement | Earlier flex | Local slim variant |
| --- | ---: | ---: |
| Main board length × width | 97.89 × 20 mm | 97.89 × 17 mm |
| Secondary board length × width | 134.54 × 20 mm | 134.54 × 17 mm |
| Main populated normal span | 3.10 mm | 3.10 mm |
| Secondary populated normal span | 9.50 mm | 4.35 mm |

Both boards are **15% narrower**. Secondary populated CAD span decreases by about
54%. These spans include model underhang and backing. They exclude the harness,
mated antenna/coax, battery, housings and assembly tolerances. They are CAD
measurements, not measured hardware thickness or proof of wearable fit.

The 7 × 7 mm ESP32 chip does not set the present board-width floor. The retained
FH12-20S-0.5SH(55) inter-board connector has a 15.6 mm transverse courtyard in its
existing orientation. A 17 mm board leaves a measured minimum **0.70 mm** between
component courtyards and the real rounded outline. Reducing it to 12–14 mm would
require another qualified connector/cable arrangement. Main-board thickness is
now dominated by the inductor and underside flash; the retained SMT C&K switch
sets the secondary CAD normal span.

## Changed physical interfaces

| Reference, secondary board | Old header | Local replacement | Signals, unchanged |
| --- | --- | --- | --- |
| J2 | B3B-PH-K-S(LF)(SN) | JST BM03B-ACHSS-GAN-ETF | 1 VBAT; 2 GND; 3 PACK_NTC |
| J3 | B2B-PH-K-S(LF)(SN) | JST BM02B-ACHSS-GAN-ETF | 1 current-limited CHARGE_5V; 2 GND |
| J4 | B2B-PH-K-S(LF)(SN) | JST BM02B-ACHSS-GAN-ETF | 1 SPK_P; 2 SPK_N (bridge output) |

The [JST primary drawing](https://www.jst-mfg.com/product/pdf/eng/eACH.pdf)
specifies 1.2 mm pitch, 1.4 mm mated height, 4.3 mm depth and 4.2/5.4 mm header
widths. ACH is **top entry, side feed**: vertical mating access and outgoing wire
clearance are both required. The nominal mated bounding boxes in CAD intentionally
do not claim a detailed vendor model or maximum tolerance envelope. The matching
housings are ACHR-02V-S / ACHR-03V-S and AWG28 contacts SACH-003G-P0.2. A custom
harness needs verified pin-1 orientation, polarity and strain relief; it is not
instantiated or qualified in this revision.

The 2 A rating for 1–3 circuits requires **AWG28** and a temperature range of
−25 to +85 °C including self-heating. Initial contact resistance is at most 10 mΩ
per contact, 20 mΩ after the specified tests. A 1.654 A conservative battery stress
case would dissipate about 0.055 W initially / 0.109 W at 20 mΩ per contact in the
two-contact supply loop, before wire/PCB losses. This nominal-rating comparison
does not qualify temperature rise, flex copper, pack current or a finished harness.
Charging remains disabled by default; no dummy NTC or new battery is introduced.

## Tooling, geometry and sourcing evidence

JLC searches did not return an exact verified ACH identity. Unrelated returned
parts were rejected and are absent from the design. **No JLC/LCSC ID, assembly
tier or JLC inventory has been verified for these replacements.** The official
CLI DigiKey search returned the exact JST identities: 6,643 three-pin headers at
06:15 UTC and 21,197 two-pin headers at 06:16 UTC on 2 November. Those are dated
DigiKey observations, not reserved stock or JLC assembly stock. See the saved
[source evidence](progress/2026-11-02-slim-connector-evidence.json).

Footprints were converted with the installed `tsci convert` from the pinned
[KiCad library revision](https://github.com/KiCad/kicad-footprints/tree/7ebfa6b23cc292a56f751b7b5f4a0e12eeef69dd/Connector_JST.pretty),
using the exact ACH-ETF 2/3-position land patterns. The original files and their
[license](../imports/slim/KiCad-LICENSE.md) accompany the converted source. Only an
unsupported legacy 3D-model block was omitted from temporary conversion input.
The converter's four open courtyard fragments were joined into the same closed
rectangle, its rounded-pad radius corrected against the original ratio, and the
component declared as a connector with explicit vertical insertion direction.
Pad numbering/pitch/size, mounting tabs, NC mapping and clearances are checked
against generated circuit JSON and the original drawing/library geometry.

## Backing and frame constraints

The four-layer 0.20 mm flex stack, 0.20 mm FR4 stiffeners and 0.05 mm adhesive
remain provisional CAD assumptions. Static bends retain their previous radius,
angle and component/via-free zones; no dynamic hinge qualification is implied.
All five backing islands have one connected union and a connected 0.60 mm
structural spine. On the narrower main core, a small peninsula attached through
a weaker neck was omitted from the backing. Required component/drill windows,
all nine thermal vias and electrical geometry remain intact. The backing review
STL is closed, consistently wound and one body. It is not fabrication approval.

With the old prototype assumptions of 1.6 mm walls and 0.6 mm clearance per side,
a 17 mm board alone implies a **21.4 mm outer arm height**, rather than 24.4 mm.
The corresponding normal-section estimates are about 7.5 mm main / 8.75 mm
secondary, before harness and assembly allowances. A nominal 8–8.5 mm-thick
battery candidate would still need a larger bay. No qualified pack is selected.
The old rigid trays do not fit these longer flex boards; this revision does not
pretend to provide new fitted housings. The front frame shown in renders is only
the existing reference. Camera carrier integration, actual frame measurements,
antenna clearance and protected-pack/NTC qualification remain open.

## Reproduce and review

Entrypoints are [main](../src/slim/main-slim.circuit.tsx) and
[secondary](../src/slim/secondary-slim.circuit.tsx). Placement overrides are local
to those entrypoints; the default shared sheets retain the old headers/positions.

```sh
npm run plan:slim
npm run build:slim
npm run plan:slim-backing
npm run build:slim
npm run check:slim
npm run render:slim
python scripts/measure-slim-cad.py
```

The initial build supplies actual courtyards/drill geometry to the backing
planner. TypeScript, both native builds, physical pin/net equivalence, unchanged
non-connector metadata/lands, outline margin, thermal vias and backing/bend
clearances are automated checks. Original rigid/flex entrypoints are rebuilt and
compared with the frozen electrical/land-pattern contract as regression checks.

Actual CAD views: [assembled](progress/2026-11-02-slim-temples-assembled.png) and
[exploded](progress/2026-11-02-slim-temples-exploded.png). The exploded view moves
backing sideways for inspection. Neither view includes a selected battery,
camera assembly, fitted temple shell or validated moving hinge. Detailed routing,
supplier flex/coverlay/stiffener manufacturing exports, thermal/RF validation,
firmware/hardware integration and physical tests remain outstanding.
