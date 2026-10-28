# Physical pin allocation and frame cable contract

Current compact revision; Espressif S3 series v2.2 Tables2-1/2-14. GPIO numbers are not QFN
pad numbers. Camera GPIOs remain reserved; all other functional rows are drawn
in review TSX. No assignment is hardware-tested.

| Signal | GPIO | R8 physical pad | State |
| --- | --- | --- | --- |
| CAM_D0 | 4 | 9 | Camera pending |
| CAM_D1 | 5 | 10 | Camera pending |
| CAM_D2 | 6 | 11 | Camera pending |
| CAM_D3 | 7 | 12 | Camera pending |
| CAM_D4 | 8 | 13 | Camera pending |
| CAM_D5 | 9 | 14 | Camera pending |
| CAM_D6 | 10 | 15 | Camera pending |
| CAM_D7 | 11 | 16 | Camera pending |
| CAM_PCLK | 12 | 17 | Camera pending |
| CAM_HREF | 13 | 18 | Camera pending |
| CAM_VSYNC | 14 | 19 | Camera pending |
| CAM_XCLK | 15 | 21 | Camera pending |
| CAM_SIOD | 16 | 22 | Camera pending |
| CAM_SIOC | 17 | 23 | Camera pending |
| CAM_PWDN | 18 | 24 | Camera pending |
| AUDIO_BCLK | 38 | 43 | Wired; bench pending |
| AUDIO_LRCLK | 39 | 44 | Wired; bench pending |
| MIC_SD | 40 | 45 | Wired; bench pending |
| AUDIO_DOUT | 41 | 47 | Wired; bench pending |
| CTRL_SDA | 47 | 37 | Wired; bench pending |
| CTRL_SCL | 2 | 7 | Wired; bench pending |
| TOUCH_OUT | 21 | 27 | Wired; bench pending |
| AMP_ENABLE | 42 | 48 | Wired; bench pending |
| USER_BUTTON | 1 | 6 | Wired; KMR/2.7k/100nF; bench pending |
| REC_LED | 48 | 36 | Wired; bench pending |

Preserve USB19/20 (pads25/26), UART43/44 (49/50), GPIO0/3/45/46 boot straps,
and all memory resources. R8 SPICS1/pad28 and GPIO33–37/pads38–42 are unavailable.
VDD_SPI/pad29 receives the common3.296 V supply through R25 and powers external flash; pads30–35 carry its quad bus. Pads53/54
connect the external40 MHz crystal. These differ from the preserved PICO SiP. GPIO45 low selects the
required3.3 V memory domain. EN is physical pad4, not GPIO3. GPIO3/pad8 is reserved and externally pulled up10 kΩ
by R26. It has no internal pull; high selects USB Serial/JTAG if eFuse-controlled
strap selection is enabled and USB JTAG is not disabled. See [boot review](boot-memory-review.md).

## Frame connector J1, both boards

FH12-20S-0.5SH(55), C596730. The two independent netlists are checked against
this numbered contract; they are not connected by identical net names alone.

| Contact | Net |
| --- | --- |
| 1 | GND |
| 2 | VSYS |
| 3 | VSYS |
| 4 | GND |
| 5 | VSYS |
| 6 | VSYS |
| 7 | GND |
| 8 | VCORE3V3 |
| 9 | GND |
| 10 | AUDIO_BCLK |
| 11 | GND |
| 12 | AUDIO_LRCLK |
| 13 | GND |
| 14 | AUDIO_DOUT |
| 15 | GND |
| 16 | CTRL_SCL |
| 17 | CTRL_SDA |
| 18 | TOUCH_OUT |
| 19 | AMP_ENABLE |
| 20 | GND |

Mounting lands21/22 are NC. Main connector is rotated90°, right270° for opposing
board edges. Actual mating geometry, cable contact side/numbering, conductor current,
voltage drop and hinge endurance remain unverified. Candidate static Wurth cable
687620100002 is not a validated dynamic frame flex.

Camera DVP and microphone SD stay on the left. Bridge speaker outputs and battery
stay local to the right. See [current design](compact-design.md) for voltage,
power-off and charge-inhibit requirements.
