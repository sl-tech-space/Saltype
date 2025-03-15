import { describe, it, expect } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import UserInfo from "../../../../../components/molecules/settings/user/UserInfo.vue";
import BaseCard from "../../../../../components/molecules/common/BaseCard.vue";
import Title from "../../../../../components/atoms/texts/Title.vue";
import Text from "../../../../../components/atoms/texts/Text.vue";

describe("UserInfo", () => {
  let wrapper: VueWrapper<any>;

  const mountComponent = (props = {}) => {
    return mount(UserInfo, {
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
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    wrapper = mountComponent();
    expect(wrapper.findComponent(BaseCard).exists()).toBe(true);
    expect(wrapper.findComponent(Title).props("text")).toBe("ユーザ情報");
  });

  it("ユーザー情報が正しく表示される", () => {
    wrapper = mountComponent();
    const texts = wrapper.findAllComponents(Text);
    expect(texts[0].text()).toBe("ユーザ名\u00A0:\u00A0test user");
    expect(texts[1].text()).toBe("メールアドレス\u00A0:\u00A0test@example.com");
  });

  it("propsが変更されると表示が更新される", async () => {
    wrapper = mountComponent();
    await wrapper.setProps({
      userName: "updated user",
      email: "updated@example.com",
    });

    const texts = wrapper.findAllComponents(Text);
    expect(texts[0].text()).toBe("ユーザ名\u00A0:\u00A0updated user");
    expect(texts[1].text()).toBe("メールアドレス\u00A0:\u00A0updated@example.com");
  });
});


