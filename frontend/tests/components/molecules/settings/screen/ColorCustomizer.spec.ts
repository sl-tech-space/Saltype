import { describe, it, expect, vi } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import ColorCustomizer from "../../../../../components/molecules/settings/screen/ColorCustomizer.vue";
import BaseCard from "../../../../../components/molecules/common/BaseCard.vue";
import Label from "../../../../../components/atoms/labels/Label.vue";
import Input from "../../../../../components/atoms/inputs/Input.vue";
import Text from "../../../../../components/atoms/texts/Text.vue";
import ToggleSwitch from "../../../../../components/atoms/inputs/ToggleSwitch.vue";
import Button from "../../../../../components/atoms/buttons/Button.vue";

const mockSetColor = vi.fn();
const mockResetColors = vi.fn();

vi.mock('~/store/colorStore', () => ({
  useColorStore: () => ({
    colorStore: {
      value: {
        backgroundColor: '#dcdcdc',
        textColor: '#000000',
        mainColor: '#3f51b5',
        subColor: '#757575',
        hoverColor: '#1976d2'
      }
    },
    setColor: mockSetColor,
    resetColors: mockResetColors
  })
}));

describe("ColorCustomizer", () => {
  const mountComponent = () => {
    return mount(ColorCustomizer, {
      global: {
        components: {
          BaseCard,
          Label,
          Input,
          Text,
          ToggleSwitch,
          Button
        }
      }
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent(BaseCard).exists()).toBe(true);
  });

  it("カラーピッカーが正しく表示される", () => {
    const wrapper = mountComponent();
    const colorInputs = wrapper.findAllComponents(Input);
    expect(colorInputs.length).toBe(1);
  });

  it("リセットボタンが正しく動作する", async () => {
    const wrapper = mountComponent();
    const resetButton = wrapper.findComponent(Button);
    
    await resetButton.trigger('click');
    expect(mockResetColors).toHaveBeenCalled();
  });
});


