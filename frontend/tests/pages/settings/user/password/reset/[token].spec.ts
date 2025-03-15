import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick, ref, computed } from "vue";
import PasswordReset from "../../../../../../pages/settings/user/password/reset/[token].vue";
import AuthHeader from "../../../../../../components/organisms/auth/AuthHeader.vue";
import Reset from "../../../../../../components/organisms/settings/user/password/reset/Reset.vue";
import Loading from "../../../../../../components/molecules/common/ui/Loading.vue";
import { usePasswordReset } from "../../../../../../composables/settings/usePasswordReset";

// usePasswordResetのモック
vi.mock("../../../../../../composables/settings/usePasswordReset", () => ({
  usePasswordReset: vi.fn(),
}));

const mockToken = "test-token";
const mockRoute = {
  params: {
    token: mockToken,
  },
};

// useRouteとnavigateTo のモック
vi.mock("#imports", () => ({
  useRoute: () => mockRoute,
  navigateTo: vi.fn(),
}));

describe("PasswordReset", () => {
  const mockTokenIsValid = vi.fn();
  const mockNavigateTo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-ignore
    vi.mocked(usePasswordReset).mockReturnValue({
      tokenIsValid: mockTokenIsValid,
      isLoading: ref(false),
    });
  });

  it("正しくレンダリングされること", () => {
    const wrapper = mount(PasswordReset, {
      shallow: true,
      global: {
        mocks: {
          useRoute: () => mockRoute,
        },
      },
    });

    // 必要なコンポーネントが存在することを確認
    expect(wrapper.findComponent(AuthHeader).exists()).toBe(true);
    expect(wrapper.findComponent(Reset).exists()).toBe(true);
    expect(wrapper.findComponent(Loading).exists()).toBe(true);

    // ページのルート要素が正しいクラスを持つことを確認
    expect(wrapper.classes()).toContain("page");
  });
});
