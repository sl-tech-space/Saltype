import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { nextTick, ref } from "vue";
import LoginForm from "../../../../components/organisms/login/LoginForm.vue";
import Input from "../../../../components/atoms/inputs/Input.vue";
import Button from "../../../../components/atoms/buttons/Button.vue";

const mockLogin = vi.fn();
const mockError = ref<string | null>(null);
const mockIsLoading = ref(false);

vi.mock("~/composables/auth/useLogin", () => ({
  useLogin: () => ({
    login: mockLogin,
    error: mockError,
    isLoading: mockIsLoading,
  }),
}));

vi.mock("#app", () => ({
  useRoute: () => ({
    query: {},
  }),
}));

describe("LoginForm", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    mockLogin.mockReset();
    mockError.value = null;
    mockIsLoading.value = false;
  });

  const mountComponent = () => {
    return mount(LoginForm, {
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
          Image: true,
          NuxtLink: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    wrapper = mountComponent();
    expect(wrapper.findComponent({ name: "LoginForm" }).exists()).toBe(true);
  });
});
