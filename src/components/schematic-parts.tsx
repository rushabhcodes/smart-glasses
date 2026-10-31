import { Children, type ReactNode } from "react"

/** Keep review symbols individually grouped while retaining explicit PCB review positions. */
export function SchematicParts({ section, title, children, pcbOffsetX = 0 }: {
  section: string
  title: string
  pcbOffsetX?: number
  children: ReactNode
}) {
  return (
    <>
      <schematicsection name={section} displayName={title} sectionTitleFontSize={0.3} />
      {Children.toArray(children).map((part, index) => (
        <group key={index} name={`${section}Part${index}`} pcbX={pcbOffsetX} pcbY={0} schX={0} schY={0}
          schLayout={{ layoutMode: "none" }}>
          {part}
        </group>
      ))}
    </>
  )
}
