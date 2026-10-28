# Hardware requirements and candidate review

Research date: 2026-10-28. "Datasheet reviewed" means the listed facts were checked;
it does not approve a part, footprint, pin mapping, stock level, or wearable layout.
No finalized manufacturer/LCSC purchasing list is provided.

## Prototype acceptance targets

| Requirement | Initial implementation target | Verification before PCB release |
| --- | --- | --- |
| Assistant | Muse personal agent, Gadgets SDK custom board port | Pair real account and complete voice/photo round trip |
| Photos | Single QVGA JPEG initially; OV2640 through new Muse camera backend | Module rails/connector, bounded frame, command path and actual Muse image context |
| Microphone | INMP441 on shared I2S0, 16 kHz, two 32-bit wire slots | Supply tolerance, PCM16 conversion/levels, acoustic port and custom board port |
| Speaker | MAX98357A at 16 kHz on right board; realtime voice/TTS source | No direct 24 kHz LRCLK; SD_MODE power behavior, load, limiter and acoustic/thermal tests |
| Wi-Fi/BLE | 2.4 GHz Wi-Fi; BLE setup/control | Antenna, body loading, coexistence and mobile reconnect |
| Battery | One protected 1S LiPo with 4.2 V charge termination | Supplier pack limits, NTC, protection and discharge capability |
| Controls | Capture/talk button, touch input, physical power | Boot straps, debounce, pairing confirmation and true off state |
| Indicator | Outward visible recording status | On before capture; recording disabled if indicator fault policy requires it |
| Mechanics | Separate temple PCBs connected through frame | Measured envelope, hinge flex, balance and heat testing |

## Candidate compatibility and verification ledger

| Candidate | Checked electrical/package facts | Open verification and disposition |
| --- | --- | --- |
| ESP32-S3-WROOM-1U-N8R8 | 3.0–3.6 V module; 8 MB flash + 8 MB octal PSRAM; nominal 18.0 × 19.2 × 3.2 mm; external antenna connector | Exact 40-pad + ground-pad land pattern, module revision, antenna stack height, stock and thermal/mechanical fit remain open. GPIO35/36/37 unavailable with this PSRAM variant. |
| OV2640 module | Parallel DVP camera support exists in Espressif's driver; the sensor name is not an orderable module definition | Choose exact supplier/lens/flex; verify all rails, pin order, connector pitch/contact side, module dimensions and current supply. Older sensor supply is a sourcing risk. No generic OV2640 footprint. |
| INMP441 | 24-bit Philips I2S; 64 clocks/frame required; DS-INMP441-00 Rev. 1.1 Table 1 lists 1.62–3.63 V, while Table 6 describes VDD as 1.8–3.3 V; 4.72 × 3.76 × 1 mm bottom-port body | Include 100 kΩ SD pulldown and 100 nF bypass. Use the conservative 1.8–3.3 V range for supply design until the nominal-versus-limit wording is clarified. Verify suffix, lifecycle/stock, enable/channel straps and acoustic footprint; custom-board samples remain untested. |
| TPS63031 | Fixed 3.3 V buck-boost; 1.8–5.5 V input; 10-pin DSK 2.5 × 2.5 mm; TI ACTIVE | Datasheet specifies up to 500 mA in boost under its stated conditions. Budget MCU, camera, mic and control loads at low battery; switch-current rating is not output-current capacity. Verify inductor, capacitors, exposed pad and transient margin. |
| BQ24074 | 1S linear charger with power path, 4.2 V battery regulation, ~4.4 V OUT; 16-pin RGT 3 × 3 mm; TI ACTIVE | Full ordering suffix, pad/thermal design, NTC, timers, current settings and stock TBD. Charger does not replace battery protection. |
| MAX17048 | Single-cell ModelGauge, I2C; 2 × 2 mm 8-pin TDFN or 0.9 × 1.7 mm WLP; ADI production listing | Pick orderable package before pin numbers. Verify battery model, cell voltage vs OUT sensing, pull-ups and off-state I/O. It does not protect the cell. |
| MAX98357A | Philips I2S Class-D; 16 kHz/64Fs supported, 24 kHz LRCLK excluded; 2.5–5.5 V supply; audio VIH 1.3 V; no MCLK; 3 × 3 mm 16-pin TQFN or 1.345 × 1.435 mm 9-pin WLP | Review SD_MODE when VSYS is below MCU logic voltage, default-off sequencing, local bypass, gain, load and exact package/stock. Bridge outputs both go to the speaker; neither is ground. |
| AT42QT1010 | 1.8–5.5 V supply; production listing; capacitive touch with digital OUT, not I2C | Select SOT23-6 or other exact ordering option and vendor drawing. Run at 3.3 V for MCU logic; tune electrode/Cs, cover material and ~60 s maximum detection behavior. |
| Buttons, LED, connectors, antenna, cell and speaker | Functional requirements only | No MPN, footprint, dimensions or availability finalized. Select from mechanical and current requirements. |

The dimensions above are component body sizes, not PCB area allocations. Passives, solder
lands, assembly courtyards, acoustic holes, cable plugs and retainers add space. All supplier
stock quantities and lead times are **unverified**, including for active/production ICs.
Five core supplier identifiers have now been checked and imported; other LCSC fields
remain blank. Identifier verification is separate from schematic/footprint release. See
[the current MCU-core review](main-board-core.md).

## Power and battery constraints

- Determine sustained and burst loads for association, RF transmission, JPEG capture,
  recording, playback, reconnect and sleep. Use measured peaks at end-of-discharge voltage.
- Espressif recommends at least 500 mA supply capability for the S3 alone; add peripheral
  loads and design margin. The TPS63031 is a candidate at risk of inadequate headroom.
- Use only one protected cell initially. Require pack overcharge, overdischarge,
  overcurrent/short protection and supplier-specified temperature/charge/discharge limits.
- Select charger current from the actual cell's rating and enclosure thermal tests, not the
  charger's 1.5 A maximum. Provide pack-temperature sensing and correct charger TS circuitry.
- Linear charger heating depends on input/output drop and current. Measure the wearer-side
  surface while charging and operating; no skin-contact thermal claim is made here.
- DS-INMP441-00 Rev. 1.1 Table 1 specifies 1.62–3.63 V, while its Table 6 VDD description
  says 1.8–3.3 V. This may distinguish supply limits from nominal rails, but the wording
  needs manufacturer clarification before depending on the wider range. Conservatively
  keep tolerance, ripple and transients below 3.3 V in the supply design for now.
- Review amplifier SD_MODE drive and all FPC logic when VSYS is below the regulated MCU rail,
  and when either board is unpowered. Include a voltage-safe default-off interface.
- Select pack polarity/keying, fuse/current limiting, strain relief and service disconnect.
  Define charge-inhibited temperatures, low-battery shutdown and recovery from protection trip.
- Prevent dock/contact reversal, exposed-contact shorts, ESD and moisture-related leakage.
- Evaluate a hardware system switch/latch after charger OUT. Allow charging when off and
  avoid GPIO back-powering from always-on components. Verify every IC's I/O behavior unpowered.

## Camera requirements

DVP needs 8 data bits, pixel clock, VSYNC, HREF and XCLK, plus SCCB clock/data and
possibly RESET/PWDN. SCCB may share I2C wiring only after address/timing/voltage review.
The [25-GPIO proposal](pin-mapping.md) reserves a single camera PWDN, straps RESET only
if the selected module permits it, shares the audio clocks and polls the gauge. Extra signals
require revisiting this allocation. Do not copy an ESP32-CAM board pinout
onto an S3 N8R8 module. A connector with the right contact count is not automatically compatible.

Bare sensors may need multiple supply rails and sequencing. Use a supplier module schematic
and lens/flex drawing to determine which regulators/level translators are required. Keep the
camera cable near the left front and separate from the inter-temple FPC; avoid routing fast
parallel camera signals across both hinges in the baseline.

## Release gate for every real component

1. Record an official datasheet revision and exact orderable manufacturer number.
2. Independently compare symbol pin numbers, exposed pad/grounds and orientation with it.
3. Measure footprint pad count/pitch/size, courtyard, solder mask and paste against drawings.
4. Check voltage, timing, current, power sequencing, protection and supporting parts.
5. Confirm mechanical stack and reliable supply; record a dated supplier link and only then
   a verified LCSC/JLCPCB number if used.
6. Update the BOM status and review the actual circuit. A passing scaffold check approves none
   of these absent components.

Implementation details and source-level evidence: [peripheral integration](peripheral-integration.md).
References: [source register](research-sources.md).
