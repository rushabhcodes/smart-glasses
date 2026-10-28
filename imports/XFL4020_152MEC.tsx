import type { InductorProps } from "@tscircuit/props"

export const XFL4020_152MEC = (props: Omit<InductorProps, "inductance">) => {
  return (
    <inductor
      inductance="1.5uH"
      supplierPartNumbers={{
  "jlcpcb": [
    "C3033018"
  ]
}}
      manufacturerPartNumber="XFL4020-152MEC"
      footprint={<footprint>
        <smtpad portHints={["pin2"]} pcbX="1.199896mm" pcbY="0mm" width="0.999998mm" height="3.7999924mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-1.199896mm" pcbY="0mm" width="0.999998mm" height="3.7999924mm" shape="rect" />
<silkscreenpath route={[{"x":-2.0699984000000313,"y":-1.8899886000000379},{"x":-2.0699984000000313,"y":-2.0961858000000575},{"x":2.0824443999999858,"y":-2.0961858000000575},{"x":2.080005999999912,"y":-1.8999962000000323}]} />
<silkscreenpath route={[{"x":2.0699983999999176,"y":1.8999962000000323},{"x":2.0700999999999112,"y":2.0955000000000155},{"x":-2.08280000000002,"y":2.0955000000000155},{"x":-2.080006000000026,"y":1.8800064000000702}]} />
<silkscreentext text="{NAME}" pcbX="0mm" pcbY="3.0828mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-2.24999600000001,"y":2.24999600000001},{"x":2.24999600000001,"y":2.24999600000001},{"x":2.24999600000001,"y":-2.2499959999998964},{"x":-2.24999600000001,"y":-2.2499959999998964},{"x":-2.24999600000001,"y":2.24999600000001}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C3033018.obj?uuid=917e580a727645d0bd5a33a187108a81",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C3033018.step?uuid=917e580a727645d0bd5a33a187108a81",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0.000050000000000105516, z: 0 },
      }}
      {...props}
    />
  )
}