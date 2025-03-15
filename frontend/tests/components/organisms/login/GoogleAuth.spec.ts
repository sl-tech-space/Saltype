import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import GoogleAuth from "../../../../components/organisms/login/GoogleAuth.vue";
import Button from "../../../../components/atoms/buttons/Button.vue";
import Text from "../../../../components/atoms/texts/Text.vue";
import Image from "../../../../components/atoms/imgs/Image.vue";

const mockLoginWithGoogle = vi.fn();
const mockError = ref<string | null>(null);
const mockIsLoading = ref(false);

vi.mock("~/composables/auth/useGoogleAuth", () => ({
  useGoogleAuth: () => ({
    loginWithGoogle: mockLoginWithGoogle,
    error: mockError,
    isLoading: mockIsLoading,
  }),
}));

vi.mock("#app", () => ({
  useRuntimeConfig: () => ({
    public: {
      googleClientId: "test-client-id",
    },
  }),
}));

describe("GoogleAuth", () => {
  let wrapper: VueWrapper<any>;
  let mockInitialize: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockLoginWithGoogle.mockReset();
    mockError.value = null;
    mockIsLoading.value = false;

    mockInitialize = vi.fn();
    // Google APIのモックを改善
    (window as any).google = {
      accounts: {
        id: {
          initialize: mockInitialize,
        },
      },
    };
  });

  const mountComponent = () => {
    return mount(GoogleAuth, {
      global: {
        components: {
          Button,
          Text,
          Image,
        },
        stubs: {
          Separator: true,
          Loading: true,
          BaseNotification: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    wrapper = mountComponent();
    expect(wrapper.find(".google-auth").exists()).toBe(true);
    expect(wrapper.find(".sep").exists()).toBe(true);
  });

  it("Googleログインボタンが正しく表示される", () => {
    wrapper = mountComponent();
    const button = wrapper.findComponent(Button);
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain("Googleで認証");
  });

  it("ログインボタンクリックでログイン処理が実行される", async () => {
    wrapper = mountComponent();
    const button = wrapper.findComponent(Button);

    await button.trigger("click");
    expect(mockLoginWithGoogle).toHaveBeenCalled();
  });

  it("エラー発生時に通知が表示される", async () => {
    wrapper = mountComponent();
    mockError.value = "テストエラー";
    await nextTick();

    const notification = wrapper.findComponent({ name: "BaseNotification" });
    expect(notification.exists()).toBe(true);
    expect(notification.props("show")).toBe(true);
  });
});
