import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["DIR1"],
  pin2: ["DIR2"],
  pin3: ["A1"],
  pin4: ["A2"],
  pin5: ["A3"],
  pin6: ["A4"],
  pin7: ["DIR3"],
  pin8: ["DIR4"],
  pin9: ["N_OE"],
  pin10: ["GND"],
  pin11: ["B4"],
  pin12: ["B3"],
  pin13: ["B2"],
  pin14: ["B1"],
  pin15: ["VCCB"],
  pin16: ["VCCA"]
} as const

const pinAttributes = {
  pin10: {requiresGround: true}
} as const

export const SN74AXC4T774PWR = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C1849453"
  ]
}}
      manufacturerPartNumber="SN74AXC4T774PWR"
      footprint={<footprint>
        <smtpad portHints={["pin16"]} pcbX="2.999994mm" pcbY="2.275078mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="2.999994mm" pcbY="1.624838mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="2.999994mm" pcbY="0.974852mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="2.999994mm" pcbY="0.324866mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="2.999994mm" pcbY="-0.32512mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="2.999994mm" pcbY="-0.975106mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="2.999994mm" pcbY="-1.625092mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="2.999994mm" pcbY="-2.275078mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-2.999994mm" pcbY="-2.275078mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-2.999994mm" pcbY="-1.625092mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-2.999994mm" pcbY="-0.975106mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-2.999994mm" pcbY="-0.32512mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-2.999994mm" pcbY="0.324866mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-2.999994mm" pcbY="0.974852mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-2.999994mm" pcbY="1.624838mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-2.999994mm" pcbY="2.275078mm" width="1.8034mm" height="0.4064mm" shape="rect" />
<silkscreenpath route={[{"x":0.7056881999999973,"y":2.5045669999999944},{"x":1.8799047999999914,"y":2.5016714000000064}]} />
<silkscreenpath route={[{"x":-1.8600928000000039,"y":2.5016714000000064},{"x":-0.6659118000000035,"y":2.5045669999999944}]} />
<silkscreenpath route={[{"x":-1.8684748000000013,"y":-2.4983185999999904},{"x":1.8682716,"y":-2.4983185999999904}]} />
<silkscreenpath route={[{"x":0.7056881999999831,"y":2.5045669999999944},{"x":0.6721227588752043,"y":2.2926431452576566},{"x":0.574712054742335,"y":2.1014638739778206},{"x":0.4229913260221707,"y":1.9497431452576706},{"x":0.2318120547423348,"y":1.852332441124787},{"x":0.019888199999996914,"y":1.8187670000000082},{"x":-0.19203565474235518,"y":1.852332441124787},{"x":-0.3832149260221911,"y":1.9497431452576706},{"x":-0.5349356547423412,"y":2.1014638739778206},{"x":-0.6323463588752247,"y":2.2926431452576566},{"x":-0.6659118000000035,"y":2.5045669999999944}]} />
<silkscreencircle pcbX="-2.794mm" pcbY="3.049778mm" radius="0.254mm" />
<silkscreentext text="{NAME}" pcbX="-0.09525mm" pcbY="4.312922mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-4.151694000000006,"y":2.7499696},{"x":4.151693999999992,"y":2.7499696},{"x":4.151693999999992,"y":-2.750020399999997},{"x":-4.151694000000006,"y":-2.750020399999997},{"x":-4.151694000000006,"y":2.7499696}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C1849453.obj?uuid=534f03d8fe164fbab551f91e5a792e30",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C1849453.step?uuid=534f03d8fe164fbab551f91e5a792e30",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.0001015999999935957, y: 0.000025399999998398926, z: -0.019205 },
      }}
      {...props}
    />
  )
}