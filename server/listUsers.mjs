import { adminAuth, adminDb } from './firebaseAdmin.js';

async function listUsers() {
  const usersSnap = await adminDb.collection('users').get();
  console.log('=== FIRESTORE USERS ===');
  usersSnap.forEach(doc => {
    const data = doc.data();
    console.log(`User: ${doc.id} | Email: ${data.email} | Role: ${data.role} | Approved: ${data.isApproved}`);
  });

  const authList = await adminAuth.listUsers();
  console.log('\n=== AUTH USERS ===');
  authList.users.forEach(u => {
    console.log(`Auth UID: ${u.uid} | Email: ${u.email}`);
  });

  process.exit(0);
}

listUsers().catch(console.error);
