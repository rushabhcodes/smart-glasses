# Mechanical constraints

The initial two 60 × 25 mm, two-layer outlines are **arbitrary review coupons**. They are not
a measured frame design, and they contain no representations of the major IC bodies.
No conventional-glasses-temple fit has been established.

## Envelope work required

Measure each temple's internal usable length/width/height, hinge sweep, frame-front camera
space, wall thickness, fastener bosses, bend radii, flex exit slots and assembly sequence.
Define PCB thickness and edge clearance after choosing the frame material and fastening.
A four-layer main PCB may be appropriate for power/RF/return paths; the scaffold's two-layer
setting is not an approved product stack-up. Do not shrink outlines around placeholder pads.

The WROOM-1U body alone is nominally 18 × 19.2 × 3.2 mm, before PCB thickness, solder,
RF plug/cable height, shielding clearance and enclosure walls. It may require unusually wide
temples or a different module. Smaller IC body dimensions do not account for all support parts.
Camera modules differ in lens barrel, sensor board/flex and connector dimensions; exact
height, view angle and forward alignment are unresolved.

## RF antenna integration

The 1U uses an external antenna; select a real 2.4 GHz antenna, matching miniature coax plug
and cable with drawings and approved application geometry. Verify module connector type
rather than assuming every small RF connector is interchangeable. Reserve plug mating and
cable bend/strain-relief space and retention against hinge movement.

Locate the radiator away from the battery, metal hinges/frame, charger, Class-D outputs and
head/body as far as the selected antenna design permits. Use the antenna vendor's required
ground reference, ground/no-copper region and free-space clearance. There is no universal
clearance number for all external antennas. Do not apply a PCB-antenna module's keepout
blindly to an external antenna or claim RF performance from module certification alone.
Measure matching/link behavior in the final enclosure and on a wearer-equivalent fixture.

## Flex and hinge

Determine the complete path from one temple through the frame front to the other; do not
assume a short board-to-board cable. A stock FFC designed for static use may fail under
repeated hinge bending. Select cable/flex construction and dynamic bend radius from the
supplier; provide service loops, stiffeners, abrasion control and strain relief. Keep the battery
away from screws, hinge pinch points, sharp PCB edges and cable bends.

## Battery, acoustic and thermal space

Choose a protected cell only after allocating protection-board/wire space, swelling allowance,
insulation and service removal. Do not compress or reshape a pouch cell to fit the model.
Keep battery/charger heat away from skin and verify temperatures before worn operation.
Map mass and center of gravity for left/right balance; capacity/runtime targets remain TBD.

The bottom-port microphone needs a correct PCB acoustic aperture plus enclosure port and
mesh; avoid sealing it with adhesive. Isolate speaker vibration and feedback into the mic.
Provide speaker enclosure/duct volume and an output limit suitable for close-ear use.
The recording LED needs an outward-visible optical path; it must not disappear behind a
frame wall. Charging contacts need dock alignment, insulation and moisture management.

## Mechanical approval inputs

- Dimensioned frame CAD with local coordinate systems and tolerances.
- Exact module, lens, battery, speaker, connector and antenna drawings/3D models.
- Cable continuity/hinge life specification and electrical drop estimate.
- Stack-height and assembly-access review, followed by a physical fit mockup.
- Measured thermal, acoustic, RF and comfort results before wearable trials.

References: [Espressif module and RF layout guidance](research-sources.md#hardware).
