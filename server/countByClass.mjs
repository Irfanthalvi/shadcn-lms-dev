import { adminDb } from './firebaseAdmin.js';

async function countByClass() {
  const classesSnap = await adminDb.collection('classes').get();
  const classes = [];
  classesSnap.forEach(doc => classes.push({ id: doc.id, ...doc.data() }));
  
  const subjectsSnap = await adminDb.collection('subjects').get();
  const subjects = [];
  subjectsSnap.forEach(doc => subjects.push({ id: doc.id, ...doc.data() }));

  const chaptersSnap = await adminDb.collection('chapters').get();
  const chapters = [];
  chaptersSnap.forEach(doc => chapters.push({ id: doc.id, ...doc.data() }));

  console.log('=== CURRICULUM STATUS BY CLASS ===\n');
  for (const cls of classes) {
    const clsSubjects = subjects.filter(s => s.classId === cls.id);
    const clsChapters = chapters.filter(ch => ch.classId === cls.id);
    console.log(`CLASS: ${cls.name || cls.title} (ID: ${cls.id})`);
    console.log(`  Subjects: ${clsSubjects.length}`);
    for (const sub of clsSubjects) {
      const subChapters = chapters.filter(ch => ch.subjectId === sub.id);
      console.log(`    - ${sub.name || sub.title} (${subChapters.length} chapters)`);
    }
    console.log(`  Total chapters: ${clsChapters.length}\n`);
  }

  process.exit(0);
}

countByClass().catch(err => {
  console.error(err);
  process.exit(1);
});
