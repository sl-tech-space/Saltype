import { describe, it, expect, vi } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import MenuCard from "../../../../../components/molecules/settings/screen/MenuCard.vue";
import BaseCard from "../../../../../components/molecules/common/BaseCard.vue";
import Title from "../../../../../components/atoms/texts/Title.vue";
import Text from "../../../../../components/atoms/texts/Text.vue";

const mockSetColor = vi.fn();
vi.mock('~/store/colorStore', () => ({
  useColorStore: () => ({
    colorStore: {
      mainColor: '#000000'
    }
  })
}));

vi.mock('~/composables/common/useUser', () => ({
  useUser: () => ({
    isAdmin: { value: false },
    isLoading: false,
    error: null
  })
}));

vi.mock('~/composables/common/useMenuItems', () => ({
  useMenuItems: () => ({
    screenSettingMenuItems: [
      { text: 'カラーカスタマイズ', actionKey: 'colorCustomizer', path: 'M0 0h24v24H0z' },
      { text: 'タイピング画面設定', actionKey: 'typingScreenSetting', path: 'M0 0h24v24H0z' },
      { text: '共通設定', actionKey: 'screenCommonSetting', path: 'M0 0h24v24H0z' }
    ],
    getAction: (key: string) => vi.fn()
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
          'ClientOnly': true,
          'svg': true,
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
    expect(menuItems[0].text()).toContain('カラーカスタマイズ');
    expect(menuItems[1].text()).toContain('タイピング画面設定');
    expect(menuItems[2].text()).toContain('共通設定');
  });
});
