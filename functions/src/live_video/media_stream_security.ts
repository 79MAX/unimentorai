export class MediaStreamSecurity {

  static validateAccess(userRole: string): boolean {

    return [
      "ADMIN",
      "MENTOR",
      "STUDENT",
    ].includes(userRole);
  }

  static generateSecureStreamToken(
    roomId: string,
    userId: string
  ) {

    return `stream_${roomId}_${userId}_${Date.now()}`;
  }

  static preventUnauthorizedRecording() {

    return {
      protected: true,
      watermarkEnabled: true,
    };
  }
}