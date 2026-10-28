import type { ResistorProps } from "@tscircuit/props"

const pinAttributes = {
  pin2: {isPassive: true},
  pin1: {isPassive: true}
} satisfies NonNullable<ResistorProps["pinAttributes"]>

export const A_0603WAF1002T5E = (props: Omit<ResistorProps, "resistance">) => {
  const { name = "R1", ...restProps } = props

  return (
    <resistor
      name={name}
      resistance="10kohm"
      supplierPartNumbers={{
  "jlcpcb": [
    "C25804"
  ]
}}
      manufacturerPartNumber="0603WAF1002T5E"
      pinAttributes={pinAttributes}
      footprint="res_p1.5067mm_pw0.8065mm_ph0.864mm_cyw2.8132mm_cyh1.364mm"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C25804.obj?uuid=6bd5cd867e9542ebae21caaf5d2d4c4d",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C25804.step?uuid=6bd5cd867e9542ebae21caaf5d2d4c4d",
        pcbRotationOffset: 90,
        modelOriginPosition: { x: -0.004999999999999977, y: 0, z: -0.01 },
      }}
      {...restProps}
    />
  )
}