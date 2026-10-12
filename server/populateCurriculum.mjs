/**
 * Real Firestore Curriculum Populator for LMS Portal
 * Project: student-preparation-portal
 *
 * Populates authentic Sindh Textbook Board (STBB Jamshoro) curriculum
 * for Classes 8, 9, 10, 11, and 12 using REAL Firestore document IDs.
 *
 * Follows strict data rules:
 * - Uses existing real document IDs (no hardcoded "class-8" strings)
 * - No duplicates: checks existing subjects/books/chapters before creating
 * - Does not delete real Firestore data
 * - Real STBB curriculum text, notes, and formulas
 */

import { adminDb } from './firebaseAdmin.js';
import { FieldValue } from 'firebase-admin/firestore';
import { CURRICULUM_DATA } from './curriculumContent.mjs';

async function populateCurriculum() {
  console.log('=== STARTING REAL FIRESTORE CURRICULUM POPULATION ===\n');

  // 1. Fetch all classes from Firestore
  const classesSnap = await adminDb.collection('classes').orderBy('grade', 'asc').get();
  const classMap = new Map(); // grade -> { id, name, data }
  classesSnap.forEach(doc => {
    const data = doc.data();
    const grade = Number(data.grade);
    classMap.set(grade, { id: doc.id, name: data.name, grade, data });
  });

  console.log(`Found ${classesSnap.size} classes in Firestore:`);
  for (const [grade, cls] of classMap.entries()) {
    console.log(`  Grade ${grade} (${cls.name}) => Firestore Doc ID: ${cls.id}`);
  }

  // Verify all required classes 8-12 exist
  for (const requiredGrade of [8, 9, 10, 11, 12]) {
    if (!classMap.has(requiredGrade)) {
      throw new Error(`Required Class Grade ${requiredGrade} is missing from Firestore!`);
    }
  }

  // 2. Fetch all existing subjects from Firestore
  const subjectsSnap = await adminDb.collection('subjects').get();
  // Map: `${classId}_${normalizedSubjectName}` -> docId
  const subjectMap = new Map();
  const allSubjects = [];
  subjectsSnap.forEach(doc => {
    const data = doc.data();
    const key = `${data.classId}_${(data.name || '').trim().toLowerCase()}`;
    subjectMap.set(key, doc.id);
    allSubjects.push({ id: doc.id, ...data });
  });
  console.log(`Loaded ${subjectsSnap.size} existing subjects from Firestore.`);

  // 3. Fetch all existing books from Firestore
  const booksSnap = await adminDb.collection('books').get();
  // Map: `${classId}_${subjectId}_${normalizedTitle}` -> docId
  // Also map: `${subjectId}` -> docId (to find book for a subject)
  const bookMap = new Map();
  const subjectToBookMap = new Map();
  booksSnap.forEach(doc => {
    const data = doc.data();
    const key = `${data.classId}_${data.subjectId}_${(data.title || '').trim().toLowerCase()}`;
    bookMap.set(key, doc.id);
    if (data.subjectId) {
      subjectToBookMap.set(data.subjectId, doc.id);
    }
  });
  console.log(`Loaded ${booksSnap.size} existing books from Firestore.`);

  // 4. Fetch all existing chapters from Firestore
  const chaptersSnap = await adminDb.collection('chapters').get();
  // Map: `${subjectId}_${chapterNumber}` -> { id, hasContent, title }
  const chapterMap = new Map();
  chaptersSnap.forEach(doc => {
    const data = doc.data();
    const key = `${data.subjectId}_${data.chapterNumber}`;
    const hasContent = !!(
      (data.theoryNotes && data.theoryNotes.trim().length > 30) ||
      (data.textbookContent && data.textbookContent.trim().length > 30)
    );
    chapterMap.set(key, { id: doc.id, hasContent, title: data.title, data });
  });
  console.log(`Loaded ${chaptersSnap.size} existing chapters from Firestore.\n`);

  let subjectsCreated = 0;
  let booksCreated = 0;
  let booksUpdated = 0;
  let chaptersCreated = 0;
  let chaptersUpdated = 0;
  let chaptersSkipped = 0;

  // 5. Process Curriculum Data
  for (const gradeItem of CURRICULUM_DATA) {
    const classObj = classMap.get(gradeItem.grade);
    if (!classObj) {
      console.warn(`Skipping grade ${gradeItem.grade}: class not found`);
      continue;
    }
    const realClassId = classObj.id;
    console.log(`\n======================================================`);
    console.log(`PROCESSING ${classObj.name} (Grade ${gradeItem.grade}, ID: ${realClassId})`);
    console.log(`======================================================`);

    for (const subItem of gradeItem.subjects) {
      // Find or create subject
      const subjectLookupKey = `${realClassId}_${subItem.name.trim().toLowerCase()}`;
      let realSubjectId = subjectMap.get(subjectLookupKey);

      // Try alternate name matching if not found (e.g. "Urdu" vs "Urdu Lazmi" or "English" vs "English Compulsory")
      if (!realSubjectId && subItem.aliases) {
        for (const alias of subItem.aliases) {
          const aliasKey = `${realClassId}_${alias.trim().toLowerCase()}`;
          if (subjectMap.has(aliasKey)) {
            realSubjectId = subjectMap.get(aliasKey);
            break;
          }
        }
      }

      if (!realSubjectId) {
        // Create subject
        const newSubRef = await adminDb.collection('subjects').add({
          classId: realClassId,
          name: subItem.name,
          code: subItem.code || `${subItem.name.slice(0, 4).toUpperCase()}-${gradeItem.grade}`,
          icon: subItem.icon || 'BookOpen',
          color: subItem.color || 'blue',
          description: subItem.description || `${subItem.name} syllabus for ${classObj.name}`,
          createdAt: FieldValue.serverTimestamp(),
        });
        realSubjectId = newSubRef.id;
        subjectMap.set(subjectLookupKey, realSubjectId);
        console.log(`  + CREATED Subject: "${subItem.name}" -> Doc ID: ${realSubjectId}`);
        subjectsCreated++;
      } else {
        console.log(`  * REUSED Subject: "${subItem.name}" -> Doc ID: ${realSubjectId}`);
      }

      // Check or create/update Book for this subject
      let realBookId = subjectToBookMap.get(realSubjectId);
      const bookTitle = subItem.bookTitle || `${subItem.name} for ${classObj.name} (Sindh Textbook Board)`;
      const bookLookupKey = `${realClassId}_${realSubjectId}_${bookTitle.trim().toLowerCase()}`;

      if (!realBookId) {
        // Check if there is an existing book with matching title or class that had mislinked subjectId
        let foundExistingBook = null;
        booksSnap.forEach(bDoc => {
          const bData = bDoc.data();
          if (
            (bData.classId === realClassId || bData.classId === `class-${gradeItem.grade}`) &&
            (bData.title?.toLowerCase().includes(subItem.name.toLowerCase()) ||
             subItem.bookTitle?.toLowerCase().includes(bData.title?.toLowerCase()))
          ) {
            foundExistingBook = { id: bDoc.id, ...bData };
          }
        });

        if (foundExistingBook) {
          // Update book to point to the real classId and real subjectId
          await adminDb.collection('books').doc(foundExistingBook.id).update({
            classId: realClassId,
            subjectId: realSubjectId,
            board: 'Sindh Textbook Board, Jamshoro',
            edition: 'Single National Curriculum Edition',
            author: 'Sindh Textbook Board Panel of Authors',
            updatedAt: FieldValue.serverTimestamp(),
          });
          realBookId = foundExistingBook.id;
          subjectToBookMap.set(realSubjectId, realBookId);
          console.log(`    * LINKED Book: "${foundExistingBook.title}" -> ${realBookId}`);
          booksUpdated++;
        } else {
          // Create new book
          const newBookRef = await adminDb.collection('books').add({
            classId: realClassId,
            subjectId: realSubjectId,
            title: bookTitle,
            author: 'Sindh Textbook Board Panel of Authors',
            board: 'Sindh Textbook Board, Jamshoro',
            edition: 'Single National Curriculum Edition',
            description: subItem.bookDescription || `Official textbook prescribed by the Sindh Textbook Board for ${classObj.name} ${subItem.name}.`,
            coverUrl: '',
            totalChapters: subItem.chapters?.length || 8,
            createdAt: FieldValue.serverTimestamp(),
          });
          realBookId = newBookRef.id;
          subjectToBookMap.set(realSubjectId, realBookId);
          console.log(`    + CREATED Book: "${bookTitle}" -> ${realBookId}`);
          booksCreated++;
        }
      }

      // Process Chapters
      if (Array.isArray(subItem.chapters)) {
        for (const ch of subItem.chapters) {
          const chapterLookupKey = `${realSubjectId}_${ch.chapterNumber}`;
          const existingChap = chapterMap.get(chapterLookupKey);

          const chapterPayload = {
            classId: realClassId,
            subjectId: realSubjectId,
            bookId: realBookId || '',
            chapterNumber: ch.chapterNumber,
            title: ch.title,
            description: ch.description || `Chapter ${ch.chapterNumber} — ${ch.title}`,
            learningObjectives: ch.learningObjectives || [],
            textbookContent: ch.textbookContent || '',
            theoryNotes: ch.theoryNotes || '',
            keyFormulas: ch.keyFormulas || '',
            videoUrl: ch.videoUrl || '',
            resourceLink: ch.resourceLink || 'https://ebooks.stbb.edu.pk',
          };

          if (existingChap) {
            // Check if existing chapter has minimal or missing content
            if (!existingChap.hasContent) {
              await adminDb.collection('chapters').doc(existingChap.id).update({
                ...chapterPayload,
                updatedAt: FieldValue.serverTimestamp(),
              });
              console.log(`    ^ UPDATED Chapter ${ch.chapterNumber}: "${ch.title}" (ID: ${existingChap.id}) [Populated Content]`);
              chaptersUpdated++;
            } else {
              // Existing chapter already has real content! Preserve it without overwriting or duplicating.
              console.log(`    = EXISTS Chapter ${ch.chapterNumber}: "${existingChap.title}" (ID: ${existingChap.id}) [Preserved]`);
              chaptersSkipped++;
            }
          } else {
            // Chapter does not exist - create new
            const newChapRef = await adminDb.collection('chapters').add({
              ...chapterPayload,
              createdAt: FieldValue.serverTimestamp(),
            });
            chapterMap.set(chapterLookupKey, { id: newChapRef.id, hasContent: true, title: ch.title });
            console.log(`    + CREATED Chapter ${ch.chapterNumber}: "${ch.title}" -> ${newChapRef.id}`);
            chaptersCreated++;
          }
        }
      }
    }
  }

  console.log('\n======================================================');
  console.log('CURRICULUM POPULATION COMPLETED SUCCESSFULLY');
  console.log('======================================================');
  console.log(`Subjects Created:   ${subjectsCreated}`);
  console.log(`Books Created:      ${booksCreated}`);
  console.log(`Books Updated/Fixed:${booksUpdated}`);
  console.log(`Chapters Created:   ${chaptersCreated}`);
  console.log(`Chapters Updated:   ${chaptersUpdated}`);
  console.log(`Chapters Preserved: ${chaptersSkipped}`);

  // Print final summary
  const finalChaptersSnap = await adminDb.collection('chapters').get();
  const finalSubjectsSnap = await adminDb.collection('subjects').get();
  const finalBooksSnap = await adminDb.collection('books').get();
  console.log(`\nFinal Firestore State:`);
  console.log(`  Classes:  ${classesSnap.size}`);
  console.log(`  Subjects: ${finalSubjectsSnap.size}`);
  console.log(`  Books:    ${finalBooksSnap.size}`);
  console.log(`  Chapters: ${finalChaptersSnap.size}`);

  process.exit(0);
}

populateCurriculum().catch(err => {
  console.error('FATAL ERROR POPULATING CURRICULUM:', err);
  process.exit(1);
});
