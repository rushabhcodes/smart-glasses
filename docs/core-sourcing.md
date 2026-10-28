# Compact MCU sourcing follow-up — 28 October 2026

The PICO review milestone remains recoverable at `139a02a`, including its actual
3D snapshot. The new main-board review uses **ESP32-S3R8** with external flash;
the secondary board and its 20-contact contract are unchanged. This is a sourcing
and schematic alternative, not a qualified manufacturing release.

| Option | Dated catalog observation | Memory and mechanical tradeoff | Disposition |
| --- | --- | --- | --- |
| ESP32-S3-PICO-1-N8R8, C7545129 | LCSC stock 0 | 8 MB flash + 8 MB PSRAM; 7 mm LGA SiP with crystal/RF matching integrated | Preserve comparison; no stocked source established |
| ESP32-S3R8, C2913194 | LCSC stock 8,294 | 8 MB octal PSRAM; 7 mm QFN, 0.9 mm maximum package height; external flash, crystal, filtering and RF network required | Implemented review alternative; no memory downgrade |
| ESP32-S3-MINI-1U-N8, C2980299 | LCSC stock 545 | 15.4 mm square module; no PSRAM | Does not preserve the existing memory requirement |
| ESP32-S3-PICO-1-N8R2, C7558093 | LCSC stock 0; tsci external search listed Mouser stock 3,038 | 2 MB PSRAM instead of 8 MB | Capability change; not substituted |

Observations are public listings, not reserved stock. Exact `tsci import C2913194
--jlcpcb --use-exact-footprint` succeeded. The tsci JLC search returned unrelated
parts for the name and no results for the exact code; it did **not** establish JLC
assembly inventory. Exact LCSC identity and stock were checked separately. A JLC
assembly quote/availability check is still required before any order.

## R8 circuit differences

[Espressif series datasheet v2.2](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf),
Table1-1 identifies R8 as **3.3 V** memory; R8V is the different, EOL 1.8 V variant.
The new chip uses its own official QFN import, not a substituted PICO LGA part.
Physical pin assignments preserve GPIOs, straps, UART and camera reservations.
Pins28 and38–42 stay reserved for in-package octal PSRAM. Pins30–35 now connect
external quad flash through six zero-ohm tuning footprints. GPIO45 remains low.

**Winbond W25Q64JVZPIQ / C2940197**, stock80, supplies 64 Mbit = 8 MB in a
6 × 5 mm WSON8+EP package. Manufacturer revisionK, sections3/9/10/11 establish
2.7–3.6 V, quad SPI, 133 MHz maximum, ZP package and physical pins. Pin9 is
permitted to connect to GND; there are no exposed vias beneath this flash pad.
The six connections are CS=pin1, IO1=2, IO2=3, IO0=5, CLK=6, IO3=7; pins4/9
are GND, pin8 VDD_SPI. CS, IO2 and IO3 have10 kΩ pull-ups for deselected/standard-SPI
startup. The IQ option supports quad SPI; boot/read/erase compatibility on the
actual S3 ROM/firmware is untested. Do not configure133 MHz just because the flash
supports it. Initial80 MHz or lower operation still needs routed timing review.

VDD_SPI now receives the common regulated3.296 V supply through R25=0 Ω rather
than relying on the internal typical14 Ω path for combined flash/PSRAM load. TP9
provides a rail test pad. This uses the manufacturer external-supply option; only
3.3 V boot/eFuse/software modes are compatible. See [electrical review](electrical-power-review.md)
for the primary TRM basis and remaining bring-up/transient checks. The
[boot/supply state matrix](boot-memory-review.md) includes eFuse/RTC overrides,
all related supply pads, GPIO47/48 domain selection and sleep implications. Local100 nF +1 µF
and flash100 nF remain. Analog supply uses the2 nH filter and separate bypass.

**Abracon ABM10W-40.0000MHZ-8-B1U-T3 / C1985328** replaces the incompletely
specified YXC option. Abracon datasheet rev2024-02-23 decodes40.0000 MHz,8 pF CL,
B=−20 to+70 °C,1=±10 ppm initial tolerance,U=±10 ppm stability and T3=reel. At
40 MHz/8 pF the current sheet specifies≤30 Ω ESR,100 µW maximum drive and±2 ppm
first-year aging. Body2.5 ×2.0 mm, drawing maximum height0.65 mm. Initial tolerance,
temperature stability, aging and load pulling are distinct; no±10 ppm total error
across all conditions is claimed. Verify startup/drive/frequency after assembly.

The official exact-footprint import succeeded. Its oversized lands were corrected
to the manufacturer's1.2 ×0.85 mm pads on1.625 ×1.2 mm centers, with pads2/4 grounded.
The imported3D body's2.5 ×2.0 mm bounds were also checked. Two10 pF loads assume
3 pF stray:10/2+3=8 pF; load tuning remains a board measurement. Espressif's initial
24 nH XTAL_P series element is retained. LCSC listed **five** units; DigiKey search
listed31,088. JLC assembly inventory is still not confirmed.

ECS-400-10-37B2-CKY-TR / C5357833 is a second exact-spec alternative (40 MHz,
10 pF,±10 ppm initial/stability,2.0 ×1.6 mm; LCSC202 and DigiKey46,619 at lookup).
Its official tsci/JLC import failed because the EasyEDA component was absent. It is
not integrated and no footprint/import success is invented. The old YXC import is
preserved in history; it is no longer the active crystal.
Primary: [Abracon](https://abracon.com/datasheets/ABM10W.pdf),
[ECS](https://ecsxtal.com/store/pdf/ECX-1637B2.pdf).

The chip RF CLC uses0201 Murata1.5 pF /2.7 nH /1.5 pF, within Espressif's
recommended starting ranges. It is **untuned**. The existing U.FL interface remains;
50 Ω stack-up, grounding stub, antenna matching/ESD, selected coax/antenna, RF power,
harmonics and wearer/enclosure loading are unresolved. No RF operation is validated.

The original PICO listing was about$10.20 at quantity1. R8 + WSON flash listings
were about$3.18 +$5.97 before crystal/support parts. These are catalog observations,
not landed or assembled prices. A cheaper SOIC flash listing exists but increases
package area; the WSON was chosen for this compact review. Extra parts and underside
assembly can change placement, assembly cost and yield. No quote or purchase occurred.

Primary topology: [Espressif hardware design guidelines](https://docs.espressif.com/projects/esp-hardware-design-guidelines/en/latest/esp32s3/esp-hardware-design-guidelines-en-master-esp32s3.pdf),
sections1.3.2–1.3.6. Manufacturer PDFs served by LCSC were inspected for Winbond,
YXC and Murata. Supplier IDs and dated stock observations are in the BOM evidence.

The datasheet-linked [Espressif PADS land-pattern source](https://www.espressif.com/sites/default/files/chips-dxf/ESP32-S3_Footprint.asc)
was retrieved as an additional review input. Its native CAD units, copper/paste
primitives and layer definitions have not been independently reconciled with this
import in a PADS-aware editor. The library footprint's pad count/pitch and4 mm
exposed pad match the package drawing; this does not close stencil or assembly
qualification of that land pattern.
