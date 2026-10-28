import schematicPlacement from "./schematic-placement.json"
import { Esp32S3R8Core } from "../components/esp32-s3-r8"
import { A_0603WAF1002T5E } from "../../imports/A_0603WAF1002T5E"
import { A_0603WAF0000T5E } from "../../imports/A_0603WAF0000T5E"
import { R8Support } from "../components/r8-support"
import { U_FL_R_SMT_10_ } from "../../imports/U_FL_R_SMT_10_"
import { CL21A226MAQNNNE } from "../../imports/CL21A226MAQNNNE"
import { CC0603KRX7R9BB104 } from "../../imports/CC0603KRX7R9BB104"
import { CL10A105KB8NNNC } from "../../imports/CL10A105KB8NNNC"
import { MainControls } from "../components/main-controls"
import { MainPower } from "../components/main-power"
import { MainMicrophone } from "../components/main-microphone"
import { FrameInterconnect } from "../components/frame-interconnect"
import { SchematicParts } from "../components/schematic-parts"

/** Provisional narrow review coupon. No measured fit or routed RF geometry. */
export default function MainBoard() {
  return <board title="Left compact R8 board / SCHEMATIC REVIEW" width="80mm" height="18mm" manualEdits={schematicPlacement} layers={4} isViaInPadAllowed routingDisabled>
    <schematicsheet name="MainCore" displayName="S3R8 core - nominal 3.3 V" sheetIndex={0}>
      <SchematicParts section="Core" title="Compact R8 core">
        <Esp32S3R8Core />
        {/* GPIO3 has no internal bias. High chooses USB JTAG when strap selection is enabled. */}
        <A_0603WAF1002T5E name="R26" layer="bottom" pcbX={-23.5} pcbY={-2} schRotation={270}
          connections={{ pin1: "net.VCORE3V3", pin2: "net.STRAP_GPIO3" }} />
        <CL21A226MAQNNNE name="C1" maxVoltageRating="25V" schRotation={-90}
          pcbX={-21} pcbY={1} connections={{ pin1: "net.VCORE3V3", pin2: "net.GND" }} />
        <CC0603KRX7R9BB104 name="C2" pcbRotation={180} maxVoltageRating="50V" schRotation={-90}
          layer="bottom" pcbX={-19} pcbY={1} connections={{ pin1: "net.VDD_RF", pin2: "net.GND" }} />
        <A_0603WAF1002T5E name="R1" layer="bottom" schRotation={270}
          pcbX={-21} pcbY={4} connections={{ pin1: "net.VCORE3V3", pin2: "net.MCU_EN" }} />
        <CL10A105KB8NNNC name="C3" layer="bottom" pcbRotation={180} maxVoltageRating="50V" schRotation={-90}
          pcbX={-21} pcbY={7} connections={{ pin1: "net.MCU_EN", pin2: "net.GND" }} />
        <A_0603WAF1002T5E name="R2" schRotation={270}
          pcbX={-8.5} pcbY={1} connections={{ pin1: "net.VCORE3V3", pin2: "net.BOOT_N" }} />
        <A_0603WAF1002T5E name="R3" schRotation={90}
          pcbX={-8.5} pcbY={3.5} connections={{ pin1: "net.STRAP_GPIO46", pin2: "net.GND" }} />
        <A_0603WAF1002T5E name="R4" schRotation={90}
          pcbX={-8.5} pcbY={6} connections={{ pin1: "net.STRAP_GPIO45", pin2: "net.GND" }} />
        {(["VCORE3V3", "GND", "UART0_TX", "UART0_RX", "MCU_EN", "BOOT_N"] as const).map((net, i) => (
          <testpoint key={net} name={`TP${i + 1}`} doNotPlace footprintVariant="pad" padDiameter="1mm"
            pcbX={-5 + 2.5 * (i % 2)} pcbY={6 - 3 * Math.floor(i / 2)}
            connections={{ pin1: `net.${net}` }} />
        ))}
        {/* External RF connector; R8 chip CLC network is on the support sheet. Untuned. */}
        <A_0603WAF0000T5E name="R13" pcbRotation={180} pcbX={-26} pcbY={0}
          connections={{ pin1: "net.RF_MATCHED", pin2: "net.RF_ANTENNA" }} />
        <U_FL_R_SMT_10_ name="J2" pcbX={-36} pcbY={0}
          connections={{ pin1: "net.GND", pin2: "net.RF_ANTENNA", pin3: "net.GND" }} />
      </SchematicParts>
    </schematicsheet>
    <R8Support />
    <MainControls />
    <MainPower />
    <MainMicrophone />
    <FrameInterconnect side="main" />
    {/* Camera carrier, antenna selection and matched RF routing remain open. */}
    {/* USB and PSRAM/SPICS1 reserved; VDD_SPI feeds the external quad flash. */}
  </board>
}
