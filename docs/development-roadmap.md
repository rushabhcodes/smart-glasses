# Development roadmap

Current status is detailed in [compact design](compact-design.md).

- [x] Locked tsCircuit development environment; both previews functionally checked.
- [x] Original firmware build/size and host tests; no flashing or account/hardware proof.
- [x] Preserve WROOM baseline and actual3D snapshot.
- [x] Compact PICO comparison and R8 alternative, regulator and capture/indicator schematic.
- [x] Officially imported ICS-43434 replacement, local bypass/pulldown/acoustic-hole correction.
- [x] Right charger, hardware switch, gauge, amplifier and touch review circuits.
- [x] Matching20-contact logical cable contract and generated connectivity guards.
- [x] Review R8 supply/boot modes and add an external GPIO3 bias; generated guards pass.
- [x] Pin the OV5640 carrier source revision and investigate a conditional1.8 V interface.
- [x] Build an independent default-off Seeed AF-module carrier with audited contact mapping, three controlled rails, translated signals and host-tested sequencing contract; see [carrier review](camera-carrier-review.md).
- [ ] Qualify the AF motor/driver supply, connector mating/lands, actual rail controls/monitor adapter, OV5640 firmware and compact frame integration.
- [ ] Qualify and select exact camera/revision, rail sequencing and capture timing.
- [ ] Qualify a compact protected battery after delegated component selection; exact assembled rating, NTC, maximum dimensions and sourcing remain unverified.
- [ ] Resolve exact camera module/lens/carrier and its connector/rails/reset behavior.
- [x] Research stocked same-capacity R8 + external-flash alternative; preserve PICO milestone139a02a.
- [x] Stocked ECS crystal/manual manufacturer land pattern and common3.3 V memory-feed review.
- [x] Audit45 PCB supplier IDs against direct JLC records; distinguish LCSC inventory and process tiers.
- [x] Replace scarce comparator/button and qualify touch-buffer package/initial crystal loads.
- [ ] Confirm assembly inventory; measure clock/RF/memory behavior.
- [x] Glasses-shaped tsCircuit/JSCAD fit prototype with 11 closed STL parts, actual board CAD, service covers and static interference checks.
- [x] First local four-layer flex installation study: original electrical contracts preserved, two/three component islands, static bend keepouts and actual combined CAD views.
- [x] Correct main-core backing to one continuous windowed pattern; check actual native union, 0.6 mm structural spine and closed single-body review STL.
- [x] Local 17 mm slim-board variant with unchanged functional pin connections, low-profile ACH headers, continuous backing and measured CAD; see [form-factor review](slim-temple-review.md).
- [x] Assess the actual folded slim CAD against old arm cavities; add static split envelopes with measured clearances and conservative solid-containment checks. See [fit review](slim-housing-fit.md).
- [ ] Qualify ACH assembly sourcing, mating harness/polarity, wire clearance/current/temperature rise and a fitted slim temple housing.
- [ ] Qualify flex stackup, main-core backing/rigid-flex support, routing across necks, coverlay/stiffener fabrication data and replaceable hinge interconnect.
- [ ] Measure wearer/frame fit; qualify enclosure material, optics, fastening, cables and thermal/acoustic behavior.
- [ ] Select physical cell/NTC adapter, antenna/coax, speaker and final frame envelope.
- [ ] Finish input protection and low-battery shutdown/recovery against the selected pack.
- [ ] Close footprint/paste/via-in-pad, power/thermal/RF/memory-rail and mechanical reviews.
- [ ] Route both boards; run electrical/manufacturing review and review all fabrication files.
- [ ] Bench-test power/charging/temperature, cable, audio, camera, RF and recovery.
- [ ] Verify custom SiP/mic firmware, Muse pairing, audio/photo round trip and indicator policy.
- [ ] Physical fit, hinge endurance, acoustic and thermal tests before wearable trials.

Implemented source and passing host checks are schematic milestones. They are not
routing completion, manufacturability, a fit claim or hardware validation. Published
0.1.2 retains the earlier checkpoint; the 0.1.3 update exposes the slimmer boards and static envelopes. No purchase,
fabrication order, main merge or flashing is part of the current work.
