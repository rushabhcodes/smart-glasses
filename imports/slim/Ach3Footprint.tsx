// Derived via tsci convert from KiCad/kicad-footprints commit
// 7ebfa6b23cc292a56f751b7b5f4a0e12eeef69dd, Connector_JST.pretty.
// CC-BY-SA-4.0 with KiCad exception: see KiCad-LICENSE.md.
// Pads/numbering checked against JST eACH; converter courtyard/radius repaired.
import { type ConnectorProps } from "@tscircuit/props"
export const Ach3Footprint = (props: ConnectorProps) => (
  <connector
    footprint={<footprint insertionDirection="from_above">
        <smtpad portHints={["1"]} pcbX="-1.2mm" pcbY="1.875mm" layer="top" cornerRadius="0.15mm" width="0.6mm" height="0.85mm" shape="rect" />
<smtpad portHints={["2"]} pcbX="0mm" pcbY="1.875mm" layer="top" cornerRadius="0.15mm" width="0.6mm" height="0.85mm" shape="rect" />
<smtpad portHints={["3"]} pcbX="1.2mm" pcbY="1.875mm" layer="top" cornerRadius="0.15mm" width="0.6mm" height="0.85mm" shape="rect" />
<smtpad portHints={["MP"]} pcbX="-2.35mm" pcbY="-1.9mm" layer="top" cornerRadius="0.175mm" width="0.7mm" height="0.8mm" shape="rect" />
<smtpad portHints={["MP"]} pcbX="2.35mm" pcbY="-1.9mm" layer="top" cornerRadius="0.175mm" width="0.7mm" height="0.8mm" shape="rect" />
<silkscreenpath route={[{"x":-2.81,"y":-1.24},{"x":-2.81,"y":2.11}]} strokeWidth={0.12} />
<silkscreenpath route={[{"x":-2.81,"y":2.11},{"x":-1.76,"y":2.11}]} strokeWidth={0.12} />
<silkscreenpath route={[{"x":-1.76,"y":2.11},{"x":-1.76,"y":2.3}]} strokeWidth={0.12} />
<silkscreenpath route={[{"x":2.81,"y":-1.24},{"x":2.81,"y":2.11}]} strokeWidth={0.12} />
<silkscreenpath route={[{"x":2.81,"y":2.11},{"x":1.76,"y":2.11}]} strokeWidth={0.12} />
<silkscreenpath route={[{"x":-1.74,"y":-2.41},{"x":-0.79,"y":-2.41}]} strokeWidth={0.12} />
<silkscreenpath route={[{"x":-0.79,"y":-2.41},{"x":-0.39,"y":-1.91}]} strokeWidth={0.12} />
<silkscreenpath route={[{"x":-0.39,"y":-1.91},{"x":0.39,"y":-1.91}]} strokeWidth={0.12} />
<silkscreenpath route={[{"x":0.39,"y":-1.91},{"x":0.79,"y":-2.41}]} strokeWidth={0.12} />
<silkscreenpath route={[{"x":0.79,"y":-2.41},{"x":1.74,"y":-2.41}]} strokeWidth={0.12} />
<silkscreenpath route={[{"x":-1.45,"y":3.153553},{"x":-1.2,"y":2.8}]} strokeWidth={0.12} />
<silkscreenpath route={[{"x":-1.2,"y":2.8},{"x":-0.95,"y":3.153553}]} strokeWidth={0.12} />
<silkscreenpath route={[{"x":-0.95,"y":3.153553},{"x":-1.45,"y":3.153553}]} strokeWidth={0.12} />
<fabricationnotepath route={[{"x":-2.7,"y":2},{"x":2.7,"y":2}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-2.7,"y":-2.3},{"x":-0.9,"y":-2.3}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-0.9,"y":-2.3},{"x":-0.5,"y":-1.8}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-0.5,"y":-1.8},{"x":0.5,"y":-1.8}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":0.5,"y":-1.8},{"x":0.9,"y":-2.3}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":0.9,"y":-2.3},{"x":2.7,"y":-2.3}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-2.7,"y":2},{"x":-2.7,"y":-2.3}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":2.7,"y":2},{"x":2.7,"y":-2.3}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-1.7,"y":2},{"x":-1.2,"y":1.292893}]} strokeWidth={0.1} />
<fabricationnotepath route={[{"x":-1.2,"y":1.292893},{"x":-0.7,"y":2}]} strokeWidth={0.1} />
<fabricationnotetext pcbX={0} pcbY={-3.5} anchorAlignment="center" text="JST_ACH_BM03B-ACHSS-GAN-ETF_1x03-1MP_P1.20mm_Vertical" font="tscircuit2024" fontSize={1} />
<fabricationnotetext pcbX={0} pcbY={0} anchorAlignment="center" text="%R" font="tscircuit2024" fontSize={1} />
<silkscreentext pcbX={0} pcbY={3.5} anchorAlignment="center" fontSize={1} font="tscircuit2024" layer="top" text="REF**" />
        <courtyardoutline outline={[{"x":-3.2,"y":-2.8},{"x":3.2,"y":-2.8},{"x":3.2,"y":2.8},{"x":-3.2,"y":2.8}]} layer="top" />
      </footprint>}
    {...props}
  />
)
