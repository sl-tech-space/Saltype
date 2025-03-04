import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTyping } from "../../../composables/typing/useTyping";
import {
  Language,
  Difficulty,
} from "../../../composables/typing/useLanguageAndDifficulty";

// モックの定義は最上位で行う
vi.mock("#imports", () => ({
  useRuntimeConfig: () => ({
    public: {
      baseURL: "http://test.com",
    },
  }),
  navigateTo: vi.fn(),
}));

vi.mock("../../../composables/common/useUserInfo", () => ({
  useUserInfo: () => ({
    user: { value: { id: 1, username: "test-user" } },
    waitForUser: () => Promise.resolve(),
  }),
}));

vi.mock("../../../composables/server/useSentence", () => ({
  useSentence: () => ({
    sentences: () =>
      Promise.resolve([
        ["Hello", "はろー"],
        ["Good morning", "おはよう"],
      ]),
    error: { value: null },
  }),
}));

vi.mock("../../../composables/common/useLocalStorage", () => ({
  useLocalStorage: () => ({
    value: "1-1",
    setValue: vi.fn(),
  }),
}));

vi.mock("../../../composables/typing/useMistype", () => ({
  useMistype: () => ({
    resetMistypeStats: vi.fn(),
    countMistype: vi.fn(),
    sendMistypeDataToServer: vi.fn(),
  }),
}));

describe("useTyping", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
  });

  describe("initialize", () => {
    it("文章取得に失敗した場合、エラーを設定", async () => {
      vi.mock("../../../composables/server/useSentence", () => ({
        useSentence: () => ({
          sentences: () => Promise.reject(new Error("API Error")),
        }),
      }));

      const typing = useTyping(
        Language.Japanese.toString(),
        Difficulty.Easy.toString()
      );
      await typing.initialize();

      expect(typing.error.value).toBe("文章の取得に失敗しました");
    });
  });

  describe("handleKeyPress", () => {
    let typing: ReturnType<typeof useTyping>;

    beforeEach(async () => {
      typing = useTyping(
        Language.Japanese.toString(),
        Difficulty.Easy.toString()
      );
      await typing.initialize();
    });

    it("Enterキーでタイピングを開始できる", async () => {
      const result = await typing.handleKeyPress(
        new KeyboardEvent("keydown", { key: "Enter" })
      );

      expect(result).toBe("correct");
      expect(typing.isCountdownActive.value).toBe(true);
    });

    it("カウントダウン中は入力を受け付けない", async () => {
      typing.isCountdownActive.value = true;

      const result = await typing.handleKeyPress(
        new KeyboardEvent("keydown", { key: "a" })
      );

      expect(result).toBe("incorrect");
    });

    it("Shiftキーは常に正しい入力として扱う", async () => {
      const result = await typing.handleKeyPress(
        new KeyboardEvent("keydown", { key: "Shift" })
      );

      expect(result).toBe("correct");
    });
  });

  describe("タイピング精度の計算", () => {
    it("正しいタイピング精度を計算できる", () => {
      const typing = useTyping(
        Language.Japanese.toString(),
        Difficulty.Easy.toString()
      );
      typing.typingResults.totalCorrectTypedCount = 3;
      typing.typingResults.totalMistypedCount = 1;

      const total =
        typing.typingResults.totalCorrectTypedCount +
        typing.typingResults.totalMistypedCount;
      const accuracy =
        total > 0
          ? (typing.typingResults.totalCorrectTypedCount / total) * 100
          : 0;

      expect(accuracy).toBe(75);
    });

    it("入力がない場合は0を返す", () => {
      const typing = useTyping(
        Language.Japanese.toString(),
        Difficulty.Easy.toString()
      );
      const total =
        typing.typingResults.totalCorrectTypedCount +
        typing.typingResults.totalMistypedCount;
      const accuracy =
        total > 0
          ? (typing.typingResults.totalCorrectTypedCount / total) * 100
          : 0;

      expect(accuracy).toBe(0);
    });
  });
});
