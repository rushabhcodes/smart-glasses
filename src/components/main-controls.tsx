import { A_0603WAF1002T5E } from "../../imports/A_0603WAF1002T5E"
import { A_0603WAF1001T5E } from "../../imports/A_0603WAF1001T5E"
import { A_0603WAF1003T5E } from "../../imports/A_0603WAF1003T5E"
import { A_150060RS75000 } from "../../imports/A_150060RS75000"
import { A_1TS015B_2300_0453_CT } from "../../imports/A_1TS015B_2300_0453_CT"
import { CC0603KRX7R9BB104 } from "../../imports/CC0603KRX7R9BB104"
import { MMBT3904LT1G } from "../../imports/MMBT3904LT1G"
import { SchematicParts } from "./schematic-parts"

/** GPIO1 capture/PTT input and GPIO48 active-high recording indication. */
export function MainControls() {
  return (
    <schematicsheet name="MainControls" displayName="Capture button and recording indicator" sheetIndex={1}>
      <SchematicParts section="Controls" title="Controls">
        <A_0603WAF1002T5E name="R5" schSectionName="Controls" schRotation={270}
          pcbX={5.5} pcbY={-9}
          connections={{ pin1: "net.VCORE3V2", pin2: "net.USER_BUTTON" }} />
        <A_1TS015B_2300_0453_CT name="SW1" schSectionName="Controls" schRotation={-90}
          pcbX={10} pcbY={-9}
          connections={{ pin1: "net.USER_BUTTON", pin2: "net.GND" }} />
        <CC0603KRX7R9BB104 name="C4" maxVoltageRating="50V" schSectionName="Controls" schRotation={-90}
          pcbX={6} pcbY={-12}
          connections={{ pin1: "net.USER_BUTTON", pin2: "net.GND" }} />

        {/* The base pull-down holds the active-high LED driver off during reset. */}
        <A_0603WAF1002T5E name="R8" schSectionName="Controls" pcbX={14.5} pcbY={-9}
          connections={{ pin1: "net.REC_LED", pin2: "net.REC_LED_BASE" }} />
        <A_0603WAF1003T5E name="R7" schSectionName="Controls" schRotation={90}
          pcbX={21.5} pcbY={-9}
          connections={{ pin1: "net.REC_LED_BASE", pin2: "net.GND" }} />
        <MMBT3904LT1G name="Q1" schSectionName="Controls" pcbX={18} pcbY={-9}
          connections={{ pin1: "net.REC_LED_BASE", pin2: "net.GND", pin3: "net.REC_LED_CATHODE" }} />
        <A_0603WAF1001T5E name="R6" schSectionName="Controls" schRotation={270}
          pcbX={26} pcbY={-8}
          connections={{ pin1: "net.VCORE3V2", pin2: "net.REC_LED_ANODE" }} />
        <A_150060RS75000 name="LED1" schSectionName="Controls" schRotation={-90}
          pcbX={26} pcbY={-11}
          connections={{ pin1: "net.REC_LED_CATHODE", pin2: "net.REC_LED_ANODE" }} />
      </SchematicParts>
    </schematicsheet>
  )
}
