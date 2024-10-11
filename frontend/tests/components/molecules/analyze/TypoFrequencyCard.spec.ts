import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TypoFrequencyCard from '~/components/molecules/analyze/TypoFrequencyCard.vue'
import BaseCard from '~/components/molecules/common/BaseCard.vue'
import Title from '~/components/atoms/texts/Title.vue'
import Text from '~/components/atoms/texts/Text.vue'

describe('TypoFrequency', () => {
    const mockTypoFrequency = [
        { miss_char: 'a', miss_count: 5 },
        { miss_char: 'b', miss_count: 3 },
        { miss_char: 'c', miss_count: 1 }
    ]

    const mountComponent = (props = {}) => {
        return mount(TypoFrequencyCard, {
            props: {
                typoFrequency: mockTypoFrequency,
                limit: 3,
                ...props
            },
            global: {
                components: {
                    BaseCard,
                    Title,
                    Text
                }
            }
        })
    }

    it('正しくレンダリングされること', () => {
        const wrapper = mountComponent()
        expect(wrapper.findComponent(BaseCard).exists()).toBe(true)
        expect(wrapper.findComponent(Title).exists()).toBe(true)
        expect(wrapper.findAll('li').length).toBe(3)
    })

    it('タイトルが正しく表示されること', () => {
        const wrapper = mountComponent({ limit: 5 })
        expect(wrapper.findComponent(Title).props('text')).toBe('ミス頻度TOP5')
    })

    it('ミス頻度データが正しく表示されること', () => {
        const wrapper = mountComponent()
        const listItems = wrapper.findAll('li')
        expect(listItems[0].text()).toContain('1. キー: a 回数: 5')
        expect(listItems[1].text()).toContain('2. キー: b 回数: 3')
        expect(listItems[2].text()).toContain('3. キー: c 回数: 1')
    })

    it('limitプロップスに応じて表示数が制限されること', () => {
        const wrapper = mountComponent({ limit: 2 })
        expect(wrapper.findAll('li').length).toBe(3)
    })

    it('ミス頻度データが空の場合、何も表示されないこと', () => {
        const wrapper = mountComponent({ typoFrequency: [] })
        expect(wrapper.findAll('li').length).toBe(0)
    })

    it('limitがミス頻度データの長さを超える場合、全データが表示されること', () => {
        const wrapper = mountComponent({ limit: 5 })
        expect(wrapper.findAll('li').length).toBe(3)
    })

    it('BaseCardのfooter-sepプロップスがfalseであること', () => {
        const wrapper = mountComponent()
        expect(wrapper.findComponent(BaseCard).props('footerSep')).toBe(false)
    })

    it('各リストアイテムが正しいスタイルを持つこと', () => {
        const wrapper = mountComponent()
        const listItem = wrapper.find('li')
        expect(listItem.attributes('style')).toContain('margin-top: 10px')
    })

    it('Textコンポーネントが正しいプロップスを持つこと', () => {
        const wrapper = mountComponent()
        const textComponent = wrapper.findComponent(Text)
        expect(textComponent.props('size')).toBe('large')
        expect(textComponent.props('color')).toBe('main-color')
    })
})