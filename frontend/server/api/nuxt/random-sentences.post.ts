import { defineEventHandler, readBody } from "h3";
import fs from "fs/promises";
import path from "path";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const sentencesPath = config.public.sentencesPath;
  const body = await readBody(event);
  const language: string = body.language;
  const difficultyLevel: string = body.difficultyLevel;
  const count = body.count || 100;

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

    let result: [string, string][] = [];
    while (result.length < count) {
      const remaining = count - result.length;
      const shuffled = [...allSentences].sort(() => Math.random() - 0.5);
      result = result.concat(shuffled.slice(0, remaining));
    }

    return result;
  } catch (e) {
    console.log("文章取得失敗", e);
  }
});
