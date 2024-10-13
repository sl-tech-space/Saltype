import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import RankingHeader from "~/components/organisms/ranking/RankingHeader.vue";
import BaseHeader from "~/components/molecules/common/BaseHeader.vue";

describe("RankingHeader", () => {
  it("コンポーネントが正しくレンダリングされ、プロップが正しく渡される", () => {
    const title = "テストタイトル";
    const wrapper = mount(RankingHeader, {
      props: {
        title: title
      },
      global: {
        stubs: {
          BaseHeader: true
        }
      }
    });

    const baseHeader = wrapper.findComponent(BaseHeader);
    expect(baseHeader.exists()).toBe(true);

    expect(baseHeader.props("title")).toBe(title);
  });

  it("タイトルが空の場合でも正しくレンダリングされる", () => {
    const wrapper = mount(RankingHeader, {
      props: {
        title: ""
      },
      global: {
        stubs: {
          BaseHeader: true
        }
      }
    });

    const baseHeader = wrapper.findComponent(BaseHeader);
    expect(baseHeader.exists()).toBe(true);
    expect(baseHeader.props("title")).toBe("");
  });
});