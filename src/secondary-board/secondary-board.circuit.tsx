import schematicPlacement from "./schematic-placement.json"
import { FrameInterconnect } from "../components/frame-interconnect"
import { SecondaryPower } from "../components/secondary-power"
import { SecondaryGauge } from "../components/secondary-gauge"
import { SecondaryAudio } from "../components/secondary-audio"
import { SecondaryTouch } from "../components/secondary-touch"

/** Independent provisional coupon; protected pack, speaker and enclosure remain external. */
export default function SecondaryBoard() {
  return <board title="Right power and audio board / SCHEMATIC REVIEW" width="100mm" height="18mm" manualEdits={schematicPlacement} layers={4} routingDisabled>
    <SecondaryPower />
    <SecondaryGauge />
    <SecondaryAudio />
    <SecondaryTouch />
    <FrameInterconnect side="secondary" pcbX={-44} />
  </board>
}
