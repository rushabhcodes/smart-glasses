import type { CrystalProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["OSC1"],
  pin2: ["GND1"],
  pin3: ["OSC2"],
  pin4: ["GND2"]
} as const

const pinAttributes = {
  pin2: {requiresGround: true},
  pin4: {requiresGround: true}
} as const

export const ABM10W_40_0000MHZ_8_B1U_T3 = (props: Omit<CrystalProps<keyof typeof pinLabels>, "frequency" | "loadCapacitance">) => {
  return (
    <crystal
      frequency="40MHz"
      loadCapacitance="8pF"
      pinVariant="four_pin"
      pinAttributes={pinAttributes}
      symbol={
        <symbol>
          <port name="pin3" pinNumber={3} aliases={["X2", "OSC2"]} direction="right" schX={1.5} schY={0.5} schStemLength={0.2} />
          <port name="pin1" pinNumber={1} aliases={["X1", "OSC1"]} direction="left" schX={-1.5} schY={-0.5} schStemLength={0.2} />
          <schematicrect schX={0.0} schY={0.0} width={2} height={2} strokeWidth={0.02} color="#880000" />
          <port name="pin2" pinNumber={2} aliases={["GND1"]} direction="right" schX={1.5} schY={-0.5} schStemLength={0.2} />
          <port name="pin4" pinNumber={4} aliases={["GND2"]} direction="left" schX={-1.5} schY={0.5} schStemLength={0.2} />
          <schematicpath points={[{"x":0.15,"y":0.35000000000000003},{"x":0.15,"y":-0.35000000000000003},{"x":-0.15,"y":-0.35000000000000003},{"x":-0.15,"y":0.35000000000000003},{"x":0.15,"y":0.35000000000000003}]} strokeColor="#880011" />
          <schematicpath points={[{"x":-0.25,"y":-0.35000000000000003},{"x":-0.25,"y":0.35000000000000003}]} strokeColor="#880011" />
          <schematicpath points={[{"x":0.25,"y":-0.35000000000000003},{"x":0.25,"y":0.35000000000000003}]} strokeColor="#880011" />
          <schematicpath points={[{"x":-1.0,"y":-0.5},{"x":-0.5,"y":-0.5},{"x":-0.5,"y":0.0},{"x":-0.3,"y":0.0}]} strokeColor="#880011" />
          <schematicpath points={[{"x":1.0,"y":0.5},{"x":0.5,"y":0.5},{"x":0.5,"y":0.0},{"x":0.3,"y":0.0}]} strokeColor="#880011" />
          <schematicpath points={[{"x":-0.15,"y":-0.35000000000000003},{"x":-0.15,"y":0.35000000000000003},{"x":0.15,"y":0.35000000000000003},{"x":0.15,"y":-0.35000000000000003}]} strokeColor="#880011" />
          <schematicpath points={[{"x":0.25,"y":-0.2},{"x":0.25,"y":0.2}]} strokeColor="#880011" />
          <schematicpath points={[{"x":0.15,"y":-0.35000000000000003},{"x":-0.15,"y":-0.35000000000000003}]} strokeColor="#880011" />
          <schematicpath points={[{"x":-0.25,"y":-0.2},{"x":-0.25,"y":0.2}]} strokeColor="#880011" />
          <schematictext schX={0.0} schY={1.515} text="{NAME}" fontSize={0.2} anchor="bottom_center" />
        </symbol>
      }
      supplierPartNumbers={{
  "jlcpcb": [
    "C1985328"
  ]
}}
      manufacturerPartNumber="ABM10W-40.0000MHZ-8-B1U-T3"
      // Abracon rev2024-02-23 p3: correct imported oversize/pitch to1.2x0.85 lands,1.625x1.2 centers.
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-0.8125mm" pcbY="-0.6mm" width="1.2mm" height="0.85mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="0.8125mm" pcbY="-0.6mm" width="1.2mm" height="0.85mm" shape="rect" />
<smtpad portHints={["pin3"]} pcbX="0.8125mm" pcbY="0.6mm" width="1.2mm" height="0.85mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-0.8125mm" pcbY="0.6mm" width="1.2mm" height="0.85mm" shape="rect" />
<silkscreentext text="{NAME}" pcbX="-0.1143mm" pcbY="2.524mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{x:-1.6625,y:-1.325},{x:1.6625,y:-1.325},{x:1.6625,y:1.325},{x:-1.6625,y:1.325},{x:-1.6625,y:-1.325}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C1985328.obj?uuid=f88e6934b74b41a8bf87a127332ccf2b",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C1985328.step?uuid=f88e6934b74b41a8bf87a127332ccf2b",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: -0.000012700000070253736, y: 0, z: -0.01 },
      }}
      {...props}
    />
  )
}