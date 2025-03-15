import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Terms from "../../pages/terms.vue";

const mockUseHead = vi.fn();
const mockGetTermsOfServiceSentence = vi.fn();

// useHeadのモック
vi.mock("#imports", () => ({
  useHead: mockUseHead,
}));

// useLegalのモック
vi.mock("../../composables/legal/useLegal", () => ({
  useLegal: () => ({
    getTermsOfServiceSentence: mockGetTermsOfServiceSentence,
  }),
}));

describe("Terms", () => {
  const mockSentences = [
    { title: "タイトル1", content: "内容1", size: "large" },
    { title: "タイトル2", content: "内容2", size: "medium" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTermsOfServiceSentence.mockReturnValue(mockSentences);
  });

  it("正しくレンダリングされること", () => {
    const wrapper = mount(Terms, {
      shallow: true,
    });

    // メインコンテナが存在することを確認
    expect(wrapper.find(".terms").exists()).toBe(true);
    expect(wrapper.find(".terms-content").exists()).toBe(true);
  });
});
