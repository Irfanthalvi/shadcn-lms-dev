import { adminDb } from './firebaseAdmin.js';

async function checkCurriculum() {
  console.log('=== CHECKING CLASSES ===');
  const classesSnap = await adminDb.collection('classes').get();
  const classes = [];
  classesSnap.forEach(doc => {
    classes.push({ id: doc.id, ...doc.data() });
  });
  console.log(`Total classes in Firestore: ${classes.length}`);
  classes.forEach(c => console.log(` - ID: "${c.id}", name: "${c.name || c.title || ''}", document data:`, JSON.stringify(c)));

  console.log('\n=== CHECKING SUBJECTS ===');
  const subjectsSnap = await adminDb.collection('subjects').get();
  const subjects = [];
  subjectsSnap.forEach(doc => {
    subjects.push({ id: doc.id, ...doc.data() });
  });
  console.log(`Total subjects in Firestore: ${subjects.length}`);
  subjects.forEach(s => console.log(` - Subject ID: "${s.id}", name: "${s.name || s.title || ''}", classId: "${s.classId}"`));

  console.log('\n=== CHECKING CHAPTERS ===');
  const chaptersSnap = await adminDb.collection('chapters').get();
  const chapters = [];
  chaptersSnap.forEach(doc => {
    chapters.push({ id: doc.id, ...doc.data() });
  });
  console.log(`Total chapters in Firestore: ${chapters.length}`);
  chapters.forEach(ch => {
    console.log(` - Chapter ID: "${ch.id}", classId: "${ch.classId}", subjectId: "${ch.subjectId}", ch#: ${ch.chapterNumber}, title: "${ch.title}", hasVideo: ${!!ch.videoUrl}, hasTextbook: ${!!ch.textbookContent}, hasNotes: ${!!ch.theoryNotes}, hasFormulas: ${!!ch.keyFormulas}`);
    if (ch.videoUrl) console.log(`   videoUrl: ${ch.videoUrl}`);
    if (ch.textbookContent) console.log(`   textbookContent (first 80 chars): ${ch.textbookContent.slice(0, 80)}...`);
    if (ch.theoryNotes) console.log(`   theoryNotes (first 80 chars): ${ch.theoryNotes.slice(0, 80)}...`);
    if (ch.keyFormulas) console.log(`   keyFormulas (first 80 chars): ${ch.keyFormulas.slice(0, 80)}...`);
  });

  console.log('\n=== CHECKING BOOKS ===');
  const booksSnap = await adminDb.collection('books').get();
  const books = [];
  booksSnap.forEach(doc => {
    books.push({ id: doc.id, ...doc.data() });
  });
  console.log(`Total books in Firestore: ${books.length}`);
  books.forEach(b => console.log(` - Book ID: "${b.id}", title: "${b.title}", subjectId: "${b.subjectId}", classId: "${b.classId}"`));

  process.exit(0);
}

checkCurriculum().catch(err => {
  console.error('Error checking curriculum:', err);
  process.exit(1);
});
