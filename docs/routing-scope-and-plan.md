# Routing scope and next implementation stage

No explicit user prohibition on routing was found in the available task history.
The original direct request was environment setup; the supplied trusted history
later authorizes full implementation, smaller chips and continuing to a finished
product. The inherited code at0eefa0b has `routingDisabled` in both board entries,
`--routing-disabled` in package build scripts, and README lines15–16 describe the
schematic-stage status. That README lines208–219 explicitly anticipates routing
after subsystem/component review. These are stage settings, not a permanent ban.

The first implementation delegation also said to preserve detailed routing disabled
unless the current user-approved requirements established otherwise. That was an
explicit task constraint during the provisional design. The latest delegation asks
to distinguish a user restriction from this precaution and plan routing under the
user's later complete-implementation goal. No new approval flow is inferred from a
skill. The review branch can progress to routing once its technical inputs are fixed.

**Current state:** routing remains disabled because camera assembly/pin contract,
pack/protection, final outline and fabrication stack-up remain unresolved. This is
an engineering readiness gate; it is not a claim that the user forbade routing.
A successful unrouted placement check does not establish routability.

## Planned review-branch routing sequence

1. Freeze the exact camera module/carrier and its rail/logic-level requirements;
   confirm connector contact side and physical numbering. Close pack/NTC/protection
   choices and the frame cable length/current contract. Preserve GPIO/boot/PSRAM
   protections and independent-board netlist guards.
2. Select a published fabricator four-layer stack-up and actual design rules. Review
   copper weight, adjacent reference planes, via filling/capping, stencil, assembly
   sides and antenna keepout. Do not invent a50 Ω width from board thickness alone.
3. Parameterize a separate local routing build, retaining the unrouted review entry
   and snapshots. No publication or fabrication release is part of this step.
4. Route power hot loops, feedback, solid ground/thermal returns and bulk bypass
   first. Review charger dissipation and memory-feed continuity before signals.
5. Manually constrain RF and crystal paths; use the real stack-up/antenna model.
   Fan QFN lands radially and stagger vias;4/4 mil cannot pass through the nominal
   0.2 mm land gap. Retain intentional grounded thermal vias with an assembly plan.
6. Route short flash/DVP connections with return continuity and timing/skew review,
   then local audio/control and the fixed frame connector. Use automatic routing
   only for suitable remaining nets; inspect generated copper and residual unrouted
   nets independently on each board.
7. Run connectivity, shorts, clearance/edge/plane/return and fabrication-output
   checks. Review all layers, drill/paste/mask, BOM/placement and3D mechanical
   interference; resolve failures rather than suppressing them.
8. Capture actual PCB/CAD milestone images. Manufacturing review, assembly, power/
   charging/RF/audio/camera tests and physical fit/thermal/hinge validation remain
   separate gates. No order, purchase or external publication is authorized.
