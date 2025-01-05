import { mount } from "@vue/test-utils";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PaginatedUserList from "~/components/molecules/user/admin/PaginatedUserList.vue";
import BasePagination from "~/components/molecules/common/BasePagination.vue";
import BaseNotification from "~/components/molecules/common/BaseNotification.vue";
import ConfirmModal from "~/components/molecules/user/admin/ConfirmModal.vue";
import Text from "~/components/atoms/texts/Text.vue";
import Button from "~/components/atoms/buttons/Button.vue";
import Input from "~/components/atoms/inputs/Input.vue";

vi.mock("~/composables/user/useUser", () => ({
  useUser: () => ({
    updateUserInfo: vi.fn().mockResolvedValue("更新成功"),
  }),
}));

vi.mock("~/composables/user/admin/useAdmin", () => ({
  useAdmin: () => ({
    deleteUserInfo: vi.fn().mockResolvedValue("削除成功"),
  }),
}));

describe("PaginatedUserList", () => {
  const mockItems = [
    {
      userId: "1",
      userName: "User1",
      email: "user1@example.com",
      todaysMaxScore: "100",
      userRank: "1",
    },
    {
      userId: "2",
      userName: "User2",
      email: "user2@example.com",
      todaysMaxScore: "90",
      userRank: "2",
    },
  ];

  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(PaginatedUserList, {
      props: {
        items: mockItems,
        itemsPerPage: 10,
      },
      global: {
        components: {
          BasePagination,
          BaseNotification,
          ConfirmModal,
          Text,
          Button,
          Input,
        },
        stubs: {
          BasePagination: true,
          BaseNotification: true,
          ConfirmModal: true,
        },
      },
    });
  });

  it("正しくレンダリングされること", () => {
    expect(wrapper.findAll(".list-item").length).toBe(3); // ヘッダー + 2アイテム
    expect(wrapper.findComponent(BasePagination).exists()).toBe(true);
  });

  it("ユーザー情報が正しく表示されること", () => {
    const firstItem = wrapper.findAll(".list-item")[1];
    expect(firstItem.find(".username").text()).toBe("User1");
    expect(firstItem.find(".email").text()).toBe("user1@example.com");
    expect(firstItem.find(".score").text()).toBe("100");
    expect(firstItem.find(".rank").text()).toBe("1");
  });

  it("編集モードに切り替わること", async () => {
    const editButton = wrapper.findAll("button")[0];
    await editButton.trigger("click");
    expect(wrapper.findAll("input").length).toBe(2);
  });

  it("編集をキャンセルできること", async () => {
    const editButton = wrapper.findAll("button")[0];
    await editButton.trigger("click");
    const cancelButton = wrapper.findAll("button")[1];
    await cancelButton.trigger("click");
    expect(wrapper.findAll("input").length).toBe(0);
  });

  it("ユーザー情報を更新できること", async () => {
    const editButton = wrapper.findAll("button")[0];
    await editButton.trigger("click");
    const inputs = wrapper.findAll("input");
    await inputs[0].setValue("NewUser1");
    await inputs[1].setValue("newuser1@example.com");
    const saveButton = wrapper.findAll("button")[0];
    await saveButton.trigger("click");
    expect(wrapper.emitted("user-updated")).toBeTruthy();
  });

  it("削除確認モーダルが表示されること", async () => {
    const deleteButton = wrapper.findAll("button")[1];
    await deleteButton.trigger("click");
    expect(wrapper.findComponent(ConfirmModal).props("show")).toBe(true);
  });

  it("ユーザーを削除できること", async () => {
    const deleteButton = wrapper.findAll("button")[1];
    await deleteButton.trigger("click");
    await wrapper.findComponent(ConfirmModal).vm.$emit("confirm");
    expect(wrapper.emitted("user-updated")).toBeTruthy();
  });
});
