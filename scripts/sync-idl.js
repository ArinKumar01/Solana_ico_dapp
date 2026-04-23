const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "target", "idl", "solana_ico.json");
const dst = path.join(__dirname, "..", "lib", "idl.json");

if (!fs.existsSync(src)) {
  console.error("sync-idl: missing", src, "(run anchor build first)");
  process.exit(1);
}
fs.copyFileSync(src, dst);
console.log("sync-idl: copied", src, "->", dst);
