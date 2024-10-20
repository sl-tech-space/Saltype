import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper, config } from '@vue/test-utils'
import BaseCarousel from '~/components/molecules/common/BaseCarousel.vue'
import Button from '~/components/atoms/buttons/Button.vue'

// Embla Carouselのモック
const emblaApiMock = {
  scrollPrev: vi.fn(),
  scrollNext: vi.fn(),
  canScrollPrev: vi.fn(() => true),
  canScrollNext: vi.fn(() => true),
  selectedScrollSnap: vi.fn(() => 0),
  on: vi.fn(),
  reInit: vi.fn(),
}

vi.mock('embla-carousel-vue', () => ({
  default: vi.fn(() => [null, { value: emblaApiMock }]),
}))

config.global.stubs = {
  Button: true
}

describe('BaseCarousel', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(BaseCarousel, {
      props: {
        slides: 3,
      },
      global: {
        stubs: {
          Button: true,
        },
      },
    })
  })

  it('正しい数のスライドをレンダリングする', () => {
    expect(wrapper.findAll('.embla__slide')).toHaveLength(3)
  })

  it('前後のボタンが正しくレンダリングされる', () => {
    const buttons = wrapper.findAllComponents(Button)
    expect(buttons).toHaveLength(2)
    expect(buttons[0].classes()).toContain('embla__prev')
    expect(buttons[1].classes()).toContain('embla__next')
  })

  it('前のスライドボタンをクリックするとscrollPrevが呼ばれる', async () => {
    await wrapper.find('.embla__prev').trigger('click')
    expect(emblaApiMock.scrollPrev).toHaveBeenCalled()
  })

  it('次のスライドボタンをクリックするとscrollNextが呼ばれる', async () => {
    await wrapper.find('.embla__next').trigger('click')
    expect(emblaApiMock.scrollNext).toHaveBeenCalled()
  })

  it('マウント時にreInitとonSelectが呼ばれる', () => {
    expect(emblaApiMock.reInit).toHaveBeenCalled()
    expect(emblaApiMock.on).toHaveBeenCalledWith('select', expect.any(Function))
  })

  it('スライドが変更されたときにslide-changeイベントが発火する', async () => {
    const selectCallback = emblaApiMock.on.mock.calls[0][1]
    selectCallback()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('slide-change')).toBeTruthy()
    expect(wrapper.emitted('slide-change')?.[0]).toEqual([0])
  })

  it('スライド数が変更されたときにreInitが呼ばれる', async () => {
    await wrapper.setProps({ slides: 4 })
    expect(emblaApiMock.reInit).toHaveBeenCalled()
  })
})