import { describe, it, expect, vi } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import ResetForm from "../../../../../../../components/molecules/settings/user/password/reset/ResetForm.vue";
import Input from "../../../../../../../components/atoms/inputs/Input.vue";
import Button from "../../../../../../../components/atoms/buttons/Button.vue";
import Image from "../../../../../../../components/atoms/imgs/Image.vue";

const mockResetPassword = vi.fn();
const mockNavigateTo = vi.fn();

vi.mock("~/composables/settings/usePasswordReset", () => ({
  usePasswordReset: () => ({
    resetPassword: mockResetPassword,
    isLoading: false,
    successNotification: null,
    errorNotification: null,
  }),
}));

vi.mock("#app", () => ({
  navigateTo: mockNavigateTo,
}));

describe("ResetForm", () => {
  let wrapper: VueWrapper<any>;

  const mountComponent = (props = {}) => {
    return mount(ResetForm, {
      props: {
        token: "test-token",
        ...props,
      },
      global: {
        components: {
          Input,
          Button,
          Image,
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
    expect(wrapper.findComponent({ name: "ResetForm" }).exists()).toBe(true);
  });

  it("パスワードの表示/非表示を切り替えられる", async () => {
    wrapper = mountComponent();
    
    expect(wrapper.vm.showPassword).toBe(false);
    await wrapper.vm.togglePasswordVisibility("password");
    expect(wrapper.vm.showPassword).toBe(true);
    
    expect(wrapper.vm.showPasswordConfirm).toBe(false);
    await wrapper.vm.togglePasswordVisibility("passwordConfirm");
    expect(wrapper.vm.showPasswordConfirm).toBe(true);
  });

  it("フォーム送信時にパスワードリセットが実行される", async () => {
    wrapper = mountComponent();
    wrapper.vm.password = "NewPassword123!";
    
    await wrapper.vm.handleSubmit();
    expect(mockResetPassword).toHaveBeenCalledWith("test-token", "NewPassword123!");
  });

  it("送信成功後にパスワードフィールドがクリアされる", async () => {
    wrapper = mountComponent();
    wrapper.vm.password = "NewPassword123!";
    wrapper.vm.passwordConfirm = "NewPassword123!";
    
    await wrapper.vm.handleSubmit();
    expect(wrapper.vm.password).toBe("");
    expect(wrapper.vm.passwordConfirm).toBe("");
  });
});
