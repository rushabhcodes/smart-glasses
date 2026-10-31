# Flex mechanical review files

See [the design assessment](../../docs/flex-adaptation.md) for the source reference,
electrical equivalence checks, component candidates and unresolved support issues.

- [Main flat drawing](main-layout.svg): 97.892 × 20 mm, two islands / one static bend.
- [Secondary flat drawing](secondary-layout.svg): 134.537 × 20 mm, three islands / two static bends.
- Editable board geometry and offsets: `src/flex/layout.json`, with native TSX
  entrypoints `main-flex.circuit.tsx` and `secondary-flex.circuit.tsx`.
- [Main-core backing pattern](main-core-stiffener.svg): one compound cut pattern
  with four internal windows, exact mm units, 0.20 mm FR4 / 0.05 mm adhesive intent.
- [Main-core backing solid](main-core-stiffener.stl): closed single-body mm STL for
  dimensional review, not instructions to 3D-print FR4 or an assembly approval.
- [Backing verification](backing-review.json): actual native tile-union clearance,
  connectivity, 0.6 mm structural-spine and independent STL checks.
- Actual combined assembled/exploded PNG/GLB and circuit JSON: `dist/flex-review/`.

Regenerate the SVGs with `node scripts/export-flex-layout.mjs`. SVG units are mm;
the outline and backing rectangles use the exact reviewed coordinates. Component
rectangles are placement envelopes, not copper, courtyards or maximum-tolerance
mechanical models. Pink zones are static-bend keepouts. No routing is depicted.
These are review drawings, not production cut/stiffener/coverlay instructions.

The first main-board native KiCad export was inspected with CLI 0.1.2417. It retained
0.20 mm board thickness and four copper layers, but the generated board contained
no bend names, stiffener names, stackup/coverlay definitions or keepout zones.
No adhesive/backing fabrication package or unfolded/folded dimensional tolerances
were established by that export. The native circuit JSON retains `pcb_bend`,
`pcb_keepout`, `pcb_stiffener` and adhesive-thickness records; those are used for
the actual CAD views and local checks. A manufacturer-approved drawing/export
workflow is required before fabrication. Do not order from the KiCad smoke export.

The corrected main core is one continuous windowed backing. The native API has
no internal-hole property, so its 39 rectangles tile that single pattern; the SVG
represents its actual cut boundaries, without internal tile seams. The previous
ten-patch artifact is preserved at commit `004cb97`. Regenerate/refine the plan with
`npm run plan:flex`, then rebuild both boards and run `npm run check:flex` and
`npm run check:flex-backing` using the existing pinned optional Python geometry
tools. Support stiffness, adhesive, machining radii and supplier limits remain
unqualified. No printable flex
PCB, qualified moving hinge, new temple enclosure, camera or battery installation
is supplied by this milestone. The exploded backing offset is for inspection only.
