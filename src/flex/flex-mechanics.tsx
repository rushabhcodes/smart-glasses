import layout from "./layout.json"
export type FlexSide = "main" | "secondary"
export function FlexMechanics({ side }: { side: FlexSide }) {
  const b = layout.boards[side],
    s = layout.settings
  return (
    <>
      {b.bends.map((bend) => (
        <group key={bend.name} name={`${bend.name}_MECHANICAL`} pcbX={0} pcbY={0}>
          <pcbbend
            name={bend.name}
            x1={bend.x}
            y1={-s.neckWidth / 2}
            x2={bend.x}
            y2={s.neckWidth / 2}
            bendAngle={bend.angle}
            bendRadius={bend.radius}
            bendSide={bend.movingSide as "left" | "right"}
          />
          <keepout
            shape="rect"
            pcbX={bend.x}
            pcbY={0}
            width={bend.zoneWidth}
            height={s.islandHeight}
            layers={["top", "inner1", "inner2", "bottom"]}
            allowTraces
          />
        </group>
      ))}
      {b.stiffeners.map((p) => (
        <pcbstiffener
          key={p.name}
          name={`STIFF_${p.name}`}
          shape="rect"
          pcbX={(p.x0 + p.x1) / 2}
          pcbY={(p.y0 + p.y1) / 2}
          width={p.x1 - p.x0}
          height={p.y1 - p.y0}
          layer="bottom"
          material="fr4"
          thickness={s.stiffenerThickness}
          adhesiveThickness={s.adhesiveThickness}
        />
      ))}
    </>
  )
}
