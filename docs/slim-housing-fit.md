# Static arm-envelope CAD fit assessment

This local follow-up to `ffe0375` fits original tsCircuit/JSCAD envelope geometry
to the **actual folded slim-board CAD**. The boards, components, pin mappings and
electrical design are unchanged. It is a provisional geometric clearance study,
not a qualified or mechanically retained wearable assembly.

## Earlier arm cavities do not fit

The original enclosure source targets the 80/100 × 18 mm rigid PCBs. Its nominal
component cavities, before local service cutouts, are:

| World axis / cavity | Main | Secondary |
| --- | --- | --- |
| X, component normal | 70.5…76.8 mm | −80.7…−69.2 mm |
| Y, arm height | 2.4…21.6 mm | 2.4…21.6 mm |
| Z, longitudinal | 20.6…113.4 mm | 20.6…133.4 mm |

Measured transformed folded slim CAD extends beyond the rear of these cavities
by **10.92 / 26.79 mm**, and beyond their inner side by **6.09 / 10.43 mm**. A 17 mm
board fits the old cavity's height, but neither its length nor its static curve is
contained. The old enclosure's passing rigid-board fit check cannot be reused.

## New provisional envelopes and allowances

| Item | Assumption / measured result |
| --- | --- |
| Board substrate | 0.20 mm, four-layer unqualified flex stack |
| Board populated flat CAD span | Main 3.10 mm; secondary 4.35 mm |
| Side clearance | At least 0.60 mm normal to the sampled profile; actual conservative minimum 0.6055 mm |
| Upper/lower component clearance | 0.60 mm each side |
| Extra cable reserve | 1.00 mm on the outer face, independent of component clearance |
| Walls | At least 1.60 mm; X expansion 1.64 mm accounts for profile slope |
| Outer arm height | **21.40 mm** |
| Maximum local world-X thickness | **8.69 mm main / 9.87 mm secondary** |
| Profile span along world Z | 18.60…166.19 mm, plus 0.01 mm end-cap tessellation each end |
| Minimum end clearance | 6.92 mm main / 4.40 mm secondary |
| Split-cover nominal gap | 0.25 mm along X; conservative normal gap 0.244 mm |

The simple flat-section lower bounds including these allowances are about
8.62 / 9.87 mm. The actual main profile is slightly larger because it follows the
folded geometry. Overall swept X extents are **16.31 / 23.40 mm**, which include
the static arm curve; those extents are not local wall-to-wall thickness.
The earlier actual rigid trays were 22.4 mm high and about 9.5 / 14.7 mm thick.
They are comparison geometry, not valid housings for these flex boards.

The prototype retains the original front-frame reference and fixed-open arm
placement. Both new envelopes extend to the secondary board's rear plus a 6 mm
service allowance; the main has empty rear space. **This is not a selected battery
bay.** No protected pack, swelling allowance, NTC assembly, antenna/coax mating
shape, camera carrier or lens assembly is asserted to fit. The 1 mm channel is a
space reservation; cable contact side, maximum thickness, routing/strain relief,
turn radius and connector extraction access remain unqualified.

## CAD construction and verification

`scripts/plan-slim-housing.py` reads the actual assembled slim GLB, applies every
mesh transform, and clips all CAD triangles into 2 mm Z slabs. Adjacent section
stations contain the complete slab bounds plus clearances. A slope-limited outward
expansion produces a gradual profile without reducing any clearance. The generated
`src/slim/housing-profile.json` drives the editable `slim-housing.tsx` JSCAD source.

The source compiles through the pinned tsCircuit headless JSCAD API. The existing
Manifold3D backend evaluates those same CSG plans into four separate STL parts.
Each exact exported STL reloads closed, consistently wound and one body. An
independent solid test intersects the housings with conservative solids containing
**every actual CAD triangle slab**, rather than assuming that a picture proves
fit. Intersection volume is zero for both boards, between the housing halves and
with the retained front-frame reference. Source hashes and full results accompany
the saved review artifacts. Supplier meshes and the ACH nominal bounding boxes
remain unqualified tolerance models.

## Scope that remains unfinished

These split envelopes have **no qualified PCB retention, front attachment or
cover fastening**. The reference joint is separated by a nominal gap; lack of
interference is not attachment. No microphone/button/LED/touch/service openings,
gasket or speaker acoustic volume have been qualified on these new envelopes.
They must not be treated as finished functional shells or print/assembly approval.

Remaining gates include JLC ACH assembly sourcing and exact mating harness;
flex stackup, copper routing and manufacturing exports; qualified battery and
camera integration; thermal/RF/acoustic and moving-hinge tests; optics, wearer
dimensions, padding and physical fit. No purchase, publication or physical test
occurred in this phase.

```sh
npm run plan:slim-housing
npm run build:slim-housing
npm run export:slim-housing
npm run render:slim-housing
```

Review [assembled](progress/2026-11-02-slim-housing-assembled.png) and
[exploded](progress/2026-11-02-slim-housing-exploded.png) actual CAD views. In the
exploded view the outer halves move 20 mm outward and the stiffeners 6 mm inward.
