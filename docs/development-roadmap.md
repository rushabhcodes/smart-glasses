# Development roadmap

Current status is detailed in [compact design](compact-design.md).

- [x] Locked tsCircuit development environment; both previews functionally checked.
- [x] Original firmware build/size and host tests; no flashing or account/hardware proof.
- [x] Preserve WROOM baseline and actual3D snapshot.
- [x] Compact PICO comparison and R8 alternative, regulator and capture/indicator schematic.
- [x] Officially imported ICS-43434 replacement, local bypass/pulldown/acoustic-hole correction.
- [x] Right charger, hardware switch, gauge, amplifier and touch review circuits.
- [x] Matching20-contact logical cable contract and generated connectivity guards.
- [ ] Resolve exact camera module/lens/carrier and its connector/rails/reset behavior.
- [x] Research stocked same-capacity R8 + external-flash alternative; preserve PICO milestone139a02a.
- [x] Exact Abracon crystal option/land correction and common3.3 V memory-feed review.
- [ ] Confirm assembly inventory; measure clock/RF/memory behavior.
- [ ] Select physical cell/NTC adapter, antenna/coax, speaker and final frame envelope.
- [ ] Finish input protection and low-battery shutdown/recovery against the selected pack.
- [ ] Close footprint/paste/via-in-pad, power/thermal/RF/memory-rail and mechanical reviews.
- [ ] Route both boards; run electrical/manufacturing review and review all fabrication files.
- [ ] Bench-test power/charging/temperature, cable, audio, camera, RF and recovery.
- [ ] Verify custom SiP/mic firmware, Muse pairing, audio/photo round trip and indicator policy.
- [ ] Physical fit, hinge endurance, acoustic and thermal tests before wearable trials.

Implemented source and passing host checks are schematic milestones. They are not
routing completion, manufacturability, a fit claim or hardware validation. No publication,
purchase, fabrication order, main merge or flashing is part of the current work.
