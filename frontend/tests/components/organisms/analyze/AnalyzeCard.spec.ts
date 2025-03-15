import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import AnalyzeCard from "../../../../components/organisms/analyze/AnalyzeCard.vue";
import TypoFrequencyCard from "../../../../components/molecules/analyze/TypoFrequencyCard.vue";
import GrowthChartCard from "../../../../components/molecules/analyze/GrowthChartCard.vue";

const mockGetTypoFrequencyByLimit = vi.fn();
const mockGetPastScores = vi.fn();
const mockScoresByCombination = { value: {} };
const mockTypoFrequency = { value: [] };
const mockIsLoading = { value: true };
const mockError = { value: null };

vi.mock('~/utils/language', () => ({
  getLanguageName: vi.fn((id: number) => {
    return id === 1 ? 'Japanese' : 'English';
  }),
  getDifficultyName: vi.fn((id: number) => {
    return id === 1 ? 'Easy' : 'Normal';
  }),
  splitId: vi.fn((id: string) => {
    const [left, right] = id.split('-');
    return { left: Number(left), right: Number(right) };
  }),
}));

vi.mock("~/composables/analyze/useAnalyze", () => ({
  useAnalyze: () => ({
    typoFrequency: mockTypoFrequency,
    scoresByCombination: mockScoresByCombination,
    isLoading: mockIsLoading,
    error: mockError,
    getTypoFrequencyByLimit: mockGetTypoFrequencyByLimit,
    getPastScores: mockGetPastScores,
  }),
}));

vi.mock("~/composables/typing/useLanguageAndDifficulty", () => ({
  useLanguageAndDifficulty: () => ({
    generateAllCombinations: () => [
      { languageId: "1", difficultyId: "1" },
      { languageId: "2", difficultyId: "1" },
    ],
  }),
}));

describe("AnalyzeCard", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    mockGetTypoFrequencyByLimit.mockReset();
    mockGetPastScores.mockReset();
    mockGetPastScores.mockResolvedValue([10, 20, 30]);
    mockScoresByCombination.value = {};
    mockTypoFrequency.value = [];
    mockIsLoading.value = true;
    mockError.value = null;
  });

  const mountComponent = () => {
    return mount(AnalyzeCard, {
      global: {
        stubs: {
          GrowthChartCard: true,
          TypoFrequencyCard: true,
          Loading: true,
          BaseNotification: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", async () => {
    wrapper = mountComponent();
    await nextTick();

    expect(wrapper.find(".analyze-cards-container").exists()).toBe(true);
    expect(wrapper.find(".left-card").exists()).toBe(true);
    expect(wrapper.find(".right-card").exists()).toBe(true);
    expect(wrapper.findComponent(GrowthChartCard).exists()).toBe(true);
    expect(wrapper.findComponent(TypoFrequencyCard).exists()).toBe(true);
  });

  it("マウント時にデータを取得する", async () => {
    wrapper = mountComponent();
    await nextTick();

    expect(mockGetTypoFrequencyByLimit).toHaveBeenCalledWith(10);
    expect(mockGetPastScores).toHaveBeenCalledTimes(2);
    expect(mockGetPastScores).toHaveBeenCalledWith("1", "1");
    expect(mockGetPastScores).toHaveBeenCalledWith("2", "1");
  });
});