# OV5640 AF carrier review — 31 October 2026

This is a **separate default-off 58 × 18 × 0.8 mm four-layer review board**,
not connected to either flex board or fitted into the frame. Source:
[`camera-carrier.circuit.tsx`](../src/camera-carrier/camera-carrier.circuit.tsx).
It instantiates the documented camera contact map, three controlled rails,
four direction-controlled DVP/control translators and an SCCB buffer. Probe pads
are a bench interface, not a selected production interconnect. Routing is disabled.
Existing CPU/RF/memory, nine thermal vias, flex circuits and frame remain intact.

## Exact module and connector

Prototype target: **Seeed SKU 114993115**, specifically **MJY5OAF-F3M-V1** OV5640
AF, drawing dated 20 June 2023. The manager observed in-stock/$11.99; this executor
retrieved the primary drawing/schematic, not a fresh stock allocation or the
previously denied storefront. Exact delivered revision must be supplier-confirmed.
The alternatively linked **OV5640-8225N-120 has NC on contacts 23/24** and is not
interchangeable. Autofocus remains a target; its power/driver qualification is open.

The drawing gives a nominal 8.5 × 8.5 mm head, approximately 5.5 mm module height,
70.5 mm overall assembly, 12.5 mm tongue, 24 contacts at 0.5 mm pitch and 0.3 mm
thickness. Reconcile side-view steps, tolerances, actuator travel and heat sink
before claiming a maximum fitted height. Neither the 58 mm carrier nor the
70.5 mm camera flex is fitted into the current frame. Bend radius, hinge path,
retention and wearer fit are unverified. No camera-head CAD model is invented. The editable
`mechanical-contract.ts` retains nominal source dimensions and a clearly
provisional 10 × 10 × 7 mm head reserve; it is not a measured maximum.

| Contact | AF drawing signal | Carrier net |
| --- | --- | --- |
| 1 | STROBE | NC |
| 2 | AGND | GND |
| 3 | SDA | RAW_SDA |
| 4 | AVDD2.8V | CAM_AVDD |
| 5 | SCL | RAW_SCL |
| 6 | RST | RAW_RESETB |
| 7 | VSYNC | RAW_VSYNC |
| 8 | PWDN | RAW_PWDN |
| 9 | HSYNC/HREF | RAW_HREF |
| 10 | DVDD1.5V/internal option | CAM_DVDD, external-core review |
| 11 | DOVDD1.8V | CAM_DOVDD |
| 12 | Y9 | RAW_D7 |
| 13 | MCLK | RAW_XCLK |
| 14 | Y8 | RAW_D6 |
| 15 | GND | GND |
| 16 | Y7 | RAW_D5 |
| 17 | PCLK | RAW_PCLK |
| 18 | Y6 | RAW_D4 |
| 19 | Y2 | RAW_D0 |
| 20 | Y5 | RAW_D3 |
| 21 | Y3 | RAW_D1 |
| 22 | Y4 | RAW_D2 |
| 23 | AF-GND | GND |
| 24 | AFVDD2.8V | **AF_EXTERNAL_2V8**, isolated from all three rails |

**JUSHUO AFC01-S24FCC-00 / C262276** is identified in Seeed expansion schematic
v1.2. The official exact-footprint import contains 24 signal pads at 0.5 mm pitch,
nominal 0.3 × 1.3 mm lands, and mounting pads 25/26. The import makes the mounts
extra ports; both remain NC. Contact 1 is negative-X and 24 positive-X in the
unrotated imported top-board view; review placement rotates the whole part 90°.
Do not confuse the module bottom-contact view with the PCB top view.

**Final connector qualification is blocked:** the supplier-linked manufacturer
PDF returned HTTP 403 and was not retried. Signal identities were audited against
the module drawing and Seeed schematic; geometry was checked against generated
import data, not certified against the inaccessible manufacturer drawing.
Numbered mating orientation, tongue tolerance, land/paste geometry and physical
continuity must pass before fabrication or attaching a module.

## Supplies and interfaces

Input contract: **HOST_3V3 =3.15–3.45 V at the carrier pads**, supplied from the
existing nominal 3.296 V domain. Include distribution loss at this location;
3.15 V is an acceptance condition, not a measured minimum. Do not use raw VSYS.

| Rail | Imported regulator | Static screen / condition |
| --- | --- | --- |
| Core1.5V | **TLV75515PDBVR / C2867152**, 500 mA | ±1.5% gives1.4775–1.5225 V, inside sensor1.425–1.575 V; accuracy headroom VIN≥2.0 V. |
| I/O1.8V | **TLV75518PDBVR / C2877863**, 500 mA | ±1.5% gives1.773–1.827 V; accuracy headroom VIN≥2.3 V. |
| Analog2.85V | **TPS799285DDCR / C2865893**, 200 mA | ±2% gives2.793–2.907 V, inside module2.8V±5% and sensor2.6–3.0V. **VIN≥2.85+0.3=3.15 V**. |

The TLV755 ±1.5% ranges above are **base-accuracy screening at the
datasheet test condition (1 mA load)**, not a complete line/load/transient
rail bound. TI specifies line and load regulation separately. Those terms,
distribution loss and temperature must be included before qualifying actual
rail limits; the static arithmetic check alone does not prove this.

Every EN is pulled down100 kΩ. TLV NC pins remain NC; TPS799 NR uses10 nF.
The analog4.7 kΩ bleeder supplies >0.5 mA minimum load for the accuracy condition
and assists discharge. Nominal22 µF input/output capacitors and local100 nF
bypasses are drawn. Effective capacitance after bias/temperature/tolerance,
stability, inrush, actual placement and <5 ms rise remain acceptance gates.
Typical startup is not a guaranteed rise-time bound. Three input capacitors
also load the host supply ramp even while EN is low. TPS799 active discharge is
not claimed; sequencing must verify the actual rail falls below100 mV.

AF_EXTERNAL_2V8 has an off bias and test pad; **no AF regulator is instantiated**.
The sensor's100 mA VCM sink capability does not bound the delivered module's
motor/driver demand or establish its topology/sequence. AF must stay unpowered;
the isolated sequence refuses operation if AF is above100 mV. AF power/driver
qualification is required to finish this assembly, not silently treated as working.

Four **SN74AXC4T774PWR / C1849453** use A=1.8V/B=HOST_3V3: eleven DVP channels
(D0–7, PCLK/HREF/VSYNC) run A→B; XCLK/PWDN/RESETB run B→A. Directions are tied to
A-domain power/GND. Unused inputs are grounded, unused outputs NC. OE_N pulls up
to1.8V and requires **open-drain pull-low/release, never direct3.3V drive**. TI
specifies port isolation below100 mV on either supply. PWDN defaults high;
RESETB/XCLK low. Each IC has both supply bypasses; raw DVP inputs have100 kΩ bias.

**TCA9517DGKR / C544515** provides SCCB A=camera1.8V/B=host3.3V, separate10 kΩ
pull-ups and EN pulldown. EN changes only with an idle bus. TI allows arbitrary
supply order and holds outputs off below its power-good thresholds. Start100 kHz.
B-side low offset, host low-drive margin and actual capacitance need measurement;
see [earlier interface screening](camera-voltage-review.md). AXC propagation delay
is not a closed DVP setup/hold/skew budget. QVGA alone does not prove low PCLK;
register-clock profile, FPC load and routing remain unqualified.

The [isolated C contract](../firmware/camera-carrier/README.md) requires measured
rail callbacks: DOVDD→AVDD→DVDD, rise<5 ms, ≥5 ms before PWDN release, ≥1 ms before
RESETB release, ≥20 ms before SCCB and clock active≥1 ms before access. Shutdown
isolates buses, asserts reset, stops clock and verifies reverse-order discharge.
The active OV2640 firmware port is unchanged. No free GPIO is assumed: control
transport/expander, rail-monitor adapter, OV5640 register initialization and AF
driver still need integration. Existing camera GPIO reservations are preserved. Confirm the delivered module
EVDD/DVDD strapping and external-core mode before energizing it.

## Revised power assessment

The **1.654 A** result remains an unmeasured stress allocation:1 A combined logic,
3.296 V rail,85% converter/audio efficiency,3.0 V cell,0.20 Ω path,5 mA auxiliary
and continuous ideal full-scale8 Ω sine audio. It is not an established product
peak. The same model gives **0.974 A at0.552 A logic** and **1.191 A at0.7 A**;
neither qualifies a lower-current pack. The existing20% software amplitude cap
is not a measured speaker-power or acoustic limit.

For the documented external-core5 MP/15 fps JPEG example, maxima are analog40 mA,
core125 mA and I/O12 mA. With LDOs these contribute approximately **177 mA upstream**:
**0.5834 W at3.296 V** before regulator quiescent, bleed, buffer switching, SCCB
and host losses. Using the chosen rails, sensor rail power is **0.3231 W** and
LDO loss approximately **0.2603 W**, before those extras. AF is excluded because
its actual module demand is unknown. This is a sensor test condition, not a
qualified final-module/QVGA/startup bound. The illustrative340 mA radio +177 mA
camera +25 mA flash +10 mA allowance =552 mA still lacks PSRAM/CPU dynamic loads,
AF, translator power, inrush and margins. Preserve coincident camera/WiFi/playback
requirements; duty-cycle averages cannot replace peak supply sizing. The600 mA
pack remains unqualified. No battery is instantiated; see the unsent
[battery supplier query](supplier-query-draft.md).

## Evidence and status

Retrieved primary sources (HTTP200) and SHA-256 records are in
[`bom/camera-carrier-review.json`](../bom/camera-carrier-review.json):

- [AF module drawing](https://files.seeedstudio.com/wiki/SeeedStudio-XIAO-ESP32S3/new-res/OV5640_Camera_Module_Specification.pdf).
- [Seeed v1.2 schematic](https://files.seeedstudio.com/wiki/SeeedStudio-XIAO-ESP32S3/res/XIAO_ESP32S3_Exp_Board_v1.2_SCH_PDF_260810.pdf): U2 is1.5V despite stale VCC_1V3 label. Its direct camera I/O supply is not copied.
- [OV5640 specification](https://files.seeedstudio.com/wiki/SeeedStudio-XIAO-ESP32S3/res/OV5640_datasheet.pdf), §§2.7.2/8.3.
- TI [TLV755P](https://www.ti.com/lit/ds/symlink/tlv755p.pdf), [TPS799](https://www.ti.com/lit/ds/symlink/tps799.pdf), [AXC4T774](https://www.ti.com/lit/ds/symlink/sn74axc4t774.pdf), [TCA9517](https://www.ti.com/lit/ds/symlink/tca9517.pdf).

Manufacturer facts were studied; no Seeed PCB artwork was copied or license to
reuse its design files assumed. Source validity/netlist/placement and host
sequence tests do not establish electrical operation, physical fit, RF/thermal
behavior, flex manufacture or fatigue life. No order, supplier contact, push,
merge or publication is performed.

The review drawing uses a custom 1000 × 400 mm digital sheet to contain the
current auto-layout. The native advisory preferring A4 and the importer J-prefix
advisory are retained and reported. Drawing-area overflow warnings must be zero;
pagination for a production schematic remains future work.

Final checks: TypeScript, native build (zero errors), independent 24-contact/rail/
direction/default-state/NC/pad checks and strict C host sequence harness pass.
Both previous flex contracts preserve 76 main / 46 secondary components and all
land patterns/thermal vias. Two native advisories remain as described above.
Actual assembled/exploded carrier PNGs are 1100 × 600; 57/57 supplier CAD meshes
loaded. The batch completed at 2026-10-31T21:39:16.935Z. They show the
independent carrier, not a camera module or glasses assembly.

Core LDO dissipation alone is approximately 0.2245 W in the documented sensor
example. A narrow enclosed board needs real temperature testing; that number
does not establish wearable surface temperature.

November 2 publication revalidation regenerated the same carrier geometry and
source-backed PNGs; current capture metadata is in the snapshot JSON. The
October 31 filenames identify the design milestone. Physical gates are unchanged.
