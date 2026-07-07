export interface DeviceFingerprint {
  deviceId: string;
  fingerprint: string;
  trustScore: number;
  riskScore: number;
  isEmulator: boolean;
  isBot: boolean;
  createdAt: number;
}