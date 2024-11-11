import { ref, computed } from "vue";
import { useSentence } from "~/composables/server/useSentence";
import { useSentencePattern } from "~/composables/typing/japanese/useSentencePattern";
import { useInputPattern } from "./japanese/useInputPattern";
import { useMistype } from "./useMistype";
import { useUser } from "../conf/useUser";

/**
 * タイピング画面処理
 * @param language
 * @param difficultyLevel
 * @returns typingAccuracy, sentencesData,
 * currentSentence, coloredText,
 * isTypingStarted, countdown,
 * isCountdownActive, handleKeyPress,
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
  const isTypingStarted = ref(false);
  const countdown = ref(3);
  const isCountdownActive = ref(false);
  const { resetMistypeStats, countMistype, sendMistypeDataToServer } =
    useMistype();
  const { user } = useUser();
  const { getPatternArray, getVowelPatternArray } = useInputPattern();
  // TODO 許容文字列
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
  const currentSentence = computed(() => {
    const sentence = sentencesData.value[currentIndex.value];
    return sentence
      ? {
          sentence: sentence,
          patterns: patterns.value,
        }
      : null;
  });

  /**
   * 初期化処理
   */
  const initialize = async () => {
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
      console.error("文章の取得に失敗しました:");
    }
  };

  /**
   * タイピング結果送信
   */
  const _sendTypingDataToServer = async () => {
    const indexOffset = 1;

    try {
      if (!user.value) {
        console.error("ユーザ情報が存在しません");
        return;
      }

      const response = await fetch(
        `${config.public.baseURL}/api/django/score/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: user.value.user_id,
            lang_id: Number(localStorage.getItem("language")) + indexOffset,
            diff_id: Number(localStorage.getItem("difficulty")) + indexOffset,
            typing_count: typingResults.totalCorrectTypedCount,
            accuracy: typingResults.typingAccuracy,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("スコアの送信に失敗");
      }

      const data = await response.json();

      localStorage.setItem("score", data.score);
    } catch (e) {}
  };

  /**
   * タイピング開始処理
   */
  const _startTyping = () => {
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
  const finishTyping = () => {
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
  const _nextSentence = () => {
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
  const _updatePatterns = async () => {
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
  const _updateColoredText = () => {
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
  const _resetTypingStats = () => {
    typingResults.totalCorrectTypedCount = 0;
    typingResults.totalMistypedCount = 0;
    resetMistypeStats();
  };

  return {
    currentSentence,
    coloredText,
    isTypingStarted,
    countdown,
    isCountdownActive,
    handleKeyPress,
    finishTyping,
    initialize,
  };
}
