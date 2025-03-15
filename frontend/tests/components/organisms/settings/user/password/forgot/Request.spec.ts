import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Request from "../../../../../../../components/organisms/settings/user/password/forgot/Request.vue";
import Describe from "../../../../../../../components/molecules/settings/user/password/Describe.vue";
import RequestForm from "../../../../../../../components/molecules/settings/user/password/forgot/RequestForm.vue";

describe("Request", () => {
  const mountComponent = () => {
    return mount(Request, {
      global: {
        stubs: {
          Describe: true,
          RequestForm: true,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent({ name: "Describe" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "RequestForm" }).exists()).toBe(true);
  });

  it("Describeに正しいプロパティが渡される", () => {
    const wrapper = mountComponent();
    const describe = wrapper.findComponent({ name: "Describe" });
    
    expect(describe.props()).toEqual({
      title: "ログインできない場合",
      description: "メールアドレスを入力してください。<br>パスワード再設定のリンクをお送りします。",
    });
  });
});
