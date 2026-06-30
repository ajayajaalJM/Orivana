/**
 * Verified Unsplash URLs for Orivana mock/demo imagery.
 * All IDs tested — do not use placeholder or guessed photo IDs.
 */
export const images = {
  /** Medjool dates in a ceramic bowl */
  datesBowl: "https://images.unsplash.com/photo-1742204618752-295ed6d4b5e0",
  /** Rows of dried dates — macro texture */
  datesRows: "https://images.unsplash.com/photo-1770617476915-7269d29d27dc",
  /** Olive oil bottles — green-gold liquid */
  oliveOil: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5",
  /** Olive branches / grove greenery */
  oliveGrove: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b",
  /** Golden honey dripping from a wooden dipper */
  honeyDipper: "https://images.unsplash.com/photo-1771405317876-616a62efd97e",
  /** Honeycomb macro — amber texture */
  honeycomb: "https://images.unsplash.com/photo-1773957949151-338dedf0edce",
  /** Mediterranean ingredients flat lay */
  mediterraneanSpread: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
  /** Mediterranean coast at golden hour — hero / brand */
  heroCoast: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  /** Olive harvest / pastoral landscape — journal */
  pastoralLandscape: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
} as const;

export function img(url: string, width = 1200): string {
  return `${url}?w=${width}&q=80`;
}
