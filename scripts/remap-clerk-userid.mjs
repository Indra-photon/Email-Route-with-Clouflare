/**
 * Remaps a production Clerk userId to a dev Clerk userId in MongoDB.
 *
 * If the dev user already has an auto-created workspace (from logging in once),
 * it is deleted first to avoid duplicates.
 *
 * Usage:
 *   PROD_USER_ID=user_xxxx DEV_USER_ID=user_yyyy node scripts/remap-clerk-userid.mjs
 */

import { readFileSync } from "fs";
import { MongoClient, ObjectId } from "mongodb";

// Load .env.local without requiring dotenv
function loadEnv() {
  try {
    const lines = readFileSync(".env.local", "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {}
}

loadEnv();

const { PROD_USER_ID, DEV_USER_ID, MONGODB_URI } = process.env;

if (!PROD_USER_ID || !DEV_USER_ID) {
  console.error("Usage: PROD_USER_ID=user_xxxx DEV_USER_ID=user_yyyy node scripts/remap-clerk-userid.mjs");
  process.exit(1);
}
if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}
if (PROD_USER_ID === DEV_USER_ID) {
  console.log("Both IDs are the same — nothing to do.");
  process.exit(0);
}

const client = new MongoClient(MONGODB_URI);

async function run() {
  await client.connect();
  const dbName = MONGODB_URI.split("/").pop().split("?")[0];
  const db = client.db(dbName);

  // Delete existing dev workspace to avoid duplicates
  const devWorkspaces = await db.collection("workspaces").find({ ownerUserId: DEV_USER_ID }).toArray();
  if (devWorkspaces.length > 0) {
    console.log(`Found ${devWorkspaces.length} existing dev workspace(s) — deleting them first...`);
    for (const ws of devWorkspaces) {
      const id = new ObjectId(ws._id);
      const childCollections = [
        "aliases", "domains", "integrations", "emailthreads",
        "cannedresponses", "receivingrequests", "chatwidgets",
        "chatconversations", "subscriptions",
      ];
      for (const col of childCollections) {
        const { deletedCount } = await db.collection(col).deleteMany({ workspaceId: id });
        if (deletedCount > 0) console.log(`  deleted ${deletedCount} from ${col}`);
      }
      await db.collection("workspaces").deleteOne({ _id: id });
    }
    await db.collection("users").deleteMany({ clerkUserId: DEV_USER_ID });
    console.log("Dev workspace purged.\n");
  }

  // Remap prod userId → dev userId
  const updates = [
    ["users",         { clerkUserId: PROD_USER_ID }, { $set: { clerkUserId: DEV_USER_ID } }],
    ["workspaces",    { ownerUserId: PROD_USER_ID }, { $set: { ownerUserId: DEV_USER_ID } }],
    ["emailthreads",  { assignedTo:  PROD_USER_ID }, { $set: { assignedTo:  DEV_USER_ID } }],
    ["cannedresponses", { createdBy: PROD_USER_ID }, { $set: { createdBy:   DEV_USER_ID } }],
  ];

  console.log(`Remapping ${PROD_USER_ID} → ${DEV_USER_ID}`);
  for (const [col, filter, update] of updates) {
    const { modifiedCount } = await db.collection(col).updateMany(filter, update);
    console.log(`  ${col}: ${modifiedCount} updated`);
  }

  console.log("\nDone.");
  await client.close();
}

run().catch(async (err) => {
  console.error("Failed:", err.message);
  await client.close();
  process.exit(1);
});
