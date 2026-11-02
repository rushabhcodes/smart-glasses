import { assembly, jscad } from "tscircuit"
import profile from "./housing-profile.json"

type Side = "main" | "secondary"
const settings=profile.settings
// Actual folded CAD drives these stations. No battery, hinge or retention
// features are invented here: these are split, static fit-assessment envelopes.
function Sweep({side,kind}:{side:Side;kind:"outer"|"cavity"|"inner-half"|"outer-half"}) {
  const b=profile.sides[side],s=settings
  const zInset=kind==="cavity"?s.wallMinimum:0
  return <jscad.hullChain>
    {b.points.map((p,i)=>{
      let x0=p.x0,x1=p.x1,y0=b.cavityY[0],y1=b.cavityY[1],z=p.z
      if(kind!=="cavity") {x0-=s.wallX;x1+=s.wallX;y0-=s.wallY;y1+=s.wallY}
      const mid=(p.x0+p.x1)/2
      if(kind==="inner-half") {
        if(side==="main")x1=mid-s.seamGap/2;else x0=mid+s.seamGap/2
      }
      if(kind==="outer-half") {
        if(side==="main")x0=mid+s.seamGap/2;else x1=mid-s.seamGap/2
      }
      // Preserve interior stations; inset just the end caps of the cavity.
      z=Math.max(b.points[0].z+zInset,Math.min(b.points.at(-1)!.z-zInset,z))
      return <jscad.cuboid key={i} size={[x1-x0,y1-y0,.02]} center={[(x0+x1)/2,(y0+y1)/2,z]}/>
    })}
  </jscad.hullChain>
}
export function SlimHousingPart({side,half}:{side:Side;half:"inner"|"outer"}) {
  return <jscad.subtract>
    <Sweep side={side} kind={half==="inner"?"inner-half":"outer-half"}/>
    <Sweep side={side} kind="cavity"/>
  </jscad.subtract>
}
export const slimHousingParts=(["main","secondary"] as const).flatMap(side=>(["inner","outer"] as const).map(half=>({
  name:`${side}-${half}-envelope`,color:half==="inner"?"#46717c":"#2d525e",
  element:<SlimHousingPart side={side} half={half}/>
})))
export default function SlimHousing() {
  return <assembly.device name="SLIM_STATIC_ARM_ENVELOPE_REVIEW">
    {slimHousingParts.map(p=><assembly.printedpart key={p.name} name={p.name.replaceAll("-","_")}
      material="petg" displayName={p.name} color={p.color} jscad={p.element}/>)}
  </assembly.device>
}
