import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import LoadingComponent from "~/composables/ui/useLoading.vue";

describe("LoadingComponent", () => {
  it("isLoadingがtrueの場合、コンポーネントが表示される", () => {
    const wrapper = mount(LoadingComponent, {
      props: {
        isLoading: true,
      },
    });
    expect(wrapper.find(".loading-overlay").exists()).toBe(true);
    expect(wrapper.find(".loading-spinner").exists()).toBe(true);
  });

  it("isLoadingがfalseの場合、コンポーネントが表示されない", () => {
    const wrapper = mount(LoadingComponent, {
      props: {
        isLoading: false,
      },
    });
    expect(wrapper.find(".loading-overlay").exists()).toBe(false);
    expect(wrapper.find(".loading-spinner").exists()).toBe(false);
  });

  it("正しいクラスが適用されている", () => {
    const wrapper = mount(LoadingComponent, {
      props: {
        isLoading: true,
      },
    });
    const overlay = wrapper.find(".loading-overlay");
    const spinner = wrapper.find(".loading-spinner");

    expect(overlay.classes()).toContain("loading-overlay");
    expect(spinner.classes()).toContain("loading-spinner");
  });

  it("isLoadingプロパティの変更に応じて表示が切り替わる", async () => {
    const wrapper = mount(LoadingComponent, {
      props: {
        isLoading: false,
      },
    });
    expect(wrapper.find(".loading-overlay").exists()).toBe(false);

    await wrapper.setProps({ isLoading: true });
    expect(wrapper.find(".loading-overlay").exists()).toBe(true);

    await wrapper.setProps({ isLoading: false });
    expect(wrapper.find(".loading-overlay").exists()).toBe(false);
  });
});
