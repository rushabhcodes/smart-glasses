import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["WS"],
  pin2: ["LR"],
  pin3: ["GND"],
  pin4: ["SCK"],
  pin5: ["VDD"],
  pin6: ["SD"]
} as const

const pinAttributes = {
  pin3: {requiresGround: true, mustBeConnected: true},
  pin5: {requiresPower: true, mustBeConnected: true, shouldHaveDecouplingCapacitor: true, recommendedDecouplingCapacitorCapacitance: "100nF"},
  pin1: {isInput: true},
  pin2: {isInput: true, canUseInternalPulldown: true},
  pin4: {isInput: true},
  pin6: {isOutput: true, canUseTriState: true, needsExternalPulldown: true}
} satisfies NonNullable<ChipProps["pinAttributes"]>

// TDK DS-000069 rev1.2 Fig13: continuous copper annulus, ID1.025/OD1.625 mm.
// Four touching sectors represent one continuous ring; the imported copper had
// incorrectly copied the separated Fig14 stencil apertures. Final paste is still
// an assembly review gate: uniform -0.05 mm offset also reduces the outer diameter.
const acousticCenter = { x: 0.7650734, y: 0 }
function copperRingSector(quadrant: number) {
  const point = (radius: number, step: number) => {
    const angle = (quadrant + step / 32) * Math.PI / 2
    return { x: acousticCenter.x + radius * Math.cos(angle), y: acousticCenter.y + radius * Math.sin(angle) }
  }
  return [...Array.from({ length: 33 }, (_, i) => point(0.8125, i)),
    ...Array.from({ length: 33 }, (_, i) => point(0.5125, 32 - i))]
}

export const ICS_43434 = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C5656610"
  ]
}}
      manufacturerPartNumber="ICS-43434"
      footprint={<footprint>
        <hole pcbX="0.7650734mm" pcbY="-0mm" diameter="0.5mm" />
<smtpad portHints={["pin1"]} pcbX="-1.3071856mm" pcbY="-0.900049mm" solderPasteMargin={-0.05} width="0.522mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="-0.4852416mm" pcbY="-0.900049mm" solderPasteMargin={-0.05} width="0.522mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin4"]} pcbX="-0.4852416mm" pcbY="0.900049mm" solderPasteMargin={-0.05} width="0.522mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin5"]} pcbX="-1.3071856mm" pcbY="0.900049mm" solderPasteMargin={-0.05} width="0.522mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin6"]} pcbX="-1.3071856mm" pcbY="-0.000127mm" solderPasteMargin={-0.05} width="0.522mm" height="0.5999988mm" shape="rect" />
<smtpad portHints={["pin3"]} shape="polygon" points={copperRingSector(0)} solderPasteMargin={-0.05} />
<smtpad portHints={["pin3"]} shape="polygon" points={copperRingSector(1)} solderPasteMargin={-0.05} />
<smtpad portHints={["pin3"]} shape="polygon" points={copperRingSector(2)} solderPasteMargin={-0.05} />
<smtpad portHints={["pin3"]} shape="polygon" points={copperRingSector(3)} solderPasteMargin={-0.05} />
<silkscreenpath route={[{"x":1.864715599999954,"y":-1.4000479999999698},{"x":-1.735251800000242,"y":-1.3999972000000298}]} />
<silkscreenpath route={[{"x":-1.7852390000000469,"y":1.399971800000003},{"x":-1.7852390000000469,"y":-1.4000479999999698}]} />
<silkscreenpath route={[{"x":-1.7852390000000469,"y":1.399971800000003},{"x":1.864715599999954,"y":1.399971800000003},{"x":1.864715599999954,"y":-1.4000479999999698}]} />
<silkscreencircle pcbX="-1.3351256mm" pcbY="-1.799971mm" radius="0.119888mm" />
<silkscreentext text="{NAME}" pcbX="0.0415544mm" pcbY="2.403985mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-1.9397350000001552,"y":1.5749655999999277},{"x":2.060257999999749,"y":1.5749655999999277},{"x":2.060257999999749,"y":-1.5750418000001218},{"x":-1.9397350000001552,"y":-1.5750418000001218},{"x":-1.9397350000001552,"y":1.5749655999999277}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C5656610.obj?uuid=7098589742ce4a2fb4f80d2ad85dc714",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C5656610.step?uuid=7098589742ce4a2fb4f80d2ad85dc714",
        pcbRotationOffset: 90,
        modelOriginPosition: { x: 0.00003810000009707437, y: 0.0602614999997968, z: -0.02 },
      }}
      {...props}
    />
  )
}
