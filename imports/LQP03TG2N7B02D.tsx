import type { InductorProps } from "@tscircuit/props"

export const LQP03TG2N7B02D = (props: Omit<InductorProps, "inductance">) => {
  return (
    <inductor
      inductance="2.7nH"
      supplierPartNumbers={{
  "jlcpcb": [
    "C86109"
  ]
}}
      manufacturerPartNumber="LQP03TG2N7B02D"
      footprint={<footprint>
        <smtpad portHints={["pin1"]} pcbX="-0.27432mm" pcbY="0mm" width="0.368427mm" height="0.3240024mm" shape="rect" />
<smtpad portHints={["pin2"]} pcbX="0.27432mm" pcbY="0mm" width="0.368427mm" height="0.3240024mm" shape="rect" />
<silkscreenpath route={[{"x":-0.8889999999998963,"y":-0.2743199999998751},{"x":-0.8889999999998963,"y":0.2743199999999888}]} />
<silkscreenpath route={[{"x":0.16619220000006862,"y":-0.39060120000010556},{"x":0.5346446000000924,"y":-0.39060120000010556},{"x":0.6870446000000356,"y":-0.23820119999993494},{"x":0.6870446000000356,"y":0.23820120000004863},{"x":0.5346446000000924,"y":0.3906011999999919},{"x":0.16619220000006862,"y":0.3906011999999919}]} />
<silkscreenpath route={[{"x":-0.16619219999995494,"y":-0.39060120000010556},{"x":-0.534644599999865,"y":-0.39060120000010556},{"x":-0.687044599999922,"y":-0.23820119999993494},{"x":-0.687044599999922,"y":0.23820120000004863},{"x":-0.534644599999865,"y":0.3906011999999919},{"x":-0.16619219999995494,"y":0.3906011999999919}]} />
<silkscreentext text="{NAME}" pcbX="-0.09652mm" pcbY="1.381mm" anchorAlignment="center" fontSize="1mm" />
<fabricationnotepath route={[{"x":-0.5079999999998108,"y":-0.1270000000000664},{"x":-0.3809999999998581,"y":-0.1270000000000664},{"x":-0.3809999999998581,"y":0.1269999999999527},{"x":-0.5079999999998108,"y":0.1269999999999527},{"x":-0.5079999999998108,"y":-0.1270000000000664}]} strokeWidth="0mm" isFilled hasStroke={false} />
<courtyardoutline outline={[{"x":-0.7085335000000441,"y":0.4120011999999633},{"x":0.7085335000000441,"y":0.4120011999999633},{"x":0.7085335000000441,"y":-0.4120011999999633},{"x":-0.7085335000000441,"y":-0.4120011999999633},{"x":-0.7085335000000441,"y":0.4120011999999633}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C86109.obj?uuid=fa57e36e003e4ee2b14b14feaebd32e1",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C86109.step?uuid=fa57e36e003e4ee2b14b14feaebd32e1",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: -0.000012699999956566899, z: -0.01 },
      }}
      {...props}
    />
  )
}