# R8 boot and memory supply review

Reviewed28 October2026 against Espressif's ESP32-S3 series datasheet v2.2,
technical reference manual v1.8 §10.3.4.3, and hardware design guide §1.3.2.
This is a source/design review. No physical chip's eFuses, reset behavior or rail
waveforms have been read or measured. No eFuse programming is proposed.

## Common supply and physical pads

| Physical R8 pad | Function | Implemented supply |
| --- | --- | --- |
|2,3 | VDD3P3 RF/analog supply | VDD_RF from VCORE3V3 through L3=2 nH, local bypass |
|20 | VDD3P3_RTC | VCORE3V3, local bypass |
|46 | VDD3P3_CPU | VCORE3V3, local bypass |
|55,56 | VDDA | VCORE3V3, local bypass |
|29 | VDD_SPI / in-package PSRAM supply and external flash rail | R25=0 Ω from the same VCORE3V3,100 nF +1 µF, TP9 |
|57 | Exposed ground pad | GND, nine intentional grounded thermal vias |

R8 means3.3 V octal PSRAM; R8V is the distinct1.8 V variant. The external
W25Q64JV flash also requires2.7–3.6 V. Series datasheet Tables5-11/5-12 give
2.7–3.6 V for the3.3 V memory class. The documented3.0 V acceptance target is
our conservative design target, not a claim that2.7 V is outside that table.
R25 avoids relying on the internal14 Ω **typical**, unbounded maximum path for
combined flash/PSRAM current. It does not establish a measured burst margin.

GPIO47/48 are **physical pads37/36**. Espressif allows their I/O supply selection
between VDD_SPI and VDD3P3_CPU. These domains share the same external source here;
neither selection permits a1.8 V override. Physical pads47/48 are different GPIOs
(41/42), used for audio data and amplifier enable. PSRAM SPICS1/pad28 and
GPIO33–37/pads38–42 remain unavailable to peripherals.

## Memory states that must be preserved

The TRM distinguishes the default strap/eFuse source from an RTC register override.
The rows below describe the effective source controls, rather than assuming software
or factory state from a host build.

| Effective state | Internal pad29 behavior | Disposition with R25 populated |
| --- | --- | --- |
| Default eFuse force clear, GPIO45 low, no RTC override |3.3 V connection to VDD3P3_RTC | Compatible common source; GPIO45 has external10 kΩ pulldown |
| eFuse force set, XPD=1, TIEH=1 |3.3 V connection | Compatible common source; confirm actual eFuses before bring-up |
| Effective XPD_SDIO_REG=0 | High impedance, external supply accepted | R25 supplies memory; check the effective configuration through reset/sleep |
| Effective XPD=1, TIEH=0 from forced eFuse or RTC configuration | Internal1.8 V regulator | **Incompatible** with this3.3 V assembly; do not enable or burn this state |
| Sleep powers down internal VDD_SPI regulator | Internal source disabled | R25 still powers memory from VCORE3V3; no claim of minimum datasheet deep-sleep current |

An RTC force setting can supersede strap-based selection. Keep both firmware and
bootloader configuration consistent with the3.3 V assembly. The cached ESP-IDF
v6.0.1 RTC initialization source consults RTC override or GPIO45; reading that helper
does not prove physical eFuse state. The bootloader's optional1.9 V boost path is
for a1.8 V configuration and is not a justification for this assembly. Existing
host firmware checks do not inspect silicon or validate this new board's boot.

## Boot straps and recovery

GPIO3 has no internal pull according to datasheet §3.4. It was floating in the
prior review. **R26=10 kΩ / C25804 now pulls physical pad8 to VCORE3V3** and a
generated physical-pin guard checks the connection, value and supplier identity.
It remains reserved from peripherals. Table3-5 states that, when strap JTAG
selection is enabled and neither JTAG controller is disabled, **GPIO3 high selects
USB Serial/JTAG; low selects pad JTAG**. Pad JTAG shares GPIO39–42 with the audio
interface, so a floating or low strap is undesirable. Default strap-selection eFuse
clear makes GPIO3 irrelevant to JTAG selection; the resistor is still required to
avoid a floating strap. An eFuse disabling USB JTAG cannot be repaired by this bias.

GPIO0 retains its10 kΩ pull-up and BOOT recovery pad; GPIO45/46 retain external
10 kΩ pulldowns. EN/pad4 retains10 kΩ/1 µF and a recovery test pad. Straps must be
stable over the documented reset sampling/hold interval (at least3 ms after EN
rise); no physical reset timing is established by the RC nominal value. UART0
recovery pads remain available. No camera or control signal uses a boot strap.

## Checks still required on a physical review board

Read exact chip identity and relevant eFuses without modifying them before normal
boot. Confirm no1.8 V force or USB-JTAG disable conflicts. Scope CPU/RTC, filtered
RF and TP9 memory supplies through power-up, reset, flash/PSRAM/Wi-Fi activity and
sleep/wake; verify regulator stability and common-source behavior. The provisional
memory acceptance budget is at least3.10 V after allotted rail/feed droop. Inspect
reset strap levels and recovery access. No flash, eFuse, RF or power test has run.

Primary sources: [series datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf),
[TRM](https://www.espressif.com/sites/default/files/documentation/esp32-s3_technical_reference_manual_en.pdf),
[hardware guide](https://docs.espressif.com/projects/esp-hardware-design-guidelines/en/latest/esp32s3/esp-hardware-design-guidelines-en-master-esp32s3.pdf).
