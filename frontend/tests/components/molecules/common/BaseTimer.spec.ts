import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import BaseTimer from '~/components/molecules/common/BaseTimer.vue'
import Text from '~/components/atoms/texts/Text.vue'

describe('BaseTimer Component', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('初期状態で正しく表示される', () => {
        const wrapper = mount(BaseTimer, {
            props: {
                duration: 60000 // 1分
            },
            global: {
                components: { Text }
            }
        })

        expect(wrapper.findComponent(Text).exists()).toBe(true)
        expect(wrapper.findComponent(Text).props('text')).toBe('1:00')
        expect(wrapper.find('.timer-bar').exists()).toBe(true)
    })

    it('プロップスが正しく適用される', () => {
        const wrapper = mount(BaseTimer, {
            props: {
                duration: 60000,
                backColor: 'sub-color',
                barColor: 'main-color'
            },
            global: {
                components: { Text }
            }
        })

        expect(wrapper.find('.timer-bar-container').classes()).toContain('timer-bar-container--sub-color')
        expect(wrapper.find('.timer-bar').classes()).toContain('timer-bar--main-color')
    })

    it('タイマーの開始と終了をシミュレートする', async () => {
        const wrapper = mount(BaseTimer, {
            props: {
                duration: 5000 // 5秒
            },
            global: {
                components: { Text }
            }
        })

        // タイマー開始をシミュレート
        await wrapper.trigger('keypress', { key: 'Enter' })
        vi.advanceTimersByTime(3000) // 3秒待機
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.isRunning).toBe(true)

        // 5秒経過をシミュレート
        vi.advanceTimersByTime(5000)
        await wrapper.vm.$nextTick()

        expect(wrapper.emitted('timerEnd')).toBeTruthy()
        expect(wrapper.findComponent(Text).props('text')).toBe('0:00')
    })

    it('残り時間が正しく計算される', async () => {
        const wrapper = mount(BaseTimer, {
            props: {
                duration: 65000 // 1分5秒
            },
            global: {
                components: { Text }
            }
        })

        await wrapper.trigger('keypress', { key: 'Enter' })
        vi.advanceTimersByTime(3000) // 3秒待機
        await wrapper.vm.$nextTick()

        vi.advanceTimersByTime(10000) // 10秒経過
        await wrapper.vm.$nextTick()

        expect(wrapper.findComponent(Text).props('text')).toBe('0:55')
    })
})