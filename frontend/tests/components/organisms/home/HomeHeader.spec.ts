import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import HomeHeader from "~/components/organisms/home/HomeHeader.vue";
import BaseHeader from "~/components/molecules/common/BaseHeader.vue";

describe("HomeHeader", () => {
  it("コンポーネントが正しくレンダリングされる", () => {
    const wrapper = mount(HomeHeader);

    const baseHeader = wrapper.findComponent(BaseHeader);
    expect(baseHeader.exists()).toBe(true);

    expect(baseHeader.props("title")).toBe("ホーム");
  });
});
