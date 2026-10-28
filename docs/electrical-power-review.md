# Electrical, RF and thermal review — 28 October 2026

These are independent calculations against manufacturer documents and the generated
netlists. They are not power, temperature, RF or runtime measurements. Reproduce the
scenarios with `node scripts/report-power-budget.mjs`; inputs derived from the built
BOM and explicit assumptions are recorded in `dist/power-budget.json`.

## Memory supply correction

ESP32-S3 series v2.2 Table1-1 identifies **R8** as3.3 V octal PSRAM; R8V is a
different1.8 V part. Table5-3 gives a **typical14 Ω** VDD_SPI path and requires
VDD_RTC > Vmemory_min + Imemory_max × RSPI. Winbond revisionK Table9.4 gives
18 mA maximum80 MHz read current, and25 mA program/erase current. These figures
exclude the S3's in-package PSRAM and dynamic output-load current. RSPI has no
published worst-case bound in that table. Tables5-11/5-12 specify2.7–3.6 V for3.3 V flash/PSRAM, but do not bound the
combined PSRAM burst current. At the3.15 V rail-budget floor the typical14 Ω path
leaves only about32 mA for all memory load before reaching2.7 V. The old
configuration therefore lacked a
guaranteed combined flash/PSRAM voltage margin; a successful netlist was insufficient.

The current review uses **R25=0 Ω from VCORE3V3 to VDD_SPI**, powering pad29 and
flash from the same regulated3.296 V source as VDD3P3_RTC. It removes reliance on
the internal14 Ω path. This is the external-supply option documented in Espressif
hardware guidelines1.3.2 and TRM v1.8 section10.3.4.3. It is a common supply, not
an independent regulator feeding an output at a different voltage. Local100 nF +1 µF
and flash100 nF remain. TP9 exposes the memory rail for transient measurement.

**Only3.3 V memory operation is permitted.** GPIO45 remains low; exact R8 identity,
factory/eFuse state and software overrides must preserve3.3 V, including boot/reset
and sleep transitions. The TRM describes XPD_SDIO_REG=0 as high impedance for an
external supply, and SDIO_TIEH=1 as the3.3 V connection to VDD3P3_RTC. Any future
software selecting1.8 V is incompatible with this assembly. No eFuse was programmed
and no powered behavior was tested. Factory state/bring-up and sleep sequencing
remain bench gates; do not generalize this feed to a1.8 V S3 variant.

The existing regulator tolerance budget gives approximately3.15 V after its100 mV
droop allowance. A provisional additional50 mV feed-drop acceptance limit leaves
about3.10 V, above the conservative3.0 V memory-domain target. These are acceptance
budgets, not measured margins. Validate at TP9 with simultaneous flash/PSRAM/Wi-Fi
activity and check the actual0 Ω link, copper, decoupling and regulator stability.

Primary documents: [S3 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf),
[TRM](https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf),
[hardware guide](https://docs.espressif.com/projects/esp-hardware-design-guidelines/en/latest/esp32s3/esp-hardware-design-guidelines-en-master-esp32s3.pdf).

## Current and cable scenarios

Assume3.0 V at the cell,85% buck-boost efficiency,85% amplifier efficiency,8 Ω
speaker at theoretical full scale and5 mA auxiliary load. Logic current includes
CPU/radio, camera and left peripherals; it is not a measured ESP32 current.

| Logic load at3.296 V | Total modeled path resistance | Supply at loads | Battery current |
| --- | --- | --- | --- |
|0.35 A |0.20 Ω |2.862 V |0.690 A |
|0.70 A |0.20 Ω |2.762 V |1.191 A |
|1.00 A |0.20 Ω |2.669 V |1.654 A |
|0.70 A |0.40 Ω |2.489 V |1.279 A |
|1.00 A |0.40 Ω |2.240 V |1.901 A |

This conservative model puts both loads at the lowest common path voltage; real
right-board and left-board drops differ. It exposes a design constraint: at high
resistance the amplifier drops below its2.5 V operating minimum even while the
buck-boost could continue. Bound pack/PCM/BATFET/switch/cable/contact resistance;
nominal contact count alone does not prove current sharing. Four0.5 A VSYS contacts
are not an unconditional2 A system rating. The selected100 mm static cable is not
an established whole-frame length or dynamic hinge flex.

## Average use versus instantaneous demand

The1.654 A result is **cell-terminal current in a sustained stress scenario**, with
3.0 V at the cell terminals before modeled0.20 Ω pack/PCM/FET/contact/cable losses.
The modeled load node is2.669 V, the regulated logic rail3.296 V. It assumes1 A
logic continuously plus theoretical full-scale8 Ω audio. It is not measured continuous
product consumption, nor a measured transient. Pack comparisons use continuous
ratings because no qualified pulse rating or burst profile is available.

Espressif Table5-7 reports340 mA for802.11b1 Mbps/+21 dBm at3.3 V/25 °C and100%
TX duty, with other rates283–291 mA. This is not a specification that the entire
product draws1 A. OV5640 Table8-3 gives, for an external-DVDD5 MP/15 fps JPEG
condition, up to40 mA analog,125 mA core and12 mA I/O. With linear regulators these
rail currents contribute roughly177 mA upstream, plus oscillator/buffer losses.
They do not establish the unknown final module's QVGA or startup consumption.
Adding340 mA radio,177 mA camera,25 mA flash and a10 mA allowance suggests about
0.55 A on the logic rail as an illustrative concurrent case. The conditions differ,
so this is not a guaranteed combined maximum. Actual PSRAM/CPU/camera/inrush and
network profiles must be measured;1 A remains an unverified stress envelope.

Duty cycling can materially lower average demand. An **unimplemented illustrative**
60 s cycle with54 s at50 mA logic,2 s capture at300 mA,2 s TX at400 mA, then2 s
reply at150 mA plus0.10 W speaker gives73.3 mA average logic. With the same85%
efficiencies and5 mA auxiliary assumption, average battery current is about101 mA
at3.0 V before path loss. This is an assumption table, not a runtime claim. It
requires verified camera power gating, idle behavior and non-overlapping capture/TX.
The current firmware has not demonstrated that schedule or those currents.

That example's400 mA logic TX state still needs about522 mA from3.0 V before path
loss or audio. Thus a370 mA continuous-rated pack is not qualified by the lower
average. A different high-rate cell, a verified lower-peak implementation or a
proper burst buffer could change the result. For scale only, covering a200 mA
deficit for20 ms with100 mV allowed droop needs C=I×t/ΔV=40 mF, before ESR and
recharge limits; those pulse parameters are illustrative and no buffer is selected.
Never infer pulse capability from capacity or average current alone.

## Charger and thermal constraints

BQ24075T R30=2.21 kΩ gives about403 mA nominal;975/(2210×0.99) gives446 mA at
the reviewed upper corner. At5.25 V input and3.0 V cell, charge-path dissipation can
reach about1.00 W before other losses. TI's reference θJA45.8 °C/W would imply
about46 °C junction rise on that reference board. It does not predict the narrow
coupon's surface or the wearer's temperature.125 °C thermal regulation protects
the IC; it is not an acceptable enclosure-temperature target.

At1 A logic and assumed85% conversion efficiency, total converter loss is about
0.582 W. Assigning it all to the IC with TI reference θJA63 °C/W gives a36.6 °C
reference junction-rise scenario. Actual losses split between IC, inductor and
copper; the actual stack-up/planes/enclosure must be measured.

The5 V/500 mA input provides only2.5 W. It cannot simultaneously supply the1 A
logic scenario and full-rate charging. DPPM reduces charging and the battery may
supplement the system; being plugged in does not guarantee net charging under load.

Charge remains **default disabled**. A selected pack must meet the complete
current/temperature profile. For example, Jauch LP504783JU permits only420 mA below
15 °C: the present446 mA upper corner exceeds it. That candidate needs a lower
ISET value (2.49 kΩ would give≤396 mA), timer review and an actual attached NTC
before charging can be enabled. The narrower LP561836JU is incompatible with both
the current load budget and charge-current setting. Pack PCM trip current is not
an application cutoff or sufficient cable fault protection.

## RF and release gates

The1.5 pF/2.7 nH/1.5 pF0201 CLC is within Espressif's starting ranges, and the RF
supply filter is2 nH/900 mA. Neither fact establishes a tuned radio. Choose a real
stack-up, review the chip ground stub and uninterrupted RF reference, tune the
50 Ω path/matching with the selected U.FL coax/antenna, then measure power,
harmonics and enclosure/body loading. Do not copy module matching values as a
qualification of this board. Application undervoltage shutdown/recovery, upstream
fault limiting, thermal spreading, cable balance and physical tests remain open.
