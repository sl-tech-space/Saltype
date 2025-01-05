import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import UserAdminHeader from "~/components/organisms/user/admin/UserAdminHeader.vue";
import BaseHeader from "~/components/molecules/common/BaseHeader.vue";

describe("UserAdminHeader", () => {
  it("BaseHeaderコンポーネントが正しくレンダリングされること", () => {
    const wrapper = mount(UserAdminHeader, {
      global: {
        stubs: {
          BaseHeader: true,
        },
      },
    });

    expect(wrapper.findComponent(BaseHeader).exists()).toBe(true);
  });

  it("BaseHeaderコンポーネントに正しいタイトルが渡されること", () => {
    const wrapper = mount(UserAdminHeader);

    expect(wrapper.findComponent(BaseHeader).props("title")).toBe("ユーザ管理");
  });
});
