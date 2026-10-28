import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["VIN1"],
  pin2: ["VIN2"],
  pin3: ["ON"],
  pin4: ["VBIAS"],
  pin5: ["GND"],
  pin6: ["CT"],
  pin7: ["VOUT1"],
  pin8: ["VOUT2"],
  pin9: ["EP"]
} as const

const pinAttributes = {
  pin1: {requiresPower: true},
  pin2: {requiresPower: true},
  pin5: {requiresGround: true}
} as const

export const TPS22965DSGR = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C122837"
  ]
}}
      manufacturerPartNumber="TPS22965DSGR"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-0.927608mm" pcbY="0.750062mm" width="0.5050028mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-0.927608mm" pcbY="0.249936mm" width="0.5050028mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-0.927608mm" pcbY="-0.249936mm" width="0.5050028mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-0.927608mm" pcbY="-0.750062mm" width="0.5050028mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="0.927608mm" pcbY="-0.750062mm" width="0.5050028mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="0.927608mm" pcbY="-0.249936mm" width="0.5050028mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="0.927608mm" pcbY="0.249936mm" width="0.5050028mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="0.927608mm" pcbY="0.750062mm" width="0.5050028mm" height="0.2800096mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="0mm" pcbY="0mm" width="0.8999982mm" height="1.6999966mm" shape="rect" />
<silkscreenpath route={[{"x":-1.0761979999999767,"y":1.0761980000000904},{"x":1.0761979999999767,"y":1.0761980000000904}]} />
<silkscreenpath route={[{"x":-1.0761979999999767,"y":-1.0761979999999767},{"x":1.0761979999999767,"y":-1.0761979999999767}]} />
<silkscreencircle pcbX="-1.480058mm" pcbY="0.750062mm" radius="0.07493mm" />
<silkscreentext text="{NAME}" pcbX="-0.1778mm" pcbY="2.0668mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-1.4301094000002195,"y":1.249998000000005},{"x":1.4301094000001058,"y":1.249998000000005},{"x":1.4301094000001058,"y":-1.249998000000005},{"x":-1.4301094000002195,"y":-1.249998000000005},{"x":-1.4301094000002195,"y":1.249998000000005}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C122837.obj?uuid=ec33f86995434393b9d1cf92fd8f7247",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C122837.step?uuid=ec33f86995434393b9d1cf92fd8f7247",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: 0 },
      }}
      {...props}
    />
  )
}
