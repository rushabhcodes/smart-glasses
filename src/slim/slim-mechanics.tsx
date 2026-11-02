import layout from "./layout.json"

export function SlimMechanics({ side }: { side: "main" | "secondary" }) {
  const b = layout.boards[side], s = layout.settings
  const tiles: {name:string;x0:number;x1:number;y0:number;y1:number}[] = b.stiffeners
  return <>
    {b.bends.map(bend => <group key={bend.name} name={`${bend.name}_MECHANICAL`} pcbX={bend.x} pcbY={0}>
      <pcbbend name={bend.name} x1={0} y1={-s.neckWidth/2} x2={0} y2={s.neckWidth/2}
        bendAngle={bend.angle} bendRadius={bend.radius} bendSide={bend.movingSide as "left" | "right"} />
      <keepout shape="rect" pcbX={0} pcbY={0} width={bend.zoneWidth} height={b.height}
        layers={["top","inner1","inner2","bottom"]} allowTraces />
    </group>)}
    {tiles.map(p => <pcbstiffener key={p.name} name={`STIFF_${p.name}`}
      shape="rect" pcbX={(p.x0+p.x1)/2} pcbY={(p.y0+p.y1)/2} width={p.x1-p.x0} height={p.y1-p.y0}
      layer="bottom" material="fr4" thickness={s.stiffenerThickness} adhesiveThickness={s.adhesiveThickness} />)}
  </>
}
