import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import TypingScreenSetting from "../../../../../components/molecules/settings/screen/TypingScreenSetting.vue";
import BaseCard from "../../../../../components/molecules/common/BaseCard.vue";
import Title from "../../../../../components/atoms/texts/Title.vue";
import Text from "../../../../../components/atoms/texts/Text.vue";
import ToggleSwitch from "../../../../../components/atoms/inputs/ToggleSwitch.vue";

describe("TypingScreenSetting", () => {
  let wrapper: VueWrapper<any>;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn((key) => localStorageMock[key] || null),
        setItem: vi.fn((key, value) => {
          localStorageMock[key] = value.toString();
        }),
        clear: vi.fn(() => {
          localStorageMock = {};
        }),
      },
      writable: true,
    });
  });

  const mountComponent = () => {
    return mount(TypingScreenSetting, {
      global: {
        components: {
          BaseCard,
          Title,
          Text,
          ToggleSwitch
        }
      }
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    wrapper = mountComponent();
    expect(wrapper.findComponent(BaseCard).exists()).toBe(true);
    expect(wrapper.findComponent(Title).props('text')).toBe('タイピング画面設定');
  });

  it("タイピング詳細表示の設定が正しく表示される", async () => {
    localStorageMock["showTypingDetails"] = "true";
    wrapper = mountComponent();
    
    const toggle = wrapper.findComponent(ToggleSwitch);
    expect(toggle.props('modelValue')).toBe(true);
  });

  it("タイピング詳細表示の設定を変更できる", async () => {
    wrapper = mountComponent();
    const toggle = wrapper.findComponent(ToggleSwitch);
    
    await toggle.vm.$emit('update:modelValue', true);
    expect(localStorageMock["showTypingDetails"]).toBe("true");
    
    await toggle.vm.$emit('update:modelValue', false);
    expect(localStorageMock["showTypingDetails"]).toBe("false");
  });

  it("説明文が正しく表示される", () => {
    wrapper = mountComponent();
    const text = wrapper.findComponent(Text);
    expect(text.text()).toBe('タイピング詳細表示');
  });
});


