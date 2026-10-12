import {
  sindhBoardClasses,
  sindhBoardSubjects,
  sindhBoardBooks,
  sindhBoardChapters
} from '../src/data/sindhBoardCurriculum.js';

console.log('Classes:', sindhBoardClasses.map(c => ({ id: c.id, grade: c.grade, name: c.name })));
console.log('Subjects count:', sindhBoardSubjects.length);
console.log('Books count:', sindhBoardBooks.length);
console.log('Chapters count:', sindhBoardChapters.length);

sindhBoardChapters.forEach(ch => {
  console.log({
    id: ch.id,
    classId: ch.classId,
    subjectId: ch.subjectId,
    chapterNumber: ch.chapterNumber,
    title: ch.title,
    hasNotes: !!ch.theoryNotes,
    hasFormulas: !!ch.keyFormulas,
    hasVideoUrl: !!ch.videoUrl,
    hasTextbookContent: !!ch.textbookContent
  });
});
