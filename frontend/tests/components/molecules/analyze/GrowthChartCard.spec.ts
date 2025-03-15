import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import GrowthChartCard from '../../../../components/molecules/analyze/GrowthChartCard.vue'
import BaseCard from '../../../../components/molecules/common/BaseCard.vue'
import BaseChart from '../../../../components/molecules/common/BaseChart.vue'
import BaseCarousel from '../../../../components/molecules/common/BaseCarousel.vue'
import Title from '../../../../components/atoms/texts/Title.vue'
import Text from '../../../../components/atoms/texts/Text.vue'

// BaseChartのモック化
vi.mock('~/components/molecules/common/BaseChart.vue', () => ({
  default: {
    template: '<div class="base-chart-mock" />',
    props: ['scores']
  }
}));

vi.mock('~/composables/typing/useLanguageAndDifficulty', () => ({
  useLanguageAndDifficulty: () => ({
    getLanguageName: (id: number) => id === 1 ? 'JavaScript' : 'Python',
    getDifficultyName: (id: number) => id === 1 ? '初級' : '中級'
  })
}))

describe('GrowthChartCard', () => {
  const mockScoresByCombination = {
    '1-1': { scores: [100, 200, 300] },
    '2-2': { scores: [150, 250, 350] }
  }

  const mountComponent = (props = {}) => {
    return mount(GrowthChartCard, {
      props: {
        scoresByCombination: mockScoresByCombination,
        ...props
      },
      global: {
        components: {
          BaseCard,
          BaseCarousel,
          Title,
          Text
        },
        stubs: {
          BaseChart: {
            template: '<div class="base-chart-mock" />',
            props: ['scores']
          }
        }
      }
    })
  }

  // 基本的なレンダリングテスト
  describe('Basic Rendering', () => {
    it('正しくレンダリングされること', () => {
      const wrapper = mountComponent()
      expect(wrapper.findComponent(BaseCard).exists()).toBe(true)
      expect(wrapper.findComponent(BaseCarousel).exists()).toBe(true)
      expect(wrapper.find('.header-content').text()).toContain('成長グラフ')
    })

    it('カードのサイズが正しく設定されていること', () => {
      const wrapper = mountComponent()
      const card = wrapper.findComponent(BaseCard)
      expect(card.props('width')).toBe('xl')
      expect(card.props('height')).toBe('xl')
    })
  })

  // チャート表示のテスト
  describe('Chart Display', () => {
    it('スコアがある場合、BaseChartが表示されること', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      expect(wrapper.findComponent(BaseChart).exists()).toBe(true)
      expect(wrapper.findComponent(BaseChart).props('scores')).toEqual([100, 200, 300])
    })

    it('スコアが空の場合、"データがありません"と表示されること', async () => {
      const wrapper = mountComponent({
        scoresByCombination: { '1-1': { scores: [] } }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('データがありません')
      expect(wrapper.findComponent(BaseChart).exists()).toBe(false)
    })

    it('スコアがundefinedの場合、"データがありません"と表示されること', async () => {
      const wrapper = mountComponent({
        scoresByCombination: { '1-1': { scores: undefined } }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('データがありません')
    })
  })

  // カルーセル機能のテスト
  describe('Carousel Functionality', () => {
    it('スライド変更時に正しい組み合わせが表示されること', async () => {
      const wrapper = mountComponent()
      await wrapper.findComponent(BaseCarousel).vm.$emit('slide-change', 1)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.footer-content').text()).toContain('Python - 中級')
    })

    it('初期状態で最初の組み合わせが表示されること', async () => {
      const wrapper = mountComponent()
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.footer-content').text()).toContain('JavaScript - 初級')
    })

    it('カルーセルのオプションが正しく設定されていること', () => {
      const wrapper = mountComponent()
      const carousel = wrapper.findComponent(BaseCarousel)
      expect(carousel.props('options')).toEqual({ loop: true })
      expect(carousel.props('slides')).toBe(2)
    })
  })

  // エラー状態のテスト
  describe('Error States', () => {
    it('組み合わせが空の場合、"エラー発生"と表示されること', async () => {
      const wrapper = mountComponent({ scoresByCombination: {} })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.footer-content').text()).toContain('エラー発生')
    })

    it('無効な組み合わせIDの場合でも正しく処理されること', async () => {
      const wrapper = mountComponent({
        scoresByCombination: { 'invalid-id': { scores: [100] } }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.find('.footer-content').text()).not.toContain('undefined')
    })
  })

  // 言語と難易度の表示テスト
  describe('Language and Difficulty Display', () => {
    it('全ての言語・難易度の組み合わせが正しく表示されること', async () => {
      const combinations = {
        '1-1': { scores: [100] }, // JavaScript - 初級
        '1-2': { scores: [100] }, // JavaScript - 中級
        '2-1': { scores: [100] }, // Python - 初級
        '2-2': { scores: [100] }  // Python - 中級
      }
      const wrapper = mountComponent({ scoresByCombination: combinations })

      for (let i = 0; i < Object.keys(combinations).length; i++) {
        await wrapper.findComponent(BaseCarousel).vm.$emit('slide-change', i)
        await wrapper.vm.$nextTick()
        const footerText = wrapper.find('.footer-content').text()
        expect(footerText).toMatch(/^設定 : (JavaScript|Python) - (初級|中級)$/)
      }
    })
  })
})