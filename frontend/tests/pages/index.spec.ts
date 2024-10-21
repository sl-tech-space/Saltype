import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import WelcomePage from "~/pages/index.vue";
import Loading from "~/composables/ui/useLoading.vue";

describe("WelcomePage", () => {
  it("正しくレンダリングされること", () => {
    const wrapper = mount(WelcomePage, {
      global: {
        stubs: {
          Loading: true,
        },
      },
    });

    // Loadingコンポーネントが存在することを確認
    expect(wrapper.findComponent(Loading).exists()).toBe(true);

    // Loadingコンポーネントにis-loadingプロパティが渡されていることを確認
    const loadingComponent = wrapper.findComponent(Loading);
    expect(loadingComponent.props("isLoading")).toBe(true);
  });
});
