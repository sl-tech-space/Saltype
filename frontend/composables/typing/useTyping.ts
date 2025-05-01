import { useSentence } from "~/composables/server/useSentence";
import { useSentencePattern } from "~/composables/typing/japanese/useSentencePattern";
import { useInputPattern } from "./japanese/useInputPattern";
import { useMistype } from "./useMistype";
import { useUserInfo } from "../common/useUserInfo";
import { useLocalStorage } from "../common/useLocalStorage";
import { Language } from "./useLanguageAndDifficulty";

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
export function useTyping(language: string, difficultyLevel: string) {
  const config = useRuntimeConfig();
  const sentencesData = shallowRef<Array<[string, string]>>([]);
  const currentIndex = ref(0);
  const patterns = shallowRef<string[]>([]);
  const nextPatterns = shallowRef<string[]>([]); // 次の文章のパターンをキャッシュ
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
  const { getVowelPatternArray, getSymbolsPatternArray } = useInputPattern();

  const vowelPattern = computed(() => getVowelPatternArray());
  const symbolPattern = computed(() => getSymbolsPatternArray());

  const { value: gameModeId } = useLocalStorage("gameModeId");
  const { setValue: setScore } = useLocalStorage("score", "0");
  const { setValue: setTotalCorrectTypedCount } = useLocalStorage(
    "totalCorrectTypedCount",
    "0"
  );
  const { setValue: setTypingAccuracy } = useLocalStorage(
    "typingAccuracy",
    "0"
  );

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
   * 分割された言語：難易度IDを取得
   */
  const _splittedId = computed(() => {
    if (!gameModeId.value) {
      error.value = "選択した難易度は存在しません";
      return null;
    }
    return splitId(gameModeId.value);
  });

  /**
   * 初期化処理
   */
  const initialize = async (): Promise<void> => {
    const { sentences } = useSentence(language, difficultyLevel);

    try {
      const data = await sentences();
      if (Array.isArray(data) && data.length > 0) {
        // メモリ最適化のために前のデータを解放
        sentencesData.value = [];
        patterns.value = [];
        nextPatterns.value = [];

        // 新しいデータをセット
        sentencesData.value = data;
        resetMistypeStats();
        _resetTypingStats();
        await _updatePatterns();
        _updateColoredText();
        // 次の文章のパターンを事前に取得
        _prefetchNextPattern();
      }
    } catch {
      error.value = "文章の取得に失敗しました";
    }
  };

  /**
   * タイピング結果送信
   */
  const _sendTypingDataToServer = async (): Promise<void> => {
    if (!user.value || !_splittedId.value) {
      error.value = "ユーザ情報が存在しません";
      return;
    }

    isLoading.value = true;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(
        `${config.public.baseURL}/api/django/score/insert/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.value.user_id,
            lang_id: _splittedId.value.left,
            diff_id: _splittedId.value.right,
            typing_count: typingResults.totalCorrectTypedCount,
            accuracy: typingResults.typingAccuracy,
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error("スコアの送信に失敗");
      }

      const data = await response.json();
      setScore(data.score.toString());
    } catch {
      error.value =
        "ネットワークエラーが発生しました。接続を確認してください。";
    } finally {
      clearTimeout(timeoutId);
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
  const finishTyping = async (): Promise<void> => {
    isLoading.value = true;
    isTypingStarted.value = false;

    // メモリ最適化: 不要なパターンをクリア
    patterns.value = [];
    nextPatterns.value = [];

    await Promise.all([sendMistypeDataToServer(), _sendTypingDataToServer()]);

    setTotalCorrectTypedCount(typingResults.totalCorrectTypedCount.toString());
    setTypingAccuracy(typingResults.typingAccuracy.toString());

    await navigateTo({ name: "score" });
    isLoading.value = false;
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

    // 言語モードに基づいて処理を分岐
    if (!_splittedId.value) return "incorrect";

    const isCorrect =
      _splittedId.value.left === Language.Japanese
        ? await _handleKeyPressOnJapaneseMode(event)
        : await _handleKeyPressOnEnglishMode(event);

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
    if (
      !_splittedId.value ||
      _splittedId.value.left !== Language.Japanese ||
      !currentSentence.value
    ) {
      return false;
    }

    const currentPatterns = currentSentence.value.patterns;
    const inputKey = event.key.toLowerCase();
    const nextInput = (currentInput.value + inputKey).toLowerCase();

    // 入力に合致するパターンをフィルタリング
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
      // フィルタリングされたパターンを保持
      patterns.value = filteredPatterns;
      typingResults.totalCorrectTypedCount++;
    }

    if (currentInputIndex.value === filteredPatterns[0].length) {
      await _nextSentence();
    }

    return true;
  };

  /**
   * 英語モードのキー入力処理
   */
  const _handleKeyPressOnEnglishMode = async (
    event: KeyboardEvent
  ): Promise<boolean> => {
    if (
      !_splittedId.value ||
      _splittedId.value.left !== Language.English ||
      !currentSentence.value
    ) {
      return false;
    }

    const currentPatterns = currentSentence.value.patterns;
    const expectedChar = currentPatterns.find(
      (pattern) => pattern[currentInputIndex.value] === event.key
    );

    if (!expectedChar) return false;

    currentInput.value += event.key;
    currentInputIndex.value++;
    currentPatternIndex.value = currentPatterns.indexOf(expectedChar);
    typingResults.totalCorrectTypedCount++;
    await _updateColoredText();

    if (currentInputIndex.value === expectedChar.length) {
      await _nextSentence();
    }

    return true;
  };

  /**
   * 次の文章を表示
   */
  const _nextSentence = async (): Promise<void> => {
    if (currentIndex.value < sentencesData.value.length - 1) {
      // メモリ最適化: 古いパターンをクリア
      patterns.value = [];

      currentIndex.value++;
      currentInputIndex.value = 0;
      currentInput.value = "";
      currentPatternIndex.value = 0;

      // 事前に取得していた次のパターンを使用
      if (nextPatterns.value.length > 0) {
        patterns.value = nextPatterns.value;
        nextPatterns.value = [];
        // 現在の文章を表示しながら、次の文章のパターンを事前に取得
        _prefetchNextPattern();
      } else {
        // 事前取得できていなかった場合は通常の更新
        await _updatePatterns();
      }

      await _updateColoredText();
    } else {
      isTypingStarted.value = false;
      // メモリ最適化: 全てのパターンをクリア
      patterns.value = [];
      nextPatterns.value = [];
    }
  };

  /**
   * 次の文章のパターンを事前に取得
   */
  const _prefetchNextPattern = async (): Promise<void> => {
    // まだ次の文章がある場合のみ
    if (currentIndex.value < sentencesData.value.length - 1) {
      const nextIndex = currentIndex.value + 1;
      const { getAllCombinations } = useSentencePattern();

      if (!_splittedId.value) return;

      try {
        if (_splittedId.value.left === Language.Japanese) {
          // 全てのパターンを取得
          nextPatterns.value = await getAllCombinations(
            sentencesData.value[nextIndex][1]
          );
        } else {
          nextPatterns.value = [sentencesData.value[nextIndex][0]];
        }
      } catch (error) {
        console.error("次の文章のパターン取得に失敗:", error);
        // エラーが発生した場合は空配列に
        nextPatterns.value = [];
      }
    }
  };

  /**
   * 文章パターンの更新
   */
  const _updatePatterns = async (): Promise<void> => {
    const { getAllCombinations } = useSentencePattern();
    if (!_splittedId.value) {
      return;
    }

    // メモリ最適化: 古いパターンをクリア
    patterns.value = [];

    if (_splittedId.value.left === Language.Japanese) {
      // 全てのパターンを取得
      patterns.value = await getAllCombinations(
        sentencesData.value[currentIndex.value][1]
      );
    } else {
      patterns.value = [sentencesData.value[currentIndex.value][0]];
    }
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
      coloredText.value = pattern.replace(/ /g, "&nbsp;");
      return;
    }

    // スペースを&nbsp;に置き換え v-htmlによる表示のため
    const typedText = pattern
      .slice(0, currentInputIndex.value)
      .replace(/ /g, "&nbsp;");
    const remainingText = pattern
      .slice(currentInputIndex.value)
      .replace(/ /g, "&nbsp;");

    coloredText.value = `<span style="opacity: 0.5">${typedText}</span>${remainingText}`;
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
    handleKeyPress,
    finishTyping,
    initialize,
  };
}
