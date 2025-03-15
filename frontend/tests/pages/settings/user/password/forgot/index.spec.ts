import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import ForgotPassword from "../../../../../../pages/settings/user/password/forgot/index.vue";
import AuthHeader from "../../../../../../components/organisms/auth/AuthHeader.vue";
import Request from "../../../../../../components/organisms/settings/user/password/forgot/Request.vue";

describe("ForgotPassword", () => {
  it("正しくレンダリングされること", () => {
    const wrapper = mount(ForgotPassword, {
      shallow: true,
    });

    // 必要なコンポーネントが存在することを確認
    expect(wrapper.findComponent(AuthHeader).exists()).toBe(true);
    expect(wrapper.findComponent(Request).exists()).toBe(true);

    // ページのルート要素が正しいクラスを持つことを確認
    expect(wrapper.classes()).toContain("page");
  });

  it("コンポーネントの順序が正しいこと", () => {
    const wrapper = mount(ForgotPassword, {
      shallow: true,
    });

    const children = wrapper.element.children;
    expect(children[0].tagName.toLowerCase()).toBe("auth-header-stub");
    expect(children[1].tagName.toLowerCase()).toBe("request-stub");
  });
});
