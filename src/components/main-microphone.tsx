import { TLV3201AIDCKR } from "../../imports/TLV3201AIDCKR"
import { RT0603BRD07100KL } from "../../imports/RT0603BRD07100KL"
import { ICS_43434 } from "../../imports/ICS_43434"
import { CC0603KRX7R9BB104 } from "../../imports/CC0603KRX7R9BB104"
import { A_0603WAF1003T5E } from "../../imports/A_0603WAF1003T5E"
import { SchematicParts } from "./schematic-parts"

/** Left-slot 24-bit Philips I2S, 16 kHz / 64 BCLK per frame; no MCLK. */
export function MainMicrophone() {
  return <schematicsheet name="Microphone" displayName="ICS-43434 I2S microphone" sheetIndex={3}>
    <SchematicParts section="Mic" title="Bottom-port microphone">
      <ICS_43434 name="U3" pcbX={-30} pcbY={4}
        connections={{ pin1: "net.AUDIO_LRCLK", pin2: "net.GND", pin3: "net.GND",
          pin4: "net.AUDIO_BCLK", pin5: "net.VCORE3V3", pin6: "net.MIC_SD_RAW" }} />
      <CC0603KRX7R9BB104 name="C11" maxVoltageRating="50V" schRotation={-90}
        pcbX={-34} pcbY={4} connections={{ pin1: "net.VCORE3V3", pin2: "net.GND" }} />
      <A_0603WAF1003T5E name="R12" schRotation={90}
        pcbX={-35} pcbY={7} connections={{ pin1: "net.MIC_SD_RAW", pin2: "net.GND" }} />
      {/* Reconstruct SD at half-supply: mic guaranteed 0.35/0.65 VDD does not meet S3 0.25/0.75 thresholds. */}
      <TLV3201AIDCKR name="U4" pcbX={-25} pcbY={4}
        connections={{ pin1: "net.MIC_SD", pin2: "net.GND", pin3: "net.MIC_SD_RAW",
          pin4: "net.MIC_REF_HALF", pin5: "net.VCORE3V3" }} />
      <CC0603KRX7R9BB104 name="C12" pcbRotation={180} maxVoltageRating="50V" schRotation={-90}
        pcbX={-25} pcbY={1.7} connections={{ pin1: "net.VCORE3V3", pin2: "net.GND" }} />
      <RT0603BRD07100KL name="R14" schRotation={270} pcbX={-30} pcbY={7}
        connections={{ pin1: "net.VCORE3V3", pin2: "net.MIC_REF_HALF" }} />
      <RT0603BRD07100KL name="R15" schRotation={90} pcbX={-25} pcbY={7}
        connections={{ pin1: "net.MIC_REF_HALF", pin2: "net.GND" }} />
      <CC0603KRX7R9BB104 name="C13" pcbRotation={180} maxVoltageRating="50V" schRotation={-90}
        pcbX={-25} pcbY={-2} connections={{ pin1: "net.MIC_REF_HALF", pin2: "net.GND" }} />
    </SchematicParts>
  </schematicsheet>
}
