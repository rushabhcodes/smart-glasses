# Glasses-shaped fit prototype

This is actual editable tsCircuit/JSCAD geometry around the current 80 × 18 × 1.4 mm
main PCB and 100 × 18 × 1.4 mm secondary PCB. It is a **fixed-open mechanical fit
prototype**, not a fit-tested wearable or a manufacturing release. The two boards
remain unrouted. No component, battery architecture or camera choice was silently
changed to make the enclosure look smaller.

## Source and artifacts

- `src/enclosure/glasses-parameters.ts`: millimetre assumptions and board transforms.
- `src/enclosure/glasses-geometry.tsx`: front frame/bridge, integrated camera pod,
  two temples with ear curves, corner board retention, service covers, cable passages,
  strain-relief slots and joint splints.
- `src/enclosure/glasses-enclosure.circuit.tsx`: supported `assembly.device` /
  `assembly.printedpart` entry. This entry displays the mechanical parts; the export
  script adds the actual populated board CAD without changing either circuit.
- `mechanical/glasses/stl/`: **11 separate binary STL parts**, millimetres. Each is
  reoriented and translated to a nonnegative bed origin; inspect orientation/supports
  in a slicer. These are prototype print files, not fabrication approval.
- `mechanical/glasses/mesh-review.json`: frozen source hashes, imported-model counts,
  board envelopes, topology checks and conservative interference results.
- `docs/progress/2026-10-29-glasses-enclosure.png` and
  `2026-10-29-glasses-exploded.png`: actual assembled/exploded CAD renders.
- `dist/mechanical/glasses/assembled.glb`, `exploded.glb`, serialized JSCAD plans and
  the ZIP bundle: generated local artifacts. Nothing is published externally.

## Prototype assumptions

| Item | Value / meaning |
|---|---|
| Printed assembly bounding box | Approximately **165.25 X × 69 Y × 199.45 Z mm**; width × height × depth |
| World frame | +X main temple, −X secondary, +Y up, +Z toward ears; front at Z=0 |
| Empty lens apertures | 48 × 26 mm, rounded; centres 68 mm apart; no optical PD/fit claim |
| Temple board planes | X=±73 mm, Y=12 mm; board front Z=27 mm |
| Walls/floors and covers | Nominal 1.6 mm; local rounded edges and holes require process review |
| PCB edge clearance | 0.6 mm per side; actual board thickness 1.4 mm |
| Cover gap | 0.25 mm; not a measured printing tolerance or waterproof seal |
| Retention | Four corner support pads and cover fingers per PCB; 0.2 mm top float; no PCB holes invented |
| Camera reserve | Configurable nominal 24 × 18 × 14 mm, 12 mm front opening; no selected sensor/lens or camera mounting pattern |
| Rear reserves | Main nominal 30 × 10 × 6 mm, secondary 10 × 10 × 6 mm, rounded; not qualified battery cavities |
| Fastener geometry | M2-size 2.3 mm clearance / 1.6 mm pilot holes; joint 2.7 mm through holes for M2.5-size hardware |

Dimensions include printed parts only. Protruding screw heads/nuts, mating plugs,
wires, lens assemblies and padding are absent. Supplier component CAD is a visual
model, not a certified maximum-tolerance envelope. The current bench connector
choices make this intentionally substantial; no purchased glasses-frame fit is implied.

The rear reserves are architecture-neutral. The researched 52 × 34.5 × 10 mm Jauch
pack **does not fit**. No smaller pack has been qualified for the existing load budget.
Rounded walls, separated end bays and end-mounted screws keep the empty reserve
away from screw tips and active-board edges. Allow insulation, padding, swelling,
wire/protection-board space and thermal separation after a real pack is chosen;
e.g. a 1 mm lining reduces the main nominal bounding space to at most 28 × 8 × 4 mm,
with rounded-corner restrictions. This is not a recommendation for a cell that small.

## Interfaces and assembly

The main inward wall has a 1.6 mm microphone passage at PCB **(−29.2349266, 4)**,
aligned to the actual 0.5 mm PCB acoustic drill, plus a gasket collar ending 0.4 mm
below the PCB. A soft gasket/mesh and acoustic sealing still need qualification.
The outer cover exposes SW1 (−28,−5), LED1 (−6,−5), and RF connector J2 (−36,0).
The LED opening is 3.2 mm; its final diffuser and visibility need testing.

Secondary openings align with battery/NTC J2 (−35,−5), charge J3 (−35,5), speaker
J4 (24,5) and power switch SW2 (−13,−2). **Charging access is the current JST bench
interface, not a USB socket.** Connector openings permit service but do not validate
mating-plug envelopes, moisture protection or safe cable locking. The rear ear port
is provisional; no speaker/transducer, enclosure volume or acoustic output is selected.
The insulated touch interface remains untuned through the enclosure.

A 13.5 mm-wide cable corridor crosses the brow and joins the front service bays.
Two 1.2 × 1.6 mm tie slots per temple allow a soft saddle/loop outside the PCB edge.
Rear passages link the boards' service bays to the empty rear reserves. The frame
has **no folding hinge**: external joint splints and four through bolts hold it open.
This avoids assuming a stock FFC survives hinge cycles. The exact cable/contact
orientation, turn radius, insulation, strain-relief hardware and connector extraction
clearance still need physical review. No installed cable is claimed by the render.

Suggested mockup sequence: print and calibrate hole/clearance coupons; inspect and
deburr all paths; fasten the front and temples using splints; seat unpowered dummy
PCBs on the corner supports; check cover fingers, service access and removal; then
review the soft cable saddle and gasket. Fit covers with suitable M2-size prototype
hardware, checking pilot engagement and tip clearance before inserting electronics.
Fastener lengths, captive nuts/inserts, torque and skin-side shielding are not yet
qualified. Do not install a pouch cell or power the wearable on this CAD evidence.
The charger remains inhibited by the existing circuit default.

PETG is an editable prototype material tag, not a thermal, fire, skin-contact or
strength qualification. FDM may need supports, especially for the integral camera
pod and stepped temple floors. Nylon powder printing is another possible process;
no printer, service, layer height, shrink factor or finished tolerance is selected.
Lens retention/prescription optics, nose pads and comfort surfaces remain unfinished.

## Reproduce

Use the existing locked Node/Bun environment. Optional mesh tools are separate,
pinned Python packages; installation preserves the runtime proxy and CA settings.

```sh
source /workspace/.cloud-setup/activate.sh
npm run build
uv venv .cache/enclosure-venv
uv pip install --python .cache/enclosure-venv/bin/python -r mechanical/glasses/requirements.txt
npm run build:enclosure
ENCLOSURE_PYTHON="$PWD/.cache/enclosure-venv/bin/python" npm run export:enclosure
```

The exporter fetches original supplier OBJ assets only when the existing local cache
is absent, using the normal verified HTTPS/proxy path. It checks every expected
imported model and records asset/source hashes. No AI illustration is used.

The official tsCircuit source compiles pure JSCAD JSX into serializable CSG plans.
The browser JSCAD triangulation produced open edges on compound booleans, so the
STL exporter evaluates the **same primitive plans** with Manifold3D 3.3.2. Rounded
cuboids use a convex hull of sphere samples at the eight inset corners; tessellation
can differ from the browser while nominal dimensions and CSG intent are preserved.
GLB previews retain the toolchain's millimetre coordinate values; apply a 0.001
import scale in tools that assume glTF metres. STL files are explicitly documented
in millimetres. A 0.0001 mm simplification removes numerical slivers; there is no automatic hole
filling. Trimesh 4.9.0 independently checks each exact reloaded binary STL for closed
edges, winding, finite coordinates and positive volume; each part must be one solid.
The rendered enclosure uses those exported solids, rather than a different cosmetic model.

`export:enclosure` also fails on detected printed-part or component-AABB overlap.
The reported overlap threshold is 0.02 mm³, with a 0.005 mm bounding-box prefilter.
This is a conservative static test against the current CAD envelopes, not a check
of cable bend radius, toleranced moving hardware, electrical clearances, strength,
RF behavior or manufacturability. Both boards' dimensions and microphone-drill
alignment are checked against the independently generated circuit JSON.

## Required before a fitted or manufacturing-ready revision

1. User/frame measurements: temple inner spacing, usable length/depth/height, bridge,
   lens shape/retention, nose/ear support positions and desired folding behavior.
2. Exact protected battery architecture/pack, NTC/wiring, current ratings and swelling
   allowance; exact camera/lens/carrier/connector with safe rails, timing and sequencing.
3. Selected speaker/driver limits, antenna/coax/keepout, cable construction/contact side,
   bend radius and final low-profile connector geometry.
4. Routed PCB/stack-up and assembly review; printer/material, fasteners and measured
   tolerance coupons; unpowered physical mockup and service/access checks.
5. Bench electrical, charge/thermal, RF, acoustic and hinge/comfort testing before wearing.

Official documentation read **2026-10-29**:
[printed parts](https://docs.tscircuit.com/elements/assembly-printedpart),
[assembly device](https://docs.tscircuit.com/elements/assembly-device),
[advanced assembly](https://docs.tscircuit.com/guides/advanced-assembly), via the official
[documentation export](https://docs.tscircuit.com/llms.txt).
These docs explicitly say named face mounting does not generate holes or check
collisions; those geometries/checks are implemented separately here.
