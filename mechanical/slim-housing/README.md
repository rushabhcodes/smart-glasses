# Static slim-arm CAD envelopes

These four review STL solids come from editable tsCircuit/JSCAD source in
`src/slim/slim-housing.tsx`, driven by actual folded slim-board CAD. See
[the assumptions and fit assessment](../../docs/slim-housing-fit.md).

They are split envelopes with modeled component and cable space. They have no
qualified PCB retention, cover fasteners, front attachment or service/acoustic
openings. Battery, camera, antenna mating geometry and real harness integration
remain open. They are not functional finished housings or fabrication approval.
Print orientation, support, material, tolerances and physical fit are unqualified.

`fit-assessment.json` records the source-based old cavity failure and new clearances.
`fit-check.json` records conservative CAD-containing-solid interference checks.
`solid-mesh-review.json` records the four closed, oriented single-body mesh/STL
checks. The generic exporter reports `interferenceChecked:false`; that field
refers to its older component-AABB checker. The separate `fit-check.json` uses
tighter triangle-slab containing solids for the folded boards.
`bundle-manifest.json` records source and actual snapshot hashes.

STL coordinates are millimetres, normalized to a nonnegative origin for inspection;
that normalization does not select a suitable print orientation. World-assembled
GLB files remain in `dist/slim-housing-review/`.
