import { adminDb } from './firebaseAdmin.js';

async function checkStudent() {
  const doc = await adminDb.collection('users').doc('ohp1laN2e8Mbky7W614OLPog9ze2').get();
  console.log('Student doc:', JSON.stringify(doc.data(), null, 2));
  process.exit(0);
}

checkStudent().catch(console.error);
