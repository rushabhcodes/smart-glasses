import { ESP32_S3R8 } from "../../imports/ESP32_S3R8"

/** Bare R8 QFN physical pads, Espressif series v2.2; external flash and crystal required. */
export function Esp32S3R8Core() {
  return <ESP32_S3R8 name="U1" pcbX={-15} pcbY={1}
    noConnect={["pin8", "pin9", "pin10", "pin11", "pin12", "pin13", "pin14", "pin15",
      "pin16", "pin17", "pin18", "pin19", "pin21", "pin22", "pin23", "pin24",
      "pin25", "pin26", "pin28", "pin38", "pin39", "pin40", "pin41", "pin42"]}
    connections={{
      pin1: "net.RF_CHIP", pin2: "net.VDD_RF", pin3: "net.VDD_RF", pin4: "net.MCU_EN",
      pin5: "net.BOOT_N", pin6: "net.USER_BUTTON", pin7: "net.CTRL_SCL",
      pin20: "net.VCORE3V3", pin27: "net.TOUCH_OUT", pin36: "net.REC_LED",
      pin37: "net.CTRL_SDA", pin43: "net.AUDIO_BCLK", pin44: "net.AUDIO_LRCLK",
      pin45: "net.MIC_SD", pin46: "net.VCORE3V3", pin47: "net.AUDIO_DOUT",
      pin48: "net.AMP_ENABLE", pin49: "net.UART0_TX", pin50: "net.UART0_RX",
      pin51: "net.STRAP_GPIO45", pin52: "net.STRAP_GPIO46", pin55: "net.VCORE3V3",
      pin56: "net.VCORE3V3", pin57: "net.GND",
      pin29: "net.VDD_SPI", pin30: "net.SPIHD", pin31: "net.SPIWP",
      pin32: "net.SPICS0", pin33: "net.SPICLK", pin34: "net.SPIQ", pin35: "net.SPID",
      pin53: "net.XTAL_N", pin54: "net.XTAL_P_CHIP",
    }} />
}
