import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import UserSettingCard from "../../../../../components/organisms/settings/user/UserSettingCard.vue";
import MenuCard from "../../../../../components/molecules/settings/user/MenuCard.vue";

const mockGetUserInfo = vi.fn();
const mockUserItem = ref({
  user_id: "1",
  username: "Test User",
  email: "test@example.com",
  password_exists: true,
});
const mockError = ref<string | null>(null);
const mockIsLoading = ref(false);

vi.mock("~/composables/settings/useUserSetting", () => ({
  useUserSetting: () => ({
    getUserInfo: mockGetUserInfo,
    userItem: mockUserItem,
    error: mockError,
    isLoading: mockIsLoading,
  }),
}));

describe("UserSettingCard", () => {
  beforeEach(() => {
    mockGetUserInfo.mockReset();
    mockError.value = null;
    mockIsLoading.value = false;
  });

  const mountComponent = () => {
    return mount(UserSettingCard, {
      global: {
        stubs: {
          UserInfo: true,
          UpdateUserName: true,
          UpdatePassword: true,
          MenuCard: true,
          Loading: true,
          BaseNotification: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.find(".settings-card").exists()).toBe(true);
    expect(wrapper.find(".left-card").exists()).toBe(true);
    expect(wrapper.find(".right-card").exists()).toBe(true);
  });

  it("初期表示時はUserInfoが表示される", () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent({ name: "UserInfo" }).exists()).toBe(true);
  });

  it("カード切り替えが正しく動作する", async () => {
    const wrapper = mountComponent();

    // UpdateUserNameに切り替え
    await wrapper
      .findComponent(MenuCard)
      .vm.$emit("change-card", "updateUserName");
    await nextTick();
    expect(wrapper.findComponent({ name: "UpdateUserName" }).exists()).toBe(
      true
    );

    // UpdatePasswordに切り替え
    await wrapper
      .findComponent(MenuCard)
      .vm.$emit("change-card", "updatePassword");
    await nextTick();
    expect(wrapper.findComponent({ name: "UpdatePassword" }).exists()).toBe(
      true
    );

    // UserInfoに戻る
    await wrapper.findComponent(MenuCard).vm.$emit("change-card", "userInfo");
    await nextTick();
    expect(wrapper.findComponent({ name: "UserInfo" }).exists()).toBe(true);
  });

  it("ユーザー情報が正しくコンポーネントに渡される", () => {
    const wrapper = mountComponent();
    const userInfo = wrapper.findComponent({ name: "UserInfo" });
    expect(userInfo.props()).toEqual({
      userId: "1",
      userName: "Test User",
      email: "test@example.com",
      passwordExists: true,
    });
  });

  it("マウント時にユーザー情報を取得する", () => {
    mountComponent();
    expect(mockGetUserInfo).toHaveBeenCalled();
  });
});
