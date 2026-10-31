# Battery/camera selection checkpoint — 31 October 2026

This is a **selection and official-import checkpoint**, based on flex milestone
`b25af4436939951b996377085934f311ee01740f`. The selected assemblies have not yet
been electrically integrated. No new assembly render, routing, firmware port,
fabrication, order, push or publication is claimed. The user's latest instruction
delegates battery, camera and provisional frame choices; those choices are no
longer waiting for a preference answer.

## Battery selected for integration

**RRC1120 generation 2, manufacturer P/N 110018**, a protected 1S1P lithium-ion
hardpack: 3.60 V nominal, 2.35 Ah / 8.46 Wh, 4.20 V maximum charge voltage,
1.59 A maximum charge current and 2.30 A continuous discharge. Its manufacturer
lists redundant cell-voltage, temperature, overcurrent, overload, timeout and
short-circuit protection. Nominal body is 52.50 × 34.95 × 11.15 mm, with a
**52.70 × 35.10 × 11.25 mm maximum envelope**, mass 42 g. This is a hardpack
Li-ion choice rather than an assumed loose LiPo pouch; it retains the 1S / 4.2 V
power architecture. Do not substitute the older lower-capacity generation.

The exact **328-RRC1120** Mouser listing reports **123 units** and describes the
matching 3.6 V / 2.35 Ah version. This is a dated catalog observation, not an
allocation or a verified delivery promise to the user's country.

2.30 A exceeds both existing modeled cell-current cases, 1.654 A at 0.20 Ω and
1.901 A at 0.40 Ω. The latter still fails the amplifier voltage floor and is not
an accepted operating point. Pack impedance is specified at 1 kHz, not as a
guaranteed DC resistance. Cable drop, startup/transient load, undervoltage
shutdown, current limiting and thermal behavior remain implementation/bench gates.
No pulse current above the continuous rating is assumed.

The pack uses **four smart contacts: SCL, positive, SDA/ID, negative**. The required
mating connector is **RRC-MC11-90-2, P/N 210520**, rated 3 A per contact with
maximum 0.04 Ω contact resistance, 2.5 mm pitch, nominal 11.5 × 5 × 6.5 mm body.
Its exact numbered mating view and land pattern still need the connector drawing.
It is not a direct replacement for the existing three-contact battery/NTC header.
Do not infer contact numbering from the order of names on the product page.

Charging remains inhibited. Existing nominal 4.2 V / maximum 446 mA settings are
below the pack's published maximum current, but that alone does not qualify a
charger: verify voltage tolerance, temperature-dependent/JEITA behavior, termination,
smart-interface requirements and actual cell-temperature sensing. The public pack
manual lists 0–45 °C charging and recommends a compatible charger such as
**RRC-SCC1120**. Do not treat SDA/ID as an exposed NTC or replace a real sensor
with a fixed resistor.

Sources: [manufacturer product](https://www.rrc-ps.com/en/battery-packs/standard-battery-packs/products/RRC1120),
[datasheet M](https://www.rrc-ps.com/fileadmin/Dokumente/Data-Sheets/DS_RRC1120.pdf),
[downloaded manual H, URL retains G](https://www.rrc-ps.com/fileadmin/Dokumente/Manuals/Manual_RRC1120_G.pdf),
[Mouser listing](https://www.mouser.com/en/ProductDetail/RRC-Power-Solutions/RRC1120?qs=C8aJjQqBHT3AC2DsfA6Ovg%3D%3D),
[mating connector](https://www.rrc-ps.com/en/power-management/battery-connectors/products/RRC-MC11-90-2).

## Camera selected for integration

**Adafruit 5839**, fixed-focus 120° low-distortion OV5640 kit, used as the source
of its **FD5640 500W-V11 / C19938-001 sensor/flex assembly**. Mouser's exact
**485-5839** listing reports **51 units**. The supplied breakout is not the selected
electrical carrier: the already-reviewed carrier ties DOVDD to 3.3 V, outside the
module's recommended range. Removing the plug-in camera from its supplied carrier
is a prototype donor strategy; no purchase or physical modification has occurred.

The locally retained primary module drawing was inspected again. It specifies
AVDD 2.8–3.3 V, DOVDD 1.7–2.8 V, DVDD 1.2–1.5 V, a nominal 8.5 × 8.7 mm
module body, total height 5.1 ±0.2 mm, overall flex length 21 ±0.2 mm, and a
12.5 mm-wide 24-contact / 0.5 mm-pitch tail. The full sensor specification's tighter
rail intersection, sequencing and timing requirements in
[the voltage review](camera-voltage-review.md) remain binding. A compatible
custom carrier, not direct 3.3 V DVP wiring, must be completed before this is a
working camera integration. Native DVP/JPEG and the ESP32-S3 Wi-Fi/audio/Muse
architecture are retained; no SPI or BLE-only substitution was made.

The drawing's contact names are recorded in the machine-readable selection file.
Verify connector contact side/orientation, AFVDD treatment for this fixed-focus
SKU, rail headroom/tolerance, discharge and power sequencing, DVP clock/load/skew,
and the OV5640 firmware configuration. No regulator or sequencer has yet passed
this complete review. TPS7A26's precision conditions explicitly require adequate
headroom; do not infer compliance from typical dropout alone.

Sources: [exact Mouser listing](https://www.mouser.com/en/ProductDetail/Adafruit/5839?qs=mELouGlnn3e7IT6wYqPafQ%3D%3D),
[original kit reference](https://www.adafruit.com/product/5839),
[primary guide reference](https://learn.adafruit.com/adafruit-ov5640-camera-breakout?view=all).
The original module drawing and sensor specification were reviewed on 28 October.
This turn's sensor-PDF refresh returned HTTP 403; no fresh PDF access is claimed.

## Import results and next bounded implementation

Installed CLI help confirms `tsci import --jlcpcb --use-exact-footprint <query>`.
The following exact-ID commands succeeded in isolated local staging directories:

```sh
tsci import --jlcpcb --use-exact-footprint C131339
tsci import --jlcpcb --use-exact-footprint C1849453
```

The results are preserved under `imports/candidates/`. They are **not instantiated
in product circuits or newly added to the product BOM**. C131339 is the existing
JST three-contact header, verified for a possible adapter-side interface; it is
not the four-contact RRC mating connector. C1849453 is TI SN74AXC4T774PWR,
whose 16 physical pin labels match the reviewed A/B translation contract. Its
land pattern, paste and placement still require assembly review.

The next bounded implementation is the RRC mating/adapter and charging contract,
then the three-rail DVP camera carrier and its keyed interconnect. Preserve the
existing flex circuits and nine thermal vias while adding those interfaces in a
reviewable variant. A rear removable battery bay is the provisional packaging
direction: allow at least the manufacturer's maximum pack envelope plus padding,
retention and service clearance, separated from charger/regulator heat. Keep the
existing approximately 165 mm frame width as an editable prototype assumption.
New arm sections, carrier placement, bay dimensions and cable lengths must be
derived from the final component envelopes before CAD/fit checks. No measured
wearer fit or completed new frame geometry is claimed at this checkpoint.

Runtime: managed environment `smart-glasses`, running/connected, revision 4,
unrestricted HTTP enforced; inherited proxy/TLS preserved. Several vendor and CDN
requests returned HTTP 403. They were not retried or bypassed. Broad CLI keyword
searches also returned unrelated matches; only exact manufacturer identities were
accepted as sourcing evidence. No currently running command blocks continuation.
