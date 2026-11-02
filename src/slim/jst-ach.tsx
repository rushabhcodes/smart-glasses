import type { ConnectorProps } from "@tscircuit/props"
import { Ach2Footprint } from "../../imports/slim/Ach2Footprint"
import { Ach3Footprint } from "../../imports/slim/Ach3Footprint"

// Manufacturer-backed mated bounding envelope only, not a detailed vendor model.
// JST eACH: 1.4mm mated height, 4.3mm depth; 4.2/5.4mm header widths.
function envelope(width: number) {
  const x=width/2, y0=-2.3, y1=2, z=1.4
  const points=[[-x,y0,0],[x,y0,0],[x,y1,0],[-x,y1,0],[-x,y0,z],[x,y0,z],[x,y1,z],[-x,y1,z]]
  const faces=[[1,4,3,2],[5,6,7,8],[1,2,6,5],[2,3,7,6],[3,4,8,7],[4,1,5,8]]
  const obj=points.map(p=>`v ${p.join(' ')}`).concat(faces.map(f=>`f ${f.join(' ')}`)).join('\n')+'\n'
  return {objUrl:'data:text/plain;base64,'+btoa(obj),modelOriginPosition:{x:0,y:0,z:0},pcbRotationOffset:0}
}
const labels2={pin1:["pin1","1"],pin2:["pin2","2"],pin3:["MP"]} as const
const labels3={pin1:["pin1","1"],pin2:["pin2","2"],pin3:["pin3","3"],pin4:["MP"]} as const
export function Ach2(props: ConnectorProps) {
  return <Ach2Footprint {...props} pinLabels={labels2} noConnect={["pin3"]}
    manufacturerPartNumber="BM02B-ACHSS-GAN-ETF"
    supplierPartNumbers={{digikey:["455-BM02B-ACHSS-GAN-ETFCT-ND"]}}
    cadModel={envelope(4.2)} />
}
export function Ach3(props: ConnectorProps) {
  return <Ach3Footprint {...props} pinLabels={labels3} noConnect={["pin4"]}
    manufacturerPartNumber="BM03B-ACHSS-GAN-ETF"
    supplierPartNumbers={{digikey:["455-BM03B-ACHSS-GAN-ETFCT-ND"]}}
    cadModel={envelope(5.4)} />
}
