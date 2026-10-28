import { Esp32S3Wroom1uCoreModule } from "../components/esp32-s3-wroom-1u"
import { A_0603WAF1002T5E } from "../../imports/A_0603WAF1002T5E"
import { CL21A226MAQNNNE } from "../../imports/CL21A226MAQNNNE"
import { CC0603KRX7R9BB104 } from "../../imports/CC0603KRX7R9BB104"
import { CL10A105KB8NNNC } from "../../imports/CL10A105KB8NNNC"
import { MainControls } from "../components/main-controls"
import { MainPower } from "../components/main-power"

/** Bench schematic; board space and placement are for review, not temple fit. */
export default function MainBoard() {
  return (
    <board title="Left board - power and compute / SCHEMATIC REVIEW" width="60mm" height="30mm" layers={2} routingDisabled>
      <schematicsheet name="MainCore" displayName="ESP32-S3 core - regulated 3.2 V" sheetIndex={0}>
        <schematicsection name="Core" displayName="ESP32-S3 core" sectionTitleFontSize={0.3} />
        <group name="U1Position" schX={0} schY={0} pcbX={0} pcbY={0} schLayout={{ layoutMode: "none" }}>
          <Esp32S3Wroom1uCoreModule />
        </group>

        {/* JLCPCB-imported candidates; assembly review and effective MLCC capacitance remain open. */}
        <group name="C1Position" schX={0} schY={0} pcbX={0} pcbY={0} schLayout={{ layoutMode: "none" }}>
          <CL21A226MAQNNNE name="C1" maxVoltageRating="25V"
            schSectionName="Core" schRotation={-90} schX={-14} schY={8}
            pcbX={-27} pcbY={9.5} connections={{ pin1: "net.VCORE3V2", pin2: "net.GND" }} />
        </group>
        <group name="C2Position" schX={0} schY={0} pcbX={0} pcbY={0} schLayout={{ layoutMode: "none" }}>
          <CC0603KRX7R9BB104 name="C2" maxVoltageRating="50V"
            schSectionName="Core" schRotation={-90} schX={-10} schY={8}
            pcbX={-27} pcbY={7} connections={{ pin1: "net.VCORE3V2", pin2: "net.GND" }} />
        </group>
        <group name="TP1Position" schX={0} schY={0} pcbX={0} pcbY={0} schLayout={{ layoutMode: "none" }}>
          <testpoint name="TP1" doNotPlace footprintVariant="pad" padDiameter="1mm"
            schSectionName="Core" schX={-18} schY={10} pcbX={-2} pcbY={10}
            connections={{ pin1: "net.VCORE3V2" }} />
        </group>
        <group name="TP2Position" schX={0} schY={0} pcbX={0} pcbY={0} schLayout={{ layoutMode: "none" }}>
          <testpoint name="TP2" doNotPlace footprintVariant="pad" padDiameter="1mm"
            schSectionName="Core" schX={-18} schY={5} pcbX={-2} pcbY={6}
            connections={{ pin1: "net.GND" }} />
        </group>

        <group name="R1Position" schX={0} schY={0} pcbX={0} pcbY={0} schLayout={{ layoutMode: "none" }}>
          <A_0603WAF1002T5E name="R1" schRotation={270}
            schSectionName="Core" schX={-15} schY={0} pcbX={-27} pcbY={1.8}
            connections={{ pin1: "net.VCORE3V2", pin2: "net.MCU_EN" }} />
        </group>
        <group name="C3Position" schX={0} schY={0} pcbX={0} pcbY={0} schLayout={{ layoutMode: "none" }}>
          <CL10A105KB8NNNC name="C3" maxVoltageRating="50V" schRotation={-90}
            schSectionName="Core" schX={-11} schY={-2} pcbX={-27} pcbY={4.6}
            connections={{ pin1: "net.MCU_EN", pin2: "net.GND" }} />
        </group>
        <group name="TP5Position" schX={0} schY={0} pcbX={0} pcbY={0} schLayout={{ layoutMode: "none" }}>
          <testpoint name="TP5" doNotPlace footprintVariant="pad" padDiameter="1mm"
            schSectionName="Core" schX={-18} schY={-3} pcbX={-2} pcbY={-6}
            connections={{ pin1: "net.MCU_EN" }} />
        </group>

        <group name="R2Position" schX={0} schY={0} pcbX={0} pcbY={0} schLayout={{ layoutMode: "none" }}>
          <A_0603WAF1002T5E name="R2" pcbRotation={180} schRotation={270}
            schSectionName="Core" schX={-16} schY={-10} pcbX={-1.5} pcbY={-8}
            connections={{ pin1: "net.VCORE3V2", pin2: "net.BOOT_N" }} />
        </group>
        <group name="R3Position" schX={0} schY={0} pcbX={0} pcbY={0} schLayout={{ layoutMode: "none" }}>
          <A_0603WAF1002T5E name="R3" schRotation={90}
            schSectionName="Core" schX={-12} schY={-10} pcbX={-23} pcbY={-11.5}
            connections={{ pin1: "net.STRAP_GPIO46", pin2: "net.GND" }} />
        </group>
        <group name="R4Position" schX={0} schY={0} pcbX={0} pcbY={0} schLayout={{ layoutMode: "none" }}>
          <A_0603WAF1002T5E name="R4" pcbRotation={180} schRotation={90}
            schSectionName="Core" schX={-8} schY={-10} pcbX={-10} pcbY={-11.5}
            connections={{ pin1: "net.STRAP_GPIO45", pin2: "net.GND" }} />
        </group>
        <group name="TP6Position" schX={0} schY={0} pcbX={0} pcbY={0} schLayout={{ layoutMode: "none" }}>
          <testpoint name="TP6" doNotPlace footprintVariant="pad" padDiameter="1mm"
            schSectionName="Core" schX={-18} schY={-14} pcbX={-2} pcbY={-10}
            connections={{ pin1: "net.BOOT_N" }} />
        </group>

        <group name="TP3Position" schX={0} schY={0} pcbX={0} pcbY={0} schLayout={{ layoutMode: "none" }}>
          <testpoint name="TP3" doNotPlace footprintVariant="pad" padDiameter="1mm"
            schSectionName="Core" schX={12} schY={7} pcbX={-2} pcbY={2}
            connections={{ pin1: "net.UART0_TX" }} />
        </group>
        <group name="TP4Position" schX={0} schY={0} pcbX={0} pcbY={0} schLayout={{ layoutMode: "none" }}>
          <testpoint name="TP4" doNotPlace footprintVariant="pad" padDiameter="1mm"
            schSectionName="Core" schX={12} schY={3} pcbX={-2} pcbY={-2}
            connections={{ pin1: "net.UART0_RX" }} />
        </group>
      </schematicsheet>
      <MainControls />
      <MainPower />
      {/* TODO: Camera, mic, FPC and RF/mechanical integration. */}
      {/* USB IO19/IO20 are reserved/unconnected; no USB connector or protection circuit yet. */}
      {/* TP1 monitors the regulated 3.2 V output; never apply raw LiPo/VSYS/5 V there. */}
    </board>
  )
}
