import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useUserInfo } from "../../../composables/common/useUserInfo";
import type { UserData } from "../../../types/user.d";

describe("useUserInfo", () => {
  let userInfo: ReturnType<typeof useUserInfo>;
  const mockUserData: UserData = {
    user_id: "test-user-id",
    username: "test-user",
    email: "test@example.com",
  };

  beforeEach(() => {
    // useState のモック
    vi.mock("#app", () => ({
      useState: vi.fn().mockReturnValue({ value: null }),
    }));
    userInfo = useUserInfo();
  });

  describe("setUser", () => {
    it("ユーザー情報を正しく設定できる", () => {
      userInfo.setUser(mockUserData);
      expect(userInfo.user.value).toEqual(mockUserData);
    });
  });

  describe("clearUser", () => {
    it("ユーザー情報を正しくクリアできる", () => {
      userInfo.setUser(mockUserData);
      userInfo.clearUser();
      expect(userInfo.user.value).toBeNull();
    });
  });

  describe("waitForUser", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("ユーザー情報が利用可能になったら解決する", async () => {
      const waitPromise = userInfo.waitForUser();
      
      // ユーザー情報を設定
      setTimeout(() => {
        userInfo.setUser(mockUserData);
      }, 1000);

      vi.advanceTimersByTime(1000);
      await expect(waitPromise).resolves.toBeUndefined();
    });

    it("タイムアウト時間を超えた場合、エラーで拒否する", async () => {
      const waitPromise = userInfo.waitForUser();
      
      vi.advanceTimersByTime(10001); // 10秒 + 1ms

      await expect(waitPromise).rejects.toThrow(
        "ユーザ情報の取得に失敗しました。タイムアウトしました。"
      );
    });

    it("既にユーザー情報が存在する場合、即座に解決する", async () => {
      userInfo.setUser(mockUserData);
      await expect(userInfo.waitForUser()).resolves.toBeUndefined();
    });
  });
});
