import type { CapacitorProps } from "@tscircuit/props"

export const CL21A226MAQNNNE = (props: Omit<CapacitorProps, "capacitance">) => {
  const { name = "C1", ...restProps } = props

  return (
    <capacitor
      name={name}
      capacitance="22uF"
      supplierPartNumbers={{
  "jlcpcb": [
    "C45783"
  ]
}}
      manufacturerPartNumber="CL21A226MAQNNNE"
      footprint="cap_p2mm_pw1.41mm_ph1.35mm_cyw3.91mm_cyh1.85mm"
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C45783.obj?uuid=b87ab0c5465a48b3a1c9a6dac8d30bc5",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C45783.step?uuid=b87ab0c5465a48b3a1c9a6dac8d30bc5",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0, y: -0.000012700000070253736, z: -0.65 },
      }}
      {...restProps}
    />
  )
}