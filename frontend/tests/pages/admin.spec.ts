import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import AdminPage from "../../pages/admin.vue";
import UserAdminHeader from "../../components/organisms/admin/UserAdminHeader.vue";
import UserAdminCard from "../../components/organisms/admin/UserAdminCard.vue";

const mockUseHead = vi.fn();

// useHeadのモック
vi.mock("#imports", () => ({
  useHead: mockUseHead,
}));

describe("AdminPage", () => {
  it("正しくレンダリングされること", () => {
    const wrapper = mount(AdminPage, {
      shallow: true,
    });

    // 必要なコンポーネントが存在することを確認
    expect(wrapper.findComponent(UserAdminHeader).exists()).toBe(true);
    expect(wrapper.findComponent(UserAdminCard).exists()).toBe(true);

    // ページのルート要素が正しいクラスを持つことを確認
    expect(wrapper.find(".page").exists()).toBe(true);
  });

  it("コンポーネントの順序が正しいこと", () => {
    const wrapper = mount(AdminPage, {
      shallow: true,
    });

    const children = wrapper.element.children;
    expect(children[0].tagName.toLowerCase()).toBe("user-admin-header-stub");
    expect(children[1].tagName.toLowerCase()).toBe("user-admin-card-stub");
  });
});
