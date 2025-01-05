import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import UserAdminCard from "~/components/organisms/user/admin/UserAdminCard.vue";
import Input from "~/components/atoms/inputs/Input.vue";
import Button from "~/components/atoms/buttons/Button.vue";
import Select from "~/components/atoms/selects/Select.vue";
import PaginatedUserList from "~/components/molecules/user/admin/PaginatedUserList.vue";

vi.mock("~/composables/user/admin/useAdmin", () => ({
  useAdmin: () => ({
    getAllUserInfo: vi.fn(),
    userItems: { value: [] },
  }),
}));

vi.mock("~/store/colorStore", () => ({
  useColorStore: () => ({
    colorStore: { mainColor: "#000000" },
  }),
}));

describe("UserAdminCard", () => {
  it("コンポーネントが正しくレンダリングされること", () => {
    const wrapper = mount(UserAdminCard, {
      global: {
        stubs: {
          Input: true,
          Button: true,
          Select: true,
          PaginatedUserList: true,
        },
      },
    });

    expect(wrapper.findComponent(Input).exists()).toBe(true);
    expect(wrapper.findComponent(Button).exists()).toBe(true);
    expect(wrapper.findComponent(Select).exists()).toBe(true);
    expect(wrapper.findComponent(PaginatedUserList).exists()).toBe(true);
  });
});
