import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import GrowthChartCard from '~/components/molecules/analyze/GrowthChartCard.vue'
import BaseCard from '~/components/molecules/common/BaseCard.vue'
import BaseChart from '~/components/molecules/common/BaseChart.vue'
import BaseCarousel from '~/components/molecules/common/BaseCarousel.vue'
import Title from '~/components/atoms/texts/Title.vue'
import Text from '~/components/atoms/texts/Text.vue'

vi.mock('~/composables/typing/useLanguageAndDifficulty', () => ({
    useLanguageAndDifficulty: () => ({
        getLanguageName: (id: number) => id === 1 ? 'JavaScript' : 'Python',
        getDifficultyName: (id: number) => id === 1 ? '初級' : '中級'
    })
}))

describe('GrowthChart', () => {
    const mockScoresByCombination = {
        '1-1': [{ score: 100 }, { score: 200 }],
        '2-2': [{ score: 150 }, { score: 250 }]
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
                    BaseChart,
                    BaseCarousel,
                    Title,
                    Text
                }
            }
        })
    }

    it('正しくレンダリングされること', () => {
        const wrapper = mountComponent()
        expect(wrapper.findComponent(BaseCard).exists()).toBe(true)
        expect(wrapper.findComponent(BaseCarousel).exists()).toBe(true)
        expect(wrapper.find('.header-content').text()).toContain('成長グラフ')
    })

    it('スコアがある場合、BaseChartが表示されること', async () => {
        const wrapper = mountComponent()
        await wrapper.vm.$nextTick()
        expect(wrapper.findComponent(BaseChart).exists()).toBe(true)
    })

    it('スコアがない場合、"データがありません"と表示されること', async () => {
        const wrapper = mountComponent({ scoresByCombination: { '1-1': [] } })
        await wrapper.vm.$nextTick()
        expect(wrapper.text()).toContain('データがありません')
    })

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

    it('組み合わせがない場合、"エラー発生"と表示されること', async () => {
        const wrapper = mountComponent({ scoresByCombination: {} })
        await wrapper.vm.$nextTick()
        expect(wrapper.find('.footer-content').text()).toContain('エラー発生')
    })
})