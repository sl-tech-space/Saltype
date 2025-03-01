import { describe, it, expect, vi } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import RequestForm from "../../../../../../../components/molecules/settings/user/password/forgot/RequestForm.vue";
import Input from "../../../../../../../components/atoms/inputs/Input.vue";
import Button from "../../../../../../../components/atoms/buttons/Button.vue";

const mockRequestResetPassword = vi.fn();
const mockNavigateTo = vi.fn();

vi.mock("~/composables/settings/usePasswordReset", () => ({
  usePasswordReset: () => ({
    requestResetPassword: mockRequestResetPassword,
    isLoading: false,
    successNotification: null,
    error: null,
  }),
}));

vi.mock("#app", () => ({
  navigateTo: mockNavigateTo,
}));

describe("RequestForm", () => {
  let wrapper: VueWrapper<any>;

  const mountComponent = () => {
    return mount(RequestForm, {
      global: {
        components: {
          Input,
          Button,
        },
        stubs: {
          Field: true,
          Form: true,
          Loading: true,
          BaseNotification: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    wrapper = mountComponent();
    expect(wrapper.findComponent({ name: "RequestForm" }).exists()).toBe(true);
  });

  it("フォーム送信時にパスワードリセットがリクエストされる", async () => {
    wrapper = mountComponent();
    await wrapper.vm.handleSubmit();
    expect(mockRequestResetPassword).toHaveBeenCalled();
  });

  it("送信成功後にメールアドレスがクリアされる", async () => {
    wrapper = mountComponent();
    wrapper.vm.email = "test@example.com";
    await wrapper.vm.handleSubmit();
    expect(wrapper.vm.email).toBe("");
  });
});
