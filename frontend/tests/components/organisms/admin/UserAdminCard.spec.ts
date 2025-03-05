import { mount, VueWrapper } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import UserAdminCard from "../../../../components/organisms/admin/UserAdminCard.vue";
import Input from "../../../../components/atoms/inputs/Input.vue";
import Button from "../../../../components/atoms/buttons/Button.vue";
import Select from "../../../../components/atoms/selects/Select.vue";
import PaginatedUserList from "../../../../components/molecules/admin/PaginatedUserList.vue";

const mockGetAllUserInfo = vi.fn();

vi.mock("~/composables/admin/useAdmin", () => ({
  useAdmin: () => ({
    getAllUserInfo: mockGetAllUserInfo,
    userItems: { value: [] },
    isLoading: false,
    error: null,
  }),
}));

vi.mock("~/store/colorStore", () => ({
  useColorStore: () => ({
    colorStore: { mainColor: "#000000" },
  }),
}));

describe("UserAdminCard", () => {
  let wrapper: VueWrapper<any>;

  const mountComponent = () => {
    return mount(UserAdminCard, {
      global: {
        components: {
          Input,
          Button,
          Select,
          PaginatedUserList,
        },
        stubs: {
          Loading: true,
          BaseNotification: true,
        },
      },
    });
  };

  beforeEach(() => {
    wrapper = mountComponent();
  });

  it("コンポーネントが正しくレンダリングされる", () => {
    expect(wrapper.findComponent(Input).exists()).toBe(true);
    expect(wrapper.findComponent(Button).exists()).toBe(true);
    expect(wrapper.findComponent(Select).exists()).toBe(true);
    expect(wrapper.findComponent(PaginatedUserList).exists()).toBe(true);
  });

  it("ソート順を切り替えられる", async () => {
    const sortButton = wrapper.findComponent(Button);
    expect(wrapper.vm.sortOrder).toBe("desc");

    await sortButton.trigger("click");
    expect(wrapper.vm.sortOrder).toBe("asc");

    await sortButton.trigger("click");
    expect(wrapper.vm.sortOrder).toBe("desc");
  });

  it("ユーザーを検索できる", async () => {
    const searchInput = wrapper.findComponent(Input);
    await searchInput.setValue("test");
    expect(wrapper.vm.searchQuery).toBe("test");
  });

  it("ランクでフィルタリングできる", async () => {
    const rankSelect = wrapper.findComponent(Select);
    await rankSelect.setValue("メンバー");
    expect(wrapper.vm.selectedRank).toBe("メンバー");
  });

  it("マウント時にユーザー情報を取得する", () => {
    expect(mockGetAllUserInfo).toHaveBeenCalled();
  });

  it("ユーザー情報更新時にリストを再取得する", async () => {
    await wrapper.findComponent(PaginatedUserList).vm.$emit("user-updated");
    expect(mockGetAllUserInfo).toHaveBeenCalled();
  });
});
