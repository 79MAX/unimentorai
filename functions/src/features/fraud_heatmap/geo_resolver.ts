export class GeoResolver {

  // ⚡ MOCK SAFE VERSION (replace later with ipinfo / maxmind)
  static resolve(ip?: string) {

    if (!ip) {
      return { country: "UNKNOWN", city: "UNKNOWN", lat: 0, lng: 0 };
    }

    // simple hash-based fake geo distribution (safe MVP)
    const hash = this.hash(ip);

    const lat = (hash % 180) - 90;
    const lng = (hash % 360) - 180;

    return {
      country: "SIMULATED",
      city: "NODE_" + (hash % 100),
      lat,
      lng,
    };
  }

  private static hash(str: string) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h;
  }
}