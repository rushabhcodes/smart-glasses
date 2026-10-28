import { SN74LVC1G125DCKR } from "../../imports/SN74LVC1G125DCKR"
import { AT42QT1010_TSHR } from "../../imports/AT42QT1010_TSHR"
import { A_0603WAF1001T5E } from "../../imports/A_0603WAF1001T5E"
import { CC0603KRX7R9BB103 } from "../../imports/CC0603KRX7R9BB103"
import { CC0603KRX7R9BB104 } from "../../imports/CC0603KRX7R9BB104"
import { SchematicParts } from "./schematic-parts"

/** Low-power mode; Cs and final insulated electrode require enclosure tuning. */
export function SecondaryTouch() {
  return <schematicsheet name="Touch" displayName="Capacitive touch input" sheetIndex={0}>
    <SchematicParts section="Touch" title="Capacitive touch input">
      <AT42QT1010_TSHR name="U5" pcbX={32} pcbY={2}
        connections={{ pin1: "net.TOUCH_RAW", pin2: "net.GND", pin3: "net.TOUCH_SNSK", pin4: "net.TOUCH_SNS", pin5: "net.VCORE3V3", pin6: "net.GND" }} />
      <CC0603KRX7R9BB104 name="C25" pcbX={32} pcbY={6} schRotation={-90} maxVoltageRating="50V"
        connections={{ pin1: "net.VCORE3V3", pin2: "net.GND" }} />
      <CC0603KRX7R9BB103 name="C26" pcbX={37} pcbY={2} maxVoltageRating="50V"
        connections={{ pin1: "net.TOUCH_SNSK", pin2: "net.TOUCH_SNS" }} />
      <A_0603WAF1001T5E name="R26" pcbX={41} pcbY={2}
        connections={{ pin1: "net.TOUCH_SNSK", pin2: "net.TOUCH_ELECTRODE" }} />
      <testpoint name="TP21" pcbX={45} pcbY={2} doNotPlace footprintVariant="pad" padDiameter="3mm"
        connections={{ pin1: "net.TOUCH_ELECTRODE" }} />
      {/* TTL input thresholds accept QT1010's specified 2.3 V / 0.5 V output levels. */}
      <SN74LVC1G125DCKR name="U6" pcbX={32} pcbY={-3}
        connections={{ pin1: "net.GND", pin2: "net.TOUCH_RAW", pin3: "net.GND",
          pin4: "net.TOUCH_OUT", pin5: "net.VCORE3V3" }} />
      <CC0603KRX7R9BB104 name="C27" maxVoltageRating="50V" schRotation={-90}
        pcbX={36} pcbY={-3} connections={{ pin1: "net.VCORE3V3", pin2: "net.GND" }} />
    </SchematicParts>
  </schematicsheet>
}
