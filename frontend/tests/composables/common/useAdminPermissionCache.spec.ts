import { describe, it, expect, beforeEach } from "vitest";
import { useAdminPermissionCache } from "../../../composables/common/useAdminPermissionCache";

describe("useAdminPermissionCache", () => {
  let mockStorage: { [key: string]: string } = {};

  beforeEach(() => {
    mockStorage = {};
    // @ts-expect-error: window is available in test environment
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => mockStorage[key] || null,
        setItem: (key: string, value: string) => {
          mockStorage[key] = value;
        },
      },
    });
  });

  it("初期状態ではnullを返す", () => {
    const { getCache } = useAdminPermissionCache("user123");
    expect(getCache()).toBeNull();
  });

  it("管理者権限を保存して取得できる", () => {
    const { getCache, setCache } = useAdminPermissionCache("user123");
    setCache(true);
    expect(getCache()).toBe(true);
  });

  it("管理者権限を更新できる", () => {
    const { getCache, setCache } = useAdminPermissionCache("user123");
    setCache(true);
    setCache(false);
    expect(getCache()).toBe(false);
  });

  it("異なるユーザーIDで別々のキャッシュを持つ", () => {
    const cache1 = useAdminPermissionCache("user1");
    const cache2 = useAdminPermissionCache("user2");

    cache1.setCache(true);
    cache2.setCache(false);

    expect(cache1.getCache()).toBe(true);
    expect(cache2.getCache()).toBe(false);
  });
});
