import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import LoginPage from "~/pages/login.vue";
import CursorEffect from "~/composables/ui/useCursorEffect.vue";
import LoginForm from "~/components/organisms/login/LoginForm.vue";
import GoogleAuth from "~/components/organisms/login/GoogleAuth.vue";
import Title from "~/components/atoms/texts/Title.vue";

// useAuthTokenのモック
vi.mock("~/composables/auth/useAuthToken", () => ({
  useAuthToken: () => ({
    authToken: vi.fn(),
  }),
}));

describe("LoginPage", () => {
  it("正しくレンダリングされること", async () => {
    const wrapper = mount(LoginPage, {
      global: {
        stubs: {
          CursorEffect: true,
          LoginForm: true,
          GoogleAuth: true,
          Title: true,
        },
      },
    });

    // 各コンポーネントが存在することを確認
    expect(wrapper.findComponent(CursorEffect).exists()).toBe(true);
    expect(wrapper.findComponent(LoginForm).exists()).toBe(true);
    expect(wrapper.findComponent(GoogleAuth).exists()).toBe(true);
    expect(wrapper.findComponent(Title).exists()).toBe(true);

    // pageクラスを持つdiv要素が存在することを確認
    expect(wrapper.find(".page").exists()).toBe(true);

    // loginクラスを持つdiv要素が存在することを確認
    expect(wrapper.find(".login").exists()).toBe(true);

    // Titleコンポーネントのテキストとクラスを確認
    const titleComponent = wrapper.findComponent(Title);
    expect(titleComponent.props("text")).toBe("ログイン");
    expect(titleComponent.classes()).toContain("title");
  });
});
