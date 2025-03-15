import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import LoginPage from "../../pages/login.vue";
import AuthHeader from "../../components/organisms/auth/AuthHeader.vue";
import LoginForm from "../../components/organisms/login/LoginForm.vue";
import GoogleAuth from "../../components/organisms/login/GoogleAuth.vue";
import { useAuthToken } from "../../composables/auth/useAuthToken";

const mockUseHead = vi.fn();
const mockAuthToken = vi.fn();

// useHeadのモック
vi.mock("#imports", () => ({
  useHead: mockUseHead,
}));

// useAuthTokenのモック
vi.mock("../../composables/auth/useAuthToken", () => ({
  useAuthToken: () => ({
    authToken: mockAuthToken,
  }),
}));

describe("LoginPage", () => {
  it("正しくレンダリングされること", () => {
    const wrapper = mount(LoginPage, {
      shallow: true,
    });

    // 必要なコンポーネントが存在することを確認
    expect(wrapper.findComponent(AuthHeader).exists()).toBe(true);
    expect(wrapper.findComponent(LoginForm).exists()).toBe(true);
    expect(wrapper.findComponent(GoogleAuth).exists()).toBe(true);

    // ページのルート要素が正しいクラスを持つことを確認
    expect(wrapper.find(".page").exists()).toBe(true);
    expect(wrapper.find(".login").exists()).toBe(true);
  });

  it("コンポーネントの順序が正しいこと", () => {
    const wrapper = mount(LoginPage, {
      shallow: true,
    });

    const loginDiv = wrapper.find(".login");
    const children = loginDiv.element.children;
    expect(children[0].tagName.toLowerCase()).toBe("auth-header-stub");
    expect(children[1].tagName.toLowerCase()).toBe("login-form-stub");
    expect(children[2].tagName.toLowerCase()).toBe("google-auth-stub");
  });

  it("マウント時に認証トークンチェックが実行されること", () => {
    mount(LoginPage, {
      shallow: true,
    });

    expect(mockAuthToken).toHaveBeenCalled();
  });
});
