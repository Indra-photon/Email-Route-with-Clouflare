/**
 * Copies all workspace data from production to development.
 * Dev data is wiped first, then a fresh copy of prod is created for the dev user.
 *
 * Usage:
 *   node scripts/sync-prod-to-dev.mjs
 */

import { readFileSync } from "fs";
import { randomBytes } from "crypto";
import { MongoClient, ObjectId } from "mongodb";

const PROD_USER_ID = "user_3BpwdqPgdTzsuLk1sAFNgixyZZH";
const DEV_USER_ID  = "user_3Cl3uiIc1c4mDrMQLuybKWp7UvM";

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

const { MONGODB_URI } = process.env;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
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

  // 1. Find prod workspace
  const prodWorkspace = await db.collection("workspaces").findOne({ ownerUserId: PROD_USER_ID });
  if (!prodWorkspace) {
    console.error("No production workspace found.");
    process.exit(1);
  }
  const prodWorkspaceId = prodWorkspace._id;

  // 2. Wipe existing dev workspace and all its children
  const devWorkspace = await db.collection("workspaces").findOne({ ownerUserId: DEV_USER_ID });
  if (devWorkspace) {
    console.log("Wiping existing dev workspace...");
    const devId = new ObjectId(devWorkspace._id);
    const childCollections = [
      "aliases", "domains", "integrations", "emailthreads",
      "cannedresponses", "receivingrequests", "chatwidgets",
      "chatconversations", "subscriptions",
    ];
    for (const col of childCollections) {
      await db.collection(col).deleteMany({ workspaceId: devId });
    }
    await db.collection("workspaces").deleteOne({ _id: devId });
    await db.collection("users").deleteMany({ clerkUserId: DEV_USER_ID });
    console.log("Wiped.\n");
  }

  // 3. Copy workspace
  const newWorkspace = cloneDoc(prodWorkspace);
  newWorkspace.ownerUserId = DEV_USER_ID;
  await db.collection("workspaces").insertOne(newWorkspace);
  const newWorkspaceId = newWorkspace._id;
  console.log(`Workspace copied: ${prodWorkspaceId} → ${newWorkspaceId}`);

  // 4. Copy child collections
  const childCollections = [
    "aliases", "domains", "integrations", "emailthreads",
    "cannedresponses", "receivingrequests", "chatwidgets",
    "chatconversations", "subscriptions",
  ];

  for (const col of childCollections) {
    const docs = await db.collection(col).find({ workspaceId: prodWorkspaceId }).toArray();
    if (docs.length === 0) continue;
    const clones = docs.map((doc) => {
      const clone = cloneDoc(doc);
      clone.workspaceId = newWorkspaceId;
      if (clone.assignedTo === PROD_USER_ID) clone.assignedTo = DEV_USER_ID;
      if (clone.createdBy  === PROD_USER_ID) clone.createdBy  = DEV_USER_ID;
      if (col === "chatwidgets" && clone.activationKey) {
        clone.activationKey = "cw_" + randomBytes(12).toString("hex");
      }
      return clone;
    });
    await db.collection(col).insertMany(clones);
    console.log(`  ${col}: ${docs.length} copied`);
  }

  // 5. Copy user record
  const prodUser = await db.collection("users").findOne({ clerkUserId: PROD_USER_ID });
  if (prodUser) {
    const newUser = cloneDoc(prodUser);
    newUser.clerkUserId = DEV_USER_ID;
    await db.collection("users").insertOne(newUser);
    console.log(`  users: 1 copied`);
  }

  console.log("\nDone. Dev is now a fresh copy of production.");
  await client.close();
}

run().catch(async (err) => {
  console.error("Failed:", err.message);
  await client.close();
  process.exit(1);
});
