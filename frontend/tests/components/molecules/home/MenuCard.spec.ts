import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import MenuCard from '../../../../components/molecules/home/MenuCard.vue';
import BaseCard from '../../../../components/molecules/common/BaseCard.vue';
import Title from '../../../../components/atoms/texts/Title.vue';
import Text from '../../../../components/atoms/texts/Text.vue';
import Button from '../../../../components/atoms/buttons/Button.vue';

vi.mock('#app', () => ({
  navigateTo: vi.fn()
}));

vi.mock('~/composables/auth/useLogout', () => ({
  useLogout: () => ({
    logout: vi.fn()
  })
}));

vi.mock('~/store/colorStore', () => ({
  useColorStore: () => ({
    colorStore: {
      mainColor: '#000000'
    }
  })
}));

vi.mock('~/composables/common/useUser', () => ({
  useUser: () => ({
    checkAdminPermission: vi.fn(),
    isAdmin: { value: false }
  })
}));

vi.mock('~/composables/common/useMenuItems', () => ({
  useMenuItems: () => ({
    homeMenuItems: [
      { text: 'ランキング', actionKey: 'ranking', path: 'M0 0h24v24H0z' },
      { text: '分析', actionKey: 'analyze', path: 'M0 0h24v24H0z' }
    ],
    getAction: (key: string) => vi.fn()
  })
}));

describe('MenuCard', () => {
  const mountComponent = () => {
    return mount(MenuCard, {
      global: {
        stubs: {
          BaseCard: {
            template: `
              <div class="menu-card">
                <div class="header-content">
                  <slot name="card-header" />
                </div>
                <div class="body-content">
                  <div class="menu-list">
                    <slot name="card-body" />
                  </div>
                </div>
                <div class="footer-content">
                  <slot name="card-footer" />
                </div>
              </div>
            `
          },
          Title: true,
          Text: true,
          Button: true,
          ClientOnly: true,
          svg: true
        }
      }
    });
  };

  it('コンポーネントが正しくマウントされる', async () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });
});
