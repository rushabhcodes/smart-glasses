import { Children, cloneElement, isValidElement, type ReactNode } from "react"

export type PcbPlacementOverrides = Readonly<Record<string, {x:number;y:number}>>
export type SheetPcbProps = {pcbOffsetX?:number;pcbPlacements?:PcbPlacementOverrides}

/** Keep review symbols individually grouped while retaining explicit PCB review positions. */
export function SchematicParts({ section, title, children, pcbOffsetX = 0, pcbPlacements }: {
  section: string
  title: string
  pcbOffsetX?: number
  pcbPlacements?: PcbPlacementOverrides
  children: ReactNode
}) {
  return (
    <>
      <schematicsection name={section} displayName={title} sectionTitleFontSize={0.3} />
      {Children.toArray(children).map((part, index) => (
        <group key={index} name={`${section}Part${index}`} pcbX={pcbOffsetX} pcbY={0} schX={0} schY={0}
          schLayout={{ layoutMode: "none" }}>
          {isValidElement<{name?:string;pcbX?:number;pcbY?:number}>(part) && part.props.name && pcbPlacements?.[part.props.name]
            ? cloneElement(part, {pcbX:pcbPlacements[part.props.name].x-pcbOffsetX,pcbY:pcbPlacements[part.props.name].y})
            : part}
        </group>
      ))}
    </>
  )
}
