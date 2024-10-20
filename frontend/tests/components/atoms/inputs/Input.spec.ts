import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Input from "~/components/atoms/inputs/Input.vue";

describe("Input", () => {
  it("デフォルトpropsで正しくレンダリングされる", () => {
    const wrapper = mount(Input);
    const input = wrapper.find("input");
    expect(input.exists()).toBe(true);
    expect(input.attributes("type")).toBe("text");
    expect(input.attributes("id")).toBe("default");
    expect(input.classes()).toContain("input-text--white");
    expect(input.classes()).toContain("input-border--none");
    expect(input.classes()).toContain("input-width--medium");
    expect(input.classes()).toContain("input-height--medium");
    expect(input.classes()).toContain("input-background--black");
    expect(input.classes()).not.toContain("input--rounded");
  });

  it("カスタムpropsで正しくレンダリングされる", () => {
    const wrapper = mount(Input, {
      props: {
        type: "email",
        id: "email-input",
        placeholder: "Enter your email",
        required: true,
        color: "main-color",
        border: "sub-color",
        width: "large",
        height: "small",
        background: "white",
        rounded: true,
      },
    });
    const input = wrapper.find("input");
    expect(input.attributes("type")).toBe("email");
    expect(input.attributes("id")).toBe("email-input");
    expect(input.attributes("placeholder")).toBe("Enter your email");
    expect(input.attributes("required")).toBe("");
    expect(input.classes()).toContain("input-text--main-color");
    expect(input.classes()).toContain("input-border--sub-color");
    expect(input.classes()).toContain("input-width--large");
    expect(input.classes()).toContain("input-height--small");
    expect(input.classes()).toContain("input-background--white");
    expect(input.classes()).toContain("input--rounded");
  });

  it("modelValueが正しく更新される", async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: "",
      },
    });
    const input = wrapper.find("input");
    await input.setValue("test value");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual(["test value"]);
  });

  it.each(["white", "black", "main-color", "sub-color"] as const)(
    "テキストカラー %s が正しく適用される",
    (color) => {
      const wrapper = mount(Input, {
        props: { color },
      });
      expect(wrapper.find("input").classes()).toContain(`input-text--${color}`);
    }
  );

  it.each(["white", "black", "main-color", "sub-color", "none"] as const)(
    "ボーダーカラー %s が正しく適用される",
    (border) => {
      const wrapper = mount(Input, {
        props: { border },
      });
      expect(wrapper.find("input").classes()).toContain(
        `input-border--${border}`
      );
    }
  );

  it.each(["small", "medium", "large"] as const)(
    "幅 %s が正しく適用される",
    (width) => {
      const wrapper = mount(Input, {
        props: { width },
      });
      expect(wrapper.find("input").classes()).toContain(
        `input-width--${width}`
      );
    }
  );

  it.each(["small", "medium", "large"] as const)(
    "高さ %s が正しく適用される",
    (height) => {
      const wrapper = mount(Input, {
        props: { height },
      });
      expect(wrapper.find("input").classes()).toContain(
        `input-height--${height}`
      );
    }
  );

  it.each(["white", "black", "main-color", "sub-color"] as const)(
    "背景色 %s が正しく適用される",
    (background) => {
      const wrapper = mount(Input, {
        props: { background },
      });
      expect(wrapper.find("input").classes()).toContain(
        `input-background--${background}`
      );
    }
  );
});
