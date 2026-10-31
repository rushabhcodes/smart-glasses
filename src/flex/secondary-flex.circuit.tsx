import placement from "../secondary-board/schematic-placement.json"
import { SecondaryPower } from "../components/secondary-power"
import { SecondaryGauge } from "../components/secondary-gauge"
import { SecondaryAudio } from "../components/secondary-audio"
import { SecondaryTouch } from "../components/secondary-touch"
import { FrameInterconnect } from "../components/frame-interconnect"
import { FlexMechanics } from "./flex-mechanics"
import layout from "./layout.json"
export default function SecondaryFlex() {
  const b = layout.boards.secondary,
    s = layout.settings,
    power = b.islands.find((x) => x.name === "power")!.offsetX,
    audio = b.islands.find((x) => x.name === "audio")!.offsetX,
    touch = b.islands.find((x) => x.name === "touch")!.offsetX
  return (
    <board
      title="SECONDARY FLEX / static installation study / NOT ROUTED"
      material="flex"
      thickness={s.thickness}
      layers={4}
      width={b.length}
      height={b.height}
      outline={b.outline}
      pcbRelative
      manualEdits={placement}
      routingDisabled
    >
      <SecondaryPower pcbOffsetX={power} />
      <SecondaryGauge pcbOffsetX={power} />
      <FrameInterconnect side="secondary" pcbX={-44} pcbOffsetX={power} />
      <SecondaryAudio pcbOffsetX={audio} />
      <SecondaryTouch pcbOffsetX={touch} />
      <FlexMechanics side="secondary" />
    </board>
  )
}
