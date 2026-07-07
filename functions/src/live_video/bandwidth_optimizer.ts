export class BandwidthOptimizer {

  static optimize(networkQuality: number) {

    if (networkQuality < 30) {
      return {
        videoQuality: "LOW",
        bitrate: 250,
      };
    }

    if (networkQuality < 70) {
      return {
        videoQuality: "MEDIUM",
        bitrate: 700,
      };
    }

    return {
      videoQuality: "HIGH",
      bitrate: 1500,
    };
  }
}