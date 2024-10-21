import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { nextTick } from "vue";
import RetryCard from "~/components/molecules/score/RetryCard.vue";
import BaseCard from "~/components/molecules/common/BaseCard.vue";
import Title from "~/components/atoms/texts/Title.vue";
import Text from "~/components/atoms/texts/Text.vue";
import Button from "~/components/atoms/buttons/Button.vue";

const mockRouter = {
  push: vi.fn(),
};

vi.mock("#app", () => ({
  useRouter: () => mockRouter,
}));

describe("RetryCard", () => {
  let wrapper: VueWrapper<any>;
  let localStorageMock: { [key: string]: string };

  beforeEach(() => {
    localStorageMock = {};
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn((key) => localStorageMock[key] || null),
        setItem: vi.fn((key, value) => {
          localStorageMock[key] = value.toString();
        }),
        clear: vi.fn(() => {
          localStorageMock = {};
        }),
      },
      writable: true,
    });
  });

  const mountComponent = () => {
    return mount(RetryCard, {
      global: {
        components: {
          BaseCard,
          Title,
          Text,
          Button,
        },
        mocks: {
          $router: mockRouter,
        },
      },
    });
  };

  it("コンポーネントが正しくレンダリングされる", () => {
    wrapper = mountComponent();
    expect(wrapper.findComponent(BaseCard).exists()).toBe(true);
  });

  it("ローカルストレージから言語と難易度を正しく読み込む", async () => {
    localStorageMock["language"] = "1";
    localStorageMock["difficulty"] = "2";
    wrapper = mountComponent();
    await nextTick();

    expect(wrapper.text()).toContain("言語: 英語");
    expect(wrapper.text()).toContain("難易度: ハード");
  });

  it("ローカルストレージにデータがない場合、適切なメッセージを表示する", async () => {
    wrapper = mountComponent();
    await nextTick();

    expect(wrapper.text()).toContain("リトライ 現在の設定 言語: 日本語 難易度: イージー スタート");
  });

  it("スタートボタンが正しく表示され、クリックするとルーティングが行われる", async () => {
    localStorageMock["language"] = "0";
    localStorageMock["difficulty"] = "1";
    wrapper = mountComponent();
    await nextTick();

    const button = wrapper.findComponent(Button);
    expect(button.exists()).toBe(true);
    expect(button.props("buttonText")).toBe("スタート");

    await button.trigger("click");
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: "typing",
      query: {
        language: 1,
        difficultyLevel: 2,
      },
    });
  });
});
