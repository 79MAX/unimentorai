const crypto = require("crypto");

/* =========================
   🔗 BLOCKCHAIN LEDGER V2 (IMMUTABLE CORE)
========================= */

class Ledger {
  constructor() {
    this.chain = [];
    this.genesis();
  }

  /* =========================
     🔐 HASH ENGINE (SAFE + DETERMINISTIC)
  ========================= */
  hash(data) {
    const input =
      typeof data === "string"
        ? data
        : JSON.stringify(data, Object.keys(data).sort());

    return crypto.createHash("sha256").update(input, "utf8").digest("hex");
  }

  /* =========================
     🧱 GENESIS BLOCK (IMMUTABLE)
  ========================= */
  genesis() {
    const genesisBlock = Object.freeze({
      index: 0,
      data: "GENESIS",
      prevHash: "0",
      timestamp: Date.now(),
      hash: this.hash("GENESIS:0")
    });

    this.chain.push(genesisBlock);
  }

  /* =========================
     ➕ ADD BLOCK (CERTIFICATE)
  ========================= */
  add(cert, certHash) {
    if (!cert?.id) throw new Error("Invalid certificate");

    const prev = this.chain[this.chain.length - 1];

    const blockData = Object.freeze({
      id: cert.id,
      hash: certHash
    });

    const blockHash = this.hash({
      id: cert.id,
      certHash,
      prevHash: prev.hash
    });

    const block = Object.freeze({
      index: this.chain.length,
      data: blockData,
      prevHash: prev.hash,
      timestamp: Date.now(),
      hash: blockHash
    });

    this.chain.push(block);

    return block;
  }

  /* =========================
     🔍 FIND BLOCK
  ========================= */
  find(id) {
    return this.chain.find(b => b.data?.id === id);
  }

  /* =========================
     🧪 VERIFY FULL CHAIN INTEGRITY
  ========================= */
  verify() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const prev = this.chain[i - 1];

      if (current.prevHash !== prev.hash) return false;

      const recalculated = this.hash({
        id: current.data.id,
        certHash: current.data.hash,
        prevHash: prev.hash
      });

      if (current.hash !== recalculated) return false;
    }

    return true;
  }

  /* =========================
     📦 SAFE EXPORT COPY
  ========================= */
  getChain() {
    return this.chain.map(b => Object.freeze({ ...b }));
  }
}

module.exports = new Ledger();

