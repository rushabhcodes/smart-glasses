import { FH12_20S_0_5SH_55_ } from "../../imports/FH12_20S_0_5SH_55_"
import { SchematicParts } from "./schematic-parts"

// Same numbers at both boards. Physical cable orientation/hinge life still unverified.
export const frameSignals = ["GND", "VSYS", "VSYS", "GND", "VSYS", "VSYS", "GND",
  "VCORE3V3", "GND", "AUDIO_BCLK", "GND", "AUDIO_LRCLK", "GND", "AUDIO_DOUT",
  "GND", "CTRL_SCL", "CTRL_SDA", "TOUCH_OUT", "AMP_ENABLE", "GND"] as const

export function FrameInterconnect({ side, pcbX }: { side: "main" | "secondary"; pcbX?: number }) {
  const connections = Object.fromEntries(frameSignals.map((net, i) => [`pin${i + 1}`, `net.${net}`]))
  return <schematicsheet name="FrameCable" displayName="20-contact inter-board cable" sheetIndex={4}>
    <SchematicParts section="Frame" title="Frame cable">
      <FH12_20S_0_5SH_55_ name="J1" pcbX={pcbX ?? (side === "main" ? 34 : -34)}
        pcbY={0} pcbRotation={side === "main" ? 90 : 270} noConnect={["pin21", "pin22"]} connections={connections} />
    </SchematicParts>
  </schematicsheet>
}
