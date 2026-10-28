import { A_0603WAF1002T5E } from "../../imports/A_0603WAF1002T5E"
import { A_0603WAF1003T5E } from "../../imports/A_0603WAF1003T5E"
import { A_0603WAF1872T5E } from "../../imports/A_0603WAF1872T5E"
import { A_0603WAF2211T5E } from "../../imports/A_0603WAF2211T5E"
import { A_0603WAF3092T5E } from "../../imports/A_0603WAF3092T5E"
import { A_0603WAF4701T5E } from "../../imports/A_0603WAF4701T5E"
import { A_0603WAF6802T5E } from "../../imports/A_0603WAF6802T5E"
import { B2B_PH_K_S_LF__SN_ } from "../../imports/B2B_PH_K_S_LF__SN_"
import { B3B_PH_K_S_LF__SN_ } from "../../imports/B3B_PH_K_S_LF__SN_"
import { BQ24075TRGTR } from "../../imports/BQ24075TRGTR"
import { CC0603KRX7R9BB102 } from "../../imports/CC0603KRX7R9BB102"
import { CC0603KRX7R9BB104 } from "../../imports/CC0603KRX7R9BB104"
import { CL10A105KB8NNNC } from "../../imports/CL10A105KB8NNNC"
import { CL21A226MAQNNNE } from "../../imports/CL21A226MAQNNNE"
import { JS102011SAQN } from "../../imports/JS102011SAQN"
import { TPS22965DSGR } from "../../imports/TPS22965DSGR"
import { SchematicParts } from "./schematic-parts"

/** Review circuit: 5 V +/-5%, 500 mA current-limited keyed bench input, protected 1S pack.
 * Charge defaults DISABLED. Enable only after cell/real attached NTC and thermal review.
 * TP31-to-TP32 service link enables charge; neither software nor a dummy NTC enables it.
 * BQ24075T OUT can reach input voltage (5.25 V here); it is not a 3.3 V regulator. */
export function SecondaryPower() {
  return <schematicsheet name="ChargePower" displayName="Bench charger and hardware power switch" sheetIndex={0}>
    <SchematicParts section="Power" title="Bench charger and hardware power switch">
      <BQ24075TRGTR name="U1" pcbX={-25} pcbY={0} noConnect={["pin7", "pin9"]}
        connections={{ pin1: "net.CHARGE_TS", pin2: "net.VBAT", pin3: "net.VBAT", pin4: "net.CHARGE_CE_N", pin5: "net.GND", pin6: "net.VOUT_ALWAYS", pin8: "net.GND", pin10: "net.VOUT_ALWAYS", pin11: "net.VOUT_ALWAYS", pin12: "net.CHARGE_ILIM", pin13: "net.CHARGE_5V", pin14: "net.CHARGE_TMR", pin15: "net.GND", pin16: "net.CHARGE_ISET", pin17: "net.GND" }} />
      <B3B_PH_K_S_LF__SN_ name="J2" pcbX={-35} pcbY={-5}
        connections={{ pin1: "net.VBAT", pin2: "net.GND", pin3: "net.PACK_NTC" }} />
      <B2B_PH_K_S_LF__SN_ name="J3" schWidth={0.6} schHeight={1} schPinArrangement={{ topSide: ["pin1"], bottomSide: ["pin2"] }} pcbX={-35} pcbY={5}
        connections={{ pin1: "net.CHARGE_5V", pin2: "net.GND" }} />
      <CL10A105KB8NNNC name="C30" pcbX={-31} pcbY={1} schRotation={-90} maxVoltageRating="50V"
        connections={{ pin1: "net.CHARGE_5V", pin2: "net.GND" }} />
      <CL21A226MAQNNNE name="C31" pcbX={-20} pcbY={1} schRotation={-90} maxVoltageRating="25V"
        connections={{ pin1: "net.VOUT_ALWAYS", pin2: "net.GND" }} />
      <CL21A226MAQNNNE name="C32" pcbRotation={180} pcbX={-30} pcbY={-1} schRotation={-90} maxVoltageRating="25V"
        connections={{ pin1: "net.VBAT", pin2: "net.GND" }} />
      <A_0603WAF2211T5E name="R30" pcbX={-27} pcbY={-4} schRotation={90}
        connections={{ pin1: "net.CHARGE_ISET", pin2: "net.GND" }} />
      <A_0603WAF6802T5E name="R31" pcbX={-23} pcbY={-4} schRotation={90}
        connections={{ pin1: "net.CHARGE_TMR", pin2: "net.GND" }} />
      <A_0603WAF4701T5E name="R32" pcbX={-20} pcbY={-7} schRotation={90}
        connections={{ pin1: "net.CHARGE_ILIM", pin2: "net.GND" }} />
      <A_0603WAF3092T5E name="R33" pcbX={-30} pcbY={7} schRotation={270}
        connections={{ pin1: "net.CHARGE_5V", pin2: "net.PACK_NTC" }} />
      <A_0603WAF1872T5E name="R34" pcbX={-27} pcbY={6} schRotation={90}
        connections={{ pin1: "net.PACK_NTC", pin2: "net.GND" }} />
      <A_0603WAF1003T5E name="R35" pcbX={-23} pcbY={6}
        connections={{ pin1: "net.PACK_NTC", pin2: "net.CHARGE_TS" }} />
      <A_0603WAF1002T5E name="R36" pcbX={-19} pcbY={6} schRotation={270}
        connections={{ pin1: "net.VOUT_ALWAYS", pin2: "net.CHARGE_CE_N" }} />
      <testpoint name="TP31" pcbX={-18} pcbY={3} doNotPlace footprintVariant="pad" padDiameter="1mm"
        connections={{ pin1: "net.CHARGE_CE_N" }} />
      <testpoint name="TP32" pcbX={-15} pcbY={3} doNotPlace footprintVariant="pad" padDiameter="1mm"
        connections={{ pin1: "net.GND" }} />
      <TPS22965DSGR name="U2" schWidth={1.23} pcbX={-6} pcbY={-2}
        connections={{ pin1: "net.VOUT_ALWAYS", pin2: "net.VOUT_ALWAYS", pin3: "net.SYSTEM_ON", pin4: "net.VOUT_ALWAYS", pin5: "net.GND", pin6: "net.SWITCH_CT", pin7: "net.VSYS", pin8: "net.VSYS", pin9: "net.GND" }} />
      <JS102011SAQN name="SW2" pcbX={-13} pcbY={-2}
        connections={{ pin1: "net.SWITCH_BIAS", pin2: "net.SYSTEM_ON", pin3: "net.GND" }} />
      <A_0603WAF1003T5E name="R37" pcbX={-4} pcbY={-7} schRotation={90}
        connections={{ pin1: "net.SYSTEM_ON", pin2: "net.GND" }} />
      <CC0603KRX7R9BB102 name="C33" pcbX={0} pcbY={-7} schRotation={-90} maxVoltageRating="50V"
        connections={{ pin1: "net.SWITCH_CT", pin2: "net.GND" }} />
      <CC0603KRX7R9BB104 name="C34" pcbX={-1} pcbY={-2} schRotation={-90} maxVoltageRating="50V"
        connections={{ pin1: "net.VOUT_ALWAYS", pin2: "net.GND" }} />
      <CL21A226MAQNNNE name="C35" pcbX={-1} pcbY={1} schRotation={-90} maxVoltageRating="25V"
        connections={{ pin1: "net.VSYS", pin2: "net.GND" }} />
      <A_0603WAF1002T5E name="R38" schRotation={270} pcbX={-14} pcbY={6}
        connections={{ pin1: "net.VOUT_ALWAYS", pin2: "net.SWITCH_BIAS" }} />
    </SchematicParts>
  </schematicsheet>
}
