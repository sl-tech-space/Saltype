import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import GameSettingCard from '../../../../components/molecules/home/GameSettingCard.vue';

describe('GameSettingCard', () => {
  const mockNavigateTo = vi.fn();

  beforeEach(() => {
    // localStorageのモック
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
      removeItem: vi.fn()
    } as Storage;
    global.localStorage = localStorageMock;

    // navigateToのモック
    vi.mock('#app', () => ({
      navigateTo: mockNavigateTo
    }));

    // joinWithHyphenのモック
    vi.mock('~/utils/string', () => ({
      joinWithHyphen: (...args: string[]) => args.join('-')
    }));
  });

  const mountComponent = () => {
    return mount(GameSettingCard, {
      global: {
        stubs: {
          'BaseCard': {
            template: `
              <div class="game-setting-card">
                <div class="header-content"><slot name="card-header" /></div>
                <div class="body-content"><slot name="card-body" /></div>
                <div class="footer-content"><slot name="card-footer" /></div>
              </div>
            `
          },
          'Title': {
            props: ['text'],
            template: '<div class="title">{{ text }}</div>'
          },
          'Separator': {
            template: '<div class="separator" />'
          },
          'Language': {
            template: '<div class="language" />'
          },
          'DifficultyLevel': {
            template: '<div class="difficulty" />'
          },
          'Button': {
            props: ['buttonText'],
            template: '<button class="start-button">{{ buttonText }}</button>'
          }
        }
      }
    });
  };

  it('コンポーネントが正しくマウントされる', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('言語選択とレベル選択のコンポーネントが存在する', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('.language-setting').exists()).toBe(true);
    expect(wrapper.find('.difficulty-setting').exists()).toBe(true);
  });

  it('スタートボタンが存在する', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('.start-button').exists()).toBe(true);
  });
});
