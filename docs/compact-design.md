# Compact schematic review — 28 October 2026

This is the current hardware status. It supersedes the original WROOM/INMP441
planning documents. Work is on `codex/smart-glasses-circuits`; the WROOM comparison
is preserved at `c45edaa` / `codex/wroom-power-baseline`. No routing, publication,
fabrication, purchasing, flashing or physical testing has occurred.

## Implemented circuits

| Board | Current source blocks | Provisional outline |
| --- | --- | --- |
| Left | S3R8 +8 MB flash core, TPS63070 buck-boost, ICS-43434 mic, button/record LED driver, RF and frame connectors | 80 × 18 mm, four layers |
| Right | BQ24075T charger/power path, TPS22965 hardware switch, MAX17048 gauge, MAX98357A amplifier/enable driver, AT42QT1010 touch, battery/input/speaker/frame connectors | 100 × 18 mm, four layers |

These are placement coupons, not approved temple geometry. Neither outline includes
an installed battery, antenna, camera or speaker assembly. The tall through-hole JST
connectors are bench interfaces and need mechanical review before wearable packaging.
Source graphs and PCB traces are distinct: all detailed routing remains disabled.

## Compact MCU and RF

The current alternative uses **ESP32-S3R8 / C2913194**, with8 MB in-package octal
PSRAM and external **W25Q64JVZPIQ / C2940197**8 MB quad flash. It preserves the
original8 MB/8 MB capacity. LCSC showed8,294 R8 and80 flash at lookup, whereas
PICO C7545129 remained at zero. These are observations, not a stock reservation
or proof of JLC assembly inventory. Official tsci exact-footprint imports succeeded.
See [sourcing review](core-sourcing.md) for the primary evidence, price/area tradeoffs
and clock measurements and assembly checks.

R8 is a7 ×7 mm QFN, maximum0.9 mm high, with its own imported56 perimeter lands,
4 mm EPAD and nine grounded thermal vias. The vias remain intentional; filled/capped
via-in-pad, mask/paste and X-ray/assembly requirements need review. The PICO SiP,
its separate LGA import and its actual snapshot remain preserved in commit139a02a.
The earlier WROOM baseline retains its corrected nine EPAD segments.

Unlike PICO, R8 requires external flash,40 MHz crystal, analog filtering and RF matching.
Pins2/3 use VDD_RF through a2 nH filter;20/46/55/56 use VCORE3V3,57GND. Pins30–35
connect the external flash through six zero-ohm tuning links. VDD_SPI/pad29 and external flash now use a common3.296 V feed through R25=0 Ω,
with100 nF +1 µF bypass and TP9 for measurement. SPICS1/pad28 and
GPIO33–37/pads38–42 remain reserved for in-package PSRAM. GPIO45 is pulled low for
R8's3.3 V memory domain. R8V is a different1.8 V variant and must not be substituted.
USB19/20, strapGPIO3 and the pending camera GPIOs remain unconnected. UART, EN/BOOT,
controls, audio and the frame interface preserve their previous physical pad mapping.

The exact Abracon8 pF crystal uses a24 nH series element and provisional10 pF loads. The chip
RF network uses0201 CLC starting values1.5 pF/2.7 nH/1.5 pF. Hirose U.FL-R-SMT(10),
C434808, and R13 remain the provisional RF output. No tuned RF geometry, selected
antenna/coax, completed50 Ω route, final antenna matching/ESD or RF measurements exist.
Some support parts are on the underside; the main carrier cavity was increased to2 mm.
This is an implemented schematic/placement alternative, not a validated radio design.

Historical OV2640 header evidence is in [camera interface review](camera-interface-review.md).
Current exact assembly candidates and the OV5640 DOVDD conflict are in
[assembly candidates](assembly-candidates.md).
Routing limits are recorded in [routing feasibility](routing-feasibility.md).

## Logic regulator and load envelope

TPS63070RNMR / C109322 is operated in forced PWM, with a 1.5 µH Coilcraft
XFL4020-152MEC inductor and 312 kΩ / 100 kΩ, 0.1%, 25 ppm/K feedback divider.
Nominal output is **3.296 V**, named VCORE3V3. Input has 2 × 22 µF; output has
3 × 22 µF plus22 µF main bulk. R8 adds separate CPU/RTC/VDDA/RF bypass and a2 nH RF supply filter. VAUX has100 nF.
PG has a 100 kΩ pull-up and test pad. VSYS never directly supplies an MCU pad.
Imported physical VIN pads12/13 and VOUT pads7/8 are separately represented.

The former 3.2 V setting protected the INMP441's ambiguous supply specification.
ICS-43434 supports 1.65–3.63 V, permitting the standard nominal 3.3 V MCU rail.
Reference/divider tolerance is checked in the guard script; ±100 mV droop and
+40 mV ripple allowances are bench acceptance targets, not measurements.
Espressif memory-rail guidance gives typical 14 Ω in the internal VDD_SPI path and requires
accounting for flash/PSRAM current and voltage drop. The common external memory feed avoids that internal resistance; burst margin,
3.3 V configuration and supply sequencing still require bring-up checks.
CPU voltage must be ≤3.3 V during any future eFuse programming; no such operation
is authorized or tested here.

A provisional 1 A logic load at 3.296 V, 3.0 V battery and assumed 85% conversion
would draw about 1.29 A before right-board audio. This is a budgeting scenario,
not a regulator, cable or cell capacity test. Characterize Wi-Fi/JPEG/audio peaks,
effective MLCC capacitance, control-loop stability, hot-loop layout and temperature.
Battery undervoltage shutdown/recovery and final input protection are release gates.

## Microphone and controls

The user has bought no INMP441 and requested tsci/JLCPCB sourcing. Exact
**TDK ICS-43434 / C5656610** identity and LGA6 package were verified using the
official tsci exact-footprint import and manufacturer DS-000069 revision1.2.
LCSC showed **2,893** at the dated lookup (not a reservation).

Physical pins: 1WS, 2LR=GND (left slot), 3GND, 4SCK, 5VDD, 6SD. C11 is the
100 nF local bypass; R12 is a 100 kΩ SD pulldown. The imported 0.4 mm acoustic
hole was corrected to the manufacturer's minimum **0.5 mm**. The imported segmented copper ring was corrected to the continuous1.025/1.625 mm
annulus in TDK Figure13 using four touching polygon sectors. The0.522 ×0.600 mm
signal lands and0.822/0.900 mm spacing follow that drawing. A−0.05 mm paste offset
matches the recommended rectangular aperture reduction; for the ring it also reduces
the outer diameter, unlike the suggested Figure14 stencil. Exact ring stencil apertures,
mask, port sealing and assembly yield remain explicit review gates. This is not pin-compatible with INMP441.

Audio uses 16 kHz Philips I2S with two 32-bit wire slots (1.024 MHz BCLK), shared
between mic RX and amp TX; 16 kHz is the mic's low-power sample-rate mode.
The microphone SD guarantees0.35/0.65×VDD, whereas the S3 specifies0.25/0.75×VDD
input limits. The current circuit therefore restores SD through a **TLV3201AIDCKR
/C130037** comparator at half-supply, rather than connecting SD directly to the MCU.
Pins1OUT,2GND,3IN+,4IN−,5VCC match the primary TI pin table and official SC70-5 import.
100 kΩ/100 kΩ0.1% divider plus100 nF establishes the reference; another100 nF bypasses
the comparator. R12 pulls the raw mic output low. TI specifies≤4 mV offset and55 ns
propagation at its2.7 V/15 pF corner; the75 ns mic delay plus55 ns comparator and50 ns
setup allowance fit the488 ns half-clock at1.024 MHz. The reference has5 ms nominal
RC; startup settling and routed load≤15 pF still require measurements. Only **one unit**
was listed at lookup, so sourcing is a gate. This restores the static-level budget;
it is not a hardware test result. [TI datasheet](https://www.ti.com/lit/ds/symlink/tlv3201.pdf).

No MCLK is used. Existing firmware host/build results do not establish acoustic,
slot alignment or capture success with this replacement.

GPIO1 capture/PTT has 10 kΩ pull-up, 100 nF and a tactile switch. GPIO48 drives
a default-off NPN recording LED driver with 1 kΩ base resistor, 1 kΩ pulldown
and 1 kΩ LED series limiter. The stronger base pulldowns resist weak reset bias; asserted GPIO current stays below3 mA in the nominal3.3 V circuit. Reset behavior, indicator optical visibility and fault behavior are untested.

## Right power and charging review

BQ24075TRGTR / C544783 replaces the earlier BQ24074 candidate because the T
variant's voltage-sense TS network can set a narrower temperature window.
Its OUT regulation target is **5.5 V**, not BQ24074's 4.4 V. The current bench
input contract is regulated **5 V ±5%, current-limited to 500 mA** at keyed J3;
OUT can reach 5.25 V under that contract. This is not a finished exposed dock input.
SYSOFF/pad15 is grounded; this pad is not an ITERM programming input.

EN1 high / EN2 low selects USB500 mode (maximum500 mA input). R30=2.21 kΩ
sets ~403 mA typical charge, <446 mA including the specified current-factor and
1% resistor corners. R31=68 kΩ retains a nominal8.5 h timer (6.54–10.49 h with
35–55 s/kΩ factor and1% resistor corners). R32=4.7 kΩ remains connected to ILIM.
CE has a pull-up: **charging defaults disabled**. Only a deliberate service link
between TP31 and TP32 enables it after cell, NTC and thermal validation.
The charger still supplies its power-path output when charging is inhibited.

The benchmark cell is external Adafruit2011/PKCELL LP803860 2000mAh with PCM:
4.2 V termination, standard400 mA charge, quick-charge≤2 A, continuous discharge≤2 A,
charge0–45°C and standard discharge end3.0 V per the vendor document. It is too large
to treat as an established temple battery. Its stock harness has two wires, no NTC.
J2 requires a documented custom adapter: pin1 VBAT, pin2 GND, pin3 PACK_NTC.
No adapter, modification or sensor attachment has been physically performed.

The external sensor candidate is Vishay NTCLE100E3103JB0, 10 kΩ ±5%, B3977±0.75%,
thermally attached to the cell. R33=30.9 kΩ from input to sensor, R34=18.7 kΩ parallel
to sensor, R35=100 kΩ series into TS follow TI's ratiometric topology. The series
resistor is required by TI when the top resistor is below100 kΩ. Open or short NTC
inhibits charge. Nominal resistor/NTC curves give a deliberately conservative window;
sensor tolerance, comparator thresholds, thermal lag and sense leakage need validation.
A fixed resistor does not substitute for the battery thermistor.

At the maximum calculated charge current, (5.25−3.0)V ×0.446 A is about1.0 W
before system-path loss. TI's45.8°C/W figure is for its test board; it does not predict
this narrow enclosure's temperature. Charge must stay disabled pending thermal tests.
The charger/gauge do not replace protected-cell over/under/short protection.

TPS22965DSGR switches OUT to VSYS, with VBIAS on always-on OUT, a hardware SPDT
ON control with10 kΩ source limiting, 100 kΩ pulldown and1 nF CT. The corrected SPDT symbol maps physical2 to COM,1 to ON-bias and3 to GND/OFF. C&K JS-series pI-52 confirms the contact numbering; the two mounting holes were corrected to its0.9 mm nominal. Datasheet rise-time example is ~1.985 ms at
5 V; actual inrush with both boards' capacitance and low battery must be measured.
MAX17048G+T10 stays on VBAT; CTG/QSTRT/EP are grounded, ALRT is unused. Its SDA/SCL
pull-ups are 4.7 kΩ to the switched VCORE3V3, not always-on battery voltage.

## Right audio and touch

MAX98357AETE+T / C910544 runs on VSYS (2.5–5.5 V), uses the left I2S slot and
100 kΩ-to-VSYS gain selection for3 dB. Local100 nF and22 µF bypass are present.
NPN+PNP control supplies SD_MODE only from local VSYS, with1 kΩ NPN base feed and1 kΩ base pulldown plus the PNP/SD bias network;
it is never tied directly to a potentially higher MCU rail. J4 pin1=SPK_P,
pin2=SPK_N: neither speaker terminal is ground. Exact ≥8 Ω speaker, power limit,
filter/emissions needs and close-ear acoustic safety remain unverified.

AT42QT1010-TSHR / C74512 uses VCORE3V3, 100 nF bypass and low-power SYNC=GND.
10 nF Cs joins SNSK/SNS; a1 kΩ series resistor feeds the electrode review pad.
Its output passes through SN74LVC1G125DCKR/C7833 with OE grounded and100 nF bypass.
The buffer's2.0/0.8 V input thresholds accept the touch IC's2.3 V high /0.5 V low
specification, then restore full logic swing to the MCU. Exact TI identity/SC70-5
import and35 units at lookup were verified. Startup OUT is invalid for about100 ms;
firmware must ignore it during that interval. [Buffer datasheet](https://www.ti.com/lit/ds/symlink/sn74lvc1g125.pdf).
The final insulated electrode/cover needs tuning; the 3 mm test pad is not an
approved touch area. Maximum-on behavior and amplifier/touch operation are untested.

## Cable and unresolved camera

Both boards use FH12-20S-0.5SH(55) / C596730 with the same numbered contract in
[pin mapping](pin-mapping.md). Metal mounting lands21/22 are intentionally NC.
Four VSYS conductors and eight returns are allocated. Wurth687620100002 is only
a static bench cable candidate:20 contacts,0.5 mm pitch,100 mm,type1,0.5 A/contact.
A1.5 A aggregate target still requires current-sharing, drop, heating and continuity
checks. Connector orientation is not proven by equal net names. No dynamic hinge
rating or full-frame cable length has been established.

Camera GPIO4–18 remain reserved and unconnected until an exact module/carrier is
selected. The Waveshare reference is useful but labels an OV9655/2640 shared
carrier and grounds PWDN through R7=0 Ω. It cannot be connected blindly to an
actively driven GPIO or treated as a verified tiny camera module. Bare sensor
rails, lens/flex dimensions and connector orientation cannot be inferred from OV2640 alone.

## Evidence and remaining release gates

`npm run typecheck`, independent board builds and generated physical-pin invariants
have been exercised. Schematic/placement/source checks and actual renders are
recorded in the final validation report; a host check is never hardware verification.
The original firmware build, size and host tests remain valid for that source only;
they do not prove this new SiP/mic hardware port, runtime pairing or camera capture.

Required next inputs are frame internal dimensions and exact camera/battery/speaker/
antenna assemblies. Then finish the camera block, low-voltage/input protection,
RF/power layout and full electrical review, route, review manufacturing outputs,
and perform bench/fit/thermal/RF/acoustic tests before worn operation.

## Primary references and licensing

- [Espressif PICO-1 datasheet v1.2](https://documentation.espressif.com/esp32-s3-pico-1_datasheet_en.pdf), external circuitp29, packagep30, physical pins and memory-voltage table.
- [M5Stack AtomS3R-CAM](https://docs.m5stack.com/en/core/AtomS3R-CAM), [main schematic](https://m5stack-doc.oss-cn-shenzhen.aliyuncs.com/681/main_board_schematic.pdf): exact SiP camera precedent; assembled24×24×13.5mm. Facts studied only; separately hosted PDF license not established, no layout copied.
- [TDK ICS-43434 revision1.2](https://product.tdk.com/system/files/dam/doc/product/sw_piezo/mic/mems-mic/data_sheet/ds-000069-ics-43434-v1.2.pdf).
- TI datasheets: [TPS63070](https://www.ti.com/lit/ds/symlink/tps63070.pdf), [BQ24075T](https://www.ti.com/lit/ds/symlink/bq24075t.pdf), [TPS22965](https://www.ti.com/lit/ds/symlink/tps22965.pdf).
- Analog Devices [MAX17048](https://www.analog.com/media/en/technical-documentation/data-sheets/MAX17048-MAX17049.pdf), [MAX98357A](https://www.analog.com/media/en/technical-documentation/data-sheets/MAX98357A-MAX98357B.pdf).
- Microchip [AT42QT1010](https://www.microchip.com/en-us/product/AT42QT1010); onsemi [MMBT3904](https://www.onsemi.com/pdf/datasheet/mmbt3904lt1-d.pdf) / [MMBT3906](https://www.onsemi.com/pdf/datasheet/mmbt3906lt1-d.pdf).
- [Vishay thermistor](https://www.vishay.com/docs/29049/ntcle100.pdf), [benchmark cell](https://cdn-shop.adafruit.com/datasheets/LiIon2000mAh37V.pdf), [Wurth cable](https://www.we-online.com/components/products/datasheet/687620100002.pdf).
- [Waveshare carrier schematic](https://files.waveshare.com/upload/9/99/OV2640-Camera-Board-Schematic.pdf): reference only, module/revision still unresolved.

Seeed hardware references carry CC BY-SA4.0; Adafruit MEMENTO/BQ24074 boards carry
CC BY-SA3.0. They informed comparisons, not copied design geometry. Espressif S3-EYE
schematic is proprietary guidance, not an open-hardware source to copy. No exact
openly licensed two-temple board was found. Any future adapted licensed files require
attribution and applicable ShareAlike compliance.

Additional primary connector/switch drawings checked through the manufacturer PDFs
linked by exact supplier listings: [C&K JS series](https://www.littelfuse.com/assetdocs/littelfuse-ck-slide-js-series-datasheet?assetguid=aba42b08-0d2c-423b-813d-a2faa5a3bb14),
[Hirose FH12 family](https://datasheet.lcsc.com/datasheet/pdf/f7f9ef83244d2b4dc557bd16689a3c06.pdf?productCode=C596730),
[Hirose U.FL family](https://datasheet.lcsc.com/datasheet/pdf/ed724b9ee28536c28fee4171a29923cc.pdf?productCode=C434808),
[JST PH family](https://datasheet.lcsc.com/datasheet/pdf/6324c8615b21464c92f0a46fe6f6545c.pdf?productCode=C131339).
These family drawings confirm nominal package/contact information; current individual
engineering drawings, connector mating orientation and assembly process still require review.
