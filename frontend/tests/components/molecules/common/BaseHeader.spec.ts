import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import BaseHeader from "~/components/molecules/common/BaseHeader.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Button from "~/components/atoms/buttons/Button.vue";
import Separator from "~/components/atoms/ui/Separator.vue";

// モックルーター
const mockRouter = {
  push: vi.fn(),
};

vi.mock("#app", () => ({
  useRouter: () => mockRouter,
}));

describe("BaseHeader", () => {
  it("タイトルが正しく表示される", () => {
    const wrapper = mount(BaseHeader, {
      props: {
        title: "テストタイトル",
      },
      global: {
        stubs: {
          Title: true,
          Button: true,
          Separator: true,
        },
      },
    });

    expect(wrapper.findComponent(Title).props("text")).toBe("テストタイトル");
  });

  it("タイトルがない場合、スロットが使用される", () => {
    const wrapper = mount(BaseHeader, {
      slots: {
        "header-center": '<div class="test-slot">スロットコンテンツ</div>',
      },
      global: {
        stubs: {
          Title: true,
          Button: true,
          Separator: true,
        },
      },
    });

    expect(wrapper.find(".test-slot").exists()).toBe(true);
    expect(wrapper.findComponent(Title).exists()).toBe(false);
  });

  it('タイトルが"ホーム"でない場合、戻るボタンが表示される', () => {
    const wrapper = mount(BaseHeader, {
      props: {
        title: "テストページ",
      },
      global: {
        stubs: {
          Title: true,
          Button: true,
          Separator: true,
        },
      },
    });

    expect(wrapper.findComponent(Button).exists()).toBe(true);
  });

  it('タイトルが"ホーム"の場合、戻るボタンは表示されない', () => {
    const wrapper = mount(BaseHeader, {
      props: {
        title: "ホーム",
      },
      global: {
        stubs: {
          Title: true,
          Button: true,
          Separator: true,
        },
      },
    });

    expect(wrapper.findComponent(Button).exists()).toBe(false);
  });

  it("戻るボタンをクリックするとホームにナビゲートする", async () => {
    const wrapper = mount(BaseHeader, {
      props: {
        title: "テストページ",
      },
      global: {
        stubs: {
          Title: true,
          Button: true,
          Separator: true,
        },
      },
    });

    await wrapper.findComponent(Button).trigger("click");
    expect(mockRouter.push).toHaveBeenCalledWith({ name: "home" });
  });

  it("Separatorが正しく表示される", () => {
    const wrapper = mount(BaseHeader, {
      global: {
        stubs: {
          Title: true,
          Button: true,
          Separator: true,
        },
      },
    });

    expect(wrapper.findComponent(Separator).exists()).toBe(true);
  });
});
