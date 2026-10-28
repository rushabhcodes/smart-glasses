# Displayless Muse smart-glasses firmware

An initial **compile-tested port**, targeting the proposed ESP32-S3-WROOM-1U-N8R8
(8 MB quad flash, 8 MB octal PSRAM). This is firmware source for the two-board hardware
plan; the right PCB has no second MCU. No device has been flashed or tested with this port.
GPIO assignments are a compile-time proposal, not approved wiring or camera connector contacts.
See [hardware plan](../docs/peripheral-integration.md) before any bench work.

## Build without flashing

From the repository root, on Linux with git, C/C++, CMake, Ninja, Python/uv and standard
ESP-IDF host prerequisites installed:

```sh
npm run firmware:bootstrap  # first run; downloads ESP-IDF and the S3 toolchain locally
npm run firmware:build
npm run firmware:test
npm run firmware:size
```

These scripts do not require npm package installation for firmware; they are convenient
aliases for `bash firmware/scripts/{bootstrap,build}.sh`. The build script accepts only
`build`, `test` and `size`. It never opens a serial port and has no flashing target.
Do not use the SDK's flash helper for this unreviewed pin map.

All toolchains, SDK checkouts and generated project sources stay under ignored `.cache/`.
No global shell profile, system ESP-IDF installation, service or USB device is changed.
First bootstrap needs internet access and several GB of disk space. `uv` installs a local
Python 3.12 if needed. Host package prerequisites remain the host's responsibility.

Outputs are `firmware/build/muse-gadget.{elf,bin,map}`, the bootloader, partition table,
`sdkconfig`, `project_description.json` and standard IDF build metadata. The generated
source is `.cache/muse-smart-glasses-sdk/esp32`; **edit tracked files here**, not that copy.
`firmware/build/` and logs are ignored; do not commit generated credentials/configuration.

## Source organization and pins

```text
firmware/
├── upstream.lock.json                 # exact Meta SDK and ESP-IDF revisions
├── dependencies.lock                  # resolved IDF component versions/hashes
├── sdkconfig.smart-glasses            # displayless S3 N8R8 profile, empty SDK token
├── patches/0001-displayless-smart-glasses.patch
├── port/
│   ├── Kconfig.smart_glasses
│   ├── voice_board_smart_glasses.c     # INMP441 RX + MAX98357A TX
│   ├── sg_audio_samples.h
│   ├── sg_camera.{c,h}                # generic JPEG backend + async command
│   └── sg_recording.{c,h}             # shared MIC/CAMERA indicator ownership
├── scripts/                          # bootstrap, prepare, build and verification
└── tests/                            # host sample and camera fault-path tests
```

`prepare.py` verifies the upstream commit and pristine checkout, restores the patched files
from that pin, applies our patch, copies `port/`, and generates `sg_pins.h` from
[`docs/proposed-gpio-map.csv`](../docs/proposed-gpio-map.csv). Duplicate or reserved GPIOs
are rejected. Change that CSV only after hardware review. The overlay separately sets the
SDK button to GPIO1; keep it consistent if the proposal changes. No FPC contact numbering
is inferred. GPIO38/48 may collide with LEDs on some commercial dev boards.

`upstream.lock.json` pins Muse SDK `1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc`,
ESP-IDF **v6.0.1**, and **espressif/esp32-camera 2.1.8**. `dependencies.lock` records
transitive IDF components. Upstream Apache-2.0 notices and the license remain in the
materialized SDK. Our original port files use SPDX Apache-2.0. The public repository
retains `UNLICENSED` in its package metadata; this does not relicense upstream code or
grant service access.

## Implemented media path

- **Displayless:** `MUSE_BOARD_NONE`, no full Muse UI, and the SDK's existing `HOMEHUB_VOICE`
  service. Our Kconfig gate adds this custom board to that headless voice service.
- **Microphone:** MCU-master I2S0, Philips timing, 16 kHz × 2 × 32-bit slots = **1.024 MHz
  BCLK**. INMP441 L/R must be low for the selected left slot. Signed upper 16 bits become
  SDK mono PCM16. No microphone gain, AEC, beamforming or wake-word engine is supplied.
- **Speaker:** the player duplicates 16 kHz PCM16 into MSB-aligned stereo 32-bit slots;
  it skips the reference Voice PE's 3× 48 kHz upsampling. MAX98357A receives shared
  BCLK/LRCLK and separate DOUT. Software default volume is 10%, capped at 20% in this
  profile, even if a remote command requests more. These are software amplitude settings,
  not a measured sound-pressure limit. No hardware gain configuration is assumed.
- **Amplifier control:** GPIO42 is assumed active high into a **reviewed external voltage-safe,
  default-off stage**. Its electrical implementation is still TBD. It is not authorization
  to connect GPIO42 directly to SD_MODE. Amp remains off until playback, with the SDK's
  tail drain; TX underflow clears to silence.
- **Realtime voice:** experimental SDK realtime calls enabled. Its 16↔24 kHz resampler
  remains in use; the MAX98357A hardware never receives 24 kHz LRCLK. Application-level
  half duplex discards microphone input during reply playback; no acoustic echo cancellation.
  RX can remain active during that gate, so the recording LED conservatively stays on.
- **Camera:** LCD_CAM/DVP through esp32-camera, SCCB on I2C0, 20 MHz XCLK, JPEG QVGA
  (320×240), quality 20, one PSRAM framebuffer. RESET=-1 requires a module with suitable
  reset strapping. PWDN uses GPIO18. Camera initializes lazily for an explicit capture,
  checks OV2640 PID, discards the first exposure, and deinitializes on release. There is
  no continuous stream/viewfinder or local vision model. Autoexposure stabilization is
  still a bench issue; one discarded frame does not guarantee correct exposure.
- **Command:** `camera.capture` is advertised and dispatched under the same custom gate.
  Capture/base64 work runs on a worker, keeps request ID and session generation, rejects
  concurrent requests, and returns the existing `jpeg-base64` result shape. Oversized
  JPEGs (>32 KiB before encoding) fail rather than truncate. This cap is project-selected,
  not a confirmed service limit. A successful command does not yet prove Muse associates
  the image with the intended voice turn.
- **Indicator:** active-high GPIO48 with separate MIC/CAMERA ownership. It comes on before
  RX acquisition/camera initialization and clears when each owner releases. One subsystem
  cannot extinguish the other. Acquisition is refused if indicator setup fails. A failed
  camera shutdown latches the indication on and blocks further captures until reboot. A GPIO write
  cannot detect a physically broken LED; electrical recording indication still needs review.

I2S TX currently stays enabled after audio initialization so shared clocks remain coherent
and the mic has a 300 ms startup settling interval. RX DMA is enabled for turns/calls, then
disabled. INMP441 CHIPEN is assumed tied to VDD, so **muted is not power-off**. Camera
PWDN behavior, initial exposure, actual slot alignment, pops, volume, DMA coexistence,
current and heat need scope/bench measurements. This port does not implement a low-power
wearable lifecycle yet.

## Controls, credentials and remaining integration

The active-low GPIO1 button uses the SDK's setup/pairing callbacks until voice is ready and
paired. With an admitted realtime session, a tap starts a call and another press ends it;
holding sends a voice note. Ordinary voice-note replies are still text-only in upstream;
we did not add TTS. Actual account/VM admission is untested. SDK network/pairing/reconnect
logic remains upstream. Serial logs provide connection status for this first displayless
port; an accessible everyday pairing/status indication is still required.

The checked-in overlay deliberately sets an **empty SDK token** and leaves the SDK warning
enabled. Upstream explicitly permits tokenless compilation; pairing requires a personal
SDK token provisioned later through its serial console or a local ignored configuration.
No token, Wi-Fi credential or fake account is embedded. Do not paste credentials into tracked
files or command logs. Muse account eligibility, phone app developer mode and service token
terms still apply. Nothing has connected or paired with Muse during these build checks.

Not implemented: MAX17048/charger telemetry, AT42QT1010 events, battery/thermal limits,
true-off control, wake policy, a physical camera-button gesture, headphone Bluetooth
profiles, automatic camera-to-question association or production OTA/key provisioning.
The upstream development signing key is inherited with OTA disabled; hardware secure boot,
flash encryption and eFuse provisioning are not enabled or performed.

## Validation and next bench gate

See [firmware validation](../docs/firmware-validation.md) for exact build/test results.
Host tests exercise sample sign/alignment/gain, camera frame ownership and failure cleanup,
one request in flight, request-generation propagation, and actual indicator ownership at both
GPIO polarities. Upstream host regressions are
also run; neither suite proves physical timing or service compatibility.

Next: review the exact camera breakout pinout/rails, amplifier enable network and indicator
wiring on a bench harness. Only then authorize flashing, test PSRAM boot, I2S with a scope,
known PCM playback/capture, one JPEG, and finally real-account pairing plus a spoken/photo
round trip. Measure power and latency before reducing this into temple PCBs.
