import { assembly } from "tscircuit";
import { printedParts } from "./glasses-geometry";
/** Fixed-open fit prototype; parts are in a common millimetre world frame. Boards are included by the export script. */
export default () => (
  <assembly.device name="SMART_GLASSES_PROTOTYPE">
    {printedParts.map((part) => (
      <assembly.printedpart
        key={part.name}
        name={part.name.replaceAll("-", "_")}
        displayName={part.name}
        material="petg"
        color={part.color}
        jscad={part.element}
      />
    ))}
  </assembly.device>
);
