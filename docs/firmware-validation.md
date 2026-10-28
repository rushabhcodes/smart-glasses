# Firmware port validation — 2026-10-28

Scope: initial displayless Muse Gadgets SDK port in `/home/rushabh/Dev/smart-glasses`.
**No flashing, serial connection, eFuse change, pairing or service request was performed.**
The port is compile-tested; the camera, microphone, speaker, wiring and battery remain
unverified on physical hardware.

## Versions and dependency resolution

| Item | Tested version/pin |
| --- | --- |
| Muse Gadgets SDK | `1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc` |
| ESP-IDF | v6.0.1, commit `8c19b156084a0753687347cca1f5355782893533` |
| Xtensa compiler | Espressif GCC 15.2.0 (`esp-15.2.0_20251204`) |
| Python used by IDF | 3.12.15, repository-local environment |
| Host CMake / Ninja | 4.4.4 / 1.13.2 |
| espressif/esp32-camera | 2.1.8 |
| espressif/esp_jpeg | 1.3.2 |
| espressif/cjson | 1.7.19~2 |
| espressif/esp_websocket_client | 1.2.3 |
| espressif/led_strip | 3.0.3 (upstream manifest dependency; no LED-ring backend selected) |

`firmware/upstream.lock.json` pins SDK/toolchain sources. `firmware/dependencies.lock`
records registry component versions and hashes. No npm media-driver package is involved;
the existing tsCircuit dependencies remain unchanged. No system ESP-IDF installation or
shell profile was changed. Tool installations and generated builds are kept in ignored
repository-local directories; package managers may also use their normal download caches.

## Build checks

- `npm run firmware:build`: **PASS**, real ESP32-S3 compilation/link/image generation.
- `verify_build.py`: **PASS**, verifies S3, 8 MB flash/QIO selection, octal PSRAM, external
  task-stack setting, `MUSE_BOARD_NONE`, headless voice, realtime mode, 20% volume cap,
  32 KiB JPEG cap, matching button proposal, empty SDK token, disabled OTA/hardware secure
  boot/flash encryption, expected ELF camera/audio symbols, no LVGL init/display symbols,
  and at least 10% app-slot headroom.
- Bootloader/partition/app IDF size checks: **PASS**.
- `build.sh flash`: **PASS as a negative test**, exits 2 before toolchain activation and
  reports that flashing is unsupported. IDF itself prints generic flashing instructions
  after a successful build; those instructions were not executed.
- Shell syntax and Python syntax checks: **PASS**.
- `npm run typecheck`: **PASS**. Circuit TSX files were unchanged; previous tsCircuit
  scaffold checks are recorded separately in [initial validation](validation.md).

## Image and memory evidence

| Output | Result |
| --- | --- |
| Signed/padded `firmware/build/muse-gadget.bin` | 1,576,960 bytes (`0x181000`) |
| Smallest app slot | 4,063,232 bytes (`0x3E0000`) |
| Remaining slot | 2,486,272 bytes, about 61.2% |
| Bootloader | 22,608 bytes (`0x5850`), passes partition-table clearance check |
| Linker DIRAM allocation | 206,865 / 341,760 bytes; 134,895 bytes remain statically unallocated |

Final image SHA-256: `c8d5ffe4f3b0d65dd29953d547ba3d9e78a7430d2227342525aad36e81f1023f`.
This identifies the checked build; a later rebuild can include a different build timestamp.

Static linker space is **not runtime free heap**. TLS, BLE/Wi-Fi, task stacks, I2S DMA,
PSRAM-framebuffer behavior and command JSON/base64 peaks need measurement after approved
bench bring-up. The 16 KiB dedicated IRAM region is occupied; further IRAM sections use
the DIRAM region, as accounted by IDF's linker. This build does not establish runtime
memory headroom or simultaneous camera/audio stability.

The app ELF, map, image, bootloader, partition table, generated sdkconfig and IDF metadata
are available under ignored `firmware/build/`. Logs are under ignored `firmware/logs/`.

## Host tests

Port tests exercise real sample conversion, camera backend/worker and shared indicator
code with fake hardware interfaces. They cover all PCM16 values, sign/alignment, gain
limits, camera initialization/PID/frame/size/allocation/task failures, framebuffer release,
serialization, one request at a time, copied request identity/session generation, indicator
ownership, both LED polarities, and a latched-on indicator after failed camera shutdown.
Address/undefined-behavior sanitizers are used for the camera harness and undefined-behavior checks for audio conversion.

Final results:

- Port suite: **3 tests PASS**, including both indicator polarities and the camera shutdown
  fault latch. Latest focused log: `firmware/logs/port-tests-final.log`.
- Full upstream suite: **829 run, 827 PASS, 2 SKIPPED, 0 failures/errors**, in 379.4 seconds.
  Log: `firmware/logs/tests-final.log`. The real-crypto/session tests ran; no device was used.
- Skipped: the SDK's optional iOS x264 loop harness cannot compile against this host's
  libx264 headers/library; and a synthetic power-profiler benchmark requires the absent
  optional `ppk2-api==0.9.2`. Neither is part of the glasses firmware build or JPEG/I2S path.
- The initial SDK regression run caught our unnamespaced driver log tags and an IDF-only
  header leaking into the existing reSpeaker host harness. Both were fixed in the port;
  focused retests and the final complete suite pass without weakening upstream tests.
- `npm run firmware:bootstrap` and `npm run firmware:size`: **PASS**. Final compile and
  profile verification log: `firmware/logs/build-confirmed.log`.

The final code contains no modifications to upstream test files, IDF sources, managed camera
sources or the pinned FreeInk sources used by the SDK's existing host regressions.

## Warnings and practical limits

The empty-token warning is intentional and remains enabled. A token is required for real
Muse pairing, not for this upstream-supported compile-only workflow. No credentials were
requested, generated or embedded. The inherited shared development signing key is not a
production key; OTA stays disabled, and no hardware security provisioning was performed.

ESP-IDF emits upstream Kconfig deprecation/choice notes and an ESP-TEE applicability notice
for S3. These do not stop the build. C5-only hardware ECDSA signing is disabled in our
profile; external-stack configuration uses the IDF 6 option name. No IDF/managed component
source was patched to suppress diagnostics.

The right-board gauge, charger, touch input, true-off circuit and power/sleep policy have no
firmware drivers yet. Clocks currently continue while audio is idle; the mic is not powered
off by firmware muting. The build proves integration of source and APIs, not physical media
operation, safe near-ear level, runtime, service admission or image interpretation.

Next gate: review a specific bench camera module and voltage rails, amp enable network,
indicator and GPIO harness; only then approve flashing and measure the interfaces before
attempting a real Muse spoken/photo round trip.
