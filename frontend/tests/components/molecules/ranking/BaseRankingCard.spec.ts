import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseRankingCard from '../../../../components/molecules/ranking/BaseRankingCard.vue';

const mockRankings = [
  { username: 'user1', score: 100 },
  { username: 'user2', score: 90 },
  { username: 'user3', score: 80 }
];

const mockNavigateTo = vi.fn();
vi.mock('#app', () => ({
  navigateTo: mockNavigateTo
}));

describe('BaseRankingCard', () => {
  const mountComponent = (props = {}) => {
    return mount(BaseRankingCard, {
      props: {
        rankings: mockRankings,
        width: 'medium',
        height: 'medium',
        limit: 3,
        ...props
      },
      global: {
        stubs: {
          'BaseCard': {
            template: `
              <div class="base-card">
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
          'Text': {
            props: ['size', 'color'],
            template: '<p class="ranking-text"><slot /></p>'
          },
          'Button': {
            props: ['buttonText'],
            template: '<button class="more-button">{{ buttonText }}</button>'
          }
        }
      }
    });
  };

  it('コンポーネントが正しくマウントされる', () => {
    const wrapper = mountComponent();
    expect(wrapper.exists()).toBe(true);
  });

  it('ランキングリストが表示される', () => {
    const wrapper = mountComponent();
    const rankingItems = wrapper.findAll('.ranking-item');
    expect(rankingItems.length).toBe(3);
  });

  it('ランキングデータが正しく表示される', () => {
    const wrapper = mountComponent();
    const rankingTexts = wrapper.findAll('.ranking-text');
    expect(rankingTexts[0].text()).toContain('user1');
    expect(rankingTexts[0].text()).toContain('100');
  });

  it('データがない場合のメッセージが表示される', () => {
    const wrapper = mountComponent({ rankings: [], limit: 1 });
    const rankingText = wrapper.find('.ranking-text');
    expect(rankingText.text()).toContain('データがありません');
  });

  it('グリッド表示が有効な場合、スタイルが適用される', () => {
    const wrapper = mountComponent({ isGrid: true });
    expect(wrapper.find('#ranking-list').exists()).toBe(true);
  });
}); 