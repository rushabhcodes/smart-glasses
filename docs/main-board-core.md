> Current revision: [current compact design and validation gates](compact-design.md).
> The original WROOM/INMP441/scaffold discussion below is historical planning;
> current TSX/BOM and the compact-design status take precedence.

# First tsCircuit hardware block: ESP32-S3 core

Status: schematic review, 2026-10-28. No physical hardware has been assembled or tested.
This stage replaces the left board's original three-item scaffold with a module core.
The right board remains its original power-rail scaffold. Detailed PCB routing is disabled.
Neither board is a fabrication release or a claim that the circuit fits a glasses temple.

## Scope and electrical connections

U1 is the **ESP32-S3-WROOM-1U-N8R8** external-antenna module. Its 41 module pads must
not be confused with ESP32-S3 silicon pin numbers. Physical module pads 1, 40 and 41
connect to GND; pad 2 receives `V3V3_CORE`. This is an **external regulated 3.3 V input**
for this initial design stage. Raw LiPo, charger OUT/VSYS and 5 V must not be applied to it.
The regulator and inter-board power path have not yet been drawn into the core circuit.

| Reference | Function |
| --- | --- |
| C1 | 22 uF nominal bulk capacitance across V3V3_CORE/GND; verify effective capacitance at 3.3 V, temperature and tolerance before release |
| C2 | 100 nF local bypass across V3V3_CORE/GND |
| R1/C3 | EN pull-up 10 kOhm and 1 uF to GND; starting RC values, not measured reset timing |
| R2 | 10 kOhm GPIO0/BOOT_N pull-up for normal boot |
| R3 | 10 kOhm GPIO46 pull-down; keeps this strap low for joint download boot |
| R4 | 10 kOhm GPIO45 pull-down; preserves the default low strap condition |
| TP1/TP2 | Regulated 3.3 V input and common GND probe pads |
| TP3/TP4 | MCU UART0 TX (module pad 37 / GPIO43) and RX (pad 36 / GPIO44) |
| TP5/TP6 | EN/reset and GPIO0/BOOT_N access pads |

EN/BOOT access is via pads and an external bench fixture at this stage. No physical reset,
boot or capture button MPN/land pattern is approved. A 3.3 V UART fixture uses a common
GND, crosses its TX/RX, and must obey the chip's boot/reset sequence. These are bare pads,
not protected external connectors or a complete USB programming interface. There is no
UART level converter or automatic reset circuit. No flashing was performed.

GPIO19/20 USB, camera, microphone, FPC and user controls are explicitly unconnected for now.
Their `noConnect` markers describe **this partial schematic**, not a decision to omit them
from the product. Remove each marker when adding that verified subsystem. The N8R8's
PSRAM module pads 28/29/30 (GPIO35/36/37) must remain externally unconnected. GPIO3 has
no external load in this core; its strap/JTAG behavior must be re-reviewed with eFuse policy.
No external memory, crystal, RF matching or PCB antenna is duplicated: those belong to the
module. An appropriate external antenna and coax installation remain required.

## JLCPCB imports used

The user requested `tsci import` from JLCPCB. These identifiers were checked against primary
supplier listings, then imported with the installed official CLI:

| References | LCSC/JLCPCB | Imported manufacturer part | Catalog rating |
| --- | --- | --- | --- |
| U1 | C2980300 | ESP32-S3-WROOM-1U-N8R8 | 8 MB flash / 8 MB PSRAM; external antenna |
| R1-R4 | C25804 | 0603WAF1002T5E | 10 kOhm, 1%, 100 mW, 0603 |
| C1 | C45783 | CL21A226MAQNNNE | 22 uF, 25 V, X5R, 20%, 0805 |
| C2 | C14663 | CC0603KRX7R9BB104 | 100 nF, 50 V, X7R, 10%, 0603 |
| C3 | C15849 | CL10A105KB8NNNC | 1 uF, 50 V, X5R, 10%, 0603 |

```sh
npx tsci import C2980300 --jlcpcb --use-exact-footprint
npx tsci import C25804 --jlcpcb
npx tsci import C45783 --jlcpcb
npx tsci import C14663 --jlcpcb
npx tsci import C15849 --jlcpcb
```

Imported files are in `imports/`, with supplier identifiers and model references. The module
keeps the exact imported EasyEDA copper. The passive imports use the CLI's >98%-match
footprinter conversion (reported copper IoU 99.99-100%). Copper probe pads use tsCircuit
builtins; they are PCB features and have no purchased JLCPCB component number.

`@tscircuit/props` 0.0.712 is now a direct development dependency because the generated
components import its types. TypeScript also includes `imports/**/*.tsx`.

**Import correction:** the raw C2980300 conversion incorrectly labeled physical pad 1 as
IO20 and pad 2 as GND; much of its remaining symbol was unlabeled. Its generated ground
attribute was consequently wrong. The imported TSX pin-label map was corrected using
Espressif datasheet v1.8 Table 3-1; ground attributes now apply to physical pads 1/40/41.
The footprint, supplier ID and model URLs were retained. Re-importing this part overwrites
those corrections: repeat the pin-table review and checks before using a regenerated file.
A successful import is not electrical verification.

The imported footprint has 40 perimeter lands and nine lands sharing pad 41. Edge pitch,
nominal land sizes and EPAD segmentation were compared with the manufacturer drawing
and CAD. After coordinate-origin alignment, bottom lands 15-25 differ by approximately
0.03 mm in Y from the manufacturer's nominal CAD; that discrepancy is recorded rather
than silently replacing the imported geometry. Land pattern, mask/paste, thermal vias,
body/courtyard, connector stack and assembly process still require release review. The
EasyEDA 3D model is a visualization aid, not a dimensioned fit approval.

## Evidence and checks

- [Module datasheet v1.8](https://documentation.espressif.com/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf): Table 3-1, boot tables, Figure 9-1 and Figure 11-2.
- [Espressif manufacturer CAD](https://github.com/espressif/kicad-libraries/blob/dd76561812ab300351234ba6e0ec1295641796f0/footprints/Espressif.pretty/ESP32-S3-WROOM-1U.kicad_mod): independent nominal pad-geometry comparison.
- [Hardware guidelines](https://docs.espressif.com/projects/esp-hardware-design-guidelines/en/latest/esp32s3/schematic-checklist.html): power and reset review; module power/current margins remain to measure.
- [Module JLCPCB identity](https://jlcpcb.com/partdetail/3401552-ESP32_S3_WROOM_1UN8R8/C2980300).
- Supplier identities/ratings: [R](https://www.lcsc.com/product-detail/C25804.html), [C1](https://www.lcsc.com/product-detail/C45783.html), [C2](https://www.lcsc.com/product-detail/C14663.html), [C3](https://www.lcsc.com/product-detail/C15849.html).

Stock and substitutions must be rechecked when ordering. Verified catalog IDs do not make
these candidates finalized. Supply transients, EN timing, effective capacitance and all
physical interfaces remain untested. The existing firmware build does not validate this
schematic, and this partial circuit cannot yet provide the full glasses firmware features.

Validation completed:

- TypeScript, both netlists, both schematic-placement checks, both PCB-placement checks,
  and both independent builds: **PASS**. No actionable placement findings remain.
- `npm run check:main-core`: **PASS** on the generated Circuit JSON, independently checks
  physical supply/ground separation, EN/BOOT/strap and UART pad connectivity, reserved
  USB/PSRAM pins, verified supplier IDs, nine EPAD segments and zero routed PCB traces.
  It is included at the end of `npm run validate`.
- Left schematic/PCB SVG and PNG rendering: **PASS**, visually inspected. The schematic
  uses a 160 x 160 mm review sheet so the full circuit is visible.
- Optional `check:source`: completes with **one warning**: the upstream automated datasheet
  lookup for the module returns HTTP 500. Manual Espressif pin-table verification and our
  explicit corrected pin metadata/guards do not depend on that lookup. The warning is not
  suppressed and does not represent a verified full set of peripheral attributes.
- A local tsCircuit dev server is running at `http://localhost:3040` for this session.
  Standard restarts can use `npm run dev:main` (default port 3020), or the same custom-port
  invocation: `npx tsci dev src/main-board/main-board.circuit.tsx --port 3040`.

Build outputs: `dist/src/main-board/main-board/` and the corresponding secondary-board
folder. No fabrication exports, routing, orders or hardware operations were performed.

Next block: choose a regulator/power path with measured peak-current headroom, then add
that verified supply circuit before camera/audio/FPC circuitry. Keep the two PCB entries
independent, and complete the interconnect contact assignment before routing.

Raw module import before metadata corrections, SHA-256: `4c358975d5b779f442c7860b2d1099b22a7f4561c94c2a846ec4401f3e642bb2`.
The original download is retained in ignored `.cache/jlcpcb-imports/` for local comparison.
