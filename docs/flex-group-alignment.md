# Mechanical group outline alignment

Local correction after published0.1.2; not pushed or published.

The original main STATIC_1_MECHANICAL pcb_group was centered at x=0, while
its actual bend/keepout center was x=-1.089427875 mm. Both boxes were9.235987756 mm
wide. A417 px displayed width predicts49.186 px offset, matching the reported
49 px displacement. The Library screenshot could not be retrieved here, so
this is a source/JSON diagnosis rather than direct pixel inspection.

The source now places the mechanical group at the bend and defines its children
relative to that anchor. Main and both secondary groups align with their keepouts.
Actual global bend and keepout coordinates, every electrical connection, land
pattern and nine thermal vias remain unchanged; native builds and flex guards pass.
A regression check now compares group/keepout/bend centers. No viewer code changed.
