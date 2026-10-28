import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["OUT"],
  pin2: ["GND"],
  pin3: ["IN_POS"],
  pin4: ["IN_NEG"],
  pin5: ["VCC"]
} as const

const pinAttributes = {
  pin2: {requiresGround: true},
  pin5: {requiresPower: true}
} as const

export const TLV3201AIDCKR = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      showPinAliases={false}
      pinAttributes={pinAttributes}
      symbol={
        <symbol>
          <schematicpath points={[{"x":-0.4,"y":-0.4},{"x":0.4,"y":0},{"x":-0.4,"y":0.4},{"x":-0.4,"y":-0.4}]} strokeColor="#880000" />
          <schematicpath points={[{"x":-0.32,"y":0.2},{"x":-0.2,"y":0.2}]} strokeColor="#880000" />
          <schematicpath points={[{"x":-0.32,"y":-0.2},{"x":-0.2,"y":-0.2}]} strokeColor="#880000" />
          <schematicpath points={[{"x":-0.26,"y":-0.14},{"x":-0.26,"y":-0.26}]} strokeColor="#880000" />
          <schematicpath points={[{"x":0,"y":0.4},{"x":0,"y":0.2}]} strokeColor="#880000" />
          <schematicpath points={[{"x":0,"y":-0.2},{"x":0,"y":-0.4}]} strokeColor="#880000" />
          <port name="pin1" pinNumber={1} aliases={["OUT"]} direction="right" schX={0.8} schY={0} schStemLength={0.4} />
          <port name="pin2" pinNumber={2} aliases={["GND"]} direction="down" schX={0} schY={-0.8} schStemLength={0.4} />
          <port name="pin3" pinNumber={3} aliases={["IN_POS"]} direction="left" schX={-0.8} schY={-0.2} schStemLength={0.4} />
          <port name="pin4" pinNumber={4} aliases={["IN_NEG"]} direction="left" schX={-0.8} schY={0.2} schStemLength={0.4} />
          <port name="pin5" pinNumber={5} aliases={["VCC"]} direction="up" schX={0} schY={0.8} schStemLength={0.4} />
          <schematictext schX={0} schY={1.02} text="{NAME}" fontSize={0.2} anchor="bottom_center" />
        </symbol>
      }
      supplierPartNumbers={{
  "jlcpcb": [
    "C130037"
  ]
}}
      manufacturerPartNumber="TLV3201AIDCKR"
      footprint={<footprint>
        <smtpad portHints={["pin5"]} pcbX="1.100074mm" pcbY="0.649986mm" width="0.7999984mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="1.100074mm" pcbY="-0.649986mm" width="0.7999984mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="-1.100074mm" pcbY="-0.649986mm" width="0.7999984mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-1.100074mm" pcbY="-0mm" width="0.7999984mm" height="0.3999992mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-1.100074mm" pcbY="0.649986mm" width="0.7999984mm" height="0.3999992mm" shape="rect" />
<silkscreenpath route={[{"x":0.6999478000000181,"y":1.149959599999761},{"x":-0.7000240000000986,"y":1.149959599999761}]} />
<silkscreenpath route={[{"x":0.6999478000000181,"y":-1.1500612000000956},{"x":-0.7000240000000986,"y":-1.1500612000000956}]} />
<silkscreenpath route={[{"x":0.6999478000000181,"y":1.149959599999761},{"x":0.6999478000000181,"y":1.0580623999998124}]} />
<silkscreenpath route={[{"x":0.6999478000000181,"y":0.2419095999999854},{"x":0.6999478000000181,"y":-0.24196040000015273}]} />
<silkscreenpath route={[{"x":0.6999478000000181,"y":-1.0580878000000666},{"x":0.6999478000000181,"y":-1.1500612000000956}]} />
<silkscreenpath route={[{"x":-0.7000240000000986,"y":1.149959599999761},{"x":-0.7000240000000986,"y":1.0581131999999798}]} />
<silkscreenpath route={[{"x":-0.7000240000000986,"y":-1.058164000000147},{"x":-0.7000240000000986,"y":-1.1500612000000956}]} />
<silkscreencircle pcbX="-1.143mm" pcbY="1.27mm" radius="0.127mm" />
<silkscreentext text="{NAME}" pcbX="-0.079756mm" pcbY="2.393444mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-1.750073200000088,"y":1.2499725999998645},{"x":1.7500731999999743,"y":1.2499725999998645},{"x":1.7500731999999743,"y":-1.2500234000002592},{"x":-1.750073200000088,"y":-1.2500234000002592},{"x":-1.750073200000088,"y":1.2499725999998645}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C130037.obj?uuid=c7f70410144b4181a75d6c56456eaf60",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C130037.step?uuid=c7f70410144b4181a75d6c56456eaf60",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.000012700000070253736, y: 0.000025400000026820635, z: -0.1 },
      }}
      {...props}
    />
  )
}
