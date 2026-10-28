import type { PushButtonProps } from "@tscircuit/props"

const pinLabels = {
  pin1: ["pin1"],
  pin2: ["pin2"]
} as const

export const A_1TS015B_2300_0453_CT = (props: PushButtonProps<typeof pinLabels>) => {
  const { name = "SW1", ...restProps } = props

  return (
    <pushbutton
      name={name}
      pinLabels={pinLabels}
      supplierPartNumbers={{
  "jlcpcb": [
    "C398741"
  ]
}}
      manufacturerPartNumber="1TS015B-2300-0453-CT"
      footprint={<footprint>
        <smtpad portHints={["pin2"]} pcbX="1.599946mm" pcbY="0mm" width="0.999998mm" height="1.524mm" shape="rect" />
<smtpad portHints={["pin1"]} pcbX="-1.599946mm" pcbY="0mm" width="0.999998mm" height="1.524mm" shape="rect" />
<silkscreenpath route={[{"x":-1.5239237999999204,"y":-1.0160000000000764},{"x":1.5240762000000814,"y":-1.0160000000000764}]} />
<silkscreenpath route={[{"x":-1.5239237999999204,"y":1.0160000000000764},{"x":1.5240762000000814,"y":1.0160000000000764}]} />
<silkscreenpath route={[{"x":0.5080507999998645,"y":-0.2540000000000191},{"x":0.5676251535996926,"y":-0.02148241201609835},{"x":0.5258346508092018,"y":0.21487978082598147},{"x":0.39014295808078714,"y":0.4128729545799388},{"x":0.18478423071928773,"y":0.5371360843695356},{"x":-0.05356503920722844,"y":0.565476124139991},{"x":-0.282336341364271,"y":0.4928316223656566},{"x":-0.4606717635667792,"y":0.332176683081002},{"x":-0.556721100167465,"y":0.11220382733017686},{"x":-0.5533302093519978,"y":-0.12780041052451452},{"x":-0.4511046946985289,"y":-0.34497194752350424},{"x":-0.26830174607925983,"y":-0.5005245569673207},{"x":-0.037569456814708246,"y":-0.5666769795942628},{"x":0.19988403411866784,"y":-0.5316145784764785},{"x":0.4016501999998354,"y":-0.40159940000000915}]} />
<silkscreentext text="{NAME}" pcbX="-0.012954mm" pcbY="2.016mm" anchorAlignment="center" fontSize="1mm" />
<courtyardoutline outline={[{"x":-2.3499449999999342,"y":1.2499979999998914},{"x":2.3499449999999342,"y":1.2499979999998914},{"x":2.3499449999999342,"y":-1.2499979999998914},{"x":-2.3499449999999342,"y":-1.2499979999998914},{"x":-2.3499449999999342,"y":1.2499979999998914}]} />
      </footprint>}
      cadModel={{
        objUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C398741.obj?uuid=f5e3b425a98e405abe1489b4110a5501",
        stepUrl: "https://modelcdn.tscircuit.com/easyeda_models/assets/C398741.step?uuid=f5e3b425a98e405abe1489b4110a5501",
        pcbRotationOffset: 0,
        modelOriginPosition: { x: -0.000012699999842880061, y: 0, z: -0.01 },
      }}
      {...restProps}
    />
  )
}