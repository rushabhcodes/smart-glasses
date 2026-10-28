# Meta Muse personal agent: hardware integration

Research date: 2026-10-28. The project owner intends **the Muse personal agent**.
The applicable integration is the **Muse Gadgets SDK**, not a replacement assistant built
with the Model API, and not locally hosted Muse Glimmer.

## What is officially available

[Meta's Gadgets site](https://gadgets.muse.ai/) and the
[official SDK repository](https://github.com/facebookincubator/muse-gadget-sdk)
provide ESP32 firmware and a Linux SDK for custom devices. Custom hardware runs a device
client and connects to the user's Muse; the personal agent's cloud execution remains remote.
There is no requirement to fit a large language model into the temple electronics.

Reference revision inspected: `1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc`.
The links below pin implementation references to that revision where appropriate.

| Hardware family | Official starting points | Relevance to these glasses |
| --- | --- | --- |
| ESP32-S3 | DevKitC-1 N8R8, BOX-3, M5Stack and multiple Seeed/Waveshare boards | Best initial family match; board-specific media support still matters |
| ESP32-C5 | DevKitC-1 default profile | Basic light/button starting point |
| ESP32-C6 | Devkits and display boards | Memory/features vary; do not assume the S3 audio/image behavior |
| Classic ESP32 | Existing display/control profiles | Feature/PSRAM limits and GPIO differences require review |
| Linux with BLE | Raspberry Pi 3B+, 4, 5, Zero 2 W; other Linux computers with BLE | Bench gateway/alternative client, too large/power-hungry for the assumed temple design |

Sources: [ESP32 device list](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/devices/README.md),
[Linux prerequisites](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/linux/README.md).
This is a representative list, not a claim that every listed board supports glasses features.

## Exact module connection

The [S3 DevKitC overlay](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/devices/sdkconfig.espressif-s3-devkitc-1)
explicitly covers WROOM-1-N8R8 **and WROOM-1U-N8R8**: 8 MB quad flash and 8 MB
octal PSRAM. This is a credible base for the proposed module's firmware configuration.
It is not a validated pin map for custom glasses: its RGB LED/button wiring belongs to
the DevKit, and that profile's documented user functions are status light and button.

"Custom hardware" means porting the client and its peripheral drivers to a suitable
board. It does not establish universal MCU, camera, audio, power or SDK feature compatibility.
A reviewed 25-GPIO allocation is now proposed in [pin mapping](pin-mapping.md); assignments,
memory and physical fit still need implementation and bench proof.

## Camera/audio review outcome

The [peripheral integration plan](peripheral-integration.md) records the source-level review:

- OV2640 is supported by Espressif's S3 camera driver. Muse's generic JPEG interface can wrap
  it. Our port now adds its own camera.capture gate and worker independently of Watcher.
- An existing Muse Guition adapter explicitly supports INMP441. Reuse its 64-clock framing
  concept with one shared I2S0 bus; its speaker is NS4168, so MAX98357A needs adaptation/testing.
- Keep hardware audio at 16 kHz. Realtime transport is 24 kHz with SDK resampling;
  MAX98357A cannot be driven directly at 24 kHz LRCLK.
- The standard voice-note path is text-only at the reply stage. Evaluate the experimental
  realtime voice path for spoken replies; otherwise add TTS explicitly.
- The initial custom displayless application/board port is now implemented and compile-tested.
  Its physical interfaces, service behavior and everyday status indication still need proof.

## Custom glasses work still required

1. Start with an official working S3 profile and reproduce pairing/reconnect on the bench.
2. Bench-test the displayless port's capture/talk, pairing-confirmation and status
   behavior. A single recording LED and a multi-color SDK status LED are different roles;
   select an accessible status strategy without hiding the recording indication.
3. Bench-validate the port's INMP441 microphone acquisition and MAX98357A speaker playback,
   sample conversion, slot selection and amplifier power control against the SDK board hooks.
   These parts do not become supported simply because they use I2S.
4. Bench-validate the OV2640 generic camera backend and its capture-command dispatch.
   Prove capture **and upload to Muse**, including association with the intended question.
   Displaying received images and phone-to-gadget video are different directions of media flow.
5. Measure flash/partition usage, PSRAM/internal heap, TLS and media buffers, Wi-Fi reconnect
   and simultaneous camera/audio load. Increase flash capacity only if that evidence requires it.
6. Add charger/gauge/touch drivers, true-off handling and recovery/programming access.
7. Test the intended network/hotspot and real account/country eligibility before PCB commitment.

The [board porting reference](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/devices/AGENTS.md)
describes memory, board hooks and verification. An initial [displayless port](../firmware/README.md)
now lives in this repository, with SDK/toolchains in ignored local caches. No device has been
flashed, paired or tested against the service. The remaining work above now refers to bench
validation and completion rather than absence of implementation.

## Setup and availability prerequisites

The [ESP32 SDK instructions](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/README.md)
specify ESP-IDF **6.0.1**, a personal Gadget SDK token, the Muse phone app and Developer
mode for pairing. The phone performs setup; a Wi-Fi device session is the baseline runtime
link. Continuous smartphone audio relay is not an assumption of this SDK path.

Do not commit tokens, Wi-Fi credentials, pairing stores or recordings. No token is needed to
edit or validate these tsCircuit starter boards. Account provisioning and actual pairing are
future bench tasks, not completed checks in this initialization.

The [SDK token terms](https://gadgets.muse.ai/sdk-terms) currently limit token use to personal,
non-commercial projects, constrain distribution, and describe the service as changeable and
withdrawable. These terms are separate from the Apache-2.0 source license. This repository
is a personal prototype; any future sale/distribution needs a fresh review of that access path.

## First integration proof

On a supported S3 bench board: pair with the intended Muse account, record a short question,
test the admitted realtime spoken response (or explicit TTS), capture a JPEG and verify
that the personal agent can answer about it.
Record hardware revision, SDK revision, heap/PSRAM peaks, latency and current consumption.
That evidence should drive the custom board port and electrical design.
