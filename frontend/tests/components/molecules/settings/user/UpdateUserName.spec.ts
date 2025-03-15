import { describe, it, expect, vi } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import UpdateUserName from "../../../../../components/molecules/settings/user/UpdateUserName.vue";
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

describe("UpdateUserName", () => {
  let wrapper: VueWrapper<any>;

  const mountComponent = (props = {}) => {
    return mount(UpdateUserName, {
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
          Field: true,
          Form: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    wrapper = mountComponent();
    expect(wrapper.findComponent(BaseCard).exists()).toBe(true);
    expect(wrapper.findComponent(Title).props("text")).toBe("ユーザ名変更");
  });

  it("ユーザー名更新が成功すると通知が表示される", async () => {
    mockUpdateUserInfo.mockResolvedValue("ユーザー名を更新しました");
    wrapper = mountComponent();

    await wrapper.vm.handleSubmit();
    expect(wrapper.vm.showNotification).toBe(true);
    expect(wrapper.vm.message).toBe("ユーザー名を更新しました");
  });

  it("user-updatedイベントが発火される", async () => {
    wrapper = mountComponent();
    await wrapper.vm.handleSubmit();
    expect(wrapper.emitted("user-updated")).toBeTruthy();
  });
});
