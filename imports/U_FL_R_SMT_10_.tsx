import type { ConnectorProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["GND2"],
  pin2: ["SIG"],
  pin3: ["GND1"]
} as const

const pinAttributes = {
  pin1: {requiresGround: true},
  pin3: {requiresGround: true}
} as const

export const U_FL_R_SMT_10_ = (props: ConnectorProps) => {
  return (
    <connector
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C434808"
  ]
}}
      manufacturerPartNumber="U.FL-R-SMT(10)"
      footprint={<footprint insertionDirection="from_above">
        <smtpad portHints={["pin3"]} pcbX="1.400048mm" pcbY="-0.36261675mm" width="0.7999984mm" height="2.1999956mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-0mm" pcbY="0.93760925mm" width="0.999998mm" height="1.0500106mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-1.400048mm" pcbY="-0.36261675mm" width="0.7999984mm" height="2.1999956mm" shape="rect" />
<silkscreenpath route={[{"x":0.8367267999998376,"y":-1.6626395499999944},{"x":-0.8367268000001786,"y":-1.6626395499999944}]} />
<silkscreenpath route={[{"x":0.7311135999998442,"y":0.9374060499999359},{"x":0.8367267999998376,"y":0.9374060499999359}]} />
<silkscreenpath route={[{"x":-0.8367268000001786,"y":0.9374060499999359},{"x":-0.7311136000000715,"y":0.9374060499999359}]} />
<silkscreenpath route={[{"x":-0.5377434000001813,"y":0.0855154500000026},{"x":-0.6584635755067438,"y":-0.12508837772622883},{"x":-0.6999966946732457,"y":-0.36425847000271006},{"x":-0.657347970286196,"y":-0.6032321491716175},{"x":-0.5356463526269408,"y":-0.8132703582820113},{"x":-0.34952772014469247,"y":-0.9691138299779141},{"x":-0.12137476367377076,"y":-1.052020774685957},{"x":0.1213747636734297,"y":-1.052020774685957},{"x":0.3495277201443514,"y":-0.9691138299779141},{"x":0.5356463526268271,"y":-0.8132703582820113},{"x":0.6573479702860823,"y":-0.6032321491716175},{"x":0.699996694673132,"y":-0.36425847000271006},{"x":0.6584635755066301,"y":-0.12508837772622883},{"x":0.5377433999998402,"y":0.0855154500000026}]} />
<silkscreencircle pcbX="-0mm" pcbY="-0.36261675mm" radius="0.22352mm" />
<silkscreentext text="{NAME}" pcbX="0.001524mm" pcbY="2.46618325mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-2.050047200000108,"y":1.712614550000012},{"x":2.0500471999999945,"y":1.712614550000012},{"x":2.0500471999999945,"y":-2.162499349999962},{"x":-2.050047200000108,"y":-2.162499349999962},{"x":-2.050047200000108,"y":1.712614550000012}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C434808.obj?uuid=b608ffd257624968b7f500f01fd0153b",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C434808.step?uuid=b608ffd257624968b7f500f01fd0153b",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.00018300000022741791, y: 0.3625024499999654, z: 0 },
      }}
      {...props}
    />
  )
}
