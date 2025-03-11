import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAISentence } from "../../../composables/server/useAISentence";
import { useUserInfo } from "../../../composables/common/useUserInfo";

// useUserInfoのモック
vi.mock("../../../composables/common/useUserInfo", () => ({
  useUserInfo: vi.fn(() => ({
    user: { value: { user_id: "test-user" } },
    waitForUser: vi.fn().mockResolvedValue(undefined)
  }))
}));

describe("useAISentence", () => {
  let mockFetch: any;

  beforeEach(() => {
    mockFetch = vi.spyOn(global, "fetch").mockReset();
  });

  describe("sentences", () => {
    const mockSentences = {
      generatedPairs: [
        ["テスト文章1", "Test Sentence 1"],
        ["テスト文章2", "Test Sentence 2"]
      ]
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
            user_id: "test-user"
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
