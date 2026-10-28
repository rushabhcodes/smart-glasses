# Research source register

Checked 2026-10-28. Official documentation, installed CLI help and package declarations
were used for this initialization. Web pages and supplier stock can change. Preserve exact
datasheet revisions and dated stock evidence when components are approved.

## tsCircuit

- [Official CLI quickstart](https://docs.tscircuit.com/intro/quickstart-cli)
- [tsci init](https://docs.tscircuit.com/command-line/tsci-init): official bootstrap used.
- [tsci build](https://docs.tscircuit.com/command-line/tsci-build): explicit per-board input files.
- [tsci check](https://docs.tscircuit.com/command-line/tsci-check): supported checks confirmed with installed help.
- [Project configuration](https://docs.tscircuit.com/guides/tscircuit-essentials/tscircuit-config)
- [Testpoint primitive](https://docs.tscircuit.com/elements/testpoint)
- Installed `@tscircuit/props` declarations: board/group `routingDisabled`, testpoint and capacitor props.
- Published npm `tscircuit@0.0.3033`, latest tag at setup; TypeScript stays at 5.9.3 to satisfy its 5.x peer requirement.

## Hardware

- [ESP32-S3-WROOM-1/1U datasheet v1.8](https://www.espressif.com/sites/default/files/documentation/esp32-s3-wroom-1_wroom-1u_datasheet_en.pdf): variant, power, pin constraints, package/connector/land-pattern drawings.
- [Espressif schematic checklist](https://docs.espressif.com/projects/esp-hardware-design-guidelines/en/latest/esp32s3/schematic-checklist.html): supply capability and decoupling guidance.
- [Espressif PCB layout guidance](https://docs.espressif.com/projects/esp-hardware-design-guidelines/en/latest/esp32s3/pcb-layout-design.html): grounding and RF layout.
- [TPS63031 product and datasheet](https://www.ti.com/product/TPS63031): Rev. D linked by TI; input/output/current limits and DSK package.
- [BQ24074 product](https://www.ti.com/product/BQ24074) and [BQ2407x datasheet Rev. N](https://www.ti.com/lit/ds/symlink/bq24074.pdf): power path, OUT voltage, charging and NTC controls.
- [MAX17048 product/datasheet](https://www.analog.com/en/products/max17048.html): single-cell gauge and package alternatives; exact ordering variant unselected.
- [MAX98357A product](https://www.analog.com/en/products/max98357a.html) and [datasheet Rev. 16](https://www.analog.com/media/en/technical-documentation/data-sheets/MAX98357A-MAX98357B.pdf): I2S input, supplies and bridge speaker output.
- [INMP441 manufacturer datasheet](https://product.tdk.com/system/files/dam/doc/product/sw_piezo/mic/mems-mic/data_sheet/inmp441.pdf): DS-INMP441-00 Rev. 1.1, Table 1 lists 1.62–3.63 V, while the Table 6 VDD description says 1.8–3.3 V. Preserve the conservative supply-design range pending clarification of the nominal-versus-limit wording. Download checked 2026-10-28, SHA-256 `dddcc8ac55f9ff15e93760b5d01814bccbef0cebbb3857e0fb3954b2b4973d150`. Lifecycle and purchasing availability remain separate checks.
- [AT42QT1010 product](https://www.microchip.com/en-us/product/at42qt1010) and [datasheet DS40001946A](https://ww1.microchip.com/downloads/en/DeviceDoc/40001946A.pdf).
- [Arducam OV2640 supplier module example](https://www.arducam.com/arducam-ov2640-camera-module-2mp-mini-ccm-compact-camera-modules-compatible-with-arduino_m0031esp32-esp8266-development-board-with-dvp-24-pin-interface_.html): illustration of module-specific dimensions/connector/rails; **not selected**. Its page has inconsistent interface metadata, so request a module drawing/schematic.
- [Arducam OV2640 lifecycle discussion](https://www.arducam.com/blog/ov2640/): vendor reports legacy sensor supply risk; reconfirm orderable module availability directly.

## Firmware

- [ESP-IDF S3 I2S documentation](https://docs.espressif.com/projects/esp-idf/en/stable/esp32s3/api-reference/peripherals/i2s.html)
- [Espressif camera driver](https://github.com/espressif/esp32-camera): OV2640/JPEG/PSRAM support and limitations; example board GPIOs are not this board's map.
- [Espressif Bluetooth audio platform support](https://docs.espressif.com/projects/esp-adf/en/latest/solution-center/bluetooth-audio.html): S3 BLE-only constraints.

## Muse personal agent

The applicable product is the personal agent and its **Gadgets SDK**, as clarified by the
project owner. Muse Spark API and locally hosted Muse Glimmer are different integration
paths and are not this project's baseline. See [Muse integration](muse-integration.md)
for the official repository, board support, porting requirements and research revision.

## Camera/audio integration review

The [peripheral integration plan](peripheral-integration.md#evidence-inspected) adds pinned
SDK source references for the INMP441-capable Guition adapter, board audio interface,
16/24 kHz realtime conversion, text-only voice-note response path, displayless build restriction,
generic camera API, Watcher-only capture command and 8 MB app partitions. The SDK revision
was rechecked and remains `1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc`.

Espressif camera release 2.1.8 and its IDF >=5.1 manifest were inspected. This is a proposed
firmware dependency, not an installed package or a completed ESP-IDF 6.0.1 build. INMP441
64-clock framing and supply limits, MAX98357A's excluded 24 kHz rate and SD_MODE behavior,
and the S3 module pad table were checked before drafting the new pin/resource plan.

## JLCPCB-imported MCU core (2026-10-28)

The new [MCU-core review](main-board-core.md) records primary JLCPCB/LCSC identities for
C2980300, C25804, C45783, C14663 and C15849, the actual `tsci import` commands, corrected
module pin metadata, nominal CAD comparison and remaining assembly/DC-bias/stock checks.
All other unverified supplier fields remain blank. Physical hardware has not been built.
