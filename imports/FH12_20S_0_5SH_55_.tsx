import type { ConnectorProps } from "@tscircuit/props"

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
  pin22: ["pin22"]
} as const

export const FH12_20S_0_5SH_55_ = (props: ConnectorProps) => {
  return (
    <connector
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C596730"
  ]
}}
      manufacturerPartNumber="FH12-20S-0.5SH(55)"
      footprint={<footprint>
        <smtpad portHints={["pin22"]} pcbX="-6.649974mm" pcbY="-1.43823055mm" width="1.7999964mm" height="2.1999956mm" shape="rect" />
<smtpad portHints={["pin21"]} pcbX="6.649974mm" pcbY="-1.43823055mm" width="1.7999964mm" height="2.1999956mm" shape="rect" />
<smtpad portHints={["pin20"]} pcbX="4.750054mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin19"]} pcbX="4.249928mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin18"]} pcbX="3.750056mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin17"]} pcbX="3.24993mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin16"]} pcbX="2.750058mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin15"]} pcbX="2.249932mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin14"]} pcbX="1.75006mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin13"]} pcbX="1.249934mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin12"]} pcbX="0.750062mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin11"]} pcbX="0.249936mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin10"]} pcbX="-0.249936mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin9"]} pcbX="-0.750062mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin8"]} pcbX="-1.249934mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin7"]} pcbX="-1.75006mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-2.249932mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-2.750058mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-3.24993mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-3.750056mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-4.249928mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-4.750054mm" pcbY="1.81322345mm" width="0.2999994mm" height="1.4500098mm" shape="rect" />
<silkscreenpath route={[{"x":6.569049600000085,"y":-0.1071689499999593},{"x":6.569049600000085,"y":1.203496449999875},{"x":5.334050800000114,"y":1.203496449999875}]} />
<silkscreenpath route={[{"x":6.569049600000085,"y":-4.437716550000232},{"x":6.569049600000085,"y":-2.769444550000003}]} />
<silkscreenpath route={[{"x":-6.568693999999937,"y":-4.437716550000232},{"x":-6.568693999999937,"y":-2.769444550000003}]} />
<silkscreenpath route={[{"x":-6.568693999999937,"y":-4.437716550000232},{"x":6.569049600000085,"y":-4.437716550000232}]} />
<silkscreenpath route={[{"x":-6.5699386,"y":0.06273164999981873},{"x":-6.5699386,"y":1.1625516499998412},{"x":-5.320283999999901,"y":1.1625516499998412}]} />
<silkscreentext text="{NAME}" pcbX="-0.000254mm" pcbY="3.75302345mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-7.79997220000007,"y":2.7882283499999403},{"x":7.79997220000007,"y":2.7882283499999403},{"x":7.79997220000007,"y":-4.680502950000005},{"x":-7.79997220000007,"y":-4.680502950000005},{"x":-7.79997220000007,"y":2.7882283499999403}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C596730.obj?uuid=713c50296573492cb96f0bb103f650ac",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C596730.step?uuid=713c50296573492cb96f0bb103f650ac",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: -12.400063000000124, y: 7.230509350000034, z: 0 },
      }}
      {...props}
    />
  )
}
