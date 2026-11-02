# 0.1.3 work-in-progress release scope

The user authorized pushing and publishing the slimmer revision on 2 November
2026. This release preserves board checkpoint `ffe0375` and static arm-envelope
checkpoint `8fcb0a4` on `codex/slim-temple-review`. It does not merge main, place an
order, contact a supplier or expand the hardware design.

The main package, preview and standalone-site defaults select
`src/slim/main-slim.circuit.tsx`. The gallery also exposes:

- `src/slim/secondary-slim.circuit.tsx`: independent 17 mm secondary board.
- `src/slim/slim-housing.circuit.tsx`: four static mechanical envelope parts.
  The source-backed assembled/exploded PNGs combine those parts with the actual
  folded boards and earlier front reference; the mechanical entry alone does not.
- `src/camera-carrier/camera-carrier.circuit.tsx`: standalone default-off OV5640
  AF carrier, not yet connected to or fitted into the glasses.
- `src/enclosure/glasses-enclosure.circuit.tsx`: legacy rigid-board frame for
  comparison; it is not a fitted housing for the longer flex boards.

Original rigid and 20 mm flex board entrypoints, schematics, pin contracts,
thermal vias, routing-disabled status and legacy snapshots remain available.
Both slimmer boards retain the existing functional physical-pin connections.
Only secondary J2/J3/J4 change to the audited JST ACH footprints. Their supplier
evidence is DigiKey; JLC assembly identity, allocation and stock are unverified.

The configured build command runs the normal gallery build, then renders the
housing thumbnail from its actual native GLB with an explicit camera. The pinned
thumbnail helper uses a fixed near-origin camera when no PCB is present, clipping
the long mechanical parts. This project camera step changes no geometry, scale,
assembly coordinates or electrical source; no synthetic PCB is added. The site's
interactive camera remains an upstream viewer behavior, not a verified fit claim.

The boards are 97.89 × 17 × 0.20 mm and 134.54 × 17 × 0.20 mm. Nominal populated
flat CAD spans are 3.10 / 4.35 mm. The new static envelopes pass conservative
CAD containment with at least 0.60 mm component clearance, 1.60 mm walls and a
1.00 mm cable reservation. They are 21.4 mm high and about 8.69 / 9.87 mm thick
locally under these assumptions. Supplier CAD and ACH boxes are nominal models,
not maximum-tolerance or physical fit evidence.

Unfinished gates remain explicit: PCB retention, cover fastening and front
attachment; button/mic/LED/touch/service access; exact harness, contact side,
turn radius and strain relief; antenna mating clearance; protected battery/NTC
qualification; camera integration and firmware; copper routing and DRC; qualified
four-layer flex stackup and manufacturing exports; thermal/RF/acoustic/hinge and
wearer-fit tests. Charging remains inhibited by the existing default circuit.

Prepublication verification covers the exact source revision, configured gallery
builds and local previews, legacy electrical/land contracts, static backing and
housing solids/containment, and camera/host-sequence checks. Hosted completion
requires a terminal successful job plus expected output metadata and uploaded
source parity with the pushed GitHub SHA. Previously denied standalone and
generated-artifact reads are not retried merely for this release; remote pixel
and live browser-default verification remain separate limits.

Final commit, release/build IDs and observed outcomes are returned in this task
after publication rather than pre-asserted here.
