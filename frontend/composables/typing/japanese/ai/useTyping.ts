import { useAISentence } from "~/composables/server/useAISentence";
import { useSentencePattern } from "~/composables/typing/japanese/useSentencePattern";
import { useInputPattern } from "~/composables/typing/japanese/useInputPattern";
import { useMistype } from "~/composables/typing/useMistype";

/**
 * タイピング画面処理
 *
 * @param language - 使用する言語
 * @param difficultyLevel - 難易度レベル
 * @returns タイピング関連の状態と関数
 *
 * @remarks
 * 返り値のオブジェクトには以下のプロパティが含まれます：
 * - currentSentence: 現在の文章とそのパターン
 * - coloredText: 色を付けた文章
 * - isTypingStarted: タイピング開始フラグ（true の場合は開始済み）
 * - countdown: カウントダウンの残り時間（秒）
 * - isCountdownActive: カウントダウン中フラグ（true の場合はカウントダウン中）
 * - isLoading: ローディング中フラグ（true の場合はローディング中）
 * - error: エラーメッセージ（エラーがない場合は null）
 * - handleKeyPress: キー入力処理を行う関数
 * - finishTyping: タイピング終了処理を行う関数
 * - initialize: 初期化処理を行う関数
 */
export function useTyping() {
  const sentencesData = shallowRef<Array<[string, string]>>([]);
  const currentIndex = ref(0);
  const patterns = shallowRef<string[]>([]);
  const currentInputIndex = ref(0);
  const currentInput = ref("");
  const currentPatternIndex = ref(0);
  const coloredText = ref("");
  const countdown = ref(3);
  const isTypingStarted = ref(false);
  const isCountdownActive = ref(false);
  const error = ref<string | null>(null);
  const isLoading = ref(false);
  const resultNotification = ref<{ message: string; content: string } | null>(
    null
  );
  const { resetMistypeStats, countMistype } = useMistype();
  const { getVowelPatternArray, getSymbolsPatternArray } = useInputPattern();

  const vowelPattern = computed(() => getVowelPatternArray());
  const symbolPattern = computed(() => getSymbolsPatternArray());

  /**
   * タイピング結果取得変数
   */
  const typingResults = reactive({
    totalCorrectTypedCount: 0,
    totalMistypedCount: 0,
    typingAccuracy: 0,
  });

  const typingAccuracy = computed(() => {
    const total =
      typingResults.totalCorrectTypedCount + typingResults.totalMistypedCount;
    return total > 0
      ? Math.round((typingResults.totalCorrectTypedCount / total) * 100) / 100
      : 0;
  });

  // 計算結果を反映
  watchEffect(() => {
    typingResults.typingAccuracy = typingAccuracy.value;
  });

  /**
   * 現在の文章を出力
   */
  const currentSentence = computed(() => {
    const sentence = sentencesData.value[currentIndex.value];
    return sentence ? { sentence, patterns: patterns.value } : null;
  });

  /**
   * 初期化処理
   */
  const initialize = async (input: string): Promise<void> => {
    const { sentences } = useAISentence(input);

    try {
      const data = await sentences();
      if (Array.isArray(data) && data.length > 0) {
        sentencesData.value = data;
        resetMistypeStats();
        _resetTypingStats();
        await _updatePatterns();
        _updateColoredText();
      }
    } catch {
      error.value = "文章の取得に失敗しました";
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
  const finishTyping = async (): Promise<void> => {
    isTypingStarted.value = false;
    
    for (let i = 3; i > 0; i--) {
      resultNotification.value = {
        message: `AIタイピング終了、${i}秒後にホームに戻ります。結果を確認してください。`,
        content: `正タイプ数: ${typingResults.totalCorrectTypedCount}<br>誤タイプ数: ${typingResults.totalMistypedCount}<br>正確性: ${typingAccuracy.value}`,
      };
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    await navigateTo({ name: "home" });
  };

  /**
   * キー入力処理
   */
  const handleKeyPress = async (
    event: KeyboardEvent
  ): Promise<"correct" | "incorrect"> => {
    if (event.key === "Shift" || event.key === "ShiftRight") return "correct";

    if (!isTypingStarted.value && !isCountdownActive.value) {
      if (event.key === "Enter") _startTyping();
      return "correct";
    }

    if (isCountdownActive.value) return "incorrect";

    if (!isTypingStarted.value) {
      if (event.key === "Enter") {
        isTypingStarted.value = true;
        _updateColoredText();
      }
      return "correct";
    }

    const isCorrect = await _handleKeyPressOnJapaneseMode(event);

    if (isCorrect) {
      return "correct";
    }

    countMistype(event.key);
    typingResults.totalMistypedCount++;
    return "incorrect";
  };

  /**
   * 日本語モードのキー入力処理
   */
  const _handleKeyPressOnJapaneseMode = async (
    event: KeyboardEvent
  ): Promise<boolean> => {
    if (!currentSentence.value) {
      return false;
    }

    const currentPatterns = currentSentence.value.patterns;
    const inputKey = event.key.toLowerCase();
    const nextInput = (currentInput.value + inputKey).toLowerCase();

    const filteredPatterns = currentPatterns.filter((pattern) => {
      const lowerPattern = pattern.toLowerCase();
      return lowerPattern.startsWith(nextInput);
    });

    if (!filteredPatterns.length) return false;

    currentInput.value += event.key;
    currentInputIndex.value++;
    currentPatternIndex.value = currentPatterns.indexOf(filteredPatterns[0]);
    await _updateColoredText();

    if (
      vowelPattern.value.includes(inputKey) ||
      symbolPattern.value.includes(inputKey)
    ) {
      patterns.value = filteredPatterns;
      typingResults.totalCorrectTypedCount++;
    }

    if (currentInputIndex.value === filteredPatterns[0].length) {
      await _nextSentence();
    }

    return true;
  };

  /**
   * 次の文章を表示
   */
  const _nextSentence = async (): Promise<void> => {
    if (currentIndex.value < sentencesData.value.length - 1) {
      currentIndex.value++;
      currentInputIndex.value = 0;
      currentInput.value = "";
      currentPatternIndex.value = 0;
      await _updatePatterns();
    } else {
      isTypingStarted.value = false;
    }
  };

  /**
   * 文章パターンの更新
   */
  const _updatePatterns = async (): Promise<void> => {
    const { getAllCombinations } = useSentencePattern();
    patterns.value = await getAllCombinations(
      sentencesData.value[currentIndex.value][1]
    );
    await _updateColoredText();
  };

  /**
   * 文字色を更新
   */
  const _updateColoredText = async (): Promise<void> => {
    if (!currentSentence.value) return;

    const pattern = currentSentence.value.patterns[currentPatternIndex.value];
    if (!pattern) return;

    if (!isTypingStarted.value) {
      coloredText.value = pattern;
      return;
    }

    coloredText.value = `<span style="opacity: 0.5">${pattern.slice(
      0,
      currentInputIndex.value
    )}</span>${pattern.slice(currentInputIndex.value)}`;
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
    typingResults,
    currentSentence,
    coloredText,
    countdown,
    isTypingStarted,
    isCountdownActive,
    isLoading,
    error,
    resultNotification,
    handleKeyPress,
    finishTyping,
    initialize,
  };
}
