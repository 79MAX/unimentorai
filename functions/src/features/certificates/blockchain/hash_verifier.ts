import { CertificateLedger } from "./certificate_ledger";

export class HashVerifier {

  static async verify(certificateId: string, hashToCheck: string) {

    const record = await CertificateLedger.getCertificateHash(certificateId);

    if (!record) {
      return {
        valid: false,
        reason: "Certificate not found in ledger",
      };
    }

    const isValid = record.hash === hashToCheck;

    return {
      valid: isValid,
      storedHash: record.hash,
      receivedHash: hashToCheck,
    };
  }
}