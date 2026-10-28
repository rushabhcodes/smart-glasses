import type { ChipProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["N_CS"],
  pin2: ["DO_IO1"],
  pin3: ["IO2"],
  pin4: ["GND"],
  pin5: ["DI_IO0"],
  pin6: ["CLK"],
  pin7: ["IO3"],
  pin8: ["VCC"],
  pin9: ["EP"]
} as const

const pinAttributes = {
  pin4: {requiresGround: true},
  pin8: {requiresPower: true}
} as const

export const W25Q64JVZPIQ = (props: ChipProps<typeof pinLabels>) => {
  return (
    <chip
      pinLabels={pinLabels}
      pinAttributes={pinAttributes}
      supplierPartNumbers={{
  "jlcpcb": [
    "C2940197"
  ]
}}
      manufacturerPartNumber="W25Q64JVZPIQ"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-1.905mm" pcbY="-3.012694mm" width="0.5809996mm" height="1.2755118mm" radius="0.2904998mm" shape="pill" />
<smtpad portHints={["pin2"]} pcbX="-0.635mm" pcbY="-3.012694mm" width="0.5809996mm" height="1.2755118mm" radius="0.2904998mm" shape="pill" />
<smtpad portHints={["pin3"]} pcbX="0.635mm" pcbY="-3.012694mm" width="0.5809996mm" height="1.2755118mm" radius="0.2904998mm" shape="pill" />
<smtpad portHints={["pin4"]} pcbX="1.905mm" pcbY="-3.012694mm" width="0.5809996mm" height="1.2755118mm" radius="0.2904998mm" shape="pill" />
<smtpad portHints={["pin8"]} pcbX="-1.905mm" pcbY="3.012694mm" width="0.5809996mm" height="1.2755118mm" radius="0.2904998mm" shape="pill" />
<smtpad portHints={["pin7"]} pcbX="-0.635mm" pcbY="3.012694mm" width="0.5809996mm" height="1.2755118mm" radius="0.2904998mm" shape="pill" />
<smtpad portHints={["pin6"]} pcbX="0.635mm" pcbY="3.012694mm" width="0.5809996mm" height="1.2755118mm" radius="0.2904998mm" shape="pill" />
<smtpad portHints={["pin5"]} pcbX="1.905mm" pcbY="3.012694mm" width="0.5809996mm" height="1.2755118mm" radius="0.2904998mm" shape="pill" />
<smtpad portHints={["pin9"]} pcbX="0mm" pcbY="0mm" width="4.2999914mm" height="3.3999932mm" shape="rect" />
<silkscreenpath route={[{"x":-2.5761949999999842,"y":-3.0761939999999868},{"x":-2.5761949999999842,"y":3.0761939999999868}]} />
<silkscreenpath route={[{"x":2.5761949999999842,"y":3.0761939999999868},{"x":2.5761949999999842,"y":-3.0761939999999868}]} />
<silkscreencircle pcbX="-1.905mm" pcbY="-3.950462mm" radius="0.100076mm" />
<silkscreentext text="{NAME}" pcbX="0.0127mm" pcbY="4.3528mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-2.7499950000001263,"y":3.9004499000000123},{"x":2.749994999999899,"y":3.9004499000000123},{"x":2.749994999999899,"y":-3.9004499000000123},{"x":-2.7499950000001263,"y":-3.9004499000000123},{"x":-2.7499950000001263,"y":3.9004499000000123}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2940197.obj?uuid=aeccbecea0df4df4a2a68061a89a4c8e",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C2940197.step?uuid=aeccbecea0df4df4a2a68061a89a4c8e",
        pcbRotationOffset: 90,
        modelOriginPosition: { x: 0, y: 0, z: 0 },
      }}
      {...props}
    />
  )
}