import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Manual .env.local parsing (no dotenv dependency)
const envPath = join(__dirname, "../.env.local");
const envLines = readFileSync(envPath, "utf8").split("\n");
for (const line of envLines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIndex = trimmed.indexOf("=");
  if (eqIndex === -1) continue;
  const key = trimmed.slice(0, eqIndex).trim();
  const value = trimmed.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, "");
  process.env[key] = value;
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);
console.log("✅ Connected to MongoDB\n");

const db = mongoose.connection.db;

// ── 1. Integrations ──────────────────────────────────────────────────────────
const integrations = await db.collection("integrations").find({}).toArray();
console.log(`📦 Integrations (${integrations.length} total):`);
for (const i of integrations) {
  console.log(`  _id: ${i._id}  type: ${i.type}  name: ${i.name}  workspaceId: ${i.workspaceId}`);
}

// ── 2. Aliases ───────────────────────────────────────────────────────────────
const aliases = await db.collection("aliases").find({}).toArray();
console.log(`\n📧 Aliases (${aliases.length} total):`);
for (const a of aliases) {
  const intId = a.integrationId?.toString() ?? "null";
  const linked = integrations.find(i => i._id.toString() === intId);
  const linkStatus = !a.integrationId
    ? "⚪ no integration"
    : linked
    ? `✅ linked → ${linked.name}`
    : `❌ BROKEN (points to ${intId} — not found)`;

  console.log(`  email: ${a.email}  status: ${a.status}  integration: ${linkStatus}`);
}

// ── 3. Summary ───────────────────────────────────────────────────────────────
const broken = aliases.filter(
  (a) => a.integrationId && !integrations.find(i => i._id.toString() === a.integrationId?.toString())
);
if (broken.length > 0) {
  console.log(`\n⚠️  ${broken.length} alias(es) with BROKEN integrationId:`);
  for (const a of broken) {
    console.log(`  → ${a.email} still points to deleted integrationId: ${a.integrationId}`);
  }
  console.log("\n💡 Fix: run this in MongoDB Compass or mongo shell:");
  console.log(`   db.aliases.updateMany({ integrationId: { $in: [${broken.map(a => `ObjectId("${a.integrationId}")`).join(", ")}] } }, { $unset: { integrationId: "" } })`);
} else {
  console.log("\n✅ All alias→integration links look healthy.");
}

await mongoose.disconnect();
