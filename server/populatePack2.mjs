import { adminDb } from './firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';
import { CURRICULUM_PACK_2 } from './curriculumPack2.mjs';

async function populatePack2() {
  console.log('=== POPULATING CURRICULUM PACK 2 ===\n');

  const classesSnap = await adminDb.collection('classes').orderBy('grade', 'asc').get();
  const classMap = new Map();
  classesSnap.forEach(doc => {
    const data = doc.data();
    classMap.set(Number(data.grade), { id: doc.id, name: data.name });
  });

  const subjectsSnap = await adminDb.collection('subjects').get();
  const subjectMap = new Map();
  subjectsSnap.forEach(doc => {
    const data = doc.data();
    const key = `${data.classId}_${(data.name || '').trim().toLowerCase()}`;
    subjectMap.set(key, doc.id);
  });

  const booksSnap = await adminDb.collection('books').get();
  const subjectToBookMap = new Map();
  booksSnap.forEach(doc => {
    const data = doc.data();
    if (data.subjectId) {
      subjectToBookMap.set(data.subjectId, doc.id);
    }
  });

  const chaptersSnap = await adminDb.collection('chapters').get();
  const chapterMap = new Map();
  chaptersSnap.forEach(doc => {
    const data = doc.data();
    const key = `${data.subjectId}_${data.chapterNumber}`;
    const hasContent = !!(
      (data.theoryNotes && data.theoryNotes.trim().length > 30) ||
      (data.textbookContent && data.textbookContent.trim().length > 30)
    );
    chapterMap.set(key, { id: doc.id, hasContent, title: data.title });
  });

  let chaptersCreated = 0;
  let chaptersUpdated = 0;
  let chaptersSkipped = 0;
  let booksCreated = 0;
  let booksUpdated = 0;

  for (const gradeItem of CURRICULUM_PACK_2) {
    const classObj = classMap.get(gradeItem.grade);
    if (!classObj) continue;
    const realClassId = classObj.id;

    for (const subItem of gradeItem.subjects) {
      // Find subject by exact name or case-insensitive
      const subjectLookupKey = `${realClassId}_${subItem.name.trim().toLowerCase()}`;
      let realSubjectId = subjectMap.get(subjectLookupKey);

      // If not found, try searching by partial match among subjects for this class
      if (!realSubjectId) {
        subjectsSnap.forEach(sDoc => {
          const sData = sDoc.data();
          if (sData.classId === realClassId) {
            if (
              sData.name?.toLowerCase().includes(subItem.name.toLowerCase()) ||
              subItem.name?.toLowerCase().includes(sData.name?.toLowerCase())
            ) {
              realSubjectId = sDoc.id;
            }
          }
        });
      }

      if (!realSubjectId) {
        console.warn(`Subject "${subItem.name}" for Class ${gradeItem.grade} not found in Firestore. Creating...`);
        const newSubRef = await adminDb.collection('subjects').add({
          classId: realClassId,
          name: subItem.name,
          code: subItem.code,
          icon: subItem.icon,
          color: subItem.color,
          description: `${subItem.name} syllabus for ${classObj.name}`,
          createdAt: FieldValue.serverTimestamp(),
        });
        realSubjectId = newSubRef.id;
        subjectMap.set(subjectLookupKey, realSubjectId);
      }

      console.log(`Class ${gradeItem.grade} -> Subject "${subItem.name}" (ID: ${realSubjectId})`);

      // Ensure Book
      let realBookId = subjectToBookMap.get(realSubjectId);
      if (!realBookId) {
        // Check existing books by title
        let foundBook = null;
        booksSnap.forEach(bDoc => {
          const bData = bDoc.data();
          if (
            (bData.classId === realClassId || bData.classId === `class-${gradeItem.grade}`) &&
            (bData.title?.toLowerCase().includes(subItem.name.toLowerCase()) ||
             subItem.bookTitle?.toLowerCase().includes(bData.title?.toLowerCase()))
          ) {
            foundBook = { id: bDoc.id, ...bData };
          }
        });

        if (foundBook) {
          await adminDb.collection('books').doc(foundBook.id).update({
            classId: realClassId,
            subjectId: realSubjectId,
            updatedAt: FieldValue.serverTimestamp(),
          });
          realBookId = foundBook.id;
          subjectToBookMap.set(realSubjectId, realBookId);
          booksUpdated++;
          console.log(`  * LINKED existing Book: "${foundBook.title}" -> ${realBookId}`);
        } else {
          const newBRef = await adminDb.collection('books').add({
            classId: realClassId,
            subjectId: realSubjectId,
            title: subItem.bookTitle || `${subItem.name} for ${classObj.name}`,
            author: 'Sindh Textbook Board Panel of Authors',
            board: 'Sindh Textbook Board, Jamshoro',
            edition: 'Single National Curriculum Edition',
            description: `Official textbook prescribed by the Sindh Textbook Board for ${classObj.name} ${subItem.name}.`,
            coverUrl: '',
            totalChapters: subItem.chapters.length,
            createdAt: FieldValue.serverTimestamp(),
          });
          realBookId = newBRef.id;
          subjectToBookMap.set(realSubjectId, realBookId);
          booksCreated++;
          console.log(`  + CREATED Book: "${subItem.bookTitle}" -> ${realBookId}`);
        }
      }

      // Process Chapters
      for (const ch of subItem.chapters) {
        const chapterLookupKey = `${realSubjectId}_${ch.chapterNumber}`;
        const existingChap = chapterMap.get(chapterLookupKey);

        const chapterPayload = {
          classId: realClassId,
          subjectId: realSubjectId,
          bookId: realBookId || '',
          chapterNumber: ch.chapterNumber,
          title: ch.title,
          description: ch.description,
          learningObjectives: ch.learningObjectives || [],
          textbookContent: ch.textbookContent || '',
          theoryNotes: ch.theoryNotes || '',
          keyFormulas: ch.keyFormulas || '',
          videoUrl: ch.videoUrl || '',
          resourceLink: 'https://ebooks.stbb.edu.pk',
        };

        if (existingChap) {
          if (!existingChap.hasContent) {
            await adminDb.collection('chapters').doc(existingChap.id).update({
              ...chapterPayload,
              updatedAt: FieldValue.serverTimestamp(),
            });
            console.log(`    ^ UPDATED Chapter ${ch.chapterNumber}: "${ch.title}" -> ${existingChap.id}`);
            chaptersUpdated++;
          } else {
            console.log(`    = EXISTS Chapter ${ch.chapterNumber}: "${existingChap.title}" [Preserved]`);
            chaptersSkipped++;
          }
        } else {
          const newChRef = await adminDb.collection('chapters').add({
            ...chapterPayload,
            createdAt: FieldValue.serverTimestamp(),
          });
          chapterMap.set(chapterLookupKey, { id: newChRef.id, hasContent: true, title: ch.title });
          console.log(`    + CREATED Chapter ${ch.chapterNumber}: "${ch.title}" -> ${newChRef.id}`);
          chaptersCreated++;
        }
      }
    }
  }

  console.log('\n=== PACK 2 POPULATION COMPLETE ===');
  console.log(`Books Created: ${booksCreated}`);
  console.log(`Books Updated: ${booksUpdated}`);
  console.log(`Chapters Created: ${chaptersCreated}`);
  console.log(`Chapters Updated: ${chaptersUpdated}`);
  console.log(`Chapters Preserved: ${chaptersSkipped}`);

  const finalChaptersSnap = await adminDb.collection('chapters').get();
  console.log(`Total Chapters in Firestore now: ${finalChaptersSnap.size}`);

  process.exit(0);
}

populatePack2().catch(err => {
  console.error('Error in pack 2:', err);
  process.exit(1);
});
