import { PowerRailScaffold } from "../components/power-rail-scaffold"

/** Right temple entry point. Independent PCB; cable contact assignment remains TBD. */
export default function SecondaryBoard() {
  return (
    <board title="Right power and audio board - REVIEW SCAFFOLD" width="60mm" height="25mm" layers={2} routingDisabled>
      <schematicsheet name="PowerReview" displayName="Power rail scaffold" sheetIndex={0}>
        <PowerRailScaffold />
      </schematicsheet>
      {/* TODO: Add a verified single-cell charger and protected battery interface. */}
      {/* TODO: Verify fuel gauge, amplifier package, touch interface and power-off topology. */}
      {/* TODO: Add speaker connector, charging contacts, NTC sensing and input protection. */}
      {/* TODO: Replace probe-pad interconnect abstraction with the mating FPC connector. */}
    </board>
  )
}
