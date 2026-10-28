import { A_0603WAF4701T5E } from "../../imports/A_0603WAF4701T5E"
import { CC0603KRX7R9BB104 } from "../../imports/CC0603KRX7R9BB104"
import { MAX17048G_T10 } from "../../imports/MAX17048G_T10"
import { SchematicParts } from "./schematic-parts"

/** Gauge stays on VBAT; bus pull-ups use switched logic power to avoid off-state backfeed. */
export function SecondaryGauge() {
  return <schematicsheet name="Gauge" displayName="Always-on cell fuel gauge" sheetIndex={0}>
    <SchematicParts section="Gauge" title="Always-on cell fuel gauge">
      <MAX17048G_T10 name="U3" pcbX={-5} pcbY={3} noConnect={["pin5"]}
        connections={{ pin1: "net.GND", pin2: "net.VBAT", pin3: "net.VBAT", pin4: "net.GND", pin6: "net.GND", pin7: "net.CTRL_SCL", pin8: "net.CTRL_SDA", pin9: "net.GND" }} />
      <CC0603KRX7R9BB104 name="C21" pcbX={-9} pcbY={3} schRotation={-90} maxVoltageRating="50V"
        connections={{ pin1: "net.VBAT", pin2: "net.GND" }} />
      <A_0603WAF4701T5E name="R21" pcbRotation={180} pcbX={-5} pcbY={6} schRotation={270}
        connections={{ pin1: "net.VCORE3V3", pin2: "net.CTRL_SCL" }} />
      <A_0603WAF4701T5E name="R22" pcbX={-1} pcbY={6} schRotation={270}
        connections={{ pin1: "net.VCORE3V3", pin2: "net.CTRL_SDA" }} />
    </SchematicParts>
  </schematicsheet>
}
