import { describe, it, expect } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import Describe from "../../../../../../components/molecules/settings/user/password/Describe.vue";
import Title from "../../../../../../components/atoms/texts/Title.vue";
import Text from "../../../../../../components/atoms/texts/Text.vue";

describe("Describe", () => {
  let wrapper: VueWrapper<any>;

  const mountComponent = (props = {}) => {
    return mount(Describe, {
      props: {
        title: "テストタイトル",
        description: "テスト説明文",
        ...props,
      },
      global: {
        components: {
          Title,
          Text,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    wrapper = mountComponent();
    expect(wrapper.findComponent(Title).exists()).toBe(true);
    expect(wrapper.findComponent(Text).exists()).toBe(true);
  });

  it("タイトルが正しく表示される", () => {
    wrapper = mountComponent();
    expect(wrapper.findComponent(Title).props("text")).toBe("テストタイトル");
    expect(wrapper.findComponent(Title).props("size")).toBe("small");
  });

  it("propsの変更が反映される", async () => {
    wrapper = mountComponent();
    await wrapper.setProps({
      title: "新しいタイトル",
      description: "新しい説明文",
    });

    expect(wrapper.findComponent(Title).props("text")).toBe("新しいタイトル");
    expect(wrapper.findComponent(Text).text()).toBe("新しい説明文");
  });
});
