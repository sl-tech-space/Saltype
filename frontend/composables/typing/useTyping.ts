import { ref, computed } from "vue";
import { useEventListener } from "@vueuse/core";
import { useSentence } from "~/composables/server/useSentence";
import { useSentencePattern } from "~/composables/typing/japanese/useSentencePattern";
import { useMistype } from "./useMistype";

/**
 * タイピング画面処理
 * @param language
 * @param difficultyLevel
 * @returns typingAccuracy, sentencesData, currentSentence,
 * coloredText, isTypingStarted, countdown,
 * isCountdownActive, finishTyping, initialize,
 */
export function useTyping(language: string, difficultyLevel: string) {
  const router = useRouter();
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
   * タイピング開始処理
   */
  const startTyping = () => {
    isCountdownActive.value = true;
    countdown.value = 3;
    const countdownInterval = setInterval(() => {
      countdown.value--;
      if (countdown.value === 0) {
        clearInterval(countdownInterval);
        isTypingStarted.value = true;
        isCountdownActive.value = false;
        updateColoredText();
      }
    }, 1000);
  };

  /**
   * タイピング終了処理
   */
  const finishTyping = () => {
    isTypingStarted.value = false;
    sendMistypeDataToServer();

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
   * 次の文章を表示
   */
  const nextSentence = () => {
    if (currentIndex.value < sentencesData.value.length - 1) {
      currentIndex.value++;
      currentInputIndex.value = 0;
      currentInput.value = "";
      currentPatternIndex.value = 0;
      updatePatterns();
    } else {
      isTypingStarted.value = false;
    }
  };

  /**
   * キー入力処理
   * @param event
   */
  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Shift") return;

    if (!isTypingStarted.value && !isCountdownActive.value) {
      if (event.key === "Enter") {
        startTyping();
      }
      return;
    }

    if (isCountdownActive.value) return;

    if (!isTypingStarted.value) {
      if (event.key === "Enter") {
        isTypingStarted.value = true;
        updateColoredText();
      }
      return;
    }

    if (!currentSentence.value) return;

    const currentPatterns = currentSentence.value.patterns;
    let matched = false;

    for (let i = 0; i < currentPatterns.length; i++) {
      const expectedChar = currentPatterns[i][currentInputIndex.value];
      if (event.key === expectedChar) {
        currentInput.value += event.key;
        currentInputIndex.value++;
        currentPatternIndex.value = i;
        matched = true;
        typingResults.totalCorrectTypedCount++;
        updateColoredText();
        break;
      }
    }

    if (!matched) {
      console.log(event.key);
      countMistype(event.key);
      typingResults.totalMistypedCount++;
      return;
    }

    if (
      currentInputIndex.value ===
      currentPatterns[currentPatternIndex.value].length
    ) {
      nextSentence();
    }
  };

  const updatePatterns = async () => {
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
    updateColoredText();
  };

  /**
   * 文字色を更新
   */
  const updateColoredText = () => {
    if (!currentSentence.value) return;

    const fullText = currentSentence.value.patterns[currentPatternIndex.value];
    if (!isTypingStarted.value) {
      coloredText.value = fullText;
      return;
    }
    const coloredPart = fullText.slice(0, currentInputIndex.value);
    const remainingPart = fullText.slice(currentInputIndex.value);

    coloredText.value = `<span style="color: #0044fe;">${coloredPart}</span>${remainingPart}`;
  };

  /**
   * 正タイプ率の計算処理
   */
  const typingAccuracy = computed(() => {
    const total =
      typingResults.totalCorrectTypedCount + typingResults.totalMistypedCount;
    return total > 0
      ? Number((typingResults.totalCorrectTypedCount / total).toFixed(2))
      : 0;
  });

  /**
   * 合計タイプ数を初期化
   */
  const resetTypingStats = () => {
    typingResults.totalCorrectTypedCount = 0;
    typingResults.totalMistypedCount = 0;
    resetMistypeStats();
  };

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
        resetTypingStats();
        await updatePatterns();
        updateColoredText();
      } else {
        console.error("Invalid data received:", data);
      }
    } catch (error) {
      console.error("文章の取得に失敗しました:", error);
    }
  };

  useEventListener(window, "keydown", handleKeyPress);

  return {
    typingAccuracy,
    sentencesData,
    currentSentence,
    coloredText,
    isTypingStarted,
    countdown,
    isCountdownActive,
    finishTyping,
    initialize,
  };
}
