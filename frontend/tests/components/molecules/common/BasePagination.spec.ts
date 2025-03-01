import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import BasePagination from "../../../../components/molecules/common/BasePagination.vue";
import Button from "../../../../components/atoms/buttons/Button.vue";

describe("BasePagination", () => {
  const mountComponent = (props = {}) => {
    return mount(BasePagination, {
      props: {
        currentPage: 1,
        totalPages: 5,
        ...props,
      },
      global: {
        components: {
          Button,
        },
      },
    });
  };

  it("正しくレンダリングされること", () => {
    const wrapper = mountComponent();
    expect(wrapper.find(".pagination").exists()).toBe(true);
    expect(wrapper.findAllComponents(Button).length).toBe(6); // 前後ボタン + 5ページ
  });

  it("現在のページが正しくアクティブになること", () => {
    const wrapper = mountComponent({ currentPage: 3 });
    const buttons = wrapper.findAllComponents(Button);
    expect(buttons[3].props("isActive")).toBe(true);
  });

  it("前へボタンが正しく動作すること", async () => {
    const wrapper = mountComponent({ currentPage: 3 });
    await wrapper.findAllComponents(Button)[0].trigger("click");
    expect(wrapper.emitted("page-change")).toBeTruthy();
    expect(wrapper.emitted("page-change")?.[0]).toEqual([2]);
  });

  it("次へボタンが正しく動作すること", async () => {
    const wrapper = mountComponent({ currentPage: 3 });
    await wrapper.findAllComponents(Button)[6].trigger("click");
    expect(wrapper.emitted("page-change")).toBeTruthy();
    expect(wrapper.emitted("page-change")?.[0]).toEqual([4]);
  });

  it("ページ数が少ない場合に正しく表示されること", () => {
    const wrapper = mountComponent({ totalPages: 2 });
    expect(wrapper.findAllComponents(Button).length).toBe(4); // 前後ボタン + 2ページ
  });
});
