import { mount, VueWrapper } from "@vue/test-utils";
import { describe, it, expect, beforeEach } from "vitest";
import UserAdminHeader from "../../../../components/organisms/admin/UserAdminHeader.vue";
import BaseHeader from "../../../../components/molecules/common/BaseHeader.vue";

describe("UserAdminHeader", () => {
  let wrapper: VueWrapper<any>;

  const mountComponent = () => {
    return mount(UserAdminHeader, {
      global: {
        components: {
          BaseHeader,
        },
      },
    });
  };

  beforeEach(() => {
    wrapper = mountComponent();
  });

  it("コンポーネントが正しくレンダリングされる", () => {
    expect(wrapper.findComponent(BaseHeader).exists()).toBe(true);
  });

  it("BaseHeaderに正しいタイトルが渡される", () => {
    expect(wrapper.findComponent(BaseHeader).props("title")).toBe("ユーザ管理");
  });
});
