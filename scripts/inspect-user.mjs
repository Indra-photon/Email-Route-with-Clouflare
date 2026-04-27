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
const userId = "user_3BpwdqPgdTzsuLk1sAFNgixyZZH";

const workspace = await db.collection("workspaces").findOne({ ownerUserId: userId });
console.log("🏢 Workspace for this user:");
console.log(workspace ?? "❌ Not found");

if (workspace) {
  const aliases = await db.collection("aliases").find({ workspaceId: workspace._id }).toArray();
  const integrations = await db.collection("integrations").find({ workspaceId: workspace._id }).toArray();

  console.log(`\n📦 Integrations (${integrations.length}):`);
  for (const i of integrations) console.log(`  _id: ${i._id}  name: ${i.name}  type: ${i.type}`);

  console.log(`\n📧 Aliases (${aliases.length}):`);
  for (const a of aliases) console.log(`  email: ${a.email}  integrationId: ${a.integrationId ?? "null"}  status: ${a.status}`);
}

await mongoose.disconnect();
