import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PrivacyPolicy from "../../pages/privacypolicy.vue";

const mockUseHead = vi.fn();
const mockGetPrivacyPolicySentence = vi.fn();

// useHeadのモック
vi.mock("#imports", () => ({
  useHead: mockUseHead,
}));

// useLegalのモック
vi.mock("../../composables/legal/useLegal", () => ({
  useLegal: () => ({
    getPrivacyPolicySentence: mockGetPrivacyPolicySentence,
  }),
}));

describe("PrivacyPolicy", () => {
  const mockSentences = [
    { title: "タイトル1", content: "内容1", size: "large" },
    { title: "タイトル2", content: "内容2", size: "medium" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetPrivacyPolicySentence.mockReturnValue(mockSentences);
  });

  it("正しくレンダリングされること", () => {
    const wrapper = mount(PrivacyPolicy, {
      shallow: true,
    });

    // メインコンテナが存在することを確認
    expect(wrapper.find(".privacypolicy").exists()).toBe(true);
    expect(wrapper.find(".policy-content").exists()).toBe(true);
  });
});
