import schematic from "../main-board/schematic-placement.json"
import positions from "./main-placements.json"
import { MainCoreSheet } from "../main-board/main-board.circuit"
import { R8Support } from "../components/r8-support"
import { MainControls } from "../components/main-controls"
import { MainMicrophone } from "../components/main-microphone"
import { MainPower } from "../components/main-power"
import { FrameInterconnect } from "../components/frame-interconnect"
import { SlimMechanics } from "./slim-mechanics"
import layout from "./layout.json"

const pcbPlacements=Object.fromEntries(positions.map(p=>[p.selector,p.center]))

export default function MainSlim() {
  const b=layout.boards.main, s=layout.settings,
    core=b.islands.find(i=>i.name==="core")!.offsetX,
    power=b.islands.find(i=>i.name==="power")!.offsetX
  return <board title="LOCAL 17mm MAIN FLEX / unrouted fit study" material="flex"
    thickness={s.thickness} layers={4} width={b.length} height={b.height} outline={b.outline}
    pcbRelative manualEdits={schematic}
    isViaInPadAllowed routingDisabled>
    <MainCoreSheet pcbPlacements={pcbPlacements} pcbOffsetX={core}/><R8Support pcbPlacements={pcbPlacements} pcbOffsetX={core}/>
    <MainControls pcbPlacements={pcbPlacements} pcbOffsetX={core}/><MainMicrophone pcbPlacements={pcbPlacements} pcbOffsetX={core}/>
    <MainPower pcbPlacements={pcbPlacements} pcbOffsetX={power}/><FrameInterconnect pcbPlacements={pcbPlacements} side="main" pcbOffsetX={power}/>
    <SlimMechanics side="main"/>
  </board>
}
