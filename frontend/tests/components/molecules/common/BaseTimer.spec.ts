import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import BaseTimer from '../../../../components/molecules/common/BaseTimer.vue'
import Text from '../../../../components/atoms/texts/Text.vue'

describe('BaseTimer Component', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    const mountTimer = (props = {}) => {
        return mount(BaseTimer, {
            props: {
                duration: 60000,
                ...props
            },
            global: {
                components: { Text }
            }
        })
    }

    it('初期状態で正しく表示される', () => {
        const wrapper = mountTimer();
        expect(wrapper.findComponent(Text).exists()).toBe(true)
        expect(wrapper.findComponent(Text).props('text')).toBe('1:00')
        expect(wrapper.find('.timer-bar').exists()).toBe(true)
    })

    it('プロップスが正しく適用される', () => {
        const wrapper = mountTimer({
            duration: 60000,
            backColor: 'sub-color',
            barColor: 'main-color'
        })

        expect(wrapper.find('.timer-bar-container').classes()).toContain('timer-bar-container--sub-color')
        expect(wrapper.find('.timer-bar').classes()).toContain('timer-bar--main-color')
    })
})