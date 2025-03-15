import { describe, it, expect, vi, beforeEach } from "vitest";
import { useMistype } from "../../../composables/typing/useMistype";
import { useUserInfo } from "../../../composables/common/useUserInfo";

// モックの設定
const mockConfig = {
  public: {
    baseURL: "http://test.com",
  },
};

const mockUser = {
  user_id: "test-user-id",
  username: "test-user",
};

// モックの定義
vi.mock("#app", () => ({
  useRuntimeConfig: () => mockConfig,
}));

vi.mock("../../../composables/common/useUserInfo", () => ({
  useUserInfo: () => ({
    user: { value: mockUser },
  }),
}));

describe("useMistype", () => {
  let mockFetch: any;
  let mistype: ReturnType<typeof useMistype>;

  beforeEach(() => {
    mockFetch = vi.spyOn(global, "fetch").mockReset();
    mistype = useMistype();
    mistype.resetMistypeStats();
  });

  describe("countMistype", () => {
    it("アルファベットのミスタイプを正しくカウントできる", () => {
      mistype.countMistype("a");
      mistype.countMistype("A");
      mistype.countMistype("b");

      expect(mistype.mistypeCount.value).toEqual({
        a: 2,
        b: 1,
      });
    });

    it("アルファベット以外の文字はカウントしない", () => {
      mistype.countMistype("1");
      mistype.countMistype("あ");
      mistype.countMistype("@");

      expect(mistype.mistypeCount.value).toEqual({});
    });

    it("大文字小文字は同じキーとしてカウントされる", () => {
      mistype.countMistype("A");
      mistype.countMistype("a");
      mistype.countMistype("A");

      expect(mistype.mistypeCount.value).toEqual({
        a: 3,
      });
    });
  });

  describe("totalMistypes", () => {
    it("ミスタイプの合計を正しく計算できる", () => {
      mistype.countMistype("a");
      mistype.countMistype("b");
      mistype.countMistype("a");

      expect(mistype.totalMistypes.value).toBe(3);
    });

    it("ミスタイプがない場合は0を返す", () => {
      expect(mistype.totalMistypes.value).toBe(0);
    });
  });

  describe("resetMistypeStats", () => {
    it("ミスタイプカウントをリセットできる", () => {
      mistype.countMistype("a");
      mistype.countMistype("b");
      mistype.resetMistypeStats();

      expect(mistype.mistypeCount.value).toEqual({});
      expect(mistype.totalMistypes.value).toBe(0);
    });
  });

  describe("sendMistypeDataToServer", () => {
    beforeEach(() => {
      mistype.countMistype("a");
      mistype.countMistype("b");
    });

    it("APIエラー時にエラーをスローし、カウントをリセットする", async () => {
      mockFetch.mockResolvedValue({ ok: false });

      await expect(mistype.sendMistypeDataToServer()).rejects.toThrow(
        "ミスタイプデータの送信に失敗"
      );
      expect(mistype.mistypeCount.value).toEqual({});
    });

    it("ネットワークエラー時にエラーをスローする", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      await expect(mistype.sendMistypeDataToServer()).rejects.toThrow(
        "ミスタイプデータの送信に失敗"
      );
    });
  });
});
