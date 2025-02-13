import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Image from "../../../../components/atoms/imgs/Image.vue";

describe("Image", () => {
  const dummyImageSrc = "/path/to/dummy/image.jpg";

  it("デフォルトpropsで正しくレンダリングされる", () => {
    const wrapper = mount(Image, {
      props: {
        imageSrc: dummyImageSrc,
      },
    });
    const img = wrapper.find("img");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe(dummyImageSrc);
    expect(img.classes()).toContain("img-width--medium");
    expect(img.classes()).toContain("img-height--medium");
  });

  it("カスタムpropsで正しくレンダリングされる", () => {
    const wrapper = mount(Image, {
      props: {
        imageSrc: dummyImageSrc,
        alt: "テスト画像",
        width: "large",
        height: "small",
      },
    });
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe(dummyImageSrc);
    expect(img.attributes("alt")).toBe("テスト画像");
    expect(img.classes()).toContain("img-width--large");
    expect(img.classes()).toContain("img-height--small");
  });

  it.each(["mini", "small", "medium", "large"] as const)(
    "画像の幅クラス %s が正しく適用される",
    (size) => {
      const wrapper = mount(Image, {
        props: {
          imageSrc: dummyImageSrc,
          width: size,
        },
      });
      const img = wrapper.find("img");
      expect(img.classes()).toContain(`img-width--${size}`);
    }
  );

  it.each(["mini", "small", "medium", "large"] as const)(
    "画像の高さクラス %s が正しく適用される",
    (size) => {
      const wrapper = mount(Image, {
        props: {
          imageSrc: dummyImageSrc,
          height: size,
        },
      });
      const img = wrapper.find("img");
      expect(img.classes()).toContain(`img-height--${size}`);
    }
  );

  it("srcとaltの属性が正しく設定される", () => {
    const wrapper = mount(Image, {
      props: {
        imageSrc: dummyImageSrc,
        alt: "テスト画像の説明",
      },
    });
    const img = wrapper.find("img");
    expect(img.attributes("src")).toBe(dummyImageSrc);
    expect(img.attributes("alt")).toBe("テスト画像の説明");
  });
});
