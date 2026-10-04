// Google Maps sometimes resolves the written address to a different nearby point.
// These coordinates mark the supplied Neftçilər Prospekti 44 location.
export function mapsQuery(address: string) {
  const location = address.startsWith("44 Neftçilər Prospekti, Bakı,")
    ? "40.36887,49.84485"
    : address;
  return encodeURIComponent(location);
}

export function googleMapsUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${mapsQuery(address)}`;
}
