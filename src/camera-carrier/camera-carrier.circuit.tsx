import { cameraCarrierMechanics } from "./mechanical-contract"
import { AFC01_S24FCC_00 } from "../../imports/AFC01_S24FCC_00"
import { TLV75515PDBVR } from "../../imports/TLV75515PDBVR"
import { TLV75518PDBVR } from "../../imports/TLV75518PDBVR"
import { TPS799285DDCR } from "../../imports/TPS799285DDCR"
import { TCA9517DGKR } from "../../imports/TCA9517DGKR"
import { SN74AXC4T774PWR } from "../../imports/candidates/SN74AXC4T774PWR"
import { CC0603KRX7R9BB104 } from "../../imports/CC0603KRX7R9BB104"
import { CC0603KRX7R9BB103 } from "../../imports/CC0603KRX7R9BB103"
import { CL21A226MAQNNNE } from "../../imports/CL21A226MAQNNNE"
import { A_0603WAF1003T5E } from "../../imports/A_0603WAF1003T5E"
import { A_0603WAF1002T5E } from "../../imports/A_0603WAF1002T5E"
import { A_0603WAF4701T5E } from "../../imports/A_0603WAF4701T5E"

import type { PinAttributeMap } from "@tscircuit/props"
// The pinned props API requires every physical pin and alias in the attribute
// record. Populate the full audited label set; classify only documented roles.
function auditedAttributes<const Names extends readonly string[]>(names: Names,
  power: readonly Names[number][], ground: readonly Names[number][], nc: readonly Names[number][] = []
): Record<Names[number], PinAttributeMap> {
  return Object.fromEntries(names.map(name => [name, nc.includes(name) ? {doNotConnect:true}
    : power.includes(name) ? {requiresPower:true} : ground.includes(name) ? {requiresGround:true} : {}])) as Record<Names[number], PinAttributeMap>
}
const axcSupplyAttributes = auditedAttributes(["pin1", "pin2", "pin3", "pin4", "pin5", "pin6", "pin7", "pin8", "pin9", "pin10", "pin11", "pin12", "pin13", "pin14", "pin15", "pin16", "DIR1", "DIR2", "A1", "A2", "A3", "A4", "DIR3", "DIR4", "N_OE", "GND", "B4", "B3", "B2", "B1", "VCCB", "VCCA"] as const, ["pin15", "pin16", "VCCB", "VCCA"], ["pin10", "GND"], [])
const coreSupplyAttributes = auditedAttributes(["pin1", "pin2", "pin3", "pin4", "pin5", "IN", "GND", "EN", "NC", "OUT"] as const, ["pin1", "IN"], ["pin2", "GND"], ["pin4", "NC"])
const analogSupplyAttributes = auditedAttributes(["pin1", "pin2", "pin3", "pin4", "pin5", "IN", "GND", "EN", "NR", "OUT"] as const, ["pin1", "IN"], ["pin2", "GND"], [])
const sccbSupplyAttributes = auditedAttributes(["pin1", "pin2", "pin3", "pin4", "pin5", "pin6", "pin7", "pin8", "VCCA", "SCLA", "SDAA", "GND", "EN", "SDAB", "SCLB", "VCCB"] as const, ["pin1", "pin8", "VCCA", "VCCB"], ["pin4", "GND"], [])
const connectorSupplyAttributes = auditedAttributes(["pin1", "pin2", "pin3", "pin4", "pin5", "pin6", "pin7", "pin8", "pin9", "pin10", "pin11", "pin12", "pin13", "pin14", "pin15", "pin16", "pin17", "pin18", "pin19", "pin20", "pin21", "pin22", "pin23", "pin24", "pin25", "pin26"] as const, ["pin4", "pin10", "pin11"], ["pin2", "pin15", "pin23"], ["pin1", "pin25", "pin26"])

/** Independent default-off review carrier. Control pads require an external sequencer.
 * Not connected to the main flex, and not a qualified fabrication/AF assembly.
 * Freeze MJY5OAF-F3M-V1: the other OV5640 module variant has different contacts 23/24.
 */
export default function CameraCarrier() {
  return <board width={cameraCarrierMechanics.carrier.widthMm} height={cameraCarrierMechanics.carrier.heightMm} layers={4} thickness={cameraCarrierMechanics.carrier.thicknessMm} routingDisabled
    title="OV5640 AF carrier / EXTERNAL SEQUENCER REQUIRED / REVIEW ONLY">
    <schematicsheet name="CameraCarrier" displayName="OV5640 AF carrier and controlled interface" sheetIndex={0} sheetWidth="1000mm" sheetHeight="400mm">
    <AFC01_S24FCC_00 pinAttributes={connectorSupplyAttributes} name="J_CAM" pcbX={-24} pcbY={0} pcbRotation={90}
      noConnect={["pin1", "pin25", "pin26"]} connections={{
        pin2: "net.GND", pin3: "net.RAW_SDA", pin4: "net.CAM_AVDD",
        pin5: "net.RAW_SCL", pin6: "net.RAW_RESETB", pin7: "net.RAW_VSYNC",
        pin8: "net.RAW_PWDN", pin9: "net.RAW_HREF", pin10: "net.CAM_DVDD",
        pin11: "net.CAM_DOVDD", pin12: "net.RAW_D7", pin13: "net.RAW_XCLK",
        pin14: "net.RAW_D6", pin15: "net.GND", pin16: "net.RAW_D5",
        pin17: "net.RAW_PCLK", pin18: "net.RAW_D4", pin19: "net.RAW_D0",
        pin20: "net.RAW_D3", pin21: "net.RAW_D1", pin22: "net.RAW_D2",
        pin23: "net.GND", pin24: "net.AF_EXTERNAL_2V8",
      }} />
    <TLV75515PDBVR pinAttributes={coreSupplyAttributes} name="U_CORE" pcbX={24} pcbY={-5.5} noConnect={["pin4"]}
      connections={{pin1:"net.HOST_3V3",pin2:"net.GND",pin3:"net.EN_CORE",pin5:"net.CAM_DVDD"}} />
    <TLV75518PDBVR pinAttributes={coreSupplyAttributes} name="U_IO" pcbX={24} pcbY={0} noConnect={["pin4"]}
      connections={{pin1:"net.HOST_3V3",pin2:"net.GND",pin3:"net.EN_IO",pin5:"net.CAM_DOVDD"}} />
    <TPS799285DDCR pinAttributes={analogSupplyAttributes} name="U_ANALOG" pcbX={24} pcbY={5.5}
      connections={{pin1:"net.HOST_3V3",pin2:"net.GND",pin3:"net.EN_ANALOG",pin4:"net.ANALOG_NR",pin5:"net.CAM_AVDD"}} />
    <TCA9517DGKR pinAttributes={sccbSupplyAttributes} name="U_SCCB" pcbX={18.5} pcbY={4.5}
      connections={{pin1:"net.CAM_DOVDD",pin2:"net.RAW_SCL",pin3:"net.RAW_SDA",pin4:"net.GND",
        pin5:"net.SCCB_ENABLE_3V3",pin6:"net.HOST_SDA",pin7:"net.HOST_SCL",pin8:"net.HOST_3V3"}} />
    <SN74AXC4T774PWR pinAttributes={axcSupplyAttributes} name="U_DVP1" pcbX={-14} pcbY={-1} connections={{pin1: "net.CAM_DOVDD", pin2: "net.CAM_DOVDD", pin3: "net.RAW_D0", pin4: "net.RAW_D1", pin5: "net.RAW_D2", pin6: "net.RAW_D3", pin7: "net.CAM_DOVDD", pin8: "net.CAM_DOVDD", pin9: "net.CAM_OE_N_1V8", pin10: "net.GND", pin11: "net.HOST_D3", pin12: "net.HOST_D2", pin13: "net.HOST_D1", pin14: "net.HOST_D0", pin15: "net.HOST_3V3", pin16: "net.CAM_DOVDD"}} />
    <SN74AXC4T774PWR pinAttributes={axcSupplyAttributes} name="U_DVP2" pcbX={-5.5} pcbY={-1} connections={{pin1: "net.CAM_DOVDD", pin2: "net.CAM_DOVDD", pin3: "net.RAW_D4", pin4: "net.RAW_D5", pin5: "net.RAW_D6", pin6: "net.RAW_D7", pin7: "net.CAM_DOVDD", pin8: "net.CAM_DOVDD", pin9: "net.CAM_OE_N_1V8", pin10: "net.GND", pin11: "net.HOST_D7", pin12: "net.HOST_D6", pin13: "net.HOST_D5", pin14: "net.HOST_D4", pin15: "net.HOST_3V3", pin16: "net.CAM_DOVDD"}} />
    <SN74AXC4T774PWR pinAttributes={axcSupplyAttributes} name="U_DVP3" pcbX={3} pcbY={-1} connections={{pin1: "net.CAM_DOVDD", pin2: "net.CAM_DOVDD", pin3: "net.RAW_PCLK", pin4: "net.RAW_HREF", pin5: "net.RAW_VSYNC", pin6: "net.RAW_XCLK", pin7: "net.CAM_DOVDD", pin8: "net.GND", pin9: "net.CAM_OE_N_1V8", pin10: "net.GND", pin11: "net.HOST_XCLK", pin12: "net.HOST_VSYNC", pin13: "net.HOST_HREF", pin14: "net.HOST_PCLK", pin15: "net.HOST_3V3", pin16: "net.CAM_DOVDD"}} />
    <SN74AXC4T774PWR pinAttributes={axcSupplyAttributes} name="U_DVP4" pcbX={11.5} pcbY={-1} noConnect={["pin11", "pin12"]} connections={{pin1: "net.GND", pin2: "net.GND", pin3: "net.RAW_PWDN", pin4: "net.RAW_RESETB", pin5: "net.GND", pin6: "net.GND", pin7: "net.CAM_DOVDD", pin8: "net.CAM_DOVDD", pin9: "net.CAM_OE_N_1V8", pin10: "net.GND", pin13: "net.HOST_RESETB", pin14: "net.HOST_PWDN", pin15: "net.HOST_3V3", pin16: "net.CAM_DOVDD"}} />
    <CL21A226MAQNNNE name="C_IN_CORE" pcbX={-18.900} pcbY={-7.200} layer="bottom" maxVoltageRating="25V" connections={{pin1:"net.HOST_3V3",pin2:"net.GND"}} />
    <CL21A226MAQNNNE name="C_OUT_CORE" pcbX={-14.700} pcbY={-7.200} layer="bottom" maxVoltageRating="25V" connections={{pin1:"net.CAM_DVDD",pin2:"net.GND"}} />
    <CL21A226MAQNNNE name="C_IN_IO" pcbX={-10.500} pcbY={-7.200} layer="bottom" maxVoltageRating="25V" connections={{pin1:"net.HOST_3V3",pin2:"net.GND"}} />
    <CL21A226MAQNNNE name="C_OUT_IO" pcbX={-6.300} pcbY={-7.200} layer="bottom" maxVoltageRating="25V" connections={{pin1:"net.CAM_DOVDD",pin2:"net.GND"}} />
    <CL21A226MAQNNNE name="C_IN_ANALOG" pcbX={-2.100} pcbY={-7.200} layer="bottom" maxVoltageRating="25V" connections={{pin1:"net.HOST_3V3",pin2:"net.GND"}} />
    <CL21A226MAQNNNE name="C_OUT_ANALOG" pcbX={2.100} pcbY={-7.200} layer="bottom" maxVoltageRating="25V" connections={{pin1:"net.CAM_AVDD",pin2:"net.GND"}} />
    <CC0603KRX7R9BB103 name="C_NR" pcbX={6.300} pcbY={-7.200} layer="bottom" maxVoltageRating="50V" connections={{pin1:"net.ANALOG_NR",pin2:"net.GND"}} />
    <CC0603KRX7R9BB104 name="C_DVP1A" pcbX={10.500} pcbY={-7.200} layer="bottom" maxVoltageRating="50V" connections={{pin1:"net.CAM_DOVDD",pin2:"net.GND"}} />
    <CC0603KRX7R9BB104 name="C_DVP1B" pcbX={14.700} pcbY={-7.200} layer="bottom" maxVoltageRating="50V" connections={{pin1:"net.HOST_3V3",pin2:"net.GND"}} />
    <CC0603KRX7R9BB104 name="C_DVP2A" pcbX={18.900} pcbY={-7.200} layer="bottom" maxVoltageRating="50V" connections={{pin1:"net.CAM_DOVDD",pin2:"net.GND"}} />
    <CC0603KRX7R9BB104 name="C_DVP2B" pcbX={-18.900} pcbY={-3.600} layer="bottom" maxVoltageRating="50V" connections={{pin1:"net.HOST_3V3",pin2:"net.GND"}} />
    <CC0603KRX7R9BB104 name="C_DVP3A" pcbX={-14.700} pcbY={-3.600} layer="bottom" maxVoltageRating="50V" connections={{pin1:"net.CAM_DOVDD",pin2:"net.GND"}} />
    <CC0603KRX7R9BB104 name="C_DVP3B" pcbX={-10.500} pcbY={-3.600} layer="bottom" maxVoltageRating="50V" connections={{pin1:"net.HOST_3V3",pin2:"net.GND"}} />
    <CC0603KRX7R9BB104 name="C_DVP4A" pcbX={-6.300} pcbY={-3.600} layer="bottom" maxVoltageRating="50V" connections={{pin1:"net.CAM_DOVDD",pin2:"net.GND"}} />
    <CC0603KRX7R9BB104 name="C_DVP4B" pcbX={-2.100} pcbY={-3.600} layer="bottom" maxVoltageRating="50V" connections={{pin1:"net.HOST_3V3",pin2:"net.GND"}} />
    <CC0603KRX7R9BB104 name="C_SCCBA" pcbX={2.100} pcbY={-3.600} layer="bottom" maxVoltageRating="50V" connections={{pin1:"net.CAM_DOVDD",pin2:"net.GND"}} />
    <CC0603KRX7R9BB104 name="C_SCCBB" pcbX={6.300} pcbY={-3.600} layer="bottom" maxVoltageRating="50V" connections={{pin1:"net.HOST_3V3",pin2:"net.GND"}} />
    <CC0603KRX7R9BB104 name="C_CAM_CORE" pcbX={10.500} pcbY={-3.600} layer="bottom" maxVoltageRating="50V" connections={{pin1:"net.CAM_DVDD",pin2:"net.GND"}} />
    <CC0603KRX7R9BB104 name="C_CAM_IO" pcbX={14.700} pcbY={-3.600} layer="bottom" maxVoltageRating="50V" connections={{pin1:"net.CAM_DOVDD",pin2:"net.GND"}} />
    <CC0603KRX7R9BB104 name="C_CAM_AVDD" pcbX={18.900} pcbY={-3.600} layer="bottom" maxVoltageRating="50V" connections={{pin1:"net.CAM_AVDD",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_EN_CORE" pcbX={-18.900} pcbY={0.000} layer="bottom"  connections={{pin1:"net.EN_CORE",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_EN_IO" pcbX={-14.700} pcbY={0.000} layer="bottom"  connections={{pin1:"net.EN_IO",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_EN_ANALOG" pcbX={-10.500} pcbY={0.000} layer="bottom"  connections={{pin1:"net.EN_ANALOG",pin2:"net.GND"}} />
    <A_0603WAF1002T5E name="R_SCCB_OFF" pcbX={-6.300} pcbY={0.000} layer="bottom"  connections={{pin1:"net.SCCB_ENABLE_3V3",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_OE_OFF" pcbX={-2.100} pcbY={0.000} layer="bottom"  connections={{pin1:"net.CAM_DOVDD",pin2:"net.CAM_OE_N_1V8"}} />
    <A_0603WAF1003T5E name="R_PWDN_SAFE" pcbX={2.100} pcbY={0.000} layer="bottom"  connections={{pin1:"net.CAM_DOVDD",pin2:"net.RAW_PWDN"}} />
    <A_0603WAF1003T5E name="R_RESET_SAFE" pcbX={6.300} pcbY={0.000} layer="bottom"  connections={{pin1:"net.RAW_RESETB",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_CLOCK_SAFE" pcbX={10.500} pcbY={0.000} layer="bottom"  connections={{pin1:"net.RAW_XCLK",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_HOST_PWDN" pcbX={14.700} pcbY={0.000} layer="bottom"  connections={{pin1:"net.HOST_3V3",pin2:"net.HOST_PWDN"}} />
    <A_0603WAF1003T5E name="R_HOST_RESET" pcbX={18.900} pcbY={0.000} layer="bottom"  connections={{pin1:"net.HOST_RESETB",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_HOST_CLOCK" pcbX={-18.900} pcbY={3.600} layer="bottom"  connections={{pin1:"net.HOST_XCLK",pin2:"net.GND"}} />
    <A_0603WAF4701T5E name="R_ANALOG_BLEED" pcbX={-14.700} pcbY={3.600} layer="bottom"  connections={{pin1:"net.CAM_AVDD",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_AF_OFF" pcbX={-10.500} pcbY={3.600} layer="bottom"  connections={{pin1:"net.AF_EXTERNAL_2V8",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_RAW_D0" pcbX={-6.300} pcbY={3.600} layer="bottom"  connections={{pin1:"net.RAW_D0",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_RAW_D1" pcbX={-2.100} pcbY={3.600} layer="bottom"  connections={{pin1:"net.RAW_D1",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_RAW_D2" pcbX={2.100} pcbY={3.600} layer="bottom"  connections={{pin1:"net.RAW_D2",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_RAW_D3" pcbX={6.300} pcbY={3.600} layer="bottom"  connections={{pin1:"net.RAW_D3",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_RAW_D4" pcbX={10.500} pcbY={3.600} layer="bottom"  connections={{pin1:"net.RAW_D4",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_RAW_D5" pcbX={14.700} pcbY={3.600} layer="bottom"  connections={{pin1:"net.RAW_D5",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_RAW_D6" pcbX={18.900} pcbY={3.600} layer="bottom"  connections={{pin1:"net.RAW_D6",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_RAW_D7" pcbX={-18.900} pcbY={7.200} layer="bottom"  connections={{pin1:"net.RAW_D7",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_RAW_PCLK" pcbX={-14.700} pcbY={7.200} layer="bottom"  connections={{pin1:"net.RAW_PCLK",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_RAW_HREF" pcbX={-10.500} pcbY={7.200} layer="bottom"  connections={{pin1:"net.RAW_HREF",pin2:"net.GND"}} />
    <A_0603WAF1003T5E name="R_RAW_VSYNC" pcbX={-6.300} pcbY={7.200} layer="bottom"  connections={{pin1:"net.RAW_VSYNC",pin2:"net.GND"}} />
    <A_0603WAF1002T5E name="R_RAW_SDA" pcbX={-2.100} pcbY={7.200} layer="bottom"  connections={{pin1:"net.CAM_DOVDD",pin2:"net.RAW_SDA"}} />
    <A_0603WAF1002T5E name="R_HOST_SDA" pcbX={2.100} pcbY={7.200} layer="bottom"  connections={{pin1:"net.HOST_3V3",pin2:"net.HOST_SDA"}} />
    <A_0603WAF1002T5E name="R_RAW_SCL" pcbX={6.300} pcbY={7.200} layer="bottom"  connections={{pin1:"net.CAM_DOVDD",pin2:"net.RAW_SCL"}} />
    <A_0603WAF1002T5E name="R_HOST_SCL" pcbX={10.500} pcbY={7.200} layer="bottom"  connections={{pin1:"net.HOST_3V3",pin2:"net.HOST_SCL"}} />
    <testpoint name="TP_GND" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={-17.0} pcbY={-8} connections={{pin1:"net.GND"}} />
    <testpoint name="TP_HOST_3V3" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={-15.5} pcbY={-8} connections={{pin1:"net.HOST_3V3"}} />
    <testpoint name="TP_HOST_D0" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={-14.0} pcbY={-8} connections={{pin1:"net.HOST_D0"}} />
    <testpoint name="TP_HOST_D1" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={-12.5} pcbY={-8} connections={{pin1:"net.HOST_D1"}} />
    <testpoint name="TP_HOST_D2" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={-11.0} pcbY={-8} connections={{pin1:"net.HOST_D2"}} />
    <testpoint name="TP_HOST_D3" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={-9.5} pcbY={-8} connections={{pin1:"net.HOST_D3"}} />
    <testpoint name="TP_HOST_D4" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={-8.0} pcbY={-8} connections={{pin1:"net.HOST_D4"}} />
    <testpoint name="TP_HOST_D5" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={-6.5} pcbY={-8} connections={{pin1:"net.HOST_D5"}} />
    <testpoint name="TP_HOST_D6" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={-5.0} pcbY={-8} connections={{pin1:"net.HOST_D6"}} />
    <testpoint name="TP_HOST_D7" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={-3.5} pcbY={-8} connections={{pin1:"net.HOST_D7"}} />
    <testpoint name="TP_HOST_PCLK" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={-2.0} pcbY={-8} connections={{pin1:"net.HOST_PCLK"}} />
    <testpoint name="TP_HOST_HREF" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={-0.5} pcbY={-8} connections={{pin1:"net.HOST_HREF"}} />
    <testpoint name="TP_HOST_VSYNC" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={1.0} pcbY={-8} connections={{pin1:"net.HOST_VSYNC"}} />
    <testpoint name="TP_HOST_XCLK" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={2.5} pcbY={-8} connections={{pin1:"net.HOST_XCLK"}} />
    <testpoint name="TP_HOST_PWDN" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={4.0} pcbY={-8} connections={{pin1:"net.HOST_PWDN"}} />
    <testpoint name="TP_HOST_RESETB" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={5.5} pcbY={-8} connections={{pin1:"net.HOST_RESETB"}} />
    <testpoint name="TP_HOST_SDA" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={7.0} pcbY={-8} connections={{pin1:"net.HOST_SDA"}} />
    <testpoint name="TP_HOST_SCL" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={8.5} pcbY={-8} connections={{pin1:"net.HOST_SCL"}} />
    <testpoint name="TP_EN_IO" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={10.0} pcbY={-8} connections={{pin1:"net.EN_IO"}} />
    <testpoint name="TP_EN_ANALOG" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={11.5} pcbY={-8} connections={{pin1:"net.EN_ANALOG"}} />
    <testpoint name="TP_EN_CORE" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={13.0} pcbY={-8} connections={{pin1:"net.EN_CORE"}} />
    <testpoint name="TP_CAM_OE_N_1V8" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={14.5} pcbY={-8} connections={{pin1:"net.CAM_OE_N_1V8"}} />
    <testpoint name="TP_SCCB_ENABLE_3V3" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={16.0} pcbY={-8} connections={{pin1:"net.SCCB_ENABLE_3V3"}} />
    <testpoint name="TP_AF_EXTERNAL_2V8" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={17.5} pcbY={-8} connections={{pin1:"net.AF_EXTERNAL_2V8"}} />
    <testpoint name="TP_CAM_DOVDD" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={20.5} pcbY={5.5} connections={{pin1:"net.CAM_DOVDD"}} />
    <testpoint name="TP_CAM_AVDD" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={20.5} pcbY={0.0} connections={{pin1:"net.CAM_AVDD"}} />
    <testpoint name="TP_CAM_DVDD" doNotPlace footprintVariant="pad" padDiameter="0.7mm" pcbX={20.5} pcbY={-5.5} connections={{pin1:"net.CAM_DVDD"}} />
    </schematicsheet>
  </board>
}
