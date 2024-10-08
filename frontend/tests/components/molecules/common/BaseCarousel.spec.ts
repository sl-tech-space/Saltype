import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import BaseCarousel from "~/components/molecules/common/BaseCarousel.vue";
import Button from "~/components/atoms/buttons/Button.vue";

// Embla Carouselのモック
vi.mock("embla-carousel-vue", () => ({
  default: vi.fn(() => [
    null,
    {
      scrollPrev: vi.fn(),
      scrollNext: vi.fn(),
      canScrollPrev: vi.fn(() => true),
      canScrollNext: vi.fn(() => true),
      selectedScrollSnap: vi.fn(() => 0),
      on: vi.fn(),
      reInit: vi.fn(),
    },
  ]),
}));

describe("BaseCarousel", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    vi.clearAllMocks();
    wrapper = mount(BaseCarousel, {
      props: {
        slides: 3,
      },
      global: {
        stubs: {
          Button: true,
        },
      },
    });
  });

  it("正しい数のスライドをレンダリングする", () => {
    expect(wrapper.findAll(".embla__slide")).toHaveLength(3);
  });

  it("前後のボタンが正しくレンダリングされる", () => {
    const buttons = wrapper.findAllComponents(Button);
    expect(buttons).toHaveLength(2);
    expect(buttons[0].classes()).toContain("embla__prev");
    expect(buttons[1].classes()).toContain("embla__next");
  });
});
