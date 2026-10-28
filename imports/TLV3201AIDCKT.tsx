import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["OUT"],
  pin2: ["GND"],
  pin3: ["INP"],
  pin4: ["INM"],
  pin5: ["VCC"]
} as const

export const TLV3201AIDCKT = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={{pin2:{requiresGround:true},pin5:{requiresPower:true,shouldHaveDecouplingCapacitor:true}}}
      symbol={
        <symbol>
          <schematicpath points={[{"x":-0.8,"y":-0.8},{"x":0.8,"y":0},{"x":-0.8,"y":0.8},{"x":-0.8,"y":-0.8}]} strokeColor="#880000" />
          <schematicpath points={[{"x":-0.64,"y":0.4},{"x":-0.4,"y":0.4}]} strokeColor="#880000" />
          <schematicpath points={[{"x":-0.64,"y":-0.4},{"x":-0.4,"y":-0.4}]} strokeColor="#880000" />
          <schematicpath points={[{"x":-0.52,"y":0.28},{"x":-0.52,"y":0.52}]} strokeColor="#880000" />
          <schematicpath points={[{"x":0,"y":0.8},{"x":0,"y":0.4}]} strokeColor="#880000" />
          <schematicpath points={[{"x":0,"y":-0.4},{"x":0,"y":-0.8}]} strokeColor="#880000" />
          <port name="pin2" pinNumber={2} aliases={["GND"]} direction="down" schX={0.0} schY={-1.6} schStemLength={0.8} />
          <port name="pin3" pinNumber={3} aliases={["INP"]} direction="left" schX={-1.6} schY={0.4} schStemLength={0.8} />
          <port name="pin4" pinNumber={4} aliases={["INM"]} direction="left" schX={-1.6} schY={-0.4} schStemLength={0.8} />
          <port name="pin5" pinNumber={5} aliases={["VCC"]} direction="up" schX={0.0} schY={1.6} schStemLength={0.8} />
          <port name="pin1" pinNumber={1} aliases={["OUT"]} direction="right" schX={1.6} schY={0.0} schStemLength={0.8} />
          <schematictext schX={0.0} schY={2.04} text="{NAME}" fontSize={0.2} anchor="bottom_center" />
        </symbol>
      }
      supplierPartNumbers={{
  "jlcpcb": [
    "C133590"
  ]
}}
      manufacturerPartNumber="TLV3201AIDCKT"
      // TI DCK0005A drawing4214834/G: 0.4x0.95 lands,0.65 pitch,2.2 row centers (rotated90deg).
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-0.65mm" pcbY="-1.1mm" width="0.4mm" height="0.95mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="0mm" pcbY="-1.1mm" width="0.4mm" height="0.95mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="0.65mm" pcbY="-1.1mm" width="0.4mm" height="0.95mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="0.65mm" pcbY="1.1mm" width="0.4mm" height="0.95mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-0.65mm" pcbY="1.1mm" width="0.4mm" height="0.95mm" shape="rect" />
<silkscreenpath route={[{"x":-1.143000000000029,"y":0.5080000000000382},{"x":-1.0316971999999396,"y":0.5080000000000382}]} />
<silkscreenpath route={[{"x":-0.2683256000000256,"y":0.5080000000000382},{"x":0.2683256000001393,"y":0.5080000000000382}]} />
<silkscreenpath route={[{"x":1.031697200000167,"y":0.5080000000000382},{"x":1.143000000000029,"y":0.5080000000000382},{"x":1.143000000000029,"y":-0.5079999999999245},{"x":1.031697200000167,"y":-0.5079999999999245}]} />
<silkscreenpath route={[{"x":-1.0316971999999396,"y":-0.5079999999999245},{"x":-1.143000000000029,"y":-0.5079999999999245},{"x":-1.143000000000029,"y":0.5080000000000382}]} />
<silkscreencircle pcbX="-1.2599924mm" pcbY="-1.0700004mm" radius="0.1199896mm" />
<silkscreentext text="{NAME}" pcbX="-0.1143mm" pcbY="2.2446mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-1.2499979999998914,"y":1.4999594000000798},{"x":1.2499980000001187,"y":1.4999594000000798},{"x":1.2499980000001187,"y":-1.499959399999966},{"x":-1.2499979999998914,"y":-1.499959399999966},{"x":-1.2499979999998914,"y":1.4999594000000798}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C133590.obj?uuid=cb969c45c1dd4fed98451329f3c3c26e",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C133590.step?uuid=cb969c45c1dd4fed98451329f3c3c26e",
        pcbRotationOffset: 90,
        modelOriginPosition: { x: 0, y: 0, z: -0.049083 },
      }}
      {...props}
    />
  )
}