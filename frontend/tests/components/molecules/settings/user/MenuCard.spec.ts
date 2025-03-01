import { describe, it, expect, vi } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import MenuCard from "../../../../../components/molecules/settings/user/MenuCard.vue";
import BaseCard from "../../../../../components/molecules/common/BaseCard.vue";
import Title from "../../../../../components/atoms/texts/Title.vue";
import Text from "../../../../../components/atoms/texts/Text.vue";

vi.mock('~/composables/common/useUser', () => ({
  useUser: () => ({
    isAdmin: { value: false },
    isLoading: false,
    error: null
  })
}));

vi.mock('~/composables/common/useMenuItems', () => ({
  useMenuItems: () => ({
    userSettingMenuItems: [
      { text: 'ユーザー情報', actionKey: 'userInfo' },
      { text: 'ユーザー名変更', actionKey: 'updateUserName' },
      { text: 'パスワード変更', actionKey: 'updatePassword' }
    ],
    getAction: (key: string) => vi.fn()
  })
}));

vi.mock('~/composables/common/useError', () => ({
  useErrorNotification: () => ({
    showErrorNotification: true
  })
}));

describe("MenuCard", () => {
  const mountComponent = () => {
    return mount(MenuCard, {
      global: {
        components: {
          BaseCard,
          Title,
          Text
        },
        stubs: {
          'Loading': true,
          'BaseNotification': true
        }
      }
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent(BaseCard).exists()).toBe(true);
    expect(wrapper.findComponent(Title).props('text')).toBe('メニュー');
  });

  it("メニュー項目が正しく表示される", () => {
    const wrapper = mountComponent();
    const menuItems = wrapper.findAllComponents(Text);
    expect(menuItems.length).toBe(3);
    expect(menuItems[0].text()).toBe('ユーザー情報');
    expect(menuItems[1].text()).toBe('ユーザー名変更');
    expect(menuItems[2].text()).toBe('パスワード変更');
  });
});


