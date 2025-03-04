import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import UpdatePassword from "../../../../../components/molecules/settings/user/UpdatePassword.vue";
import BaseCard from "../../../../../components/molecules/common/BaseCard.vue";
import Title from "../../../../../components/atoms/texts/Title.vue";
import Text from "../../../../../components/atoms/texts/Text.vue";
import Input from "../../../../../components/atoms/inputs/Input.vue";
import Button from "../../../../../components/atoms/buttons/Button.vue";

const mockUpdateUserInfo = vi.fn();
vi.mock("~/composables/common/useUser", () => ({
  useUser: () => ({
    updateUserInfo: mockUpdateUserInfo,
  }),
}));

describe("UpdatePassword", () => {
  let wrapper: VueWrapper<any>;

  const mountComponent = (props = {}) => {
    return mount(UpdatePassword, {
      props: {
        userId: "1",
        userName: "test user",
        email: "test@example.com",
        passwordExists: true,
        ...props,
      },
      global: {
        components: {
          BaseCard,
          Title,
          Text,
          Input,
          Button,
        },
        stubs: {
          BaseNotification: true,
          Image: true,
          Field: true,
          Form: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    wrapper = mountComponent();
    expect(wrapper.findComponent(BaseCard).exists()).toBe(true);
    expect(wrapper.findComponent(Title).props("text")).toBe("パスワード変更");
  });

  it("パスワード更新が成功すると通知が表示される", async () => {
    mockUpdateUserInfo.mockResolvedValue("パスワードを更新しました");
    wrapper = mountComponent();

    await wrapper.vm.handleSubmit();
    expect(wrapper.vm.showNotification).toBe(true);
    expect(wrapper.vm.message).toBe("パスワードを更新しました");
  });

  it("パスワードの表示/非表示を切り替えられる", async () => {
    wrapper = mountComponent();

    expect(wrapper.vm.showNewPassword).toBe(false);
    await wrapper.vm.togglePasswordVisibility("new");
    expect(wrapper.vm.showNewPassword).toBe(true);
  });
});
