import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
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

await mongoose.connect(process.env.MONGODB_URI);
console.log("✅ Connected\n");

const db = mongoose.connection.db;
const aliases = await db.collection("aliases").find({}).toArray();

console.log("📧 All aliases (full detail):");
for (const a of aliases) {
  console.log(`  _id: ${a._id}`);
  console.log(`  email: ${a.email}`);
  console.log(`  localPart: ${a.localPart}`);
  console.log(`  domainId: ${a.domainId}`);
  console.log(`  workspaceId: ${a.workspaceId}`);
  console.log(`  integrationId: ${a.integrationId ?? "null"}`);
  console.log(`  status: ${a.status}`);
  console.log();
}

// Check actual indexes on the aliases collection
const indexes = await db.collection("aliases").indexes();
console.log("🗂️  Indexes on aliases collection:");
for (const idx of indexes) {
  console.log(`  ${JSON.stringify(idx.key)}  unique: ${idx.unique ?? false}`);
}

await mongoose.disconnect();
