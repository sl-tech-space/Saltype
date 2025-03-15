import { ref } from 'vue';
import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Icon from "../../../../components/atoms/imgs/Icon.vue";

// 画像のモック
vi.mock("../../../../assets/images/home/default-user-icon.png", () => ({
  default: "default-user-icon.png"
}));
vi.mock("../../../../assets/images/test/dummy-image.png", () => ({
  default: "dummy-image.png"
}));

const DefaultUserIcon = "default-user-icon.png";
const DummyImage = "dummy-image.png";

describe("Icon", () => {
  it("デフォルトpropsで正しくレンダリングされる", () => {
    const wrapper = mount(Icon);
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe(DefaultUserIcon);
    expect(img.classes()).toContain("icon-width--medium");
    expect(img.classes()).toContain("icon-height--medium");
  });

  it("カスタムpropsで正しくレンダリングされる", () => {
    const customSrc = DummyImage;
    const wrapper = mount(Icon, {
      props: {
        src: customSrc,
        alt: "カスタムアイコン",
        width: "large",
        height: "small",
      },
    });
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe(customSrc);
    expect(img.attributes("alt")).toBe("カスタムアイコン");
    expect(img.classes()).toContain("icon-width--large");
    expect(img.classes()).toContain("icon-height--small");
  });

  it("Refオブジェクトをsrcプロップとして受け入れる", () => {
    const customSrc = ref(DummyImage);
    const wrapper = mount(Icon, {
      props: {
        src: customSrc,
      },
    });
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe(DummyImage);
  });

  it("アイコンのサイズクラスが正しく適用される", () => {
    const sizes: ("small" | "medium" | "large")[] = [
      "small",
      "medium",
      "large",
    ];
    sizes.forEach((size) => {
      const wrapper = mount(Icon, {
        props: { width: size, height: size },
      });
      const img = wrapper.find("img");
      expect(img.classes()).toContain(`icon-width--${size}`);
      expect(img.classes()).toContain(`icon-height--${size}`);
    });
  });
});
