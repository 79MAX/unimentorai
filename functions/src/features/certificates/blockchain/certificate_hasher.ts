import crypto from "crypto";

export class CertificateHasher {

  static generateHash(data: any): string {

    const raw = JSON.stringify({
      certificateId: data.certificateId,
      userId: data.userId,
      courseId: data.courseId,
      issuedAt: data.issuedAt,
    });

    return crypto
      .createHash("sha256")
      .update(raw)
      .digest("hex");
  }
}