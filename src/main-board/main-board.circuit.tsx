import schematicPlacement from "./schematic-placement.json"
import { Esp32S3PicoCore } from "../components/esp32-s3-pico-1"
import { A_0603WAF1002T5E } from "../../imports/A_0603WAF1002T5E"
import { A_0603WAF0000T5E } from "../../imports/A_0603WAF0000T5E"
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
  return <board title="Left compact PICO board / SCHEMATIC REVIEW" width="80mm" height="18mm" manualEdits={schematicPlacement} layers={4} isViaInPadAllowed routingDisabled>
    <schematicsheet name="MainCore" displayName="PICO-1 N8R8 core - nominal 3.3 V" sheetIndex={0}>
      <SchematicParts section="Core" title="Compact SiP core">
        <Esp32S3PicoCore />
        <CL21A226MAQNNNE name="C1" maxVoltageRating="25V" schRotation={-90}
          pcbX={-21} pcbY={1} connections={{ pin1: "net.VCORE3V3", pin2: "net.GND" }} />
        <CC0603KRX7R9BB104 name="C2" maxVoltageRating="50V" schRotation={-90}
          pcbX={-15} pcbY={6.5} connections={{ pin1: "net.VCORE3V3", pin2: "net.GND" }} />
        <A_0603WAF1002T5E name="R1" schRotation={270}
          pcbX={-21} pcbY={4} connections={{ pin1: "net.VCORE3V3", pin2: "net.MCU_EN" }} />
        <CL10A105KB8NNNC name="C3" pcbRotation={180} maxVoltageRating="50V" schRotation={-90}
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
        {/* Figure 5-1 external RF path. Matching and 50-ohm routing are unverified. */}
        <A_0603WAF0000T5E name="R13" pcbRotation={180} pcbX={-26} pcbY={0}
          connections={{ pin1: "net.RF_SIP", pin2: "net.RF_ANTENNA" }} />
        <U_FL_R_SMT_10_ name="J2" pcbX={-36} pcbY={0}
          connections={{ pin1: "net.GND", pin2: "net.RF_ANTENNA", pin3: "net.GND" }} />
      </SchematicParts>
    </schematicsheet>
    <MainControls />
    <MainPower />
    <MainMicrophone />
    <FrameInterconnect side="main" />
    {/* Camera carrier, antenna selection and matched RF routing remain open. */}
    {/* USB, PSRAM/SPICS1 and VDD_SPI intentionally unconnected externally. */}
  </board>
}
