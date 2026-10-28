# Provisional mechanical carriers

`board-carriers.scad` is editable OpenSCAD CAD for the current PCB review coupons.
It is a parameter study, not a model of Rushabh's frame or a printable product release.
The assembly view includes only a PCB bounding box and an exploded flat lid; it does
not invent missing camera, battery, antenna or speaker geometry. Main-floor microphone
aperture, lid LED window and end-wall FFC slots are provisional access studies located
from the implemented board coordinates. Their dimensions are adjustable assumptions,
not validated acoustic, optical or cable-clearance tolerances.

Defaults produce a left carrier83.2 ×21.2 ×12.0 mm and right103.2 ×21.2 ×16.6 mm,
including lid. Board widths18mm and tall bench connectors make these deliberately
provisional. PCB thickness1.6mm, edge clearance0.4mm, wall/floor1.2mm and headroom
6/12mm and underside cavities2.0/0.6mm are adjustable assumptions.
The main underside cavity now includes space for external flash and bypass components;
physical component heights, assembly tolerances and support-ledge clearance still need
review. None is a measured frame or fabrication tolerance.

```sh
mkdir -p dist/mechanical
openscad -D 'side="main"' -D 'part="tray"' -o dist/mechanical/main-tray.stl mechanical/board-carriers.scad
openscad -D 'side="secondary"' -D 'part="tray"' -o dist/mechanical/secondary-tray.stl mechanical/board-carriers.scad
```

Do not print or assemble for worn use on this evidence. Fit/fastening, electrical
insulation, material/fire/thermal behavior, connector access, microphone/LED openings,
RF clearance, battery swelling and the camera/hinge interfaces are not resolved.
Frame internal length/width/height and exact external assemblies are required to
replace these provisional volumes with a product enclosure.

`battery-envelopes.scad` exports manufacturer-listed pack bounding volumes for the
candidate study. These are not detailed pack shapes or an installed assembly.
See `docs/assembly-candidates.md` for electrical exclusions and procurement limits.
The study's green PCB box is a separate dimensional reference only; wires, NTC,
swelling/tolerances and frame geometry are absent.

To reproduce the bounding-volume image with OpenSCAD, Python, NumPy and Matplotlib:

```sh
mkdir -p dist/mechanical
for pack in jauch1900 jauch2050 jauch350; do
  openscad -D "pack=\"$pack\"" -o "dist/mechanical/$pack-envelope.stl" mechanical/battery-envelopes.scad
done
python mechanical/render-battery-study.py
```

These optional plotting packages are separate from the locked tsCircuit dependencies.
