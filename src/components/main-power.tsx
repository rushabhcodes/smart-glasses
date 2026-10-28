import { TPS63070RNMR } from "../../imports/TPS63070RNMR"
import { XFL4020_152MEC } from "../../imports/XFL4020_152MEC"
import { RT0603BRD07100KL } from "../../imports/RT0603BRD07100KL"
import { RT0603BRD07312KL } from "../../imports/RT0603BRD07312KL"
import { CL21A226MAQNNNE } from "../../imports/CL21A226MAQNNNE"
import { CC0603KRX7R9BB104 } from "../../imports/CC0603KRX7R9BB104"
import { SchematicParts } from "./schematic-parts"

/** TPS63070 data-sheet application, nominal 3.3 V for the PICO SiP and ICS-43434. */
export function MainPower() {
  return (
    <schematicsheet name="MainPower" displayName="Switched VSYS to regulated 3.3 V" sheetIndex={2}>
      <SchematicParts section="Regulator" title="3.3 V buck-boost">
        <TPS63070RNMR name="U2" schWidth={2.34} schHeight={1.8} pcbX={5} pcbY={1}
          noConnect={["pin6"]}
          connections={{
            pin1: "net.GND", pin2: "net.CORE_POWER_GOOD", pin3: "net.REG_VAUX", pin4: "net.GND",
            pin5: "net.REG_FB", pin7: "net.VCORE3V3", pin8: "net.VCORE3V3", pin9: "net.REG_L2",
            pin10: "net.GND", pin11: "net.REG_L1", pin12: "net.VSYS", pin13: "net.VSYS",
            pin14: "net.VSYS", pin15: "net.GND",
          }} />
        {/* Forced PWM (PS/SYNC low) uses the specified ±1% reference accuracy. */}
        <XFL4020_152MEC name="L1" schRotation={180} pcbX={10} pcbY={1}
          connections={{ pin1: "net.REG_L1", pin2: "net.REG_L2" }} />
        <RT0603BRD07312KL name="R9" schRotation={270}
          pcbX={4} pcbY={-5}
          connections={{ pin1: "net.VCORE3V3", pin2: "net.REG_FB" }} />
        <RT0603BRD07100KL name="R10" schRotation={90}
          pcbX={8} pcbY={-5}
          connections={{ pin1: "net.REG_FB", pin2: "net.GND" }} />
        <RT0603BRD07100KL name="R11" schRotation={270} pcbX={1} pcbY={-5}
          connections={{ pin1: "net.VCORE3V3", pin2: "net.CORE_POWER_GOOD" }} />
        <CC0603KRX7R9BB104 name="C5" maxVoltageRating="50V" schRotation={-90}
          pcbX={5} pcbY={-2} connections={{ pin1: "net.REG_VAUX", pin2: "net.GND" }} />
        <CL21A226MAQNNNE name="C6" maxVoltageRating="25V" schRotation={-90}
          pcbX={1} pcbY={1} connections={{ pin1: "net.VSYS", pin2: "net.GND" }} />
        <CL21A226MAQNNNE name="C7" maxVoltageRating="25V" schRotation={-90}
          pcbX={1} pcbY={4.5} connections={{ pin1: "net.VSYS", pin2: "net.GND" }} />
        <CL21A226MAQNNNE name="C8" maxVoltageRating="25V" schRotation={-90}
          pcbX={15} pcbY={0} connections={{ pin1: "net.VCORE3V3", pin2: "net.GND" }} />
        <CL21A226MAQNNNE name="C9" maxVoltageRating="25V" schRotation={-90}
          pcbX={15} pcbY={3} connections={{ pin1: "net.VCORE3V3", pin2: "net.GND" }} />
        <CL21A226MAQNNNE name="C10" maxVoltageRating="25V" schRotation={-90}
          pcbX={15} pcbY={6} connections={{ pin1: "net.VCORE3V3", pin2: "net.GND" }} />
        <testpoint name="TP7" doNotPlace footprintVariant="pad" padDiameter="1mm"
          pcbX={10} pcbY={5} connections={{ pin1: "net.VSYS" }} />
        <testpoint name="TP8" doNotPlace footprintVariant="pad" padDiameter="1mm"
          pcbX={10} pcbY={-4} connections={{ pin1: "net.CORE_POWER_GOOD" }} />
      </SchematicParts>
    </schematicsheet>
  )
}
