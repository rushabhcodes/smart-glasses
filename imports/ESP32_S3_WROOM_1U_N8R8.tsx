import type { ChipProps } from "@tscircuit/props"

// Corrected after import: module datasheet v1.8 Table 3-1. See docs/main-board-core.md.
const pinLabels = {
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

const pinAttributes = {
  pin1: { requiresGround: true },
  pin2: { requiresPower: true, requiresVoltage: "3.3V" },
  pin40: { requiresGround: true },
  pin41: { requiresGround: true },
} as const

export const ESP32_S3_WROOM_1U_N8R8 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C2980300"
  ]
}}
      manufacturerPartNumber="ESP32-S3-WROOM-1U-N8R8"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-8.750046mm" pcbY="9.0449527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-8.750046mm" pcbY="7.7749527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-8.750046mm" pcbY="6.5049527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-8.750046mm" pcbY="5.2349527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-8.750046mm" pcbY="3.9649527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-8.750046mm" pcbY="2.6949527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-8.750046mm" pcbY="1.4249527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-8.750046mm" pcbY="0.1549527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="-8.750046mm" pcbY="-1.1150473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="-8.750046mm" pcbY="-2.3850473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="-8.750046mm" pcbY="-3.6550473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="-8.750046mm" pcbY="-4.9250473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="-8.750046mm" pcbY="-6.1950473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="-8.750046mm" pcbY="-7.4650473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="-6.985mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin16"]} pcbX="-5.715mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin17"]} pcbX="-4.445mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin18"]} pcbX="-3.175mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin19"]} pcbX="-1.905mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin20"]} pcbX="-0.635mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin21"]} pcbX="0.635mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin22"]} pcbX="1.905mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin23"]} pcbX="3.175mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin24"]} pcbX="4.445mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin25"]} pcbX="5.715mm" pcbY="-8.7449533mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin26"]} pcbX="6.985mm" pcbY="-8.7149813mm" width="0.8999982mm" height="1.499997mm" shape="rect" />
<smtpad portHints={["pin27"]} pcbX="8.750046mm" pcbY="-7.4650473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin28"]} pcbX="8.750046mm" pcbY="-6.1950473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin29"]} pcbX="8.750046mm" pcbY="-4.9250473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin30"]} pcbX="8.750046mm" pcbY="-3.6550473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin31"]} pcbX="8.750046mm" pcbY="-2.3850473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin32"]} pcbX="8.750046mm" pcbY="-1.1150473mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin33"]} pcbX="8.750046mm" pcbY="0.1549527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin34"]} pcbX="8.750046mm" pcbY="1.4249527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin35"]} pcbX="8.750046mm" pcbY="2.6949527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin36"]} pcbX="8.750046mm" pcbY="3.9649527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin37"]} pcbX="8.750046mm" pcbY="5.2349527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin38"]} pcbX="8.750046mm" pcbY="6.5049527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin39"]} pcbX="8.750046mm" pcbY="7.7749527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin40"]} pcbX="8.750046mm" pcbY="9.0449527mm" width="1.499997mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin41"]} pcbX="-1.500124mm" pcbY="1.3248767mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin41"]} pcbX="-2.900172mm" pcbY="1.3248767mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin41"]} pcbX="-0.100076mm" pcbY="1.3248767mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin41"]} pcbX="-0.100076mm" pcbY="2.7249247mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin41"]} pcbX="-1.500124mm" pcbY="2.7249247mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin41"]} pcbX="-2.900172mm" pcbY="2.7249247mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin41"]} pcbX="-2.900172mm" pcbY="-0.0751713mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin41"]} pcbX="-1.500124mm" pcbY="-0.0751713mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<smtpad portHints={["pin41"]} pcbX="-0.100076mm" pcbY="-0.0751713mm" width="0.8999982mm" height="0.8999982mm" shape="rect" />
<silkscreenpath route={[{"x":9.016999999999939,"y":9.726104500000133},{"x":9.016999999999939,"y":10.504944700000124}]} />
<silkscreenpath route={[{"x":-9.000007400000186,"y":10.504944700000124},{"x":-9.000007400000186,"y":9.726104500000133}]} />
<silkscreenpath route={[{"x":-9.000007400000186,"y":10.505351100000212},{"x":9.016999999999939,"y":10.504944700000124}]} />
<silkscreenpath route={[{"x":7.666151799999966,"y":-8.994051099999865},{"x":9.016999999999939,"y":-8.994051099999865},{"x":9.016999999999939,"y":-8.14619909999999}]} />
<silkscreenpath route={[{"x":-9.000007400000186,"y":-8.14619909999999},{"x":-9.000007400000186,"y":-8.994051099999865},{"x":-7.66615180000008,"y":-8.994051099999865}]} />
<silkscreencircle pcbX="-9.8552mm" pcbY="10.1043867mm" radius="0.183388mm" />
<silkscreentext text="{NAME}" pcbX="-0mm" pcbY="10.5021527mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-9.750044499999944,"y":10.504983300000049},{"x":9.750044499999944,"y":10.504983300000049},{"x":9.750044499999944,"y":-9.744951799999967},{"x":-9.750044499999944,"y":-9.744951799999967},{"x":-9.750044499999944,"y":10.504983300000049}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2980300.obj?uuid=46b6d65fd84542c2a5b86711f114a123",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2980300.step?uuid=46b6d65fd84542c2a5b86711f114a123",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: -0.6549987000000828, z: 0 },
      }}
      {...props}
    />
  )
}