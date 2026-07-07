const crypto = require("crypto");

/* =========================
   🔗 IMMUTABLE LEDGER CORE
========================= */

class Ledger {
  constructor() {
    this.chain = Object.freeze([]);
    this._init();
  }

  /* =========================
     🔐 HASH ENGINE (STRICT)
  ========================= */
  hash(input) {
    const data =
      typeof input === "string"
        ? input
        : JSON.stringify(input, Object.keys(input).sort());

    return crypto.createHash("sha256").update(data).digest("hex");
  }

  /* =========================
     🧱 GENESIS BLOCK
  ========================= */
  _init() {
    const genesis = this._createBlock({
      index: 0,
      data: "GENESIS_BLOCK",
      prevHash: "0"
    });

    this.chain = [genesis];
  }

  /* =========================
     🧱 INTERNAL BLOCK CREATION
  ========================= */
  _createBlock({ index, data, prevHash }) {
    const blockPayload = {
      index,
      timestamp: Date.now(),
      data,
      prevHash
    };

    return Object.freeze({
      ...blockPayload,
      hash: this.hash(blockPayload)
    });
  }

  /* =========================
     ➕ ADD CERTIFICATE BLOCK
  ========================= */
  addCertificate(cert, certHash) {
    if (!cert?.id) throw new Error("Invalid certificate");

    const prev = this.chain[this.chain.length - 1];

    const data = Object.freeze({
      id: cert.id,
      hash: certHash
    });

    const block = this._createBlock({
      index: this.chain.length,
      data,
      prevHash: prev.hash
    });

    this.chain = Object.freeze([...this.chain, block]);

    return block;
  }

  /* =========================
     🔍 VERIFY FULL INTEGRITY
  ========================= */
  verifyChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const cur = this.chain[i];
      const prev = this.chain[i - 1];

      // check link
      if (cur.prevHash !== prev.hash) return false;

      // recompute hash
      const recalculated = this.hash({
        index: cur.index,
        timestamp: cur.timestamp,
        data: cur.data,
        prevHash: cur.prevHash
      });

      if (cur.hash !== recalculated) return false;
    }

    return true;
  }

  /* =========================
     🔍 FIND SAFE
  ========================= */
  findById(id) {
    return this.chain.find(
      (b) => b.data?.id === id
    );
  }
}

module.exports = new Ledger();
