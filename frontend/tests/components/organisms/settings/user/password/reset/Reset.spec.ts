import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Reset from "../../../../../../../components/organisms/settings/user/password/reset/Reset.vue";

describe("Reset", () => {
  const defaultProps = {
    token: "test-token",
  };

  const mountComponent = (props = defaultProps) => {
    return mount(Reset, {
      props,
      global: {
        stubs: {
          Describe: true,
          ResetForm: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent({ name: "Describe" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "ResetForm" }).exists()).toBe(true);
  });

  it("Describeに正しいプロパティが渡される", () => {
    const wrapper = mountComponent();
    const describe = wrapper.findComponent({ name: "Describe" });

    expect(describe.props()).toEqual({
      title: "パスワードリセット",
      description:
        "パスワードを再設定します。<br>新しいパスワードを入力してください。",
    });
  });

  it("ResetFormに正しいトークンが渡される", () => {
    const wrapper = mountComponent();
    const resetForm = wrapper.findComponent({ name: "ResetForm" });
    expect(resetForm.props("token")).toBe("test-token");
  });
});
