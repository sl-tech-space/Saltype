import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CookiePolicy from "../../pages/cookiepolicy.vue";
import Title from "../../components/atoms/texts/Title.vue";
import Text from "../../components/atoms/texts/Text.vue";
import Separator from "../../components/atoms/ui/Separator.vue";
import { useLegal } from "../../composables/legal/useLegal";

const mockUseHead = vi.fn();
const mockGetCookiePolicySentence = vi.fn();
const mockDefinePageMeta = vi.fn();

// useHeadとdefinePageMetaのモック
vi.mock("#imports", () => ({
  useHead: mockUseHead,
  definePageMeta: mockDefinePageMeta,
}));

// useLegalのモック
vi.mock("../../composables/legal/useLegal", () => ({
  useLegal: () => ({
    getCookiePolicySentence: mockGetCookiePolicySentence,
  }),
}));

describe("CookiePolicy", () => {
  const mockSentences = [
    { title: "タイトル1", content: "内容1", size: "large" },
    { title: "タイトル2", content: "内容2", size: "medium" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetCookiePolicySentence.mockReturnValue(mockSentences);
  });

  it("正しくレンダリングされること", () => {
    const wrapper = mount(CookiePolicy, {
      shallow: true,
      global: {
        stubs: {
          Title: true,
          Text: true,
          Separator: true,
        },
      },
    });

    // メインコンテナが存在することを確認
    expect(wrapper.find(".terms").exists()).toBe(true);
    expect(wrapper.find(".terms-content").exists()).toBe(true);
  });
});
