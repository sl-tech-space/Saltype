import { describe, it, expect } from "vitest";
import { useMenuItems } from "../../../composables/common/useMenuItems";

describe("useMenuItems", () => {
  const mockActions = {
    navigateToRanking: () => {},
    navigateToAnalyze: () => {},
    navigateToContact: () => {},
    navigateToScreenSetting: () => {},
    navigateToUserSetting: () => {},
    navigateToAiTyping: () => {},
    navigateToUserAdmin: () => {},
  };

  it("一般ユーザーの場合、管理者メニューを含まない", () => {
    const { homeMenuItems } = useMenuItems(mockActions, false);

    expect(homeMenuItems.value.length).toBe(6);
    expect(
      homeMenuItems.value.find((item: any) => item.text === "ユーザ管理")
    ).toBeUndefined();
  });

  it("管理者の場合、管理者メニューを含む", () => {
    const { homeMenuItems } = useMenuItems(mockActions, true);

    expect(homeMenuItems.value.length).toBe(7);
    expect(
      homeMenuItems.value.find((item: any) => item.text === "ユーザ管理")
    ).toBeDefined();
  });

  it("ユーザー設定メニューが正しい項目を含む", () => {
    const { userSettingMenuItems } = useMenuItems(mockActions, false);

    expect(userSettingMenuItems.value).toEqual([
      { text: "ユーザ情報", actionKey: "slideToUserInfo" },
      { text: "ユーザ名変更", actionKey: "slideToUpdateUserName" },
      { text: "パスワード変更", actionKey: "slideToUpdatePassword" },
    ]);
  });

  it("画面設定メニューが正しい項目を含む", () => {
    const { screenSettingMenuItems } = useMenuItems(mockActions, false);

    expect(screenSettingMenuItems.value.map((item: any) => item.text)).toEqual([
      "画面共通設定",
      "タイピング画面設定",
      "β：カラーカスタマイズ",
    ]);
  });

  it("getActionが正しいアクションを返す", () => {
    const { getAction } = useMenuItems(mockActions, false);

    expect(getAction("navigateToRanking")).toBe(mockActions.navigateToRanking);
    expect(getAction("nonexistentAction")).toBeUndefined();
  });
});
