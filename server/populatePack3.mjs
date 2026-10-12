import { adminDb } from './firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';
import { CURRICULUM_PACK_3 } from './curriculumPack3.mjs';

async function populatePack3() {
  console.log('=== POPULATING CURRICULUM PACK 3 ===\n');

  const classesSnap = await adminDb.collection('classes').orderBy('grade', 'asc').get();
  const classMap = new Map();
  classesSnap.forEach(doc => {
    const data = doc.data();
    classMap.set(Number(data.grade), { id: doc.id, name: data.name });
  });

  const subjectsSnap = await adminDb.collection('subjects').get();
  const subjectsList = [];
  subjectsSnap.forEach(doc => {
    subjectsList.push({ id: doc.id, ...doc.data() });
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

  for (const gradeItem of CURRICULUM_PACK_3) {
    const classObj = classMap.get(gradeItem.grade);
    if (!classObj) {
      console.warn(`Class for grade ${gradeItem.grade} not found in Firestore!`);
      continue;
    }
    const realClassId = classObj.id;

    for (const subItem of gradeItem.subjects) {
      const targetNameLower = subItem.name.trim().toLowerCase();
      const aliasesLower = (subItem.aliases || []).map(a => a.trim().toLowerCase());

      // 1. Exact match on subject name for this class
      let matchedSubject = subjectsList.find(s => 
        s.classId === realClassId && (s.name || '').trim().toLowerCase() === targetNameLower
      );

      // 2. Alias match if not found by exact name
      if (!matchedSubject && aliasesLower.length > 0) {
        matchedSubject = subjectsList.find(s => 
          s.classId === realClassId && aliasesLower.includes((s.name || '').trim().toLowerCase())
        );
      }

      // 3. Fallback partial match if still not found
      if (!matchedSubject) {
        matchedSubject = subjectsList.find(s => 
          s.classId === realClassId && (
            (s.name || '').toLowerCase().includes(targetNameLower) ||
            targetNameLower.includes((s.name || '').toLowerCase())
          )
        );
      }

      let realSubjectId;
      if (matchedSubject) {
        realSubjectId = matchedSubject.id;
        console.log(`[FOUND] Class ${gradeItem.grade} -> Subject "${matchedSubject.name}" (ID: ${realSubjectId})`);
      } else {
        console.log(`[CREATING] Subject "${subItem.name}" for Class ${gradeItem.grade}...`);
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
        subjectsList.push({ id: realSubjectId, classId: realClassId, name: subItem.name });
      }

      // Ensure Book
      let realBookId = subjectToBookMap.get(realSubjectId);
      if (!realBookId) {
        // Check existing books by subjectId or title match
        let foundBook = null;
        booksSnap.forEach(bDoc => {
          const bData = bDoc.data();
          if (bData.subjectId === realSubjectId) {
            foundBook = { id: bDoc.id, ...bData };
          } else if (
            (bData.classId === realClassId || bData.classId === `class-${gradeItem.grade}`) &&
            (
              (bData.title && bData.title.toLowerCase().includes(subItem.name.toLowerCase())) ||
              (subItem.bookTitle && bData.title && subItem.bookTitle.toLowerCase().includes(bData.title.toLowerCase()))
            )
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
          console.log(`  * LINKED Book: "${foundBook.title}" -> ${realBookId}`);
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

  console.log('\n=== PACK 3 POPULATION COMPLETE ===');
  console.log(`Books Created: ${booksCreated}`);
  console.log(`Books Updated: ${booksUpdated}`);
  console.log(`Chapters Created: ${chaptersCreated}`);
  console.log(`Chapters Updated: ${chaptersUpdated}`);
  console.log(`Chapters Preserved: ${chaptersSkipped}`);

  const finalChaptersSnap = await adminDb.collection('chapters').get();
  console.log(`Total Chapters in Firestore now: ${finalChaptersSnap.size}`);

  process.exit(0);
}

populatePack3().catch(err => {
  console.error('Error in pack 3:', err);
  process.exit(1);
});
