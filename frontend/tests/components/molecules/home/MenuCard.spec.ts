import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MenuCard from "~/components/molecules/home/MenuCard.vue";
import BaseCard from "~/components/molecules/common/BaseCard.vue";
import BaseModal from "~/components/molecules/common/BaseModal.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Button from "~/components/atoms/buttons/Button.vue";
import Text from "~/components/atoms/texts/Text.vue";
import ColorCustomizer from "~/components/molecules/home/ColorCustomizer.vue";

const mockLogout = vi.fn();
vi.mock("~/composables/auth/useLogout", () => ({
  useLogout: vi.fn(async () => ({ logout: mockLogout })),
}));

vi.mock("~/store/colorStore", () => ({
  useColorStore: vi.fn(() => ({ colorStore: { mainColor: "#000000" } })),
}));

const mockGetAction = vi.fn();
vi.mock("~/composables/common/useMenuItems", () => ({
  useMenuItems: vi.fn(() => ({
    homeMenuItems: [
      { text: "ランキング", actionKey: "navigateToRanking", path: "M123" },
      { text: "分析", actionKey: "navigateToAnalyze", path: "M456" },
    ],
    getAction: mockGetAction,
  })),
}));

vi.mock("~/composables/user/useUser", () => ({
  useUser: vi.fn(() => ({
    checkAdminPermission: vi.fn(),
    isAdmin: { value: false },
  })),
}));

describe("MenuCard", () => {
  it("コンポーネントがマウントされること", () => {
    const wrapper = mount(MenuCard);
    expect(wrapper.vm).toBeTruthy();
  });
});