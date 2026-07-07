constructor({ basePath, context = {} } = {}) {
  this.root = path.resolve(process.cwd(), "backend/src");

  // ✅ FIX ABSOLU: NEVER src
  this.basePath =
    basePath ||
    path.resolve(this.root, "modules");

  this.context = context;

  this.modules = new Map();
  this.services = new Map();
  this.graph = new Map();

  this.ops = {
    total: 0,
    loaded: 0,
    failed: 0,
    repaired: 0,
  };

  this.systemHealth = 0;
}
