import type { PushButtonProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"],
  pin4: ["pin4"],
  pin5: ["pin5"]
} as const

export const KMR221GLFS = (props: PushButtonProps<typeof pinLabels>) => {
  const { name = "SW1", ...restProps } = props

  return (
    <pushbutton
      name={name}
      pinLabels={pinLabels}
      internallyConnectedPins={[[1,2],[3,4]]}
      pinAttributes={{pin5:{requiresGround:true}}}
      supplierPartNumbers={{
  "jlcpcb": [
    "C72443"
  ]
}}
      manufacturerPartNumber="KMR221GLFS"
      // C&K KMR2 pB-12,8Jun2016: correct imported oversize/offset lands and ground lug.
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-2.05mm" pcbY="0.8mm" width="0.9mm" height="1mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="2.05mm" pcbY="0.8mm" width="0.9mm" height="1mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-2.05mm" pcbY="-0.8mm" width="0.9mm" height="1mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="2.05mm" pcbY="-0.8mm" width="0.9mm" height="1mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="0mm" pcbY="1.425mm" width="1.7mm" height="0.55mm" shape="rect" />
<silkscreenpath route={[{"x":-1.0160000000000764,"y":0.24604980000003707},{"x":-1.0160000000000764,"y":-0.7699502000000393},{"x":1.0159999999999627,"y":-0.7699502000000393},{"x":1.0159999999999627,"y":0.24604980000003707},{"x":-1.0160000000000764,"y":0.24604980000003707}]} />
<silkscreenpath route={[{"x":1.574342799999954,"y":1.1380216000000019},{"x":1.2311380000001009,"y":1.1380216000000019}]} />
<silkscreenpath route={[{"x":-1.2311380000001009,"y":1.1380216000000019},{"x":-1.574342799999954,"y":1.1380216000000019}]} />
<silkscreenpath route={[{"x":2.099970399999961,"y":-0.24300180000000182},{"x":2.099970399999961,"y":-0.28089860000000044}]} />
<silkscreenpath route={[{"x":1.574342799999954,"y":-1.6619474000001446},{"x":-1.574342799999954,"y":-1.6619474000001446}]} />
<silkscreenpath route={[{"x":-2.0999704000000747,"y":-0.28089860000000044},{"x":-2.0999704000000747,"y":-0.24300180000000182}]} />
<silkscreentext text="{NAME}" pcbX="0mm" pcbY="2.6176498mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-3.049968999999919,"y":1.8620491000000357},{"x":3.0499689999998054,"y":1.8620491000000357},{"x":3.0499689999998054,"y":-1.9019905999998628},{"x":-3.049968999999919,"y":-1.9019905999998628},{"x":-3.049968999999919,"y":1.8620491000000357}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C72443.obj?uuid=40eb4b87cf0c4873966e77676402d6ca",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C72443.step?uuid=40eb4b87cf0c4873966e77676402d6ca",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: -0.026272 },
      }}
      {...restProps}
    />
  )
}