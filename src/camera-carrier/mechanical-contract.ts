/** Source-backed nominal assembly data and explicitly provisional design reserves.
 * No measured frame fit, manufacturer-maximum actuator envelope or bend-life claim.
 */
export const cameraCarrierMechanics = {
  carrier: { widthMm: 58, heightMm: 18, thicknessMm: 0.8, layers: 4 },
  moduleRevision: "MJY5OAF-F3M-V1",
  moduleNominal: { headMm: [8.5, 8.5, 5.5], overallLengthMm: 70.5,
    tongueWidthMm: 12.5, tongueThicknessMm: 0.3, contacts: 24, pitchMm: 0.5 },
  provisionalHeadReserveMm: [10, 10, 7],
  headReserveIsManufacturerMaximum: false,
  cameraFlexBendRadiusQualified: false,
  heatSinkEnvelopeVerified: false,
  fittedIntoFrame: false,
} as const
