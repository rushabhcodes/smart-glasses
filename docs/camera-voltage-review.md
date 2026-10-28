# Camera voltage and interface decision

Reviewed28 October2026. The product camera remains **unselected and unwired**.
The voltage conflict is confirmed in a pinned carrier source revision. A custom
1.8 V I/O carrier can resolve the static logic mismatch without changing the MCU
or giving up JPEG; its regulators, sequencing, timing and physical assembly still
need qualification. No complete, compact, documented level-shifted commercial DVP
carrier has been qualified here.

## Exact carrier evidence

The inspected Adafruit OV5640 carrier is repository commit
[`6eba49749bf953b8e4c8abfd61bd996d184dc0c7`](https://github.com/adafruit/Adafruit-OV5640-Camera-Breakout-PCB/tree/6eba49749bf953b8e4c8abfd61bd996d184dc0c7),
dated8 February2023. `Adafruit OV5640 Breakout.sch` has Git blob
`88c69d578110c53e3754fb732da4a065e11f749d`; the downloaded schematic's Git-object
hash matches. The corresponding board blob is
`998013af5b61ea79f75dc1c339836a0f439f3d63`. This pins the inspected design files;
it does not establish the revision shipped with a future order.

The schematic connects **X1.DOVDD directly to3.3V**, also supplying its SCCB pull-ups
and reset bias. AVDD is TLV74328=2.8 V; DVDD is TLV74315=1.5 V. There are no DVP
level translators or selectable DOVDD jumper. The jumpers select clock source and
motor power, not a compliant I/O supply. Adding translators outside that complete
board would not correct the sensor's own3.3 V supply.

Adafruit5839's linked module drawing C19938-001 / FD5640 500W-V11 specifies
AVDD2.8–3.3 V, DVDD1.2–1.5 V, DOVDD1.7–2.8 V. OmniVision's full OV5640 v2.03
specification recommends AVDD2.6–3.0 V, core1.425–1.575 V and I/O1.71–3.0 V.
Thus3.3 V DOVDD exceeds both documents' recommended operating limits. Its absolute
maximum is not permission to operate there. The complete5839/5840 carriers are
commercial references with this unresolved specification conflict, not independently
qualified3.3 V interfaces for this product. The module and sensor documents also
give different core/analog limits, so regulator tolerances must fit their intersection.

The5839 fixed120° module drawing gives an8.5 ×8.7 mm optical body,5.1 ±0.2 mm
height,21 ±0.2 mm overall flex and12.5 mm wide24-contact0.5 mm-pitch tail. The
vendor's complete carrier envelope is35.7 ×23 ×17.5 mm. These are different
assemblies. The5840 page advertises72° autofocus but its linked C19940 drawing
says68°; resolve delivered lens/revision before selecting it. No fit is established.

## Conditional custom DVP interface

Use **1.8 V nominal DOVDD**, within both operating ranges and at the OV5640's
published DC test condition. Keep the MCU at its existing nominal3.296 V. Camera
signals must not connect directly: the published camera VOH1.62 V is below the
S3's0.75×VDD input-high threshold, and MCU outputs would overdrive the camera.

| Function | Candidate and supply domains | Required connections/behavior |
| --- | --- | --- |
| D0–D7, PCLK, HREF, VSYNC and XCLK |3× TI SN74AXC4T774PWR, C1849453, TSSOP16; A=1.8 V, B=VCORE3V3 |11 channels A→B; XCLK B→A. DIR pins fixed to the corresponding low-domain rail or GND; no auto-direction translator on DVP clocks/data |
| PWDN | Fourth SN74AXC4T774PWR | B→A, raw camera PWDN pulled up to1.8 V so the sensor stays in power-down while outputs are disabled. Tie unused inputs/directions to defined levels, leave unused outputs NC |
| SIOC/SIOD | TI TCA9517DGKR, C544515, VSSOP8; A=camera1.8 V, B=VCORE3V3 | A to camera, B to MCU. Separate local pull-ups. Its B-side offset must face the MCU, whose low threshold accepts the specified0.6 V maximum |

AXC4T774 physical pins:1DIR1,2DIR2,3A1,4A2,5A3,6A4,7DIR3,8DIR4,
9OE_N,10GND,11B4,12B3,13B2,14B1,15VCCB,16VCCA. TCA9517 physical pins:
1VCCA,2SCLA,3SDAA,4GND,5EN,6SDAB,7SCLB,8VCCB. Official exact-footprint
imports succeeded outside the product source; pin maps match the TI tables.
**The imported lands/model, paste and placement are not yet qualified or integrated.**

Dated LCSC exact-identity observations: AXC4T774PWR2,400 units and TCA9517DGKR99.
These are supplier listings, not JLC assembly inventory or reserved stock. QFN
AXC4T774RSVR C1849454 showed zero; do not silently substitute it. No purchase occurred.

At the documented1.8/3.3 V test conditions, AXC input-high/low limits accept the
sensor's1.62/0.18 V output levels, and its lightly loaded outputs restore both
domains. TI specifies VOH≥VCCO−0.1 V and VOL≤0.1 V at100 µA. An optional100 kΩ
raw-side bias draws at most18 µA at1.8 V, plus IC leakage; account for every load.
TI's1.8↔3.3 V delay maximum is7 ns A→B and6 ns B→A with the stated15 pF test load.
This is a useful translator budget, **not** a closed DVP setup/hold/skew budget.
Lower image resolution does not by itself prove a low PCLK: the OV5640 table lists
48 MHz typical for VGA-or-smaller YUV and full-size compression. Clock, register
settings, trace/load/skew and the S3 capture requirements must be checked together.

TCA9517's A-side output-low maximum0.2 V fits the camera's0.54 V limit; B-side0.6 V
fits the S3's0.25×3.3 V limit. Its B-side contention input requires a low below0.4 V.
The S3's0.1×VDD low-voltage figure gives only about60–70 mV nominal screening
margin there; the S3 table is a high-impedance-load characterization. Confirm low
voltage at the real pull-up current, across temperature and rail tolerance.10 kΩ
pull-ups and100 pF per side give about0.85 µs RC rise time for an initial100 kHz
bus; include IC, connector and flex capacitance. Do not call these calculations
guaranteed operation across all temperatures or module revisions.

`npm run report:camera-interface` reproduces the static screening margins from the
built regulator values and explicitly records these assumptions. Manufacturer OV5640
DC values are specified at1.8 V I/O; the S3 table is labelled3.3 V/25 °C. Rail-range
screening is an engineering extrapolation, not expanded manufacturer qualification.

TCA9406DCUR C840107 was also checked (760 listed). Despite power-off isolation,
it requires input-low≤0.15 V while the camera permits0.18 V; its guaranteed
output-high is only0.67×rail. It is **not** an accepted replacement based on a
"works at1.8/3.3 V" product description. PCA9306DCTR C123752 has an official import,
but needs controlled EN/VREF bias to prevent back-power when the camera is off;
its bare pass-FET topology is not an automatic power-off isolator.

## Power/reset contract still to implement

All four AXC OE_N pins reference1.8 V and must default high; drive them low only
with a compatible open-drain control after valid rails. Never drive OE_N directly
with3.3 V. Their Ioff/low-supply isolation protects data ports when either supply
is absent, but does not generate sensor power sequencing. TCA9517 EN must default
low and be asserted only once both supplies are stable and the bus is idle; account
for its internal input bias when sizing the pulldown. Provide100 nF at each IC
supply and a defined state for every otherwise floating input.

For the external-DVDD option in OV5640 §2.7, power-up requires DOVDD→AVDD→DVDD,
controlled rail rise times, at least5 ms from stable DVDD to PWDN release, reset
release only after stable power, and at least20 ms before SCCB initialization.
XCLK must be stable at least1 ms before access. Power-off asserts reset and stops
XCLK before DVDD removal, with AVDD removed before DOVDD. External-core operation
requires cutting all rails for its documented low-power state; PWDN alone is not
proof of low standby current. A reset RC alone does not enforce the whole sequence.

Possible nominal targets1.8 V I/O, about2.85 V analog and about1.46 V core fit the
intersection on paper; **no exact three-rail regulator/sequencer assembly is selected**.
Check accuracy under actual input headroom, dropout, transient/temperature corners,
off leakage and discharge. TPS7A26's precision table uses VIN≥VOUT+0.8 V, so its
low typical dropout alone does not qualify a2.85 V analog output from a3.15 V rail.
An internal-DVDD design requires the exact module's EVDD/DVDD connections to support
that mode; do not assume the vendor flex permits it. These are real remaining gates.

## Documented SPI/FIFO alternatives

The accessible manufacturer documentation provides two larger module paths:

| Manufacturer module | Documented electrical/image interface | Tradeoff and remaining evidence |
| --- | --- | --- |
| Arducam Shield Mini2MP Plus, OV2640 family |34×24 mm board,3.3–5 V supply,5 V/3.3 V-tolerant I/O;8 MHz SPI plus SCCB; JPEG up to1600×1200 | Retains2 MP/JPEG but replaces native DVP capture with FIFO/SPI firmware. Exact order SKU/revision, output voltage specifications, lens/height and current stock remain unverified |
| Arducam Mega5MP autofocus **B0401** | Four-wire SPI up to8 MHz,3.3 V/5 V supply; JPEG/RGB/YUV up to2592×1944; vendor reports55–154 mA,94 ms wake | Changes resolution/lens and software transport. B0401 is the SKU in the current manufacturer table; earlier B0410 speculation is not an identity match. Mechanical envelope, guaranteed host-I/O levels, stock and full system power behavior remain unverified |

Mini's documented connector is1CS,2MOSI,3MISO,4SCLK,5GND,6VCC,7SDA,8SCL.
Mega has only SPI+power; it does not use the reserved15-line DVP contract. Do not
claim an unchanged camera backend or equivalent image latency. Manufacturer pages
give typical/product figures rather than a complete worst-case host-I/O contract;
neither module has been imported or wired into the product. The storefront's earlier
Cloudflare403 was not retried/bypassed. Accessible documentation is not inventory.

Mini's published3.3 V minimum is not covered by the existing VCORE3V3 budget
(about3.15 V at its lower acceptance corner; nominal3.296 V). Mega lists3.3 V/5 V
without a tolerance range on the inspected page. A separate qualified supply or
manufacturer confirmation is required before either module is powered from this
product. Do not infer compatibility from a nominal3.3 V label.

## Decision and independent-work boundary

The open camera decision is5 MP fixed-lens custom DVP versus preserving2 MP and
continuing module sourcing. The new SPI information adds a possible larger bench
module path, not a silent choice. Neither it nor the separate external-pack versus
integrated-battery decision has been answered. Frame internal dimensions also remain
unknown. Main camera pins therefore stay reserved, and battery/camera-dependent final
routing is not started. A camera choice can close capability direction; exact module
revision, compliant rails/sequence and physical measurements still close implementation.

Primary references: [OV5640 full specification v2.03](https://cdn-learn.adafruit.com/assets/assets/000/118/994/original/OV5640_datasheet.pdf?1677598686),
[Adafruit5839](https://www.adafruit.com/product/5839),
[Adafruit5840](https://www.adafruit.com/product/5840),
[AXC4T774](https://www.ti.com/lit/ds/symlink/sn74axc4t774.pdf),
[TCA9517](https://www.ti.com/lit/ds/symlink/tca9517.pdf),
[TCA9406](https://www.ti.com/lit/ds/symlink/tca9406.pdf),
[Mini hardware](https://docs.arducam.com/Arduino-SPI-camera/Legacy-SPI-camera/Hardware/Arducam-Shield-Mini-2MP-Plus/),
[Mega module/SKU table](https://docs.arducam.com/Arduino-SPI-camera/MEGA-SPI/MEGA-SPI-Camera/).
The Adafruit files are CC BY-SA3.0. Only electrical facts were studied; no layout
was copied. Arducam SDK licensing does not establish a hardware-layout license.
