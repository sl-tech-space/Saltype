import { defineEventHandler, getQuery } from "h3";
import fs from "fs/promises";
import path from "path";

export default defineEventHandler(async (event) => {
  // クエリパラメータから dataFile を取得
  const query = getQuery(event);
  const language = (query.language as string)
  const difficultyLevel = (query.difficultyLevel as string);

  // データファイルのパスを構築
  const filePath = path.join(process.cwd(), "server", `data/${language}`, `${difficultyLevel}.json`);

  try {
    // ファイルを非同期で読み込む
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    const allSentences = data.sentences;
    const randomIndex = Math.floor(Math.random() * allSentences.length);
    const [sentence, additionalInfo] = allSentences[randomIndex];

    return {
      sentence,
      additionalInfo,
    };
  } catch (error) {
    // エラーハンドリング
    console.error(`Error reading file: ${filePath}`, error);
    return {
      error: "Failed to load data",
    };
  }
});
