import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import PaginatedUserList from "../../../../components/molecules/admin/PaginatedUserList.vue";

describe("PaginatedUserList", () => {
  const mockUsers = [
    {
      userId: "1",
      userName: "ユーザー1",
      email: "user1@example.com",
      todaysMaxScore: "100",
      userRank: "A",
      passwordExists: true
    },
    {
      userId: "2",
      userName: "ユーザー2",
      email: "user2@example.com",
      todaysMaxScore: "90",
      userRank: "B",
      passwordExists: false
    },
  ];

  // 基本的なレンダリングテスト
  describe("Basic Rendering", () => {
    it("デフォルトのpropsで正しくレンダリングされる", () => {
      const wrapper = mount(PaginatedUserList, {
        props: {
          items: mockUsers,
          itemsPerPage: 10
        }
      });
      expect(wrapper.find(".user-list").exists()).toBe(true);
      expect(wrapper.find(".list-container").exists()).toBe(true);
      expect(wrapper.find(".pagination-container").exists()).toBe(true);
    });

    it("ヘッダーが正しく表示される", () => {
      const wrapper = mount(PaginatedUserList, {
        props: {
          items: mockUsers,
          itemsPerPage: 10
        }
      });
      const headers = wrapper.findAll(".list-header .item-text");
      expect(headers[0].text()).toBe("ユーザ名");
      expect(headers[1].text()).toBe("メールアドレス");
      expect(headers[2].text()).toBe("最高スコア");
      expect(headers[3].text()).toBe("ランク");
    });
  });

  // ユーザーリスト表示のテスト
  describe("User List Display", () => {
    it("ユーザー情報が正しく表示される", () => {
      const wrapper = mount(PaginatedUserList, {
        props: {
          items: mockUsers,
          itemsPerPage: 10
        }
      });
      const firstUser = wrapper.findAll(".list-item")[1]; // 0はヘッダー
      expect(firstUser.text()).toContain("ユーザー1");
      expect(firstUser.text()).toContain("user1@example.com");
      expect(firstUser.text()).toContain("100");
      expect(firstUser.text()).toContain("A");
    });

    it("編集・削除ボタンが各ユーザーに表示される", () => {
      const wrapper = mount(PaginatedUserList, {
        props: {
          items: mockUsers,
          itemsPerPage: 10
        }
      });
      const userButtons = wrapper.findAll(".list-item")[1].findAll("button");
      expect(userButtons.length).toBe(2);
      expect(userButtons[0].text()).toBe("編集");
      expect(userButtons[1].text()).toBe("削除");
    });
  });

  // ページネーションのテスト
  describe("Pagination", () => {
    it("正しいページ数が計算される", () => {
      const wrapper = mount(PaginatedUserList, {
        props: {
          items: Array(25).fill(mockUsers[0]), // 25件のデータ
          itemsPerPage: 10
        }
      });
      const pagination = wrapper.findComponent({ name: 'BasePagination' });
      expect(pagination.props('totalPages')).toBe(3);
    });

    it("ページ切り替えで正しいアイテムが表示される", async () => {
      const items = Array(15).fill(null).map((_, i) => ({
        ...mockUsers[0],
        userId: String(i),
        userName: `ユーザー${i}`
      }));
      const wrapper = mount(PaginatedUserList, {
        props: {
          items,
          itemsPerPage: 10
        }
      });
      await wrapper.findComponent({ name: 'BasePagination' }).vm.$emit('page-change', 2);
      const displayedItems = wrapper.findAll(".list-item").slice(1); // ヘッダーを除く
      expect(displayedItems.length).toBe(5); // 2ページ目は5件
    });
  });

  // 編集機能のテスト
  describe("Edit Functionality", () => {
    it("編集モードに切り替わる", async () => {
      const wrapper = mount(PaginatedUserList, {
        props: {
          items: mockUsers,
          itemsPerPage: 10
        }
      });
      await wrapper.findAll("button")[0].trigger("click"); // 編集ボタンクリック
      expect(wrapper.findAll("input").length).toBe(2); // ユーザー名とメールアドレスの入力フィールド
    });

    it("編集をキャンセルできる", async () => {
      const wrapper = mount(PaginatedUserList, {
        props: {
          items: mockUsers,
          itemsPerPage: 10
        }
      });
      await wrapper.findAll("button")[0].trigger("click"); // 編集ボタンクリック
      const cancelButton = wrapper.findAll("button").find(b => b.text() === "キャンセル");
      await cancelButton?.trigger("click");
      expect(wrapper.findAll("input").length).toBe(0); // 入力フィールドが消える
    });
  });

  // 削除機能のテスト
  describe("Delete Functionality", () => {
    it("削除確認モーダルが表示される", async () => {
      const wrapper = mount(PaginatedUserList, {
        props: {
          items: mockUsers,
          itemsPerPage: 10
        }
      });
      const deleteButton = wrapper.findAll("button").find(b => b.text() === "削除");
      await deleteButton?.trigger("click");
      expect(wrapper.findComponent({ name: 'ConfirmModal' }).props('show')).toBe(true);
      expect(wrapper.findComponent({ name: 'ConfirmModal' }).props('message')).toContain("ユーザー1");
    });
  });
});



