import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"],
  pin5: ["pin5"],
  pin6: ["pin6"],
  pin7: ["pin7"],
  pin8: ["pin8"],
  pin9: ["pin9"],
  pin10: ["pin10"],
  pin11: ["pin11"],
  pin12: ["pin12"],
  pin13: ["pin13"],
  pin14: ["pin14"],
  pin15: ["pin15"],
  pin16: ["pin16"],
  pin17: ["pin17"],
  pin18: ["pin18"],
  pin19: ["pin19"],
  pin20: ["pin20"],
  pin21: ["pin21"],
  pin22: ["pin22"],
  pin23: ["pin23"],
  pin24: ["pin24"],
  pin25: ["pin25"],
  pin26: ["pin26"]
} as const

export const AFC01_S24FCC_00 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C262276"
  ]
}}
      manufacturerPartNumber="AFC01-S24FCC-00"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-5.74802mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-5.247894mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-4.748022mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-4.247896mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-3.748024mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-3.247898mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-2.748026mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-2.2479mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="-1.748028mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="-1.247902mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="-0.74803mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="-0.247904mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="0.251968mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="0.752094mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="1.251966mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin16"]} pcbX="1.752092mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin17"]} pcbX="2.251964mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin18"]} pcbX="2.75209mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin19"]} pcbX="3.251962mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin20"]} pcbX="3.752088mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin21"]} pcbX="4.25196mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin22"]} pcbX="4.752086mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin23"]} pcbX="5.251958mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin24"]} pcbX="5.752084mm" pcbY="-1.42577185mm" width="0.2999994mm" height="1.2999974mm" shape="rect" />
<smtpad portHints={["pin25"]} pcbX="7.450074mm" pcbY="1.27577215mm" width="1.999996mm" height="1.5999968mm" shape="rect" />
<smtpad portHints={["pin26"]} pcbX="-7.450074mm" pcbY="1.27577215mm" width="1.999996mm" height="1.5999968mm" shape="rect" />
<silkscreenpath route={[{"x":-8.199983599999996,"y":0.2447353499998144},{"x":-8.199983599999996,"y":-0.6550088500000584},{"x":-6.269990000000007,"y":-0.6550088500000584}]} />
<silkscreenpath route={[{"x":8.189975999999888,"y":0.1549971499999856},{"x":8.189975999999888,"y":-0.7150036500000851},{"x":6.389979599999947,"y":-0.7150036500000851}]} />
<silkscreenpath route={[{"x":-8.189976000000115,"y":2.205005749999941},{"x":-8.189976000000115,"y":3.4949955499999987},{"x":-7.829981800000155,"y":3.4949955499999987},{"x":-7.829981800000155,"y":4.394993750000026},{"x":7.779994600000009,"y":4.394993750000026},{"x":7.779994600000009,"y":3.5350005500000634},{"x":8.16998620000004,"y":3.5350005500000634},{"x":8.16998620000004,"y":2.244985349999979}]} />
<silkscreentext text="{NAME}" pcbX="-0.0127mm" pcbY="5.40530615mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-8.700071999999977,"y":4.663992949999965},{"x":8.700071999999864,"y":4.663992949999965},{"x":8.700071999999864,"y":-2.3257705500000156},{"x":-8.700071999999977,"y":-2.3257705500000156},{"x":-8.700071999999977,"y":4.663992949999965}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C262276.obj?uuid=9bafbf39f55444ba95701101a80398a4",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C262276.step?uuid=9bafbf39f55444ba95701101a80398a4",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.000012700000070253736, y: -1.3639990499999612, z: -2 },
      }}
      {...props}
    />
  )
}