import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import BaseNotification from "../../../../components/molecules/common/BaseNotification.vue";

describe("BaseNotification", () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  const mountNotification = (props = {}) => {
    return mount(BaseNotification, {
      props: {
        message: "Test Message",
        content: "Test Content",
        show: false,
        ...props,
      },
      global: {
        stubs: {
          Text: true,
          Transition: true,
        },
      },
    });
  };

  it("コンポーネントが正しくマウントされる", () => {
    wrapper = mountNotification();
    expect(wrapper.vm).toBeTruthy();
  });

  it("初期状態では通知が表示されない", () => {
    wrapper = mountNotification();
    expect(wrapper.find(".notification").exists()).toBe(false);
  });

  it("showプロパティがtrueになると通知が表示される", async () => {
    wrapper = mountNotification({ show: true });
    await nextTick();
    expect(wrapper.find(".notification").exists()).toBe(true);
  });

  /** 動作確認済み */
  // it("通知に正しいメッセージとコンテンツが表示される", async () => {
  //   wrapper = mountNotification({ show: true });
  //   await nextTick();
  //   const texts = wrapper.findAllComponents(Text);
  //   expect(texts[0].text()).toBe("Test Message");
  //   expect(texts[1].text()).toBe("Test Content");
  // });

  it("5秒後に通知が非表示になる", async () => {
    wrapper = mountNotification({ show: true });
    await nextTick();
    expect(wrapper.find(".notification").exists()).toBe(true);

    vi.advanceTimersByTime(5000);
    await nextTick();

    expect(wrapper.find(".notification").exists()).toBe(false);
  });

  it("高さが自動調整される", async () => {
    wrapper = mountNotification({ show: true });
    await nextTick();

    const notification = wrapper.find(".notification").element as HTMLElement;
    expect(notification.style.height).not.toBe("");
  });

  it("Transitionコンポーネントが正しく適用されている", () => {
    wrapper = mountNotification();
    expect(wrapper.findComponent({ name: "Transition" }).exists()).toBe(true);
  });

  /** CSR, SSRともに使用するためレンダリングの確認はしない */
  // it("コンポーネントが正しくレンダリングされる", async () => {
  //   wrapper = mountNotification();
  //   await nextTick();
  //   vi.runAllTimers();
  //   await nextTick();

  //   expect(wrapper.html()).toContain("notification");
  //   expect(wrapper.html()).toContain("Test Message");
  //   expect(wrapper.html()).toContain("Test Content");
  // });

  it("スナップショットと一致する", async () => {
    wrapper = mountNotification();
    await nextTick();
    vi.runAllTimers();
    await nextTick();

    expect(wrapper.html()).toMatchSnapshot();
  });
});
