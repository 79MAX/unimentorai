import { CertificateHasher } from "./certificate_hasher";
import { CertificateLedger } from "./certificate_ledger";
import { HashVerifier } from "./hash_verifier";

export class BlockchainCertificateEngine {

  // 🔐 CREATE CERTIFICATE HASH
  static async generateCertificate(data: any) {

    const hash = CertificateHasher.generateHash(data);

    await CertificateLedger.storeCertificateHash({
      certificateId: data.certificateId,
      hash,
      userId: data.userId,
    });

    return {
      certificateId: data.certificateId,
      hash,
      status: "BLOCKCHAIN_REGISTERED",
    };
  }

  // 🔎 VERIFY CERTIFICATE
  static async verifyCertificate(certificateId: string, hash: string) {

    return await HashVerifier.verify(certificateId, hash);
  }
}