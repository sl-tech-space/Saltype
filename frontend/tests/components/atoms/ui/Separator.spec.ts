import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Separator from "~/components/atoms/ui/Separator.vue";

describe("Separator", () => {
  it("デフォルトpropsで正しくレンダリングされる", () => {
    const wrapper = mount(Separator);
    const separator = wrapper.find(".separator");
    expect(separator.exists()).toBe(true);
    expect(separator.classes()).toContain("separator--white");
    expect(separator.classes()).toContain("separator--none");
  });

  it("カスタムpropsで正しくレンダリングされる", () => {
    const wrapper = mount(Separator, {
      props: {
        color: "main-color",
        width: "large",
        margin: "vertical",
      },
    });
    const separator = wrapper.find(".separator");
    expect(separator.classes()).toContain("separator--main-color");
    expect(separator.classes()).toContain("separator--large");
    expect(separator.classes()).toContain("separator--vertical");
  });

  it.each(["white", "black", "main-color", "sub-color"] as const)(
    "カラー %s が正しく適用される",
    (color) => {
      const wrapper = mount(Separator, { props: { color } });
      expect(wrapper.find(".separator").classes()).toContain(
        `separator--${color}`
      );
    }
  );

  it.each(["small", "medium", "large"] as const)(
    "幅 %s が正しく適用される",
    (width) => {
      const wrapper = mount(Separator, { props: { width } });
      expect(wrapper.find(".separator").classes()).toContain(
        `separator--${width}`
      );
    }
  );

  it.each(["none", "vertical", "horizontal"] as const)(
    "マージン %s が正しく適用される",
    (margin) => {
      const wrapper = mount(Separator, { props: { margin } });
      expect(wrapper.find(".separator").classes()).toContain(
        `separator--${margin}`
      );
    }
  );

  it("visibleがfalseの場合、境界線が表示されない", () => {
    const wrapper = mount(Separator, {
      props: { visible: false },
    });
    expect(wrapper.find(".separator").exists()).toBe(false);
  });

  it("visibleがtrueの場合、境界線が表示される", () => {
    const wrapper = mount(Separator, {
      props: { visible: true },
    });
    expect(wrapper.find(".separator").exists()).toBe(true);
  });
});
