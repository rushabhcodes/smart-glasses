# Muse camera and audio integration plan

Reviewed 2026-10-28 against Muse Gadgets SDK revision
`1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc` and manufacturer documentation.
**Decision:** retain ESP32-S3-WROOM-1U-N8R8, OV2640, INMP441 and MAX98357A as
prototype candidates. Use one shared-clock I2S audio bus and a separate parallel camera
interface. The combination is technically feasible at the interface/resource level; no
wiring, media round trip or wearable fit has been validated. An initial implementation is in
[firmware/](../firmware/README.md); [firmware validation](firmware-validation.md) records its
compile/test evidence. The planned implementation below is retained as engineering context.

## Compatibility and implementation status

| Item | Evidence checked | Planned implementation | Remaining gate |
| --- | --- | --- | --- |
| S3 N8R8 | SDK DevKitC overlay explicitly covers WROOM-1U-N8R8, 8 MB quad flash and 8 MB octal PSRAM | Keep module; preserve USB and UART recovery | Actual app-slot/heap/current measurements and temple fit |
| OV2640 | Espressif camera driver supports both S3 and this sensor; Muse exposes a generic JPEG camera interface | Add a DVP backend wrapping `esp_camera_*`, then generalize the capture-command path | Exact camera module/rails/connector; bench capture and actual image interpretation by Muse |
| INMP441 | SDK Guition board adapter explicitly accommodates this microphone with 32-bit wire slots | Adapt that I2S data-interface pattern; left-slot mic to local MCU RX | Mic voltage tolerance, acquired sample alignment/levels and real-account voice input |
| MAX98357A | Manufacturer supports 16 kHz Philips I2S, 64 BCLK/frame and 3.3 V audio logic | Feed it from shared clocks/MCU TX on right board; software volume and hardware shutdown | Replace the reference board's NS4168 assumptions; power sequencing, load and spoken replies |

The Guition code is a useful adapter reference, not a verified glasses profile. Its display,
GPIO choices, speaker IC and initialization must not be copied wholesale.

## Audio bus selected for the first port

Use **I2S0, MCU master, Philips I2S, two 32-bit wire slots per stereo frame**. Share
`AUDIO_BCLK` and `AUDIO_LRCLK` between the left INMP441 and right MAX98357A.
`MIC_SD` returns locally to MCU DIN; `AUDIO_DOUT` goes through the FPC to amplifier DIN.
Neither device needs MCLK. I2S1 is unallocated in this plan.

| Parameter | Proposed baseline |
| --- | --- |
| Hardware sample/frame rate | 16,000 Hz |
| Wire slots | Two slots × 32 clocks = 64 BCLK per frame |
| BCLK | 1.024 MHz, derived as 16,000 × 64 |
| SDK application samples | Signed mono PCM16; 320 samples per 20 ms audio chunk |
| Initial DMA/data adapter | Port uses 32-bit DMA data/slots, takes the upper 16 bits of the left sample; validate physical ordering on hardware |
| Microphone slot | Left, with L/R strapped low; avoid mixing its inactive right slot into the signal |
| Speaker slots | Duplicate mono into L/R as the SDK audio layer does; select a reviewed SD_MODE channel |
| Speech interaction | Half duplex at application level: gate captured speech during audible reply playback |

The INMP441 outputs 24-bit samples and requires 64 clocks even with only one microphone.
A 16-bit-slot/32-clock stereo bus is therefore unsuitable. The existing adapter retains the
upper 16 bits; do not reinterpret a 24-bit raw buffer as PCM16. If full-width capture is later
needed, add explicit signed 32-bit unpacking, scaling, saturation and PCM16 conversion.
Validate left/right ordering, the I2S one-bit delay and gain before using the samples.

**Keep audio hardware at 16 kHz.** The SDK realtime voice protocol uses 24 kHz mono
PCM16LE and includes 16→24 kHz uplink and 24→16 kHz downlink resampling. The MAX98357A
specifically excludes 24 kHz LRCLK, despite its headline 8–96 kHz range. Send network audio
through the SDK's conversion rather than clocking this amplifier at 24 kHz.

Half-duplex speech does not require stopping I2S RX/TX independently. Keep the clock pair
coherent. When idle, mute/shut down the amplifier before stopping clocks; never remove
LRCLK while BCLK continues. During recording, keep shared clocks running with the amplifier
muted. Ramp/limit software volume and test pop/noise behavior during wake and shutdown.

### Microphone electrical additions

- Nominal 3.3 V-domain operation is the interface baseline; the INMP441 specifies 1.8–3.3 V
  supply. Resolve regulator positive tolerance, ripple and sequencing against that range
  before approving the fixed-3.3 V TPS63031/microphone combination. Absolute maximum
  voltage is not a normal operating target; adjust the rail/regulator arrangement if needed.
- Strap L/R to GND and CHIPEN to its VDD for the first bench configuration. This saves a
  GPIO, but idle current must be measured; firmware muting alone is not power isolation.
- Include the manufacturer's 100 kΩ SD pulldown and local 100 nF bypass capacitor.
- All ground pads and the bottom acoustic port need the correct land pattern. Generic
  breakout-board pin order and dimensions do not define the bare microphone footprint.

### Amplifier electrical additions

Power the MAX98357A from right-board VSYS, within its 2.5–5.5 V range, with local bulk and
high-frequency bypass. Its digital audio VIH minimum is 1.3 V, supporting a nominal 3.3 V
MCU audio interface. Use the A variant's I2S format, not the B variant's left-justified format.

SD_MODE is also channel selection and has supply-dependent absolute limits. VSYS can fall
below the regulated MCU rail. A direct, unreviewed 3.3 V push-pull connection is insufficient:
include a default-off, voltage-safe SD_MODE interface and review the datasheet's series-
resistance/control guidance, reset behavior and unpowered state. Its actual circuit is TBD.
Keep the amp in shutdown when clocks/supply are unstable; select gain conservatively.

Connect the speaker between OUTP and OUTN; neither output is GND. Keep these switching
outputs local to the right temple, away from the microphone, antenna and touch electrode.
Speaker impedance, continuous power, acoustic enclosure and near-ear volume limit remain
unselected. The advertised wattage at 5 V is not a target for this miniature speaker.

## Camera interface and missing SDK work

Use **LCD_CAM/DVP**, not MIPI CSI-2 or SPI, for the proposed direct OV2640 module. On S3
this camera path is separate from the I2S audio peripheral; shared memory, DMA, interrupt
load and power still need measurement. Allocate D0–D7, PCLK, HREF, VSYNC, XCLK, two SCCB
lines and one PWDN. RESET may be strapped only if the exact module permits it.

Prefer a module with documented MCU-compatible I/O; some bare sensor/flex assemblies need
separate core/analog/I/O rails. A 1.8 V camera output must not be presumed to meet the S3's
3.3 V input thresholds. Confirm rails, sequencing, logic translation, lens dimensions,
connector pitch/contact side and every flex contact from the supplier drawing.

Espressif's current registry release inspected is **esp32-camera 2.1.8**; its manifest declares
IDF >=5.1, which includes the SDK's required 6.0.1 at the manifest level. An actual combined
build is recorded in the firmware validation notes. It is now pinned in the firmware
manifest/lockfile; it is separate from the TypeScript/npm dependencies.

The Muse SDK's `camera_driver_t` supports JPEG capture/release and optional streaming.
The current backend is SSCMA/Himax for SenseCAP Watcher. `camera.capture` advertisement
and dispatch are behind `CONFIG_MUSE_WATCHER_CAMERA`, which depends on the Watcher
board. Enabling that flag on our board is not an OV2640 port.

Port implementation and remaining proof:

1. Implemented: an OV2640 backend using `esp_camera_init`, `esp_camera_fb_get` and
   `esp_camera_fb_return`, with correct ownership of each returned JPEG buffer.
2. Implemented: `camera_register` registration; streaming callbacks are unsupported.
3. Implemented: custom capability/configuration, command registration and asynchronous
   dispatch independent of Watcher UI/backend code, preserving session generation and errors.
4. Implemented, bench proof pending: recording indication before acquisition, cleared after
   shutdown/release. A shutdown failure leaves it on and blocks new captures until reboot.
   Capture runs only for an explicit command; frame and failure ownership have host tests.
5. Verify that Muse receives and interprets the actual photo. A successful JPEG capture or
   a base64 tool result alone does not prove image context is integrated into a voice turn.

First experiment: one JPEG framebuffer in PSRAM, QVGA 320×240, no viewfinder, no continuous
stream and one capture in flight. Use a **project-selected initial JPEG cap of 32 KiB**, not a
claimed SDK/server maximum. Larger frames must be rejected/recompressed rather than
truncated. Base64 of 32,768 bytes needs 43,692 bytes plus a terminator; JSON copies and
serialized output add memory beyond the framebuffer. Confirm actual response limits and
peak allocations. Defer higher resolution/multiple framebuffers until the complete path works.

Test PSRAM DMA as a measured option, not an assumption that all buffers/DMA can use PSRAM.
Begin with separate camera/audio operations, then test a still while the Wi-Fi voice session
is connected. Never block the real-time audio task waiting for camera or network completion.

## Displayless voice and service behavior

The DevKitC overlay is a pairing/status baseline. Full Muse-board audio initialization is
coupled to display/UI board selection; the existing displayless `HOMEHUB_VOICE` path is
restricted upstream to Voice PE/reSpeaker profiles and their hardware drivers. Our custom
Kconfig gate now extends that path to the glasses and selects the new media backends.
Serial status, pairing callbacks, button handling and bounded software volume are present;
everyday status indication, battery reporting and a low-power lifecycle remain to implement.

The ordinary voice-note/chat implementation in `muse_chat_session.cpp` currently produces
text and contains an unimplemented speech-synthesis integration point. For the first spoken
interaction experiment, evaluate `CONFIG_MUSE_REALTIME_VOICE` (experimental) with the
actual account/VM. It resamples to/from the 16 kHz device path and gates microphone input
without an echo-cancelling front end. If service admission fails, the alternative is an
explicit TTS integration; do not present voice-note success as spoken-response success.

The INMP441/MAX98357A pair has no hardware acoustic echo cancellation or beamforming.
The first product target remains turn-taking speech, not a conventional Bluetooth headset.
A microphone-only `mic_init` hook is insufficient because that SDK path deliberately has no
speaker. Provide the two-sided audio interface and implement meaningful power/error handling.

## Memory, power and pin consequences

The 8 MB flash/8 MB PSRAM variant remains viable as a candidate. The SDK supplies an
8 MB partition table with two `0x3E0000` app slots; the final image must fit one slot.
Frame buffers, TLS, BLE, voice buffers and internal DMA allocations must be budgeted together;
8 MB installed PSRAM is not 8 MB of free application heap. No larger module is selected yet.

[Draft pin allocation](pin-mapping.md) fits 25 assigned GPIOs after preserving straps,
USB, UART and PSRAM reservations. That consumes the proposed safe output-capable set:
separate camera RESET, mic enable, fuel-gauge alert and charger status are not additional
free GPIOs. The fuel gauge is polled; optional alerts are omitted. A different module pinout,
extra controls or a second independent audio clock pair reopens the allocation.

Both MCU/radio and camera/microphone loads still need a peak-current budget. Speaker power
stays off the left regulator. Do not finalize TPS63031 from nominal average current; include
capture, Wi-Fi bursts, rail accuracy, FPC drop and charge/power-off transients.

## Evidence inspected

- [S3 module profile](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/devices/sdkconfig.espressif-s3-devkitc-1).
- [Existing INMP441-capable adapter](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/components/muse/boards/board_guition_jc3248w535.c#L350-L429),
  [audio layer](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/components/muse/muse_audio.c#L105-L158) and
  [board audio interface](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/components/muse/muse_board.h#L130-L149).
- [Realtime audio rates](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/components/muse/muse_voice_call_core.h#L25-L49),
  [voice options](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/components/muse/Kconfig#L273-L340) and
  [voice-note TTS integration point](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/components/muse/muse_chat_session.cpp#L1554-L1590).
- [Camera driver interface](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/components/camera/camera.h),
  [camera component manifest](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/components/camera/idf_component.yml),
  [camera capability registration](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/main/noise_control.cpp#L1529-L1536),
  [capture dispatch](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/main/app.c#L1914-L1929) and
  [camera Kconfig restriction](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/components/muse/Kconfig#L213-L221).
- [Displayless voice restriction](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/main/Kconfig.projbuild#L475-L488),
  [component build paths](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/components/muse/CMakeLists.txt#L143-L150) and
  [8 MB partitions](https://github.com/facebookincubator/muse-gadget-sdk/blob/1db6a26f4ca56939c4465d8a12e241c1b1b5c8dc/esp32/partitions_muse_8mb.csv).
- [Espressif camera release](https://components.espressif.com/components/espressif/esp32-camera/versions/2.1.8/readme),
  [driver manifest](https://github.com/espressif/esp32-camera/blob/v2.1.8/idf_component.yml),
  [S3 I2S documentation](https://docs.espressif.com/projects/esp-idf/en/v6.0.1/esp32s3/api-reference/peripherals/i2s.html).
- [INMP441 datasheet](https://invensense.tdk.com/wp-content/uploads/2015/02/INMP441.pdf),
  sections on supply, pin functions and 64-clock I2S framing; legacy Rev. 1.1.
- [MAX98357A/B Rev. 16](https://www.analog.com/media/en/technical-documentation/data-sheets/MAX98357A-MAX98357B.pdf),
  pages 6 and 16–18: rates/logic, clock sequencing and SD_MODE. Component lifecycle,
  purchasing codes, land patterns and actual board compatibility remain to be finalized.
