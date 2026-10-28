import { ESP32_S3_WROOM_1U_N8R8 } from "../../imports/ESP32_S3_WROOM_1U_N8R8"

/** Module pad numbers, NOT ESP32-S3 silicon pin numbers. Datasheet v1.8 Table 3-1. */
export const esp32S3Wroom1uPins = {
  pin1: "GND_1", pin2: "VDD3V3", pin3: "EN",
  pin4: "IO4", pin5: "IO5", pin6: "IO6", pin7: "IO7",
  pin8: "IO15", pin9: "IO16", pin10: "IO17", pin11: "IO18",
  pin12: "IO8", pin13: "IO19_USB_DM", pin14: "IO20_USB_DP",
  pin15: "IO3_STRAP", pin16: "IO46_STRAP", pin17: "IO9", pin18: "IO10",
  pin19: "IO11", pin20: "IO12", pin21: "IO13", pin22: "IO14",
  pin23: "IO21", pin24: "IO47", pin25: "IO48", pin26: "IO45_STRAP",
  pin27: "IO0_BOOT", pin28: "IO35_PSRAM", pin29: "IO36_PSRAM", pin30: "IO37_PSRAM",
  pin31: "IO38", pin32: "IO39", pin33: "IO40", pin34: "IO41", pin35: "IO42",
  pin36: "RXD0_IO44", pin37: "TXD0_IO43", pin38: "IO2", pin39: "IO1",
  pin40: "GND_40", pin41: "EPAD_GND",
} as const

// All unimplemented interfaces are explicitly unconnected in this design stage.
// Remove a noConnect entry only when adding that reviewed subsystem.
// Pads 28/29/30 must STAY unconnected externally on the N8R8 PSRAM variant.
const unconnectedPads = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20,
  21, 22, 23, 24, 28, 29, 30, 31, 32, 33, 34, 35, 38] as const

export function Esp32S3Wroom1uCoreModule() {
  return (
    <ESP32_S3_WROOM_1U_N8R8
      name="U1"
      manufacturerPartNumber="ESP32-S3-WROOM-1U-N8R8"
      pinLabels={esp32S3Wroom1uPins}
      schSectionName="Core"
      pcbX={-14} pcbY={0}
      schX={0} schY={0}
      noConnect={unconnectedPads.map((n) => `pin${n}` as const)}
      connections={{
        pin1: "net.GND", pin2: "net.VCORE3V2", pin3: "net.MCU_EN",
        pin16: "net.STRAP_GPIO46", pin26: "net.STRAP_GPIO45", pin27: "net.BOOT_N",
        pin36: "net.UART0_RX", pin37: "net.UART0_TX", pin40: "net.GND", pin41: "net.GND",
        pin25: "net.REC_LED", pin39: "net.USER_BUTTON",
      }}
    />
  )
}
