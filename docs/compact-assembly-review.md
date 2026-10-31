# Compact battery and camera review — 31 October 2026

Historical checkpoint `4580504`. Later work implements an independent
[OV5640 AF carrier review board](camera-carrier-review.md), without qualifying a
wearable battery or attaching the camera to either flex board.

No replacement wearable battery or camera assembly is qualified or instantiated
at this checkpoint. The earlier RRC1120 selection is rejected for temple fit;
the Adafruit 5839 donor strategy is on hold. Existing electrical circuits,
flex geometry, frame geometry and renders are unchanged from the continuous
backing milestone `b25af4436939951b996377085934f311ee01740f`.
Component choices have been delegated by the user. The remaining gates are
missing specifications and compatibility evidence, rather than a pending preference.

## Battery comparison

The approximately 20 mm flex-board width is a provisional packaging target,
not a measured internal frame dimension. Cell thickness, insulation, swelling
clearance, retention, connector and enclosure walls also consume space.

| Exact assembly | Manufacturer envelope / electrical evidence | Result |
| --- | --- | --- |
| RRC1120 Gen2, P/N 110018 | Max 52.7 × 35.1 × 11.25 mm; 42 g; 3.6 V, 2.35 Ah; 2.30 A continuous | Rejected for wearable fit: 35.1 mm wide. Bench reference only; no off-frame architecture selected. |
| Adafruit 3898 / PKCELL LP801735 | **Drawing maxima 37.0 × 17.5 × 8.2 mm**, rather than the smaller approximate sales dimensions; 3.7 V, 400 mAh typical / 380 mAh minimum; **600 mA continuous**, no higher qualified pulse rating; 400 mA maximum charge | Narrow pouch candidate rejected against the present load allocation. Existing 446 mA worst-case charge setting also exceeds its limit. |
| Jauch LP561836JU, P/N 246501 | 38.5 × 18.5 × 5.6 mm; 370 mA maximum discharge; 74 mA charge below 15 °C | Rejected against the load and charge settings. No fresh stock confirmation. |
| Keeppower P1450C3, ordinary opposite-end contacts | 14.4 × 52.1 mm cylinder, ±0.2 mm; use Ø14.6 × 52.3 mm envelope; 3.7 V, 1100 mAh typical; protected | Current rating and supply unverified. Same-MPN special contact variant exists; do not interchange. Cylindrical thickness still needs packaging review. |
| Keeppower P18350R2 | Ø18.9 × 39.7 mm, ±0.2 mm; use **Ø19.1 × 39.9 mm** envelope; 25 g; 3.6 V, 1600 mAh; protected | Detail table says **5 A continuous** and 8 A pulse with no pulse timing; headline instead says 8 A continuous. Use only conservative 5 A for comparison. Current passes the modeled cases, but stock, complete temperature/charge contract and fit remain unqualified. Not selected. |

The 18350's 19.1 mm diameter consumes thickness as well as width. With 1.6 mm
walls and 0.6 mm clearance per side, an illustrative minimum external section is
23.5 mm before any additional cell padding/retention. This is not a verified fit
in the current shallow tray, and the frame has not been enlarged around it.
No available protected narrow pouch with a verified rating sufficient for the
current load allocation was established in this bounded review.

The LP801735 PDF was retrieved successfully (HTTP 200, eight pages) and its
dimension drawing inspected. It specifies a reverse JST-PHR-2P plug and
25 ±5 mm leads. Numbered mating polarity remains unverified. It has a protection
board but no thermistor: a real cell-temperature sensor remains necessary.
Its 3.0 V rated discharge endpoint is distinct from the **2.5 ±0.1 V PCM trip**.
The PCM's **2–5 A overcurrent trip is fault protection, not a permitted load or
pulse rating**. Normal system undervoltage shutdown at or above 3.0 V is still
an implementation/bench gate. Charging remains inhibited.

Nominal energy is 1.48 Wh for LP801735, 5.76 Wh for P18350R2 and 8.46 Wh for
RRC1120: approximately 17.5% and 68.1% of the RRC reference. These ratios do not
predict runtime; useful energy depends on load, temperature, cutoff and losses.

Sources: [RRC product](https://www.rrc-ps.com/en/battery-packs/standard-battery-packs/products/RRC1120),
[RRC datasheet](https://www.rrc-ps.com/fileadmin/Dokumente/Data-Sheets/DS_RRC1120.pdf),
[LP801735 manufacturer specification supplied by Adafruit](https://cdn-shop.adafruit.com/product-files/3898/3898_specsheet_LP801735_400mAh_3.7V_20161129.pdf),
[Jauch specification](https://www.jauch.com/downloadfile/677e36004f285c9b669ea5a9814f67e5d/matd_246501_20200507_350mah_-_lp561836ju_1s1p_2_wire_50mm.pdf),
[ordinary P1450C3](https://www.keeppower.com.cn/products_detail.php?id=640),
[different contact variant](https://www.keeppower.com.cn/products_detail.php?id=678),
[P18350R2](https://www.keeppower.com.cn/products_detail.php?id=881).

## Continuous and peak allocation

The existing calculator was rerun against the saved board netlists. It models
a **3.0 V cell**, nominal **3.296 V logic rail**, 85% conversion and audio
efficiency, ideal full-scale 8 Ω BTL audio and 5 mA auxiliary current. Logic load
already includes the camera in these scenarios; camera power is not added twice.

| Logic allocation | Shared path | Calculated cell current | System voltage / result |
| --- | --- | --- | --- |
| 0.35 A | 0.20 Ω | 0.690 A | 2.862 V |
| 0.70 A | 0.20 Ω | 1.191 A | 2.762 V |
| 1.00 A stress case | 0.20 Ω | **1.654 A** | 2.669 V |
| 1.00 A stress case | 0.40 Ω | **1.901 A** | **2.240 V: fails the amplifier's 2.5 V floor** |

The 1 A logic case is a conservative, **unmeasured design stress allocation**,
not a manufacturer-specified device maximum or measured product consumption.
No acceptable battery current rating cures the excessive shared-path voltage drop.
Treat the allocated load as continuous unless a documented pulse limit and an
enforced/measured operating envelope justify otherwise. Neither duty cycling nor
a protection trip qualifies a transient load.

As an independent incomplete example, Espressif's characterized 340 mA Wi-Fi TX
condition at 3.3 V plus M0031's reported 140 mW camera load would require
`(3.3 × 0.340 + 0.140) / (3.0 × 0.90) = 0.4674 A` from the cell, or 0.4949 A
at 85% efficiency. That excludes memory, audio, other peripherals, extra LDO
losses and inrush; it is **not a closed maximum-current budget**. The 600 mA
pouch therefore cannot be qualified for simultaneous full operation from this
partial example. There is no measured transient waveform or guaranteed peak
budget yet. Preserve camera/Wi-Fi/audio requirements while resolving this gate.

## Camera and interface

**Arducam M0031 OV2640 remains a candidate, not an integrated part.** Reported
primary specifications are 21 × 12.5 × 5.85 mm, a 24-contact goldfinger,
1.3 V ±5% core, 2.5–3.0 V analog, 1.7–3.3 V I/O, 140 mW compressed-mode power,
and recommended mating **Amphenol F32R-1A7H1-11024**. These are the manager's
verified primary-source research; this executor has not obtained the exact
module contact-order drawing or a current allocation. Indexed pricing/Add to
Cart is not live stock proof. The known vendor HTTP 403 was not retried.

Do not borrow another OV2640's pin order. DFRobot's current FireBeetle DFR0975
V1.3 schematic supplies its camera core at **1.8 V** and analog/I/O at 2.8 V,
which does not establish compatibility with M0031's specified core rail.
Its documentation's AXP313A description also differs from the current fixed-LDO
schematic. Preserve exact carrier revision boundaries.
The original 3.296 V rail cannot automatically be applied to a camera with a
3.3 V maximum without checking tolerance. Rail headroom, output tolerance,
host input/output thresholds, sequencing, reset, SCCB and DVP timing still need
closure. The supplied Adafruit 5839 carrier's 3.3 V DOVDD remains rejected.

References: [exact M0031 vendor URL](https://www.arducam.com/arducam-ov2640-camera-module-2mp-mini-ccm-compact-camera-modules-compatible-with-arduino_m0031esp32-esp8266-development-board-with-dvp-24-pin-interface_.html),
[DFRobot board documentation and revisioned schematic resources](https://wiki.dfrobot.com/dfr0975/),
[Espressif ESP32-S3 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf).

## Official imports and checks

Installed CLI 0.1.2417 supports the following workflow; it has no `tsci jlcpcb`
subcommand. Exact supplier identities were checked because broad keyword search
returned unrelated components.

```sh
tsci import --jlcpcb --use-exact-footprint C3167938
tsci import --jlcpcb --use-exact-footprint C202112
```

| Exact part | Import / supplier observation | Product state |
| --- | --- | --- |
| Amphenol F32R-1A7H1-11024 / C3167938 | LCSC catalog: 81. Import **failed**, exit 1: no matching EasyEDA library component. | No generated part; not instantiated. Catalog stock does not guarantee import data or JLC assembly stock. |
| HRS FH12-24S-0.5SH(55) / C202112 | LCSC catalog: 5,133. Official exact-footprint import succeeded; JLC product page identity confirmed. | Preserved under `imports/candidates/`; not selected, instantiated or land-pattern qualified. |
| JST B3B-PH-K-S(LF)(SN) / C131339 | Earlier successful official import | Uninstantiated candidate; not the four-contact RRC mating connector. |
| TI SN74AXC4T774PWR / C1849453 | Earlier successful official import | Uninstantiated translator candidate; no camera rail/sequence qualification implied. |

The Hirose importer generated **26 schematic ports / pads**: 24 regularly spaced
signal contacts and two larger mounting pads labeled 25/26. Signal-pad centers
are approximately 0.500 mm apart. Mounting pads must be reconciled with the
manufacturer drawing before use; the generated 26-port symbol is not an approved
camera pin map. Bottom-contact, pitch and 0.3 mm cable-thickness catalog metadata
do not prove compatibility with M0031's goldfinger or make it interchangeable
with the recommended Amphenol part. JLC assembly inventory, tier and any process
fees are not qualified by the LCSC quantities above.

TypeScript and the import geometry audit cover source validity and generated pad
structure only. The power report covers calculations only. No new board build,
integrated camera/battery render, hardware measurement, fit test, routing or
manufacturing qualification was performed for these uninstantiated candidates.
Latest actual CAD remains the assembled/exploded continuous-backing captures
at **2026-10-31T19:21:15.086Z**, linked from [the flex review](flex-adaptation.md).
Flex manufacturing export still omits bend/stiffener/coverlay definitions.

Runtime is `smart-glasses`, running/connected with enforced unrestricted HTTP
at revision 4; inherited proxy/TLS was preserved. Vendor-specific HTTP 403s
remain access blockers and were not bypassed. The Amphenol import failure was
a missing-library result, not an approval denial. This review adds no electrical
or mechanical design changes, orders, pushes or publications.

Machine-readable evidence and calculation results:
[`bom/compact-assembly-review.json`](../bom/compact-assembly-review.json).
