import { adminDb } from './firebaseAdmin.js';

async function dumpChapters() {
  const chaptersSnap = await adminDb.collection('chapters').get();
  chaptersSnap.forEach(doc => {
    console.log(`\n=== Chapter: ${doc.id} ===`);
    console.log(JSON.stringify(doc.data(), null, 2));
  });
  process.exit(0);
}

dumpChapters().catch(console.error);
