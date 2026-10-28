# Camera and battery assembly candidates

Checked28 October2026. These are exact candidate products, not purchased components
or a final wearable selection. Dated availability is not reserved stock. The current
camera is still unwired; charging remains disabled. Frame dimensions and the battery
architecture choice remain pending.

## Cameras

| Exact product | Public availability at lookup | Manufacturer-listed assembly envelope | Compatibility and tradeoff |
| --- | --- | --- | --- |
| Adafruit5839 OV5640,120° low-distortion fixed lens |38 in stock,$12.50 |35.7 ×23.0 ×17.5 mm | Reference5 MP DVP/JPEG, wide fixed lens; whole-carrier voltage conflict prevents qualification. Retains QVGA JPEG capability but changes the current OV2640 backend/sensor choice |
| Adafruit5840 OV5640,72° autofocus |18 in stock,$9.95 |35.7 ×23.0 ×17.5 mm on product page | Narrower view; autofocus needs the camera's motor supply jumper and firmware upload over I2C. Not a silent substitution |
| Waveshare8532 OV2640 Camera Board |**Discontinued** on manufacturer page | Not selected | Prior reference pinout is useful, but it is not a current procurement recommendation |

Sources: [5839](https://www.adafruit.com/product/5839),
[5840](https://www.adafruit.com/product/5840),
[primary guide](https://learn.adafruit.com/adafruit-ov5640-camera-breakout?view=all),
[schematic source](https://github.com/adafruit/Adafruit-OV5640-Camera-Breakout-PCB),
[Waveshare](https://www.waveshare.com/ov2640-camera-board.htm).
The Adafruit assembly dimensions are vendor product-page values; exact lens/module
revision and mechanical drawings must be reconciled before packaging. Neither
23 mm-wide breakout fits an18 mm-wide board envelope by assumption. A compact custom
carrier for the sensor/flex is a separate design requiring its own drawings and rails.

**Independent qualification is incomplete:** the linked camera module drawing specifies
DOVDD1.7–2.8 V, while the OmniVision datasheet recommends at most3.0 V; the Adafruit
schematic ties it to3.3 V. This contradiction must not be copied into a custom carrier.
A compliant carrier needs verified camera rails and logic-level translation; neither
commercial breakout is declared fully electrically qualified here.

The Adafruit schematic and guide establish regulated3.3 V input, onboard2.8 V AVDD
and1.5 V DVDD regulators, and DOVDD tied to3.3 V. SDA/SCL have10 kΩ pull-ups;
RESET has10 kΩ/100 nF, and PWDN has10 kΩ pulldown. Unlike the old Waveshare drawing,
PWDN is not shorted to ground. The guide explicitly targets ESP32-S2/S3, but exact
sensor-module I/O limits and timing must still be checked before a custom carrier.
The120° module drawing shows an8.5 ×8.7 mm body,5.1 ±0.2 mm module height and
21 ±0.2 mm overall flex length, with a12.5 mm-wide24-contact0.5 mm-pitch tail.
These are camera-only dimensions, not the larger breakout board envelope. The
5840 product advertises72° while its linked drawing says68°; reconcile the lens
revision rather than promising either exact field of view.

Do not substitute the guide's unrelated Leopard MIPI-module PDF for the exact DVP
module specification: filename similarity does not establish compatibility.

The standard2×9 header JP2 maps1=3.3V,2=GND,3=SCL,4=SDA,5=VSYNC,6=HSYNC/HREF,
7=PCLK,8=EXT_XCLK,9=DATA9 down through16=DATA2,17=RESET_N,18=PWDN. This preserves
the existing logical camera GPIO reservation: GPIO4–11 for D0–7,12PCLK,13HREF,
14VSYNC,15XCLK,16SDA,17SCL,18PWDN. RESET can use the module RC; no boot-strap pin
needs to be consumed. This is a verified candidate mapping, not a wired connector.

External24 MHz XCLK is the default jumper setting. Selecting the onboard24 MHz clock
requires cutting/rebridging the documented jumper; leave the external input undriven
then. A fixed-focus5839 avoids autofocus motor-power/firmware work. QVGA JPEG remains
the initial application target, with bounded buffers and capture/power measurements.
The current host firmware build does not establish OV5640 support on this hardware.

The reference PCB is CC BY-SA3.0. Only pin/rail facts were studied here; no reference
layout was copied. Any future adaptation of its design files must retain attribution
and comply with that license. Arducam's storefront returned a Cloudflare403; it was
not retried or bypassed. No current Arducam assembly was qualified from that response.

The user now authorizes autonomous compatible component selection. The camera
remains a technical qualification gate, rather than a pending request to choose
a component by preference. No complete module has yet met the rail/timing/sequence
requirements; the former OV2640/OV5640 question is not treated as a prohibition.

The [camera voltage review](camera-voltage-review.md) pins the carrier source to
commit6eba497, confirms the conflict, and records conditional1.8 V level translation
and manufacturer-documented SPI alternatives. No camera is selected by this review.

## Batteries

The modeled worst-case scenario is about1.65 A at3.0 V cell with0.20 Ω total path,
1 A logic at3.296 V and theoretical full-scale8 Ω audio. It is a design scenario,
not measured consumption. See [power review](electrical-power-review.md).

| Exact assembly | Listed body L ×W ×T | Manufacturer electrical limits | Procurement/status |
| --- | --- | --- | --- |
| Jauch LP103450JH, no.246520, PCM2IC,2 wires70 mm |52.0 ×34.5 ×10.0 mm; about35 g |1900 mAh minimum/1920 typical,4.2 V charge;1C charge/discharge; charge0–45 °C;3.0 V discharge cutoff | Current manufacturer standard-pack listing and rev1.1 datasheet. Inventory not exposed; quote/lead time unverified. Conditional external-pack candidate within the stated current scenario, not temple-fit |
| Jauch LP504783JU, no.246521, PCM,2 wires70 mm |84.5 ×47.5 ×5.2 mm; about48 g |2050 mAh minimum/2100 typical;2.1 A max discharge. Below15 °C, charging limited to420 mA | Current manufacturer listing/rev1.2. Inventory unknown. Supports the modeled load but **existing446 mA charge corner exceeds its cold-charge limit**; change ISET/timer/NTC review before enabling |
| Jauch LP561836JU, no.246501, PCM,2 wires50 mm |38.5 ×18.5 ×5.6 mm; about10 g |350 mAh minimum/370 typical;370 mA max discharge,74 mA max charge below15 °C | Manufacturer listing/rev1.2. **Rejected for current load/charge budget**, despite narrower geometry |
| Adafruit2011 / earlier PKCELL2000 mAh reference |Vendor page60 ×36 ×7 mm; earlier PDF uses a different LP803860 envelope | Exact delivered revision not established | Manufacturer page currently out of stock; historical bench reference only |
| Adafruit328 / PKCELL LIPO7850602500 mAh |Vendor pack dimensions need final drawing review | Manufacturer2019 datasheet limits continuous discharge to1.5 A | Vendor currently says in stock, but **does not cover the1.65 A scenario**. Capacity alone is not a current rating |

Jauch body dimensions are from its current [standard-pack table](https://www.jauch.com/en-INT/products/battery_technology/getPrm/batteries/Lithium%20Polymer%20Batteries/),
not inferred from model numbers. Primary sheets:
[246520](https://www.jauch.com/downloadfile/66cedf6fabf401098a2fc8d8447d4ce20/matd_246520_lp103450jhpcm2ic2_wires_70mm.pdf),
[246521](https://www.jauch.com/downloadfile/677e3d8462ec62c5c2780f62146a6ef65/matd_246521_20200507_2050mah_-_lp504783ju_1s1p_2_wire_70mm.pdf),
[246501](https://www.jauch.com/downloadfile/677e36004f285c9b669ea5a9814f67e5d/matd_246501_20200507_350mah_-_lp561836ju_1s1p_2_wire_50mm.pdf),
[Adafruit2011](https://www.adafruit.com/product/2011),
[Adafruit328](https://www.adafruit.com/product/328).

These are two-wire packs; none provides the selected battery-attached NTC connection
by assumption. The current3-wire battery contract needs a verified adapter/polarity,
pack-attached thermistor, application undervoltage cutoff and upstream fault limiting.
PCM overcurrent thresholds can exceed the frame cable's permissible current and are
not a replacement for application protection. No quote, order or vendor message was sent.

**Decision pending:** external protected pack for the first prototype, or an integrated
arm battery with a redesigned load/performance budget and a qualified high-rate cell.
The narrow low-rate pack must not be made to fit by ignoring its current limits.
