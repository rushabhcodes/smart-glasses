import placement from "../main-board/schematic-placement.json"
import { MainCoreSheet } from "../main-board/main-board.circuit"
import { R8Support } from "../components/r8-support"
import { MainControls } from "../components/main-controls"
import { MainMicrophone } from "../components/main-microphone"
import { MainPower } from "../components/main-power"
import { FrameInterconnect } from "../components/frame-interconnect"
import { FlexMechanics } from "./flex-mechanics"
import layout from "./layout.json"
export default function MainFlex() {
  const b = layout.boards.main,
    s = layout.settings,
    core = b.islands.find((x) => x.name === "core")!.offsetX,
    power = b.islands.find((x) => x.name === "power")!.offsetX
  return (
    <board
      title="MAIN FLEX / static installation study / NOT ROUTED"
      material="flex"
      thickness={s.thickness}
      layers={4}
      width={b.length}
      height={b.height}
      outline={b.outline}
      pcbRelative
      manualEdits={placement}
      isViaInPadAllowed
      routingDisabled
    >
      <MainCoreSheet pcbOffsetX={core} />
      <R8Support pcbOffsetX={core} />
      <MainControls pcbOffsetX={core} />
      <MainMicrophone pcbOffsetX={core} />
      <MainPower pcbOffsetX={power} />
      <FrameInterconnect side="main" pcbOffsetX={power} />
      <FlexMechanics side="main" />
    </board>
  )
}
