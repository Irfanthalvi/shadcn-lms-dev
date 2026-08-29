/**
 * deploy-firestore-rules.mjs
 *
 * Deploys firestore.rules to Firebase using the Firebase REST API.
 * Run: node deploy-firestore-rules.mjs
 *
 * You need a Firebase project OAuth token. Get one by:
 *   1. Install firebase-tools globally: npm install -g firebase-tools
 *   2. Run: firebase login
 *   3. Run: firebase projects:list  (verify project is listed)
 *   4. Then run: node deploy-firestore-rules.mjs
 *
 * Or use Firebase Console directly to paste the rules:
 *   Firebase Console → Firestore → Rules → paste contents of firestore.rules → Publish
 */

import { readFileSync } from "fs";
import { execSync } from "child_process";

const PROJECT_ID = "student-preparation-portal";
const RULES_FILE = "./firestore.rules";

const rules = readFileSync(RULES_FILE, "utf-8");

// Try to get token from firebase-tools
let token;
try {
  token = execSync("firebase --non-interactive --token . print-access-token 2>nul", {
    encoding: "utf-8",
  }).trim();
} catch {
  // firebase-tools not available or not logged in
}

if (!token) {
  console.log("-------------------------------------------");
  console.log("Firebase CLI not available or not logged in.");
  console.log("Please deploy rules manually via Firebase Console:");
  console.log("1. Go to: https://console.firebase.google.com/project/student-preparation-portal/firestore/rules");
  console.log("2. Replace ALL rules with the contents of: firestore.rules");
  console.log("3. Click Publish");
  console.log("-------------------------------------------");
  console.log("\nRules to publish:\n");
  console.log(rules);
  process.exit(0);
}

const url = `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/rulesets`;
const body = JSON.stringify({
  source: {
    files: [
      {
        name: "firestore.rules",
        content: rules,
      },
    ],
  },
});

const response = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body,
});

if (!response.ok) {
  const err = await response.text();
  console.error("Failed to create ruleset:", err);
  process.exit(1);
}

const ruleset = await response.json();
console.log("Ruleset created:", ruleset.name);

// Now release the ruleset to the Firestore database
const releaseUrl = `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/releases/cloud.firestore`;
const releaseBody = JSON.stringify({
  release: {
    name: `projects/${PROJECT_ID}/releases/cloud.firestore`,
    rulesetName: ruleset.name,
  },
});

const releaseRes = await fetch(releaseUrl, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: releaseBody,
});

if (!releaseRes.ok) {
  const err = await releaseRes.text();
  console.error("Failed to release ruleset:", err);
  process.exit(1);
}

console.log("✅ Firestore rules deployed successfully to project:", PROJECT_ID);
