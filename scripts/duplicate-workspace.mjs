/**
 * Duplicates all workspace data from one Clerk userId to another.
 * The source user's data is untouched — a full copy is created for the target user.
 *
 * Usage:
 *   SOURCE_USER_ID=user_xxxx TARGET_USER_ID=user_yyyy node scripts/duplicate-workspace.mjs
 */

import { readFileSync } from "fs";
import { randomBytes } from "crypto";
import { MongoClient, ObjectId } from "mongodb";

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

const { SOURCE_USER_ID, TARGET_USER_ID, MONGODB_URI } = process.env;

if (!SOURCE_USER_ID || !TARGET_USER_ID) {
  console.error("Usage: SOURCE_USER_ID=user_xxxx TARGET_USER_ID=user_yyyy node scripts/duplicate-workspace.mjs");
  process.exit(1);
}
if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}
if (SOURCE_USER_ID === TARGET_USER_ID) {
  console.log("Both IDs are the same — nothing to do.");
  process.exit(0);
}

const client = new MongoClient(MONGODB_URI);

function cloneDoc(doc) {
  const { _id, ...rest } = doc;
  return { ...rest, _id: new ObjectId() };
}

async function run() {
  await client.connect();
  const dbName = MONGODB_URI.split("/").pop().split("?")[0];
  const db = client.db(dbName);

  // 1. Find source workspace
  const sourceWorkspace = await db.collection("workspaces").findOne({ ownerUserId: SOURCE_USER_ID });
  if (!sourceWorkspace) {
    console.error(`No workspace found for SOURCE_USER_ID: ${SOURCE_USER_ID}`);
    process.exit(1);
  }
  const sourceWorkspaceId = sourceWorkspace._id;

  // 2. Delete any existing target workspace + its children to start clean
  const existingTarget = await db.collection("workspaces").findOne({ ownerUserId: TARGET_USER_ID });
  if (existingTarget) {
    console.log("Existing target workspace found — removing it first...");
    const targetId = new ObjectId(existingTarget._id);
    const childCollections = [
      "aliases", "domains", "integrations", "emailthreads",
      "cannedresponses", "receivingrequests", "chatwidgets",
      "chatconversations", "subscriptions",
    ];
    for (const col of childCollections) {
      await db.collection(col).deleteMany({ workspaceId: targetId });
    }
    await db.collection("workspaces").deleteOne({ _id: targetId });
    await db.collection("users").deleteMany({ clerkUserId: TARGET_USER_ID });
    console.log("Cleared.\n");
  }

  // 3. Duplicate workspace
  const newWorkspace = cloneDoc(sourceWorkspace);
  newWorkspace.ownerUserId = TARGET_USER_ID;
  await db.collection("workspaces").insertOne(newWorkspace);
  const newWorkspaceId = newWorkspace._id;
  console.log(`Workspace duplicated: ${sourceWorkspaceId} → ${newWorkspaceId}`);

  // 4. Duplicate child collections (swap workspaceId)
  const childCollections = [
    "aliases", "domains", "integrations", "emailthreads",
    "cannedresponses", "receivingrequests", "chatwidgets",
    "chatconversations", "subscriptions",
  ];

  for (const col of childCollections) {
    const docs = await db.collection(col).find({ workspaceId: sourceWorkspaceId }).toArray();
    if (docs.length === 0) continue;
    const clones = docs.map((doc) => {
      const clone = cloneDoc(doc);
      clone.workspaceId = newWorkspaceId;
      // Remap assignedTo and createdBy if they reference the source user
      if (clone.assignedTo === SOURCE_USER_ID) clone.assignedTo = TARGET_USER_ID;
      if (clone.createdBy  === SOURCE_USER_ID) clone.createdBy  = TARGET_USER_ID;
      // Generate a new unique activationKey for chatwidgets
      if (col === "chatwidgets" && clone.activationKey) {
        clone.activationKey = "cw_" + randomBytes(12).toString("hex");
      }
      return clone;
    });
    await db.collection(col).insertMany(clones);
    console.log(`  ${col}: ${clones.length} copied`);
  }

  // 5. Duplicate user record
  const sourceUser = await db.collection("users").findOne({ clerkUserId: SOURCE_USER_ID });
  if (sourceUser) {
    const newUser = cloneDoc(sourceUser);
    newUser.clerkUserId = TARGET_USER_ID;
    await db.collection("users").insertOne(newUser);
    console.log(`  users: 1 copied`);
  }

  console.log("\nDone. Both users now have identical workspace data.");
  await client.close();
}

run().catch(async (err) => {
  console.error("Failed:", err.message);
  await client.close();
  process.exit(1);
});
