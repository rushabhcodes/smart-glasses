import { A_0603WAF1002T5E } from "../../imports/A_0603WAF1002T5E"
import { A_0603WAF1001T5E } from "../../imports/A_0603WAF1001T5E"
import { A_0603WAF1003T5E } from "../../imports/A_0603WAF1003T5E"
import { B2B_PH_K_S_LF__SN_ } from "../../imports/B2B_PH_K_S_LF__SN_"
import { CC0603KRX7R9BB104 } from "../../imports/CC0603KRX7R9BB104"
import { CL21A226MAQNNNE } from "../../imports/CL21A226MAQNNNE"
import { MAX98357AETE_T } from "../../imports/MAX98357AETE_T"
import { MMBT3904LT1G } from "../../imports/MMBT3904LT1G"
import { MMBT3906LT1G } from "../../imports/MMBT3906LT1G"
import { SchematicParts } from "./schematic-parts"

/** 3 dB gain, left I2S slot. PNP drives SD_MODE only from local VSYS, never directly from MCU. */
export function SecondaryAudio() {
  return <schematicsheet name="Audio" displayName="I2S amplifier and default-off control" sheetIndex={0}>
    <SchematicParts section="Audio" title="I2S amplifier and default-off control">
      <MAX98357AETE_T name="U4" pcbX={16} pcbY={2} noConnect={["pin5", "pin6", "pin12", "pin13"]}
        connections={{ pin1: "net.AUDIO_DOUT", pin2: "net.AMP_GAIN", pin3: "net.GND", pin4: "net.AMP_SD_MODE", pin7: "net.VSYS", pin8: "net.VSYS", pin9: "net.SPK_P", pin10: "net.SPK_N", pin11: "net.GND", pin14: "net.AUDIO_LRCLK", pin15: "net.GND", pin16: "net.AUDIO_BCLK", pin17: "net.GND" }} />
      <CC0603KRX7R9BB104 name="C22" pcbX={11} pcbY={4} schRotation={-90} maxVoltageRating="50V"
        connections={{ pin1: "net.VSYS", pin2: "net.GND" }} />
      <CL21A226MAQNNNE name="C23" pcbX={11} pcbY={0} schRotation={-90} maxVoltageRating="25V"
        connections={{ pin1: "net.VSYS", pin2: "net.GND" }} />
      <A_0603WAF1003T5E name="R23" pcbRotation={180} pcbX={16} pcbY={6} schRotation={270}
        connections={{ pin1: "net.VSYS", pin2: "net.AMP_GAIN" }} />
      <B2B_PH_K_S_LF__SN_ name="J4" pcbX={24} pcbY={5}
        connections={{ pin1: "net.SPK_P", pin2: "net.SPK_N" }} />
      <MMBT3904LT1G name="Q2" pcbX={4} pcbY={-4}
        connections={{ pin1: "net.AMP_NPN_BASE", pin2: "net.GND", pin3: "net.AMP_PNP_SINK" }} />
      <MMBT3906LT1G name="Q3" pcbX={16} pcbY={-4}
        connections={{ pin1: "net.AMP_PNP_BASE", pin2: "net.VSYS", pin3: "net.AMP_SD_MODE" }} />
      <A_0603WAF1001T5E name="R24" pcbX={0} pcbY={-4}
        connections={{ pin1: "net.AMP_ENABLE", pin2: "net.AMP_NPN_BASE" }} />
      <A_0603WAF1001T5E name="R25" pcbX={4} pcbY={-7} schRotation={90}
        connections={{ pin1: "net.AMP_NPN_BASE", pin2: "net.GND" }} />
      <A_0603WAF1002T5E name="R27" pcbRotation={180} pcbX={10} pcbY={-4}
        connections={{ pin1: "net.AMP_PNP_BASE", pin2: "net.AMP_PNP_SINK" }} />
      <A_0603WAF1003T5E name="R28" pcbX={16} pcbY={-7} schRotation={270}
        connections={{ pin1: "net.VSYS", pin2: "net.AMP_PNP_BASE" }} />
      <A_0603WAF1003T5E name="R29" pcbX={21} pcbY={-4} schRotation={90}
        connections={{ pin1: "net.AMP_SD_MODE", pin2: "net.GND" }} />
    </SchematicParts>
  </schematicsheet>
}
