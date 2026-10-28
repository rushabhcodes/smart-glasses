# PCB routing feasibility checkpoint

Detailed routing remains disabled. The read-only `npm run report:routing-feasibility`
command derives component layers, pads, net membership and geometric spans from both
built Circuit JSON files. Its output is `dist/routing-feasibility.json`. It does not
run an autorouter, create copper, or prove that a board is routable.

The R8 placement checkpoint has74 source components on the80 ×18 mm main board
(51 top,23 bottom),250 SMT lands and nine intentional ground thermal vias. The
100 ×18 mm secondary has46 components on top and157 SMT lands. There are49 and33
named nets connecting multiple components, respectively, and **zero PCB traces**.
DNP test pads are included. Net extent is a bounding-box span, not routed length.

## Constraints to resolve before routing

- **QFN escape:**0.4 mm pitch minus0.2 mm land width leaves about0.2 mm nominal
  between neighboring lands. A4 mil trace with4 mil clearance on both sides needs
  0.3048 mm;3/3 mil needs0.2286 mm. Neither fits that nominal gap. Fan out radially
  and use the reserved-pin spaces, with staggered vias outside the land rows. Do
  not assume a trace can pass between every pair of pads. The selected assembly
  process, mask tolerances and manufacturer land pattern still require review.
- **Stack-up:** four layers are provisional. Select an actual fabrication stack-up
  with a continuous adjacent ground reference before calculating50 Ω RF width or
  approving power/thermal planes. No controlled-impedance width is selected here.
- **RF:** the chip CLC is an untuned starting network. Its ground stub, short chip
  connection, U.FL path, antenna matching/ESD and surrounding clearance must be
  placed and reviewed together. Library clearance success does not approve RF.
- **Crystal:** present placement is a review arrangement. Short same-layer clock
  paths, return ground, load capacitance, drive level and startup need review;
  route length and frequency offset have not been established.
- **Flash:** the underside WSON requires vias for the six short SPI connections.
  Keep stubs short and avoid routed analog/RF regions; verify skew, return paths,
  VDD_SPI burst margin and boot timing. Winbond permits the center pad grounded,
  but prohibits exposed vias beneath it; the generated-geometry guard enforces
  the absence of such vias. Extra underside parts require a second assembly side.
- **Switching power:** TPS63070 hot loops, current-carrying copper, feedback isolation,
  exposed-pad heat spreading and inductor clearance need a real copper review.
  BQ24075T charging dissipation and the power switch need similar treatment.
- **Frame cable:** the current20-contact contract reserves grounds around audio clocks
  and four VSYS contacts. Actual cable orientation, current sharing, resistance,
  clock edge behavior, terminations and hinge endurance are unverified. It is not
  a routed flex design. Do not count four contacts as four times rated current
  without checking return capacity, connector limits and current balance.
- **Mechanics:** camera, cell, antenna, speaker, lens and measured frame envelope are
  unresolved. Placement can change when these are fixed; neither coupon is a
  final wearable outline. The carrier volume study does not establish fit.

Both independent boards must later pass actual routing/shorts/clearance, plane/return,
thermal and fabrication-output reviews, followed by assembly and bench validation.
No manufacturing file release, order or publication is authorized by this checkpoint.

Routing authority and the staged review-branch plan are recorded in [routing scope](routing-scope-and-plan.md).
