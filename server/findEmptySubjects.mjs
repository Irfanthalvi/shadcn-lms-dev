import { adminDb } from './firebaseAdmin.js';

async function findEmptySubjects() {
  const classesSnap = await adminDb.collection('classes').get();
  const classes = [];
  classesSnap.forEach(doc => classes.push({ id: doc.id, ...doc.data() }));
  
  const subjectsSnap = await adminDb.collection('subjects').get();
  const subjects = [];
  subjectsSnap.forEach(doc => subjects.push({ id: doc.id, ...doc.data() }));

  const chaptersSnap = await adminDb.collection('chapters').get();
  const chapters = [];
  chaptersSnap.forEach(doc => chapters.push({ id: doc.id, ...doc.data() }));

  console.log('\n=== SUBJECTS WITH MISSING CHAPTERS ===\n');
  for (const cls of classes) {
    const clsSubjects = subjects.filter(s => s.classId === cls.id);
    for (const sub of clsSubjects) {
      const subChapters = chapters.filter(ch => ch.subjectId === sub.id);
      if (subChapters.length === 0) {
        console.log(`Class: ${cls.name} | Subject: ${sub.name} | SubjectID: ${sub.id} | ClassID: ${cls.id}`);
      }
    }
  }
  process.exit(0);
}

findEmptySubjects().catch(err => { console.error(err); process.exit(1); });
