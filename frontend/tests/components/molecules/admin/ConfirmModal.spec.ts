import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ConfirmModal from "../../../../components/molecules/admin/ConfirmModal.vue";

describe("ConfirmModal", () => {
  // 基本的なレンダリングテスト
  describe("Basic Rendering", () => {
    it("デフォルトのpropsで正しくレンダリングされる", () => {
      const wrapper = mount(ConfirmModal, {
        props: {
          show: true,
          message: "テストメッセージ",
          onConfirm: () => {},
          onCancel: () => {},
        },
      });
      expect(wrapper.find(".modal-overlay").exists()).toBe(true);
      expect(wrapper.find(".modal-content").exists()).toBe(true);
    });

    it("show propがfalseの場合、モーダルが表示されない", () => {
      const wrapper = mount(ConfirmModal, {
        props: {
          show: false,
          message: "テストメッセージ",
          onConfirm: () => {},
          onCancel: () => {},
        },
      });
      expect(wrapper.find(".modal-overlay").exists()).toBe(false);
    });
  });

  // コンテンツ表示のテスト
  describe("Content Display", () => {
    it("メッセージが正しく表示される", () => {
      const testMessage = "テスト確認メッセージ";
      const wrapper = mount(ConfirmModal, {
        props: {
          show: true,
          message: testMessage,
          onConfirm: () => {},
          onCancel: () => {},
        },
      });
      expect(wrapper.text()).toContain(testMessage);
    });

    it("タイトルが正しく表示される", () => {
      const wrapper = mount(ConfirmModal, {
        props: {
          show: true,
          message: "テストメッセージ",
          onConfirm: () => {},
          onCancel: () => {},
        },
      });
      expect(wrapper.text()).toContain("確認");
    });

    it("ボタンが正しく表示される", () => {
      const wrapper = mount(ConfirmModal, {
        props: {
          show: true,
          message: "テストメッセージ",
          onConfirm: () => {},
          onCancel: () => {},
        },
      });
      const buttons = wrapper.findAll("button");
      expect(buttons.length).toBe(2);
      expect(buttons[0].text()).toBe("はい");
      expect(buttons[1].text()).toBe("いいえ");
    });
  });

  // イベントハンドリングのテスト
  describe("Event Handling", () => {
    it("確認ボタンクリックで onConfirm が呼ばれる", async () => {
      let confirmed = false;
      const wrapper = mount(ConfirmModal, {
        props: {
          show: true,
          message: "テストメッセージ",
          onConfirm: () => { confirmed = true; },
          onCancel: () => {},
        },
      });
      await wrapper.findAll("button")[0].trigger("click");
      expect(confirmed).toBe(true);
    });

    it("キャンセルボタンクリックで onCancel が呼ばれる", async () => {
      let cancelled = false;
      const wrapper = mount(ConfirmModal, {
        props: {
          show: true,
          message: "テストメッセージ",
          onConfirm: () => {},
          onCancel: () => { cancelled = true; },
        },
      });
      await wrapper.findAll("button")[1].trigger("click");
      expect(cancelled).toBe(true);
    });
  });

  // スタイリングのテスト
  describe("Styling", () => {
    it("モーダルオーバーレイが正しいスタイルを持つ", () => {
      const wrapper = mount(ConfirmModal, {
        props: {
          show: true,
          message: "テストメッセージ",
          onConfirm: () => {},
          onCancel: () => {},
        },
      });
      expect(wrapper.find(".modal-overlay").classes()).toContain("modal-overlay");
      expect(wrapper.find(".modal-content").classes()).toContain("modal-content");
      expect(wrapper.find(".button-container").classes()).toContain("button-container");
    });
  });
});
    



