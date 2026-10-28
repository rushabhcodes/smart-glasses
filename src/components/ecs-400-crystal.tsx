import type { CrystalProps } from "@tscircuit/props"

const envelope = {
  type: "cuboid", size: [2.1, 1.7, 0.5], center: [0, 0, 0.25],
}

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

export const ECS400Crystal = (props: Omit<CrystalProps<keyof typeof pinLabels>, "frequency" | "loadCapacitance">) => {
  return (
    <crystal
      frequency="40MHz"
      loadCapacitance="10pF"
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
    "C5357833"
  ]
}}
      manufacturerPartNumber="ECS-400-10-37B2-CKY-TR"
      // Official import has no EasyEDA component. Manufacturer ECX-1637B2 Rev2026 Fig2 defines these lands.
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX={-.675} pcbY={-.525} width={.85} height={.75} shape="rect" />
        <smtpad portHints={["pin2"]} pcbX={.675} pcbY={-.525} width={.85} height={.75} shape="rect" />
        <smtpad portHints={["pin3"]} pcbX={.675} pcbY={.525} width={.85} height={.75} shape="rect" />
        <smtpad portHints={["pin4"]} pcbX={-.675} pcbY={.525} width={.85} height={.75} shape="rect" />
        <silkscreentext text="{NAME}" pcbX={0} pcbY={1.5} anchorAlignment="center" fontSize="0.8mm" />
        <courtyardoutline outline={[{x:-1.35,y:-1.15},{x:1.35,y:-1.15},{x:1.35,y:1.15},{x:-1.35,y:1.15},{x:-1.35,y:-1.15}]} />
      </footprint>}
      // Simple maximum package envelope2.1x1.7x0.5mm, not an imported detailed manufacturer model.
      cadModel={{jscad: envelope}}
      {...props}
    />
  )
}