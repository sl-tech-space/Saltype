import { describe, it, expect, vi, beforeEach } from "vitest";
import { useLocalStorage } from "../../../composables/common/useLocalStorage";

describe("useLocalStorage", () => {
  let mockStorage: { [key: string]: string } = {};
  let mockDispatchEvent: any;

  beforeEach(() => {
    // LocalStorageのモック
    mockStorage = {};
    // @ts-expect-error: window is available in test environment
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn((key) => mockStorage[key] || null),
        setItem: vi.fn((key, value) => {
          mockStorage[key] = value.toString();
        }),
        removeItem: vi.fn((key) => {
          delete mockStorage[key];
        }),
        clear: vi.fn(() => {
          mockStorage = {};
        }),
      },
      writable: true,
    });

    // dispatchEventのモック
    // @ts-expect-error: window is available in test environment
    mockDispatchEvent = vi.spyOn(window, "dispatchEvent");
  });

  it("初期値がnullの場合、LocalStorageから値を取得する", () => {
    mockStorage["testKey"] = "storedValue";
    const { value } = useLocalStorage("testKey");

    expect(value.value).toBe("storedValue");
    // @ts-expect-error: window is available in test environment
    expect(window.localStorage.getItem).toHaveBeenCalledWith("testKey");
  });

  it("LocalStorageに値がない場合、デフォルト値を設定する", () => {
    const { value } = useLocalStorage("testKey", "defaultValue");

    expect(value.value).toBe("defaultValue");
    // @ts-expect-error: window is available in test environment
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "testKey",
      "defaultValue"
    );
  });

  it("値を設定するとLocalStorageが更新される", () => {
    const { setValue } = useLocalStorage("testKey");
    setValue("newValue");

    // @ts-expect-error: window is available in test environment
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      "testKey",
      "newValue"
    );
    expect(mockStorage["testKey"]).toBe("newValue");
  });

  it("値を設定するとstorageイベントが発火される", () => {
    const { setValue } = useLocalStorage("testKey");
    setValue("newValue");

    expect(mockDispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "storage",
        key: "testKey",
        newValue: "newValue",
      })
    );
  });

  it("storageイベントで値が更新される", () => {
    const { value } = useLocalStorage("testKey");

    // storageイベントをシミュレート
    // @ts-expect-error: window is available in test environment
    window.dispatchEvent(
      // @ts-expect-error: window is available in test environment
      new StorageEvent("storage", {
        key: "testKey",
        newValue: "updatedValue",
      })
    );

    expect(value.value).toBe("updatedValue");
  });

  it("異なるキーのstorageイベントは無視される", () => {
    const { value } = useLocalStorage("testKey", "initialValue");

    // 異なるキーのstorageイベントをシミュレート
    // @ts-expect-error: window is available in test environment
    window.dispatchEvent(
      // @ts-expect-error: window is available in test environment
      new StorageEvent("storage", {
        key: "otherKey",
        newValue: "otherValue",
      })
    );

    expect(value.value).toBe("initialValue");
  });

  it("getValueでLocalStorageから直接値を取得できる", () => {
    mockStorage["testKey"] = "storedValue";
    const { getValue } = useLocalStorage("testKey");

    expect(getValue()).toBe("storedValue");
    // @ts-expect-error: window is available in test environment
    expect(window.localStorage.getItem).toHaveBeenCalledWith("testKey");
  });

  it("getValueはLocalStorageの最新の値を返す", () => {
    const { getValue, setValue } = useLocalStorage("testKey");
    setValue("newValue");

    expect(getValue()).toBe("newValue");
  });

  it("getValueは値が存在しない場合nullを返す", () => {
    const { getValue } = useLocalStorage("nonexistentKey");

    expect(getValue()).toBeNull();
  });
});
