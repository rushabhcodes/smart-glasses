import type { InductorProps } from "@tscircuit/props"

export const LQW15AN24NG00D = (props: Omit<InductorProps, "inductance">) => {
  return (
    <inductor
      inductance="24nH"
      supplierPartNumbers={{
  "jlcpcb": [
    "C167472"
  ]
}}
      manufacturerPartNumber="LQW15AN24NG00D"
      footprint={<footprint>
        <smtpad portHints={["pin2"]} pcbX="0.419989mm" pcbY="0mm" width="0.540004mm" height="0.540004mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-0.419989mm" pcbY="0mm" width="0.540004mm" height="0.540004mm" shape="rect" />
<silkscreenpath route={[{"x":-0.12687300000004598,"y":-0.5080000000000382},{"x":-0.9169654000000946,"y":-0.5080000000000382},{"x":-1.0693908000000647,"y":-0.3556253999998944},{"x":-1.0693908000000647,"y":0.3367785999998887},{"x":-0.9169654000000946,"y":0.4891532000000325},{"x":-0.12687300000004598,"y":0.4891532000000325}]} />
<silkscreenpath route={[{"x":0.12712699999997312,"y":-0.5080000000000382},{"x":0.9170669999998609,"y":-0.5080000000000382},{"x":1.0694670000000315,"y":-0.3555999999998676},{"x":1.0694670000000315,"y":0.32766000000003714},{"x":0.9069069999999329,"y":0.4902200000000221},{"x":0.12712699999997312,"y":0.4902200000000221}]} />
<silkscreentext text="{NAME}" pcbX="0mm" pcbY="1.4826mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-0.9399909999999636,"y":0.5200019999999768},{"x":0.9399909999998499,"y":0.5200019999999768},{"x":0.9399909999998499,"y":-0.5200019999999768},{"x":-0.9399909999999636,"y":-0.5200019999999768},{"x":-0.9399909999999636,"y":0.5200019999999768}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C167472.obj?uuid=c498e8771bc24312a11c6413631665a8",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C167472.step?uuid=c498e8771bc24312a11c6413631665a8",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: -0.000012700000070253736, z: -0.25 },
      }}
      {...props}
    />
  )
}