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
console.log("✅ Connected to MongoDB\n");

const db = mongoose.connection.db;

const integrations = await db.collection("integrations").find({}).toArray();
const integrationIds = new Set(integrations.map(i => i._id.toString()));

const aliases = await db.collection("aliases").find({}).toArray();

const broken = aliases.filter(
  a => a.integrationId && !integrationIds.has(a.integrationId.toString())
);

if (broken.length === 0) {
  console.log("✅ No broken aliases found. Nothing to fix.");
  await mongoose.disconnect();
  process.exit(0);
}

console.log(`🗑️  Deleting ${broken.length} broken alias(es):`);
for (const a of broken) {
  console.log(`  → ${a.email}  integrationId: ${a.integrationId}`);
}

const ids = broken.map(a => a._id);
const result = await db.collection("aliases").deleteMany({ _id: { $in: ids } });
console.log(`\n✅ Deleted ${result.deletedCount} broken alias(es).`);

await mongoose.disconnect();
