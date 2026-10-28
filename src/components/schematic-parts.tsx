import { Children, type ReactNode } from "react"

/** Let schematic sections arrange each part while retaining explicit PCB review positions. */
export function SchematicParts({ section, title, children }: {
  section: string
  title: string
  children: ReactNode
}) {
  return (
    <>
      <schematicsection name={section} displayName={title} sectionTitleFontSize={0.3} />
      {Children.toArray(children).map((part, index) => (
        <group key={index} name={`${section}Part${index}`} pcbX={0} pcbY={0} schX={0} schY={0}
          schLayout={{ layoutMode: "none" }}>
          {part}
        </group>
      ))}
    </>
  )
}
