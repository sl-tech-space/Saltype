import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import UserSettingCard from "~/components/organisms/user/setting/UserSettingCard.vue";
import UserInfo from "~/components/molecules/user/setting/UserInfo.vue";
import UpdateUserName from "~/components/molecules/user/setting/UpdateUserName.vue";
import UpdatePassword from "~/components/molecules/user/setting/UpdatePassword.vue";
import MenuCard from "~/components/molecules/user/setting/MenuCard.vue";

vi.mock("~/composables/user/setting/useSetting", () => ({
  useSetting: () => ({
    getUserInfo: vi.fn(),
    userItem: {
      value: {
        user_id: "1",
        username: "Test User",
        email: "test@example.com",
        password_exists: true,
      },
    },
    isLoading: { value: false },
    error: { value: null },
  }),
}));

describe("UserSettingCard", () => {
  const createWrapper = () => {
    return mount(UserSettingCard, {
      global: {
        stubs: {
          UserInfo: true,
          UpdateUserName: true,
          UpdatePassword: true,
          MenuCard: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされること", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".settings-card").exists()).toBe(true);
    expect(wrapper.find(".left-card").exists()).toBe(true);
    expect(wrapper.find(".right-card").exists()).toBe(true);
  });

  it("初期状態でUserInfoコンポーネントが表示されること", () => {
    const wrapper = createWrapper();
    expect(wrapper.findComponent(UserInfo).exists()).toBe(true);
  });

  it("MenuCardコンポーネントが表示されること", () => {
    const wrapper = createWrapper();
    expect(wrapper.findComponent(MenuCard).exists()).toBe(true);
  });

  it("changeCard イベントでコンポーネントが切り替わること", async () => {
    const wrapper = createWrapper();
    await wrapper
      .findComponent(MenuCard)
      .vm.$emit("change-card", "updateUserName");
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(UpdateUserName).exists()).toBe(true);

    await wrapper
      .findComponent(MenuCard)
      .vm.$emit("change-card", "updatePassword");
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(UpdatePassword).exists()).toBe(true);
  });

  it("ユーザー情報が正しくコンポーネントに渡されること", () => {
    const wrapper = createWrapper();
    const userInfoComponent = wrapper.findComponent(UserInfo);
    expect(userInfoComponent.props()).toEqual({
      userId: "1",
      userName: "Test User",
      email: "test@example.com",
      passwordExists: true,
    });
  });
});
