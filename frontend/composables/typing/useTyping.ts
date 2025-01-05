import { useSentence } from "~/composables/server/useSentence";
import { useSentencePattern } from "~/composables/typing/japanese/useSentencePattern";
import { useInputPattern } from "./japanese/useInputPattern";
import { useMistype } from "./useMistype";
import { useUserInfo } from "../common/useUserInfo";

/**
 * タイピング画面処理
 * @param language
 * @param difficultyLevel
 * @returns currentSentence, coloredText, isTypingStarted,
 * countdown, isCountdownActive, handleKeyPress,
 * isLoading, error,
 * finishTyping, initialize,
 */
export function useTyping(language: string, difficultyLevel: string) {
  const router = useRouter();
  const config = useRuntimeConfig();
  const sentencesData = ref<Array<[string, string]>>([]);
  const currentIndex = ref(0);
  const patterns = ref<string[]>([]);
  const currentInputIndex = ref(0);
  const currentInput = ref("");
  const currentPatternIndex = ref(0);
  const coloredText = ref("");
  const countdown = ref(3);
  const isTypingStarted = ref(false);
  const isCountdownActive = ref(false);
  const error = ref<string | null>(null);
  const isLoading = ref(false);
  const { resetMistypeStats, countMistype, sendMistypeDataToServer } =
    useMistype();
  const { user } = useUserInfo();
  const { getPatternArray, getVowelPatternArray } = useInputPattern();
  const permitActionLetters = getPatternArray();
  const vowelPattern = getVowelPatternArray();

  /**
   * タイピング結果取得変数
   */
  const typingResults = reactive({
    totalCorrectTypedCount: 0,
    totalMistypedCount: 0,
    typingAccuracy: 0,
  });

  watch(
    () => [
      typingResults.totalCorrectTypedCount,
      typingResults.totalMistypedCount,
    ],
    () => {
      typingResults.typingAccuracy = typingAccuracy.value;
    }
  );

  /**
   * 正タイプ率計算
   */
  const typingAccuracy = computed(() => {
    const total =
      typingResults.totalCorrectTypedCount + typingResults.totalMistypedCount;
    return total > 0
      ? Number((typingResults.totalCorrectTypedCount / total).toFixed(2))
      : 0;
  });

  /**
   * 現在の文章を出力
   */
  const currentSentence = computed(
    (): { sentence: [string, string]; patterns: string[] } | null => {
      const sentence = sentencesData.value[currentIndex.value];
      return sentence
        ? {
            sentence: sentence,
            patterns: patterns.value,
          }
        : null;
    }
  );

  /**
   * 初期化処理
   */
  const initialize = async (): Promise<void> => {
    const { sentences } = useSentence(language, difficultyLevel);

    try {
      const data = await sentences();
      if (Array.isArray(data) && data.length > 0) {
        sentencesData.value = data;
        resetMistypeStats();
        _resetTypingStats();
        await _updatePatterns();
        _updateColoredText();
      }
    } catch (e) {
      error.value = "文章の取得に失敗しました";
    }
  };

  /**
   * タイピング結果送信
   */
  const _sendTypingDataToServer = async (): Promise<void> => {
    isLoading.value = true;

    try {
      if (!user.value) {
        error.value = "ユーザ情報が存在しません";
        return;
      }

      const id = localStorage.getItem("gameModeId");
      if (!id) {
        error.value = "選択した難易度は存在しません";
        return;
      }
      const splittedId = splitId(id);

      const response = await fetch(
        `${config.public.baseURL}/api/django/score/insert/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.value.user_id,
            lang_id: splittedId.left,
            diff_id: splittedId.right,
            typing_count: typingResults.totalCorrectTypedCount,
            accuracy: typingResults.typingAccuracy,
          }),
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!response.ok) {
        error.value = "スコアの送信に失敗";
        return;
      }

      const data = await response.json();

      localStorage.setItem("score", data.score);
    } catch (e) {
      error.value =
        "ネットワークエラーが発生しました。接続を確認してください。";
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * タイピング開始処理
   */
  const _startTyping = (): void => {
    isCountdownActive.value = true;
    countdown.value = 3;
    const countdownInterval = setInterval(() => {
      countdown.value--;
      if (countdown.value === 0) {
        clearInterval(countdownInterval);
        isTypingStarted.value = true;
        isCountdownActive.value = false;
        _updateColoredText();
      }
    }, 1000);
  };

  /**
   * タイピング終了処理
   */
  const finishTyping = (): void => {
    isTypingStarted.value = false;
    sendMistypeDataToServer();
    _sendTypingDataToServer();

    localStorage.setItem(
      "totalCorrectTypedCount",
      typingResults.totalCorrectTypedCount.toString()
    );
    localStorage.setItem(
      "typingAccuracy",
      typingResults.typingAccuracy.toString()
    );

    router.push({ name: "score" });
  };

  /**
   * キー入力処理
   * @param event
   */
  const handleKeyPress = (event: KeyboardEvent): "correct" | "incorrect" => {
    if (event.key === "Shift" || event.key === "ShiftRight") {
      return "correct";
    }

    if (!isTypingStarted.value && !isCountdownActive.value) {
      if (event.key === "Enter") {
        _startTyping();
      }
      return "correct";
    }

    if (isCountdownActive.value) {
      return "incorrect";
    }

    if (!isTypingStarted.value) {
      if (event.key === "Enter") {
        isTypingStarted.value = true;
        _updateColoredText();
      }
      return "correct";
    }

    if (!currentSentence.value) {
      return "correct";
    }

    const currentPatterns = currentSentence.value.patterns;

    for (const pattern of currentPatterns) {
      const expectedChar = pattern[currentInputIndex.value];
      if (event.key !== expectedChar) continue;

      currentInput.value += event.key;
      currentInputIndex.value++;
      currentPatternIndex.value = currentPatterns.indexOf(pattern);
      typingResults.totalCorrectTypedCount++;
      _updateColoredText();

      const nextExpectedChar = pattern[currentInputIndex.value];

      if (vowelPattern.includes(event.key)) {
        patterns.value = currentPatterns.filter((p) => {
          const lastChar = p[currentInputIndex.value];
          const basePermitActionTwoLetter = p.slice(
            currentInputIndex.value,
            currentInputIndex.value + 2
          );
          const basePermitActionThreeLetter = p.slice(
            currentInputIndex.value,
            currentInputIndex.value + 3
          );

          return (
            lastChar === expectedChar ||
            lastChar === nextExpectedChar ||
            permitActionLetters.some(
              ([_, romajiArray]) =>
                romajiArray.includes(basePermitActionTwoLetter) ||
                romajiArray.includes(basePermitActionThreeLetter)
            )
          );
        });
      }

      if (currentInputIndex.value === pattern.length) {
        _nextSentence();
      }

      return "correct";
    }

    countMistype(event.key);
    typingResults.totalMistypedCount++;
    return "incorrect";
  };

  /**
   * 次の文章を表示
   */
  const _nextSentence = (): void => {
    if (currentIndex.value < sentencesData.value.length - 1) {
      currentIndex.value++;
      currentInputIndex.value = 0;
      currentInput.value = "";
      currentPatternIndex.value = 0;
      _updatePatterns();
    } else {
      isTypingStarted.value = false;
    }
  };

  /**
   * 文章パターンの更新
   */
  const _updatePatterns = async (): Promise<void> => {
    const { getPatternList, getAllCombinations } = useSentencePattern();

    if (language === "1") {
      // 日本語パターン
      patterns.value = await getAllCombinations(
        await getPatternList(sentencesData.value[currentIndex.value][1])
      );
    } else {
      // 英語パターン
      patterns.value = await getAllCombinations(
        await getPatternList(sentencesData.value[currentIndex.value][0])
      );
    }

    _updateColoredText();
  };

  /**
   * 文字色を更新
   */
  const _updateColoredText = (): void => {
    if (!currentSentence.value) return;

    const fullText = currentSentence.value.patterns[currentPatternIndex.value];
    if (!isTypingStarted.value) {
      coloredText.value = fullText;
      return;
    }
    const coloredPart = fullText.slice(0, currentInputIndex.value);
    const remainingPart = fullText.slice(currentInputIndex.value);

    coloredText.value = `<span style="opacity: 0.5">${coloredPart}</span>${remainingPart}`;
  };

  /**
   * 合計タイプ数を初期化
   */
  const _resetTypingStats = (): void => {
    typingResults.totalCorrectTypedCount = 0;
    typingResults.totalMistypedCount = 0;
    resetMistypeStats();
  };

  return {
    currentSentence,
    coloredText,
    countdown,
    isTypingStarted,
    isCountdownActive,
    isLoading,
    error,
    handleKeyPress,
    finishTyping,
    initialize,
  };
}
