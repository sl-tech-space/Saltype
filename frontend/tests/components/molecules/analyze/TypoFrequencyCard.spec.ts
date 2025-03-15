import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import TypoFrequencyCard from '../../../../components/molecules/analyze/TypoFrequencyCard.vue'
import BaseCard from '../../../../components/molecules/common/BaseCard.vue'
import Title from '../../../../components/atoms/texts/Title.vue'
import Text from '../../../../components/atoms/texts/Text.vue'

describe('TypoFrequencyCard', () => {
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

    // 基本的なレンダリングテスト
    describe('Basic Rendering', () => {
        it('正しくレンダリングされること', () => {
            const wrapper = mountComponent()
            expect(wrapper.findComponent(BaseCard).exists()).toBe(true)
            expect(wrapper.findComponent(Title).exists()).toBe(true)
            expect(wrapper.findAll('li').length).toBe(3)
        })

        it('カードのサイズが正しく設定されていること', () => {
            const wrapper = mountComponent()
            const card = wrapper.findComponent(BaseCard)
            expect(card.props('width')).toBe('xl')
            expect(card.props('height')).toBe('xl')
        })

        it('BaseCardのfooter-sepプロップスがfalseであること', () => {
            const wrapper = mountComponent()
            expect(wrapper.findComponent(BaseCard).props('footerSep')).toBe(false)
        })
    })

    // ヘッダー表示のテスト
    describe('Header Display', () => {
        it('タイトルが正しく表示されること', () => {
            const wrapper = mountComponent({ limit: 5 })
            expect(wrapper.findComponent(Title).props('text')).toBe('ミス頻度TOP5')
        })

        it('タイトルのサイズが正しく設定されていること', () => {
            const wrapper = mountComponent()
            expect(wrapper.findComponent(Title).props('size')).toBe('small')
        })

        it('ヘッダーが正しい位置に配置されていること', () => {
            const wrapper = mountComponent()
            expect(wrapper.find('.header-content').exists()).toBe(true)
        })
    })

    // リスト表示のテスト
    describe('List Display', () => {
        it('ミス頻度データが正しい形式で表示されること', () => {
            const wrapper = mountComponent()
            const listItems = wrapper.findAll('li')
            listItems.forEach((item, index) => {
                const data = mockTypoFrequency[index]
                expect(item.text()).toContain(`${index + 1}. キー: ${data.miss_char}`)
                expect(item.text()).toContain(`回数: ${data.miss_count}`)
            })
        })

        it('ミス頻度データが空の場合、何も表示されないこと', () => {
            const wrapper = mountComponent({ typoFrequency: [] })
            expect(wrapper.findAll('li').length).toBe(0)
        })

        it('limitがミス頻度データの長さを超える場合、全データが表示されること', () => {
            const wrapper = mountComponent({ limit: 5 })
            expect(wrapper.findAll('li').length).toBe(3)
        })

        it('各リストアイテムが正しいスタイルを持つこと', () => {
            const wrapper = mountComponent()
            const listItems = wrapper.findAll('.typo-list')
            listItems.forEach(item => {
                expect(item.classes()).toContain('typo-list')
            })
        })
    })

    // テキスト表示のテスト
    describe('Text Display', () => {
        it('Textコンポーネントが正しいプロップスを持つこと', () => {
            const wrapper = mountComponent()
            const textComponents = wrapper.findAllComponents(Text)
            textComponents.forEach(text => {
                expect(text.props('size')).toBe('large')
                expect(text.props('color')).toBe('main-color')
            })
        })

        it('特殊文字を含むミス文字が正しく表示されること', () => {
            const specialChars = [
                { miss_char: '!', miss_count: 1 },
                { miss_char: '@', miss_count: 2 },
                { miss_char: '#', miss_count: 3 }
            ]
            const wrapper = mountComponent({ typoFrequency: specialChars })
            const listItems = wrapper.findAll('li')
            specialChars.forEach((char, index) => {
                expect(listItems[index].text()).toContain(char.miss_char)
            })
        })
    })

    // エッジケースのテスト
    describe('Edge Cases', () => {
        it('limitが0の場合、何も表示されないこと', () => {
            const wrapper = mountComponent({ limit: 0 })
            expect(wrapper.findAll('li').length).toBe(0)
        })

        it('limitが負数の場合、何も表示されないこと', () => {
            const wrapper = mountComponent({ limit: -1 })
            expect(wrapper.findAll('li').length).toBe(0)
        })

        it('miss_countが0の場合も正しく表示されること', () => {
            const zeroCount = [{ miss_char: 'x', miss_count: 0 }]
            const wrapper = mountComponent({ typoFrequency: zeroCount })
            expect(wrapper.find('li').text()).toContain('回数: 0')
        })
    })
})