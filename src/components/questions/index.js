// components/questions/index.js

const questionFiles = import.meta.glob("./*/chapter*.js", { eager: false });

export async function loadQuestions(subject, chapterId) {
  const path = `./${subject}/${chapterId}.js`;
  const loader = questionFiles[path];
  if (!loader) {
    console.error("❌ No file found for", path);
    return null;
  }

  try {
    const mod = await loader();
    return mod.default;
  } catch (err) {
    console.error("❌ Failed to load questions for", subject, chapterId, err);
    return null;
  }
}
