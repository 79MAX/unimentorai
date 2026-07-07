export class RecordingSecurityManager {

  static validateRecordingAccess(userRole: string): boolean {

    return ["ADMIN", "MENTOR"].includes(userRole);
  }

  static generateSecureRecordingUrl(recordingId: string) {

    return {
      recordingId,
      signedUrl: `secure_recording_${recordingId}`,
      expiresAt: Date.now() + 1000 * 60 * 60,
    };
  }
}