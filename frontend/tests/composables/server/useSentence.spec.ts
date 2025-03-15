import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSentence } from "../../../composables/server/useSentence";

describe("useSentence", () => {
  let mockFetch: any;

  beforeEach(() => {
    mockFetch = vi.spyOn(global, "fetch").mockReset();
  });

  describe("sentences", () => {
    const mockSentences = [
      ["Hello", "こんにちは"],
      ["Good morning", "おはようございます"],
    ];

    it("文章を正しく取得できる", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSentences),
      });

      const sentence = useSentence("1", "1");
      const result = await sentence.sentences();

      expect(result).toEqual(mockSentences);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/nuxt/random-sentences/",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: "japanese",
            difficultyLevel: "easy",
            count: 500,
          }),
        })
      );
    });

    it("カウントパラメータを指定できる", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSentences),
      });

      const sentence = useSentence("1", "1", 100);
      await sentence.sentences();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"count":100'),
        })
      );
    });

    it("APIエラーの場合、エラーをスローする", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
      });

      const sentence = useSentence("1", "1");

      await expect(sentence.sentences()).rejects.toThrow(
        "ネットワークエラーまたはその他例外が発生しました"
      );
    });

    it("ネットワークエラーの場合、エラーをスローする", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const sentence = useSentence("1", "1");

      await expect(sentence.sentences()).rejects.toThrow(
        "ネットワークエラーまたはその他例外が発生しました"
      );
    });

    it("タイムアウトが設定される", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSentences),
      });

      const sentence = useSentence("1", "1");
      await sentence.sentences();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      );
    });
  });
});
