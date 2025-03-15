import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import ScreenCommonSetting from "../../../../../components/molecules/settings/screen/ScreenCommonSetting.vue";
import BaseCard from "../../../../../components/molecules/common/BaseCard.vue";
import Title from "../../../../../components/atoms/texts/Title.vue";
import Text from "../../../../../components/atoms/texts/Text.vue";
import ToggleSwitch from "../../../../../components/atoms/inputs/ToggleSwitch.vue";

describe("ScreenCommonSetting", () => {
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
    return mount(ScreenCommonSetting, {
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
    expect(wrapper.findComponent(Title).props('text')).toBe('画面共通設定');
  });

  it("スクロールアシストの設定が正しく表示される", async () => {
    localStorageMock["isScrollAssist"] = "true";
    wrapper = mountComponent();
    
    const toggle = wrapper.findAllComponents(ToggleSwitch)[0];
    expect(toggle.props('modelValue')).toBe(true);
  });

  it("カーソルエフェクトの設定が正しく表示される", async () => {
    localStorageMock["isFollowCursorEffect"] = "true";
    wrapper = mountComponent();
    
    const toggle = wrapper.findAllComponents(ToggleSwitch)[1];
    expect(toggle.props('modelValue')).toBe(true);
  });

  it("スクロールアシストの設定を変更できる", async () => {
    wrapper = mountComponent();
    const toggle = wrapper.findAllComponents(ToggleSwitch)[0];
    
    await toggle.vm.$emit('update:modelValue', true);
    expect(localStorageMock["isScrollAssist"]).toBe("true");
    
    await toggle.vm.$emit('update:modelValue', false);
    expect(localStorageMock["isScrollAssist"]).toBe("false");
  });

  it("カーソルエフェクトの設定を変更できる", async () => {
    wrapper = mountComponent();
    const toggle = wrapper.findAllComponents(ToggleSwitch)[1];
    
    await toggle.vm.$emit('update:modelValue', true);
    expect(localStorageMock["isFollowCursorEffect"]).toBe("true");
    
    await toggle.vm.$emit('update:modelValue', false);
    expect(localStorageMock["isFollowCursorEffect"]).toBe("false");
  });
});

