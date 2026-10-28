# Camera interface review

The current board reserves GPIOs for an8-bit DVP OV2640 camera. No exact wearable
camera module/lens/flex has been selected, so no generic camera FPC footprint or
unverified sensor rail has been added. This is a verified reference mapping for an
external bench module, not a selected production camera or a claim of frame fit.

Primary references: [Waveshare OV2640 Camera Board](https://www.waveshare.com/wiki/OV2640_Camera_Board)
and its [manufacturer schematic](https://files.waveshare.com/upload/9/99/OV2640-Camera-Board-Schematic.pdf).
The schematic labels the shared sensor symbol OV9655 and the project OV9656/OV2640;
confirm the delivered module revision/sensor before relying on the drawing.

| Waveshare 2×9 header pin | Signal | Proposed S3 GPIO / physical pad |
| --- | --- | --- |
| 1 | 3.3 V input | Regulated logic supply, subject to peak-current budget |
| 2 | GND | GND |
| 3 | SIO_C | GPIO17 /23 |
| 4 | SIO_D | GPIO16 /22 |
| 5 | VSYNC | GPIO14 /19 |
| 6 | HREF | GPIO13 /18 |
| 7 | PCLK | GPIO12 /17 |
| 8 | XCLK | GPIO15 /21 |
| 9 | Y9 / D7 | GPIO11 /16 |
| 10 | Y8 / D6 | GPIO10 /15 |
| 11 | Y7 / D5 | GPIO9 /14 |
| 12 | Y6 / D4 | GPIO8 /13 |
| 13 | Y5 / D3 | GPIO7 /12 |
| 14 | Y4 / D2 | GPIO6 /11 |
| 15 | Y3 / D1 | GPIO5 /10 |
| 16 | Y2 / D0 | GPIO4 /9 |
| 17 | RESET | On-module RC/pull-up; initially no MCU connection |
| 18 | PWDN | **No MCU drive with stock R7 fitted** |

The module generates2.8 V and1.2 V from3.3 V with RT9166A regulators; its drawing
uses3.3 V DOVDD, so this header differs from a bare sensor or an arbitrary24-pin
camera flex. RESET has4.7 kΩ/100 nF RC. **R7=0 Ω grounds PWDN.** Connecting
GPIO18 and driving high would contend with ground. Leave pin18 undriven for the
unmodified module; controlled power-down requires removing the strap and verifying
startup/reset behavior. This modification has not been made or tested.

SCCB data/clock need pull-up presence, voltage and open-drain behavior checked on the
actual revision. XCLK source/termination and DVP timing must be checked against the
selected module's limits; the future connector should remain close to the MCU, away
from the switching regulator and the long frame cable. First capture target remains
QVGA JPEG with bounded buffering. Host firmware compilation does not verify a camera.

Release requires an exact orderable module, connector drawing/contact order, lens/FOV,
optical axis and flex dimensions, rail/current/sequence limits, current stock and a
mechanical placement. The18-contact development module is a reference, not an
assumed small camera assembly. Frame dimensions and exact camera choice remain open.
