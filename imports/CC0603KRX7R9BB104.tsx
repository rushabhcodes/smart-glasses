import type { CapacitorProps } from "@tscircuit/props"

const pinAttributes = {
  pin2: {isPassive: true},
  pin1: {isPassive: true}
} satisfies NonNullable<CapacitorProps["pinAttributes"]>

export const CC0603KRX7R9BB104 = (props: Omit<CapacitorProps, "capacitance">) => {
  const { name = "C1", ...restProps } = props

  return (
    <capacitor
      name={name}
      capacitance="100nF"
      supplierPartNumbers={{
  "jlcpcb": [
    "C14663"
  ]
}}
      manufacturerPartNumber="CC0603KRX7R9BB104"
      pinAttributes={pinAttributes}
      footprint="cap_p1.4mm_pw0.8mm_ph0.9mm_cyw2.7mm_cyh1.4mm"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C14663.obj?uuid=ac9b32e974bc448eab36b1293f859dcb",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C14663.step?uuid=ac9b32e974bc448eab36b1293f859dcb",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: 0, z: -0.4 },
      }}
      {...restProps}
    />
  )
}