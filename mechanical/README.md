# Provisional mechanical carriers

`board-carriers.scad` is editable OpenSCAD CAD for the current PCB review coupons.
It is a parameter study, not a model of Rushabh's frame or a printable product release.
The assembly view includes only a PCB bounding box and an exploded flat lid; it does
not invent missing camera, battery, antenna or speaker geometry.

Defaults produce a left carrier83.2 ×21.2 ×10.6 mm and right103.2 ×21.2 ×16.6 mm,
including lid. Board widths18mm and tall bench connectors make these deliberately
provisional. PCB thickness1.6mm, edge clearance0.4mm, wall/floor1.2mm and headroom
6/12mm are adjustable assumptions. None is a measured frame or fabrication tolerance.

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
