import { defineEventHandler, readBody } from "h3";
import fs from "fs/promises";
import path from "path";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const sentencesPath = config.public.sentencesPath;
  const body = await readBody(event);
  const language: string = body.language;
  const difficultyLevel: string = body.difficultyLevel;
  const count = body.count || 100; // デフォルトで100文取得

  const filePath = path.join(
    process.cwd(),
    `${sentencesPath}`,
    `${language}`,
    `${difficultyLevel}.json`
  );

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    const allSentences = data.sentences;
    const selectedSentences = [];

    for (let i = 0; i < count && i < allSentences.length; i++) {
      const randomIndex = Math.floor(Math.random() * allSentences.length);
      selectedSentences.push(allSentences[randomIndex]);
    }

    return selectedSentences;
  } catch (e) {
    console.log("文章取得失敗", e);
  }
});
