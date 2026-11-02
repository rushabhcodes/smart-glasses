import schematic from "../secondary-board/schematic-placement.json"
import positions from "./secondary-placements.json"
import { SecondaryPower } from "../components/secondary-power"
import { SecondaryGauge } from "../components/secondary-gauge"
import { SecondaryAudio } from "../components/secondary-audio"
import { SecondaryTouch } from "../components/secondary-touch"
import { FrameInterconnect } from "../components/frame-interconnect"
import { SlimMechanics } from "./slim-mechanics"
import layout from "./layout.json"

const pcbPlacements=Object.fromEntries(positions.map(p=>[p.selector,p.center]))

export default function SecondarySlim() {
  const b=layout.boards.secondary,s=layout.settings,
    power=b.islands.find(i=>i.name==="power")!.offsetX,
    audio=b.islands.find(i=>i.name==="audio")!.offsetX,
    touch=b.islands.find(i=>i.name==="touch")!.offsetX
  return <board title="LOCAL 17mm SECONDARY FLEX / ACH headers / unrouted fit study" material="flex"
    thickness={s.thickness} layers={4} width={b.length} height={b.height} outline={b.outline}
    pcbRelative manualEdits={schematic} routingDisabled>
    <SecondaryPower pcbPlacements={pcbPlacements} pcbOffsetX={power} lowProfile/><SecondaryGauge pcbPlacements={pcbPlacements} pcbOffsetX={power}/>
    <FrameInterconnect pcbPlacements={pcbPlacements} side="secondary" pcbX={-44} pcbOffsetX={power}/>
    <SecondaryAudio pcbPlacements={pcbPlacements} pcbOffsetX={audio} lowProfile/><SecondaryTouch pcbPlacements={pcbPlacements} pcbOffsetX={touch}/>
    <SlimMechanics side="secondary"/>
  </board>
}
