import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAISentence } from "../../../composables/server/useAISentence";

describe("useAISentence", () => {
  let mockFetch: any;

  beforeEach(() => {
    mockFetch = vi.spyOn(global, "fetch").mockReset();
  });

  describe("sentences", () => {
    const mockSentences = {
      sentences: [
        { id: 1, text: "テスト文章1" },
        { id: 2, text: "テスト文章2" },
      ],
    };

    it("文章を正しく生成できる", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSentences),
      });

      const aiSentence = useAISentence("テスト入力");
      const result = await aiSentence.sentences();

      expect(result).toEqual(mockSentences);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/nuxt/generate-sentences/",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: "テスト入力",
          }),
        })
      );
    });

    it("APIエラーの場合、エラーをスローする", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
      });

      const aiSentence = useAISentence("テスト入力");

      await expect(aiSentence.sentences()).rejects.toThrow(
        "ネットワークエラーまたはその他例外が発生しました"
      );
    });

    it("ネットワークエラーの場合、エラーをスローする", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const aiSentence = useAISentence("テスト入力");

      await expect(aiSentence.sentences()).rejects.toThrow(
        "ネットワークエラーまたはその他例外が発生しました"
      );
    });
  });
});
