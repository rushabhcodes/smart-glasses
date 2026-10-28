/**
 * Review scaffold only: two probe pads and one example bypass capacitor.
 * VSYS is the proposed inter-board system rail, not a regulated 3.3 V rail.
 * All items are unassembled: copper probe pads plus a DNP example capacitor.
 * This is not an FPC footprint, a regulator, or a verified power subsystem.
 * Both boards use the same logical rail names; no cross-board copper is implied.
 */
export function PowerRailScaffold() {
  return (
    <>
      <testpoint
        name="TP1"
        doNotPlace
        footprintVariant="pad"
        padDiameter="1mm"
        pcbX={-6}
        pcbY={0}
        schX={-3}
        schY={2}
        connections={{ pin1: "net.VSYS" }}
      />
      <testpoint
        name="TP2"
        doNotPlace
        footprintVariant="pad"
        padDiameter="1mm"
        pcbX={6}
        pcbY={0}
        schX={3}
        schY={-2}
        connections={{ pin1: "net.GND" }}
      />
      <capacitor
        name="C1"
        doNotPlace
        capacitance="100nF"
        schRotation={-90}
        footprint="0603"
        pcbX={0}
        pcbY={0}
        schX={0}
        schY={0}
        connections={{ pin1: "net.VSYS", pin2: "net.GND" }}
      />
    </>
  )
}
