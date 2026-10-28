import { W25Q64JVZPIQ } from "../../imports/W25Q64JVZPIQ"
import { ECS400Crystal } from "./ecs-400-crystal"
import { LQP03TG2N7B02D } from "../../imports/LQP03TG2N7B02D"
import { LQG15HS2N0S02D } from "../../imports/LQG15HS2N0S02D"
import { LQW15AN24NG00D } from "../../imports/LQW15AN24NG00D"
import { GRM0335C1H1R5CA01D } from "../../imports/GRM0335C1H1R5CA01D"
import { CC0402JRNPO9BN150 } from "../../imports/CC0402JRNPO9BN150"
import { CC0603KRX7R9BB104 } from "../../imports/CC0603KRX7R9BB104"
import { CC0603KRX7R9BB103 } from "../../imports/CC0603KRX7R9BB103"
import { CL10A105KB8NNNC } from "../../imports/CL10A105KB8NNNC"
import { A_0603WAF0000T5E } from "../../imports/A_0603WAF0000T5E"
import { A_0603WAF1002T5E } from "../../imports/A_0603WAF1002T5E"
import { SchematicParts } from "./schematic-parts"

/** Espressif reference topology; clock/RF values require board measurements. */
export function R8Support() {
  return <>
    <schematicsheet name="R8Memory" displayName="8 MB external quad flash" sheetIndex={5}>
      <SchematicParts section="Flash" title="R8 external flash, 3.3 V memory domain">
        {/* Common regulated3.3 V feed avoids loading the internal typical14-ohm path.
            Espressif HW guide1.3.2 / TRM10.3.4.3 external-power option; never1.8 V mode. */}
        <A_0603WAF0000T5E name="R25" layer="bottom" schRotation={-90} pcbX={-6} pcbY={-4.5}
          connections={{ pin1: "net.VCORE3V3", pin2: "net.VDD_SPI" }} />
        <testpoint name="TP9" doNotPlace layer="bottom" footprintVariant="pad" padDiameter="1mm"
          pcbX={-6} pcbY={-7.5} connections={{ pin1: "net.VDD_SPI" }} />
        <W25Q64JVZPIQ name="U5" layer="bottom" pcbRotation={90} pcbX={-5} pcbY={0}
          connections={{ pin1: "net.FLASH_CS", pin2: "net.FLASH_IO1", pin3: "net.FLASH_IO2",
            pin4: "net.GND", pin5: "net.FLASH_IO0", pin6: "net.FLASH_CLK",
            pin7: "net.FLASH_IO3", pin8: "net.VDD_SPI", pin9: "net.GND" }} />
        {([
          ["SPICS0", "FLASH_CS"], ["SPICLK", "FLASH_CLK"], ["SPIQ", "FLASH_IO1"],
          ["SPID", "FLASH_IO0"], ["SPIWP", "FLASH_IO2"], ["SPIHD", "FLASH_IO3"],
        ] as const).map(([mcu, flash], i) => <A_0603WAF0000T5E key={mcu}
          name={`R${16+i}`} layer="bottom" pcbX={-11} pcbY={-6+2*i}
          connections={{ pin1: `net.${mcu}`, pin2: `net.${flash}` }} />)}
        {(["FLASH_CS", "FLASH_IO2", "FLASH_IO3"] as const).map((net, i) =>
          <A_0603WAF1002T5E key={net} name={`R${22+i}`} layer="bottom"
            pcbX={i === 0 ? -5 : -2} pcbY={i === 0 ? 5 : i === 1 ? 7 : -5}
            schRotation={270} connections={{ pin1: "net.VDD_SPI", pin2: `net.${net}` }} />)}
        <CC0603KRX7R9BB104 name="C21" layer="bottom" pcbX={-10} pcbY={6} schRotation={-90}
          connections={{ pin1: "net.VDD_SPI", pin2: "net.GND" }} />
        <CL10A105KB8NNNC name="C22" layer="bottom" pcbX={-5} pcbY={7.5} schRotation={-90}
          connections={{ pin1: "net.VDD_SPI", pin2: "net.GND" }} />
        <CC0603KRX7R9BB104 name="C23" layer="bottom" pcbX={-2} pcbY={5} schRotation={-90}
          connections={{ pin1: "net.VDD_SPI", pin2: "net.GND" }} />
      </SchematicParts>
    </schematicsheet>
    <schematicsheet name="R8ClockRF" displayName="External crystal, analog bypass and untuned RF" sheetIndex={6}>
      <SchematicParts section="ClockRF" title="R8 support — RF and clock tuning outstanding">
        <ECS400Crystal name="Y1" pcbX={-15} pcbY={7}
          connections={{ pin1: "net.XTAL_P", pin2: "net.GND", pin3: "net.XTAL_N", pin4: "net.GND" }} />
        <LQW15AN24NG00D name="L4" pcbX={-18.8} pcbY={5.9}
          connections={{ pin1: "net.XTAL_P_CHIP", pin2: "net.XTAL_P" }} />
        {/* 10 pF CL exact ECS option: 15/2 + assumed 2.5 pF stray. Tune on actual PCB. */}
        <CC0402JRNPO9BN150 name="C24" pcbX={-18} pcbY={7.5} schRotation={-90}
          connections={{ pin1: "net.XTAL_P", pin2: "net.GND" }} />
        <CC0402JRNPO9BN150 name="C25" pcbX={-12} pcbY={7.5} schRotation={-90}
          connections={{ pin1: "net.XTAL_N", pin2: "net.GND" }} />
        {/* 0201 CLC starting values within Espressif's ranges, not a tuned network. */}
        <GRM0335C1H1R5CA01D name="C14" pcbRotation={270} pcbX={-19.5} pcbY={3.6} schRotation={-90}
          connections={{ pin1: "net.RF_CHIP", pin2: "net.GND" }} />
        <LQP03TG2N7B02D name="L2" pcbRotation={180} pcbX={-21} pcbY={3.6}
          connections={{ pin1: "net.RF_CHIP", pin2: "net.RF_MATCHED" }} />
        <GRM0335C1H1R5CA01D name="C15" pcbRotation={270} pcbX={-22.5} pcbY={3.3} schRotation={-90}
          connections={{ pin1: "net.RF_MATCHED", pin2: "net.GND" }} />
        <LQG15HS2N0S02D name="L3" pcbRotation={180} layer="bottom" pcbX={-22} pcbY={1}
          connections={{ pin1: "net.VCORE3V3", pin2: "net.VDD_RF" }} />
        <CL10A105KB8NNNC name="C16" pcbX={-21.5} pcbY={7} schRotation={-90}
          connections={{ pin1: "net.VDD_RF", pin2: "net.GND" }} />
        <CL10A105KB8NNNC name="C17" layer="bottom" pcbX={-18} pcbY={6.5} schRotation={-90}
          connections={{ pin1: "net.VCORE3V3", pin2: "net.GND" }} />
        <CC0603KRX7R9BB103 name="C18" layer="bottom" pcbX={-18} pcbY={4.5} schRotation={-90}
          connections={{ pin1: "net.VCORE3V3", pin2: "net.GND" }} />
        <CC0603KRX7R9BB104 name="C19" layer="bottom" pcbRotation={180} pcbX={-14} pcbY={6.2} schRotation={-90}
          connections={{ pin1: "net.VCORE3V3", pin2: "net.GND" }} />
        <CC0603KRX7R9BB104 name="C20" layer="bottom" pcbX={-14} pcbY={-4.5} schRotation={-90}
          connections={{ pin1: "net.VCORE3V3", pin2: "net.GND" }} />
      </SchematicParts>
    </schematicsheet>
  </>
}
