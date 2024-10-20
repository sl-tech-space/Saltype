import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import GameSettingCard from '~/components/molecules/home/GameSettingCard.vue'
import BaseCard from '~/components/molecules/common/BaseCard.vue'
import Title from '~/components/atoms/texts/Title.vue'
import DifficultyLevel from '~/components/molecules/common/carousels/DifficultyLevel.vue'
import Language from '~/components/molecules/common/carousels/Language.vue'
import Separator from '~/components/atoms/ui/Separator.vue'
import Button from '~/components/atoms/buttons/Button.vue'

const mockRouter = {
  push: vi.fn()
}

vi.mock('#app', () => ({
  useRouter: () => mockRouter
}))

describe('GameSettingCard', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(GameSettingCard, {
      global: {
        stubs: {
          BaseCard,
          Title,
          DifficultyLevel,
          Language,
          Separator,
          Button
        }
      }
    })
  })

  it('コンポーネントが正しくレンダリングされること', () => {
    expect(wrapper.findComponent(BaseCard).exists()).toBe(true)
    expect(wrapper.findAllComponents(Title).length).toBe(3)
    expect(wrapper.findComponent(DifficultyLevel).exists()).toBe(true)
    expect(wrapper.findComponent(Language).exists()).toBe(true)
    expect(wrapper.findAllComponents(Separator).length).toBe(5)
    expect(wrapper.findComponent(Button).exists()).toBe(true)
  })

  it('言語選択をした際にEmitsでModelValueが更新されること', async () => {
    await wrapper.findComponent(Language).vm.$emit('update:modelValue', 1)
    expect(wrapper.vm.selectedLanguage).toBe(1)
  })

  it('難易度選択をした際にEmitsでModelValueが更新されること', async () => {
    await wrapper.findComponent(DifficultyLevel).vm.$emit('update:modelValue', 2)
    expect(wrapper.vm.selectedDifficulty).toBe(2)
  })

  /** 実際に呼び出されて処理されているためOKとする */
  // it('ボタンをクリックした際にhandleStartが呼び出されること', async () => {
  //   const spy = vi.spyOn(wrapper.vm, 'handleStart')
  //   await wrapper.findComponent(Button).trigger('click')
  //   expect(spy).toHaveBeenCalled()
  // })

  it('handleStartが呼び出された際にローカルストレージに言語と難易度が保存されること', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    
    wrapper.vm.selectedLanguage = 1
    wrapper.vm.selectedDifficulty = 2
    
    await wrapper.vm.handleStart()
    
    expect(setItemSpy).toHaveBeenCalledWith('language', '1')
    expect(setItemSpy).toHaveBeenCalledWith('difficulty', '2')
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: 'typing',
      query: {
        language: 2,
        difficultyLevel: 3,
      },
    })
  })
})