import type { ConnectorProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"],
  pin3: ["pin3"]
} as const

export const B3B_PH_K_S_LF__SN_ = (props: ConnectorProps) => {
  return (
    <connector
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C131339"
  ]
}}
      manufacturerPartNumber="B3B-PH-K-S(LF)(SN)"
      footprint={<footprint insertionDirection="from_above">
        <platedhole  portHints={["pin2"]} pcbX="0mm" pcbY="-0.550037mm" outerDiameter="1.5999968mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin1"]} pcbX="1.999996mm" pcbY="-0.550037mm" outerDiameter="1.5999968mm" holeDiameter="0.999998mm" shape="circle" />
<platedhole  portHints={["pin3"]} pcbX="-1.999996mm" pcbY="-0.550037mm" outerDiameter="1.5999968mm" holeDiameter="0.999998mm" shape="circle" />
<silkscreencircle pcbX="3.285998mm" pcbY="-1.566037mm" radius="0.359156mm" />
<silkscreenrect pcbX="0mm" pcbY="0mm" width="7.999984mm" height="4.500118mm" strokeWidth="0.254mm" />
<silkscreentext text="{NAME}" pcbX="0.0254mm" pcbY="3.396363mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-4.200004799999874,"y":2.514968799999906},{"x":4.199979400000075,"y":2.514968799999906},{"x":4.199979400000075,"y":-2.4850222000001168},{"x":-4.200004799999874,"y":-2.4850222000001168},{"x":-4.200004799999874,"y":2.514968799999906}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C131339.obj?uuid=dad20adf37e74a59b293d1ce4ac84f72",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C131339.step?uuid=dad20adf37e74a59b293d1ce4ac84f72",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: 0.000012699999956566899, y: -0.014473299999951506, z: -0.000006799999999973494 },
      }}
      {...props}
    />
  )
}
