# Pin allocation and interconnect contract

Updated 2026-10-28. The allocation below is a **review proposal**, not a released pin map.
Module pad lookups were checked against Espressif's WROOM-1/1U datasheet v1.8, Table 3-1.
The functional assignments have not been built, wired or measured. Camera flex contacts,
peripheral package pins and FPC contact numbering remain unassigned. The left TSX now
contains the [MCU core](main-board-core.md); the right remains a power-rail scaffold.
Camera/audio/FPC GPIO assignments below are still unconnected in TSX.

## Reserved resources

- GPIO35/36/37 are unavailable on the N8R8 octal-PSRAM variant. Do not use memory pins
  or GPIOs that are not exposed by this module, including GPIO26–34.
- Preserve USB D− GPIO19/module pad 13 and D+ GPIO20/pad 14.
- Preserve UART0 TX GPIO43/pad 37 and RX GPIO44/pad 36 for recovery/debugging.
- Leave GPIO0/3/45/46 available for correct boot straps. GPIO46 is input-only.
  Provide BOOT and EN recovery access; EN is module pad 3, not GPIO3.
- Reusing GPIO39–42 for audio/control means an external four-wire JTAG connection is
  not reserved; USB Serial/JTAG is the proposed debug path.

Source: [module datasheet v1.8](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf),
sections 3–4. GPIO numbers are not module pad numbers.

## Proposed custom-board GPIO allocation

[Machine-readable allocation](proposed-gpio-map.csv) is the detailed proposal. Directions
below are relative to the MCU. Pin choices are ours; they are not copied from an SDK board.

| Function | GPIO proposal | Module pad lookup | Direction |
| --- | --- | --- | --- |
| CAM_D0…D3 | 4, 5, 6, 7 | 4, 5, 6, 7 | In |
| CAM_D4…D7 | 8, 9, 10, 11 | 12, 17, 18, 19 | In |
| CAM_PCLK / HREF / VSYNC | 12 / 13 / 14 | 20 / 21 / 22 | In |
| CAM_XCLK | 15 | 8 | Out |
| CAM_SIOD / SIOC | 16 / 17 | 9 / 10 | Bidirectional / Out |
| CAM_PWDN | 18 | 11 | Out |
| AUDIO_BCLK / LRCLK | 38 / 39 | 31 / 32 | Out, shared mic and amp |
| MIC_SD | 40 | 33 | In, local |
| AUDIO_DOUT | 41 | 34 | Out, through FPC |
| CTRL_SDA / SCL | 47 / 2 | 24 / 38 | Bidirectional / Out |
| TOUCH_OUT | 21 | 23 | In, through FPC |
| AMP_ENABLE | 42 | 35 | Out, through FPC to control network |
| USER_BUTTON | 1 | 39 | In |
| REC_LED | 48 | 25 | Out |

This uses **25 distinct GPIOs**. LCD_CAM handles the camera; I2S0 TX/RX shares the
16 kHz, 32-bit-slot audio clocks; I2S1 is free as a peripheral, but spare GPIOs are not
therefore available. Proposed SCCB uses I2C0; the right-board control bus uses I2C1.
All output assignments are to output-capable, exposed pins outside the reserved set.
USER_BUTTON GPIO1 and TOUCH_OUT GPIO21 are RTC-capable, preserving future sleep/wake
options; retained power, bias and wake configuration still need verification.

Conditions for this allocation:

- Camera RESET is strapped only if its exact module/sequence allows it. A separately
  controlled RESET requires a new allocation or reviewed I/O expansion.
- INMP441 L/R is strapped low and CHIPEN high to its VDD initially, without extra GPIOs.
- Poll MAX17048 on I2C. Do not allocate FG_ALERT_N, CHG_N or PGOOD_N as MCU inputs
  in this baseline. Unused outputs/straps still need a schematic review.
- The physical power button controls the hardware switch/latch locally. It does not get an
  additional MCU pin. Pairing/status indication needs a displayless firmware implementation.
- A second audio clock pair, mic-enable GPIO or extra indicators reopens this allocation.
- This is not a development-board wiring guide: DevKit revisions have onboard RGB LEDs
  on GPIO38 or GPIO48 and may add loads. Inspect/remap the actual bench board first.

See [peripheral integration](peripheral-integration.md) for audio framing, camera port work,
power/control limits and prototype test gates.

## Inter-temple FPC signal groups

A **20-contact cable remains an allocation study**, not a connector selection or pin order.
Three former optional alert/status allocations are reassigned as ground-return candidates.
Counts sum to 20; final current rating, geometry and signal-integrity review may change them.

| Signal(s) | Count | Direction relative to main | Electrical requirement |
| --- | --- | --- | --- |
| VSYS | 2 | In from right | Switched system voltage; contact current sharing/derating TBD |
| GND | 8 | Common return | Distribute beside clocks/data and power; actual contact order TBD |
| 3V3_CTRL | 1 | Out to right | Control power; accuracy, load, return drop and off-state review |
| AUDIO_BCLK, AUDIO_LRCLK, AUDIO_DOUT | 3 | Out to right | 16 kHz I2S, 1.024 MHz BCLK; clocks shared with left mic |
| CTRL_SCL, CTRL_SDA | 2 | Clock out / bidirectional | I2C with pull-ups to reviewed switched logic rail |
| TOUCH_OUT | 1 | In | Touch logic at the reviewed control voltage |
| AMP_ENABLE | 1 | Out | Default-off SD_MODE interface; not a direct unreviewed 3.3 V tie |
| Spare | 2 | TBD | No assigned MCU GPIO; may become power/ground or future signals |

No microphone data or MCLK crosses this FPC. Use one net contract at both ends. Top/bottom
contact orientation and same/opposite-side cable construction determine conductor numbering.
Select pitch, thickness, cross-section, contact rating and voltage drop for the actual frame
length and peak load; two VSYS contacts do not imply a particular ampacity. Assess I2C
capacitance/rise time and clock/data damping/return paths for the full frame/hinge cable.

Battery and bridge speaker outputs stay local to the right. Camera DVP uses its own short
left-side flex; RF uses a separate coax path. Do not hot-plug the cable under power unless
the eventual hardware is designed for that behavior.

## Currently implemented scaffold connectivity

The right board retains TP1/C1 pin 1 on VSYS and TP2/C1 pin 2 on GND, with a DNP
100 nF example capacitor. The left board now has U1 and its core passives: TP1 is the
**regulated V3V3_CORE input**, TP2 GND, TP3 MCU UART0 TX, TP4 RX, TP5 EN, and TP6
GPIO0/BOOT_N. TP1 is not VSYS on the left board. No physical FPC connector or cable
contact order exists yet. Identical net names do not join the independent Circuit JSON
outputs. See [core connections](main-board-core.md). Routing remains disabled.

## Pin-map release gate

Before translating this proposal into TSX, review every reset state, voltage, physical pad,
peripheral pin and chosen connector contact against the exact hardware. Record camera
D0 naming versus vendor D2…D9 naming if applicable, buffer/clock timing, boot recovery,
SD_MODE voltage behavior, and both cable ends' continuity. Then bench-test the combination
and update the CSV/status. No functional mapping is finalized by this document.
