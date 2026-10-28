# Development roadmap

## 0 — Repository baseline (this initialization)

- Official tsCircuit CLI bootstrap, locked dependencies and strict TypeScript.
- Independent main/secondary circuit entries and shared power-rail scaffold.
- No detailed IC schematics, routing, manufacturing outputs or firmware flashing.
- Preliminary BOM and evidence-linked engineering decisions.
- Initial displayless firmware implementation in [firmware/](../firmware/README.md), with
  pinned SDK/IDF and build-only scripts. No account or hardware validation.
- See [validation](validation.md) and [firmware validation](firmware-validation.md) for checks.

## 0.5 — First hardware schematic block

The left MCU core is now drawn using JLCPCB imports. Review its [pin/footprint corrections](main-board-core.md),
external regulated-power assumption and generated-connectivity guards. Next add a suitable
power subsystem, then the camera/audio blocks and the physical interconnect contract.
The right board remains a scaffold; there is still no routed or fabricated glasses PCB.

## 1 — Prove the Muse peripheral port on the bench

Follow [peripheral integration](peripheral-integration.md). Keep the S3 N8R8 candidate and
start from the SDK's matching base with ESP-IDF 6.0.1; do not assume its status/button profile
contains our media drivers. Inspect the actual development-board revision before wiring it.

1. **Electrical and framing proof:** on a bench fixture, validate nominal rail accuracy and
   INMP441 samples at 16 kHz with 64 BCLK/frame. Confirm MAX98357A playback, software
   volume, shutdown/clock sequencing and default-off behavior. Use shared I2S0 clocks and
   adapt the existing Guition audio-interface pattern; its speaker IC and GPIOs differ.
2. **Displayless Muse voice:** bench-test the initial custom no-display port, pair
   the real account, and validate input/response using an admitted experimental realtime voice
   session. Keep its 24 kHz wire audio separate from 16 kHz hardware. Voice-note text replies
   are insufficient; implement TTS explicitly if realtime admission is unavailable.
3. **Camera proof:** select a documented camera module/connector and bench-test the initial
   esp32-camera 2.1.8 backend and its independent camera.capture command. Demonstrate one bounded QVGA JPEG
   reaches Muse and is interpreted in the intended interaction.
4. **Combined operation:** measure image size, heap/largest internal block, PSRAM/DMA,
   app-slot size, reconnect, underruns, current peaks and latency. Begin with separate media
   operations; only then test a still during a connected voice session. Verify recording indication
   on success, error and timeout. Use these results to review resolution and the power rail.

Exit: reproducible camera/voice evidence on the exact bench hardware and account, a reviewed
custom-board pin map, and firmware resource/power measurements. No frame miniaturization or
functional PCB schematic should depend on an untested media or service capability.

## 2 — Freeze physical and electrical constraints

Measure frame volume, camera view/lens height, antenna location and inter-temple path.
Select one protected cell, speaker and charging dock specification. Measure peak and idle
loads and estimate runtime using usable watt-hours, duty cycle and conversion efficiency.
Choose converter headroom and system power-off topology from those measurements.

Exit: dimensioned envelope, thermal/load budget, real part/supplier selections and FPC study.

## 3 — Verify components and pin budget

Select exact ordering suffixes and connector/cable construction. Review all datasheets,
physical pin numbering, land patterns, I/O voltages, off states and boot/debug constraints.
Allocate camera, audio, I2C and controls without collisions or PSRAM/strap misuse.
Add missing power protection, rail generation, passives, recovery and test points to BOM.

Exit: reviewed footprint/symbol library and connector continuity drawing; BOM status updated.

## 4 — Build functional schematics independently

Add one verified functional block at a time: protected battery/charger/system switch,
regulation, MCU boot/debug, audio, camera and controls. Use schematic sections once
complexity grows. Validate netlist and placement after each block; maintain shared FPC
signal names and review the assembled cable system separately.

Exit: electrical review and meaningful schematic checks; no unrated placeholder parts.

## 5 — Mechanical placement, then routing

Only after earlier gates, place verified parts within the measured outlines, establish
RF/acoustic/hinge keepouts, choose a stack-up, then route. Review current/return paths,
I2S/camera timing, regulator loops, Class-D outputs and ESD paths. Run routing/short checks
and inspect fabrication outputs before ordering a bench prototype.

## 6 — Bench bring-up, then wearable prototype

Bring up supplies with current limits; test charger/protection, reset/programming, RF,
audio, camera, recording indicator and Muse reconnect. Exercise low battery and power-off.
Measure thermal rise and EMI, hinge endurance and battery/runtime behavior. Use results
to revise board partitioning, module choice, enclosure and battery capacity before worn use.
