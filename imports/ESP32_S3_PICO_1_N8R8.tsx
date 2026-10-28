import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["LNA_IN"],
  pin2: ["VDD3P31"],
  pin3: ["VDD3P32"],
  pin4: ["CHIP_PU"],
  pin5: ["GPIO0"],
  pin6: ["GPIO1"],
  pin7: ["GPIO2"],
  pin8: ["GPIO3"],
  pin9: ["GPIO4"],
  pin10: ["GPIO5"],
  pin11: ["GPIO6"],
  pin12: ["GPIO7"],
  pin13: ["GPIO8"],
  pin14: ["GPIO9"],
  pin15: ["GPIO10"],
  pin16: ["GPIO11"],
  pin17: ["GPIO12"],
  pin18: ["GPIO13"],
  pin19: ["GPIO14"],
  pin20: ["VDD3P3_RTC"],
  pin21: ["XTAL_32K_P"],
  pin22: ["XTAL_32K_N"],
  pin23: ["GPIO17"],
  pin24: ["GPIO18"],
  pin25: ["GPIO19"],
  pin26: ["GPIO20"],
  pin27: ["GPIO21"],
  pin28: ["SPICS1"],
  pin29: ["VDD_SPI"],
  pin30: ["NC1"],
  pin31: ["NC2"],
  pin32: ["NC3"],
  pin33: ["NC4"],
  pin34: ["NC5"],
  pin35: ["NC6"],
  pin36: ["SPICLK_N"],
  pin37: ["SPICLK_P"],
  pin38: ["GPIO33"],
  pin39: ["GPIO34"],
  pin40: ["GPIO35"],
  pin41: ["GPIO36"],
  pin42: ["GPIO37"],
  pin43: ["GPIO38"],
  pin44: ["MTCK"],
  pin45: ["MTDO"],
  pin46: ["VDD3P3_CPU"],
  pin47: ["MTDI"],
  pin48: ["MTMS"],
  pin49: ["U0TXD"],
  pin50: ["U0RXD"],
  pin51: ["GPIO45"],
  pin52: ["GPIO46"],
  pin53: ["NC7"],
  pin54: ["NC8"],
  pin55: ["VDDA1"],
  pin56: ["VDDA2"],
  pin57: ["EP"]
} as const

const pinAttributes = {
  pin2: {requiresPower: true},
  pin3: {requiresPower: true},
  pin20: {requiresPower: true},
  pin46: {requiresPower: true},
  pin57: {requiresGround: true},
  pin30: {doNotConnect: true},
  pin31: {doNotConnect: true},
  pin32: {doNotConnect: true},
  pin33: {doNotConnect: true},
  pin34: {doNotConnect: true},
  pin35: {doNotConnect: true},
  pin53: {doNotConnect: true},
  pin54: {doNotConnect: true},
  pin55: {requiresPower: true},
  pin56: {requiresPower: true}
} as const

export const ESP32_S3_PICO_1_N8R8 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C7545129"
  ]
}}
      manufacturerPartNumber="ESP32-S3-PICO-1-N8R8"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-3.407537mm" pcbY="2.600071mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-3.407537mm" pcbY="2.200021mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-3.407537mm" pcbY="1.799971mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-3.407537mm" pcbY="1.400175mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-3.407537mm" pcbY="1.000125mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-3.407537mm" pcbY="0.600075mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-3.407537mm" pcbY="0.200025mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-3.407537mm" pcbY="-0.200025mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="-3.407537mm" pcbY="-0.599821mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="-3.407537mm" pcbY="-0.999871mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="-3.407537mm" pcbY="-1.399921mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="-3.407537mm" pcbY="-1.799971mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="-3.407537mm" pcbY="-2.200021mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="-3.407537mm" pcbY="-2.599817mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="-2.599817mm" pcbY="-3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin16"]} pcbX="-2.200021mm" pcbY="-3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin17"]} pcbX="-1.799971mm" pcbY="-3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin18"]} pcbX="-1.399921mm" pcbY="-3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin19"]} pcbX="-0.999871mm" pcbY="-3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin20"]} pcbX="-0.599821mm" pcbY="-3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin21"]} pcbX="-0.200025mm" pcbY="-3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin22"]} pcbX="0.200025mm" pcbY="-3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin23"]} pcbX="0.600075mm" pcbY="-3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin24"]} pcbX="1.000125mm" pcbY="-3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin25"]} pcbX="1.400175mm" pcbY="-3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin26"]} pcbX="1.799971mm" pcbY="-3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin27"]} pcbX="2.200021mm" pcbY="-3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin28"]} pcbX="2.600071mm" pcbY="-3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin29"]} pcbX="3.407537mm" pcbY="-2.599817mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin30"]} pcbX="3.407537mm" pcbY="-2.200021mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin31"]} pcbX="3.407537mm" pcbY="-1.799971mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin32"]} pcbX="3.407537mm" pcbY="-1.399921mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin33"]} pcbX="3.407537mm" pcbY="-0.999871mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin34"]} pcbX="3.407537mm" pcbY="-0.599821mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin35"]} pcbX="3.407537mm" pcbY="-0.200025mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin36"]} pcbX="3.407537mm" pcbY="0.200025mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin37"]} pcbX="3.407537mm" pcbY="0.600075mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin38"]} pcbX="3.407537mm" pcbY="1.000125mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin39"]} pcbX="3.407537mm" pcbY="1.400175mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin40"]} pcbX="3.407537mm" pcbY="1.799971mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin41"]} pcbX="3.407537mm" pcbY="2.200021mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin42"]} pcbX="3.407537mm" pcbY="2.600071mm" width="0.6649974mm" height="0.1999996mm" shape="rect" />
<smtpad portHints={["pin43"]} pcbX="2.600071mm" pcbY="3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin44"]} pcbX="2.200021mm" pcbY="3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin45"]} pcbX="1.799971mm" pcbY="3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin46"]} pcbX="1.400175mm" pcbY="3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin47"]} pcbX="1.000125mm" pcbY="3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin48"]} pcbX="0.600075mm" pcbY="3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin49"]} pcbX="0.200025mm" pcbY="3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin50"]} pcbX="-0.200025mm" pcbY="3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin51"]} pcbX="-0.599821mm" pcbY="3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin52"]} pcbX="-0.999871mm" pcbY="3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin53"]} pcbX="-1.399921mm" pcbY="3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin54"]} pcbX="-1.799971mm" pcbY="3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin55"]} pcbX="-2.200021mm" pcbY="3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin56"]} pcbX="-2.599817mm" pcbY="3.407537mm" width="0.1999996mm" height="0.6649974mm" shape="rect" />
<smtpad portHints={["pin57"]} pcbX="0.000127mm" pcbY="0.000127mm" width="3.999992mm" height="3.999992mm" shape="rect" />
<via connectsTo="net.GND" pcbX="1.000125mm" pcbY="-0.000127mm" outerDiameter="0.6096mm" holeDiameter="0.3048mm" layers={["top","bottom"]} />
<via connectsTo="net.GND" pcbX="1.000125mm" pcbY="0.999871mm" outerDiameter="0.6096mm" holeDiameter="0.3048mm" layers={["top","bottom"]} />
<via connectsTo="net.GND" pcbX="-0.999617mm" pcbY="0.000127mm" outerDiameter="0.6096mm" holeDiameter="0.3048mm" layers={["top","bottom"]} />
<via connectsTo="net.GND" pcbX="-0.999617mm" pcbY="0.999871mm" outerDiameter="0.6096mm" holeDiameter="0.3048mm" layers={["top","bottom"]} />
<via connectsTo="net.GND" pcbX="1.000125mm" pcbY="-1.000125mm" outerDiameter="0.6096mm" holeDiameter="0.3048mm" layers={["top","bottom"]} />
<via connectsTo="net.GND" pcbX="-0.999871mm" pcbY="-1.000125mm" outerDiameter="0.6096mm" holeDiameter="0.3048mm" layers={["top","bottom"]} />
<via connectsTo="net.GND" pcbX="0.000127mm" pcbY="-0.000127mm" outerDiameter="0.6096mm" holeDiameter="0.3048mm" layers={["top","bottom"]} />
<via connectsTo="net.GND" pcbX="0.000635mm" pcbY="-0.999617mm" outerDiameter="0.6096mm" holeDiameter="0.3048mm" layers={["top","bottom"]} />
<via connectsTo="net.GND" pcbX="0.000127mm" pcbY="0.999871mm" outerDiameter="0.6096mm" holeDiameter="0.3048mm" layers={["top","bottom"]} />
<silkscreenpath route={[{"x":2.9025850000000446,"y":3.5762946000000966},{"x":3.576294599999983,"y":3.5762946000000966},{"x":3.576294599999983,"y":2.9025850000000446}]} />
<silkscreenpath route={[{"x":2.9025850000000446,"y":-3.576142199999822},{"x":3.576294599999983,"y":-3.576142199999822},{"x":3.576294599999983,"y":-2.9024579999999105}]} />
<silkscreenpath route={[{"x":-2.902458000000024,"y":3.5762946000000966},{"x":-3.5761422000000493,"y":3.5762946000000966},{"x":-3.5761422000000493,"y":2.9025850000000446}]} />
<silkscreenpath route={[{"x":-2.902458000000024,"y":-3.576142199999822},{"x":-3.5761422000000493,"y":-3.576142199999822},{"x":-3.5761422000000493,"y":-2.9024579999999105}]} />
<silkscreencircle pcbX="-4.039743mm" pcbY="2.600071mm" radius="0.07493mm" />
<silkscreentext text="{NAME}" pcbX="-0.190373mm" pcbY="4.733927mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-3.990035700000135,"y":3.9900357000000213},{"x":3.9900357000000213,"y":3.9900357000000213},{"x":3.9900357000000213,"y":-3.9900357000000213},{"x":-3.990035700000135,"y":-3.9900357000000213},{"x":-3.990035700000135,"y":3.9900357000000213}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C7545129.obj?uuid=6d30b5a04660477fbdff168686b01590",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C7545129.step?uuid=6d30b5a04660477fbdff168686b01590",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: -0.86 },
      }}
      {...props}
    />
  )
}
