# November 2026 work-in-progress publication scope

The user authorized a GitHub branch push and public `tsci push` update on
2 November. Target repository: `rushabhcodes/smart-glasses`; working branch:
`codex/flex-temple-review`. The validated local design checkpoints through
`6330b63` are preserved. No merge into main, order or supplier contact is included.

Package version: **0.1.2**. Default package and standalone-site entrypoint:
`src/flex/main-flex.circuit.tsx`. Separate gallery entries are:

- `src/flex/secondary-flex.circuit.tsx`: independent secondary flex board.
- `src/camera-carrier/camera-carrier.circuit.tsx`: separate default-off carrier;
  not electrically or mechanically integrated into the glasses.
- `src/enclosure/glasses-enclosure.circuit.tsx`: earlier rigid-board fixed-open
  enclosure prototype; it is not a new fitted housing for the flex boards.

Legacy rigid main/secondary entrypoints remain in the source. Combined flex and
carrier progress PNGs are source-backed local CAD snapshots; the default main-board
preview is not a complete assembled-glasses model.

Preserved gates: routing, qualified four-layer flex stackup, stiffener/coverlay
manufacturing export, dynamic hinge/cable qualification, AF power/driver, complete
camera interface/firmware/sequence controls, connector land/mating verification,
protected compact battery/NTC procurement, actual frame fit and thermal/RF/hardware
testing. The standalone carrier's base regulator-accuracy screen is not a completed
line/load/transient budget. Host tests are not physical verification.

Publication completion must be verified from the remote GitHub SHA, uploaded
source parity, hosted build termination and relevant generated previews. A local
commit, uploaded files or queued build alone does not establish a ready release.
Final release/build evidence is returned in the task after publication rather
than asserted in this prepublication scope document.

Local validation passed: TypeScript; six independent builds; source/netlist,
schematic and placement checks; main/peripheral and flex pin/land invariants;
backing/closed-mesh/interference checks; camera contact/default-state checks;
strict C host sequence harness; and actual CAD loading (109 flex +57 carrier
models). See [local validation record](progress/2026-11-02-publication-validation.json).
Routing, fabrication and all hardware tests remain unrun.
