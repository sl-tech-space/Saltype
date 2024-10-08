import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import BaseChart from "~/components/molecules/common/BaseChart.vue";

// vue-chartjsのモック
vi.mock("vue-chartjs", () => ({
  Line: {
    name: "Line",
    props: ["data", "options"],
    template: '<div data-testid="mock-line-chart"></div>',
  },
}));

// chart.jsのモック
vi.mock("chart.js", () => ({
  Chart: {
    register: vi.fn(),
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  PointElement: vi.fn(),
  LineElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
}));

describe("BaseChart", () => {
  const mockScores = [{ score: 1000 }, { score: 2000 }, { score: 3000 }];

  it("コンポーネントが正しくマウントされる", () => {
    const wrapper = mount(BaseChart, {
      props: {
        scores: mockScores,
      },
    });
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('[data-testid="mock-line-chart"]').exists()).toBe(true);
  });

  it("正しいpropsでLineコンポーネントがレンダリングされる", () => {
    const wrapper = mount(BaseChart, {
      props: {
        scores: mockScores,
      },
    });
    const lineComponent = wrapper.findComponent({ name: "Line" });
    expect(lineComponent.exists()).toBe(true);

    const { data, options } = lineComponent.props();

    // データのテスト
    expect(data.labels).toEqual(["1", "2", "3"]);
    expect(data.datasets[0].data).toEqual([1000, 2000, 3000]);
    expect(data.datasets[0].borderColor).toBe("#0099ff");

    // オプションのテスト
    expect(options.responsive).toBe(true);
    expect(options.maintainAspectRatio).toBe(false);
    expect(options.scales.y.beginAtZero).toBe(true);
    expect(options.scales.y.max).toBe(15000);
    expect(options.scales.x.reverse).toBe(true);
  });

  it("Y軸のティックが正しくフォーマットされる", () => {
    const wrapper = mount(BaseChart, {
      props: {
        scores: mockScores,
      },
    });
    const lineComponent = wrapper.findComponent({ name: "Line" });
    const options = lineComponent.props("options");
    const tickCallback = options.scales.y.ticks.callback;

    expect(tickCallback(1000)).toBe("1,000");
    expect(tickCallback(10000)).toBe("10,000");
  });

  it("ツールチップが正しくフォーマットされる", () => {
    const wrapper = mount(BaseChart, {
      props: {
        scores: mockScores,
      },
    });
    const lineComponent = wrapper.findComponent({ name: "Line" });
    const options = lineComponent.props("options");
    const labelCallback = options.plugins.tooltip.callbacks.label;

    const context = { parsed: { y: 1000 } };
    expect(labelCallback(context)).toBe("スコア: 1,000");
  });
});
