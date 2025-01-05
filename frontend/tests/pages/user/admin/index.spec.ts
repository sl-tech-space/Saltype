import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserAdminPage from "~/pages/user/admin/index.vue";
import CursorEffect from "~/components/molecules/common/ui/CursorEffect.vue";
import UserAdminHeader from "~/components/organisms/user/admin/UserAdminHeader.vue";
import CopyRight from "~/components/atoms/ui/CopyRight.vue";
import UserAdminCard from "~/components/organisms/user/admin/UserAdminCard.vue";
import Loading from "~/components/molecules/common/ui/Loading.vue";

vi.mock("~/composables/user/useUser", () => ({
  useUser: () => ({
    checkAdminPermission: vi.fn(),
    isAdmin: { value: true },
    isLoading: false,
  }),
}));

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("UserAdminPage", () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(UserAdminPage, {
      global: {
        stubs: {
          CursorEffect: true,
          UserAdminHeader: true,
          CopyRight: true,
          UserAdminCard: true,
          Loading: true,
        },
        mocks: {
          useHead: vi.fn(),
        },
      },
    });
  });

  it("コンポーネントが正しくレンダリングされること", () => {
    expect(wrapper.find(".page").exists()).toBe(true);
    expect(wrapper.findComponent(CursorEffect).exists()).toBe(true);
    expect(wrapper.findComponent(UserAdminHeader).exists()).toBe(true);
    expect(wrapper.findComponent(UserAdminCard).exists()).toBe(true);
    expect(wrapper.findComponent(CopyRight).exists()).toBe(true);
    expect(wrapper.findComponent(Loading).exists()).toBe(true);
  });
});
