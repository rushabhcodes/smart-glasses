# Component recommendation and JLC audit

Checked28 October2026; exact UTC observation times are recorded per part. The current45 PCB supplier IDs cover110
assembly component placements;12 DNP test pads are excluded. Exact code/MPN
identity is verified against JLC's public component-detail API, with positive
catalog stock for every selected PCB ID. LCSC inventory is checked separately. The counts may overlap; do not add them or
infer independent supply pools.
These are dated observations, not reservations, an allocation, a quote or approval
for fabrication. Full data and per-part timestamps: [JSON](../bom/component-audit.json),
[CSV](../bom/jlcpcb-recommendation.csv), [current BOM](../bom/preliminary-bom.csv).
Refresh with `npm run audit:bom` after building; `bun scripts/audit-bom.mjs --cached`
updates geometry/placements while retaining the original supplier observation times.

## Selected critical parts

| Function | Exact MPN / JLC ID | JLC stock / LCSC stock | Package / reason |
| --- | --- | --- | --- |
| MCU | ESP32-S3R8 / C2913194 |10,183 /8,067 |7×7 mm QFN,8 MB in-package PSRAM; preserves memory requirement |
|8 MB flash | W25Q64JVZPIQ / C2940197 |80 /80 |6×5 mm WSON; retain compact profile and3.3 V quad interface |
| I2S microphone | ICS-43434 / C5656610 |3,561 /2,860 |3.5×2.65 mm LGA6;16 kHz/64-Fs interface. Standard assembly and X-ray required |
| Mic level restoration | TLV3201AIDCKT / C133590 |58 /58 |Same SC70/DCK5 electrical device as the one-unit R packing option; body2.0×1.25 mm,1.1 mm max height |
| Crystal | ECS-400-10-37B2-CKY-TR / C5357833 |202 /202 |40 MHz,10 pF,±10 ppm initial /±10 ppm temperature stability;2.0×1.6×0.45 mm nominal |
| Capture switch | KMR221GLFS / C72443 |3,714 /2,409 |4.6×2.8×1.9 mm envelope;2 N, case ground. R5=2.7 kΩ/C13167 and R27=150 Ω/C22808 provide at least1 mA required closed current |
| Touch level restoration | SN74LVC1G125DBVR / C23654 |177,134 /176,085 |SOT23/DBV5; body2.9×1.6 mm nominal,1.45 mm max height. Same2.0/0.8 V input thresholds, stronger supply availability |
| Charger / power path | BQ24075TRGTR / C544783 |70 /70 |Existing reviewed charger/real-NTC topology retained; charging remains disabled |

All are Extended IDs. The whole PCB BOM has11 Basic and34 Extended IDs; unchanged
Basic resistors/capacitors remain where suitable. JLC lists38,070,807 of the existing
10 kΩ C25804 while LCSC search reports zero: replacing it solely from the LCSC count
would be unjustified. LCSC's LED name lookup and the latest R27 refresh are unresolved; the latter returned
HTTP503 after an earlier successful673,500-unit lookup. JLC verifies the new R27 at
1,406,968. JLC also verifies
Würth150060RS75000/C3030991 and lists5,744 units. An unresolved search is not zero stock.

The PICO alternative C7545129 still has **zero at JLC**, independently confirming
the sourcing gate. The current R8 plus flash/clock remains the compact sourced core.
The SOIC W25Q64JVSSIQ/C179171 lists383 at JLC and a lower initial catalog price,
but is wider/taller and would require placement/carrier changes. It is an unselected
cost/availability alternative. No capacity reduction or silent MCU change occurred.

## Geometry and electrical implementation

The official `tsci import --jlcpcb --use-exact-footprint` workflow succeeded for the
new comparator, button, touch buffer,15 pF loads and2.7 kΩ resistor. Exact search
sometimes returned unrelated parts; those results were rejected, then direct code/MPN
records and exact imports were checked. The ECS exact import has no EasyEDA component;
its manual footprint follows the primary ECX-1637B2 Rev2026 Figure2. No importer
success or detailed supplier3D model is claimed for it.

TI DCK0005A and DBV0005A land dimensions were corrected from the raw imports. C&K's
primary KMR2 drawing fixes contact groups and case-lug geometry; its pads1/2 and3/4
form separate common groups, with pad5 grounded. The normal silver-contact version
requires1 mA; the ULC variant was checked but JLC stock is zero. The changed2.7 kΩ
pull-up plus150 Ω series contact resistor draws about1.09–1.20 mA when held.
R27 limits the100 nF discharge to less than23 mA versus the switch's50 mA rating,
with less than78 mW peak resistor power and less than0.19 V at the MCU input.
Charging RC is0.27 ms nominal. These are tolerance budgets, not measurements. Firmware debounce,
actuation/sealing and contact behavior remain physical review gates.

The ECS initial15 pF loads assume2.5 pF stray capacitance; the old load model is
superseded. Startup, drive and frequency trim require the real routed PCB. Initial,
temperature, aging and load errors are distinct; no±10 ppm total physical performance
is claimed. Each audit placement records actual copper spans and land counts in the
board axes. Those dimensions are not body dimensions or proof that every inherited
land/mask/paste pattern is production-qualified.

[Imported model bounds](../bom/selected-model-review.json) were also checked. The
comparator model reaches about1.25 mm above its origin, exceeding the TI package
maximum1.1 mm; it is retained as a conservative visualization. Detailed imported
models do not replace manufacturer dimensions or establish frame fit.

## Assembly and extra costs

- The microphone and RF0201 IDs C85897/C86109 make the main board **Standard Only**.
  ICS-43434 requires X-ray according to its JLC record.
- 34 unique Extended IDs can incur loading/setup charges. Final counts depend on
  assembly sides, quantity, loss allowance and the quote.
- JST bench connectors use manual THT assembly. Double-sided assembly and manual
  operations require a quote; a catalog PCBA-tier label does not price the whole board.
- The retained nine CPU thermal vias need an approved via-in-pad fill/cap and stencil
  process. Acoustic apertures, mask/paste, thermal spreading and final geometry remain
  release gates. These processes are not approved merely by the imported footprint.
- Per-component `specialComponentFee=0` does not mean zero total assembly/process
  cost. Raw unit-price fields are preserved in the audit; no landed or finished-unit
  price, quotation or fabrication readiness is claimed.

## Reproduce the actual CAD snapshot

After building, run `npm run render:progress -- dist/progress/current` from the
repository root. It uses the locked circuit-json-to-gltf0.0.151 and poppygl0.0.37,
caches exact original supplier OBJ bytes and checks every requested mesh before
writing PNG/GLB outputs. An empty tool-added cache hint is removed only from asset
URLs in a render copy; no component, placement or connection changes. Latest
[actual board image](progress/2026-10-28-contact-review.png) is23:34:03 UTC,76/46
components,80×18/100×18 mm. Earlier snapshots remain preserved.

## External assemblies and unresolved gates

| Assembly | Recommendation / verified limitation |
| --- | --- |
| Camera | No exact JLC-sourced module has yet closed rail, pinout, worst-case capture timing and power sequencing. The Adafruit OV5640 carrier's3.3 V DOVDD conflicts with its linked module/sensor limits. The documented1.8 V custom interface is conditional, not a selected camera. Autonomous component selection is authorized; this is an engineering gate, not an unanswered component-preference question |
| Battery | Recommend a protected external Jauch LP103450JH/no.246520 for initial bench work within the documented load scenario. The external-versus-integrated architecture remains unanswered, so this is **not selected**. No suitable protected wearable pack or its assembly was verified at JLC. Do not treat the PCBA catalog as a qualified battery-pack source |
| Pack thermistor | Vishay NTCLE100E3103JB0/C141588 matches the current10 kΩ/B3977 network; JLC3,875 versus LCSC3,778. It is a THT catalog component, not a ready pack-attached sensor. Battery attachment, insulation and thermal response remain separate work; JLC's PCBA-only listing does not establish loose-part delivery or pack assembly |
| Frame cable | Wurth687620100002 remains a100 mm static bench candidate. Whole-frame length, contact orientation, current sharing and hinge endurance need measurements; no final cable selection follows from equal net names |
| Speaker / antenna | Exact driver/enclosure power limit and antenna/coax/keepout still need qualification against the physical envelope. No suitable JLC assembly was verified; no invented part/stock or fit claim closes these gaps |
| Lower-profile connectors | JST S3B-PH-SM4-TB(LF)(SN)/C265101 and S2B-PH-SM4-TB(LF)(SN)/C295747 are exact2 A right-angle SMT candidates, with JLC58,057/14,511 and LCSC58,065/14,515. They are not yet selected or imported/geometry-qualified; retain existing bench connectors while battery/enclosure interfaces remain open |

The1.65 A cell-current case is a stated stress scenario, not measured continuous
consumption. Duty cycling can reduce average draw but cannot qualify a370 mA-rated
cell for higher bursts. Preserve [both battery directions](assembly-candidates.md)
until that architectural choice is resolved. Camera and battery-dependent final
routing, orders and publication remain outstanding and unauthorized here.

Primary drawings: [TI comparator](https://www.ti.com/lit/ds/symlink/tlv3201.pdf),
[TI buffer](https://www.ti.com/lit/ds/symlink/sn74lvc1g125.pdf),
[ECS](https://ecsxtal.com/store/pdf/ECX-1637B2.pdf),
[C&K KMR2 manufacturer sheet mirrored by LCSC](https://datasheet.lcsc.com/datasheet/pdf/b3b49c9e2af6b33c7691f4b109b7083c.pdf?productCode=C72443).
