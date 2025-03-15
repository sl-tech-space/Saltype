import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import BaseChart from "../../../../components/molecules/common/BaseChart.vue";
import { ref } from "vue";

// vue-chartjsのモック
vi.mock("vue-chartjs", () => ({
  Line: {
    name: "Line",
    props: ["data", "options"],
    template: '<div class="chart-container"></div>',
  },
}));

// chart.jsのモック
vi.mock("chart.js", () => ({
  Chart: { register: vi.fn() },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  PointElement: vi.fn(),
  LineElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
}));

// colorStoreのモック
const mockMainColor = '#0099ff';
vi.mock('~/store/colorStore', () => ({
  useColorStore: () => ({
    colorStore: ref({ mainColor: mockMainColor })
  })
}));

describe("BaseChart", () => {
  const mockScores = [1000, 2000, 3000];

  const mountComponent = (props = { scores: [...mockScores] }) => {
    return mount(BaseChart, {
      props,
      global: {
        stubs: { Line: true }
      }
    });
  };

  // 基本的なレンダリングテスト
  describe('Basic Rendering', () => {
    it("コンポーネントが正しくマウントされる", () => {
      const wrapper = mountComponent();
      expect(wrapper.find('.chart-container').exists()).toBe(true);
    });
  });

  // データとオプションのテスト
  describe('Chart Configuration', () => {
    it("チャートデータが正しく設定される", () => {
      const wrapper = mountComponent();
      const chartData = (wrapper.vm as any).chartData;
      expect(chartData.labels).toEqual(["1", "2", "3"]);
      expect(chartData.datasets[0].data).toEqual([1000, 2000, 3000]);
      expect(chartData.datasets[0].borderColor).toBe(mockMainColor);
    });

    it("チャートオプションが正しく設定される", () => {
      const wrapper = mountComponent();
      const options = (wrapper.vm as any).chartOptions;
      
      expect(options.scales.y.beginAtZero).toBe(true);
      expect(options.scales.y.max).toBe(15000);
      expect(options.scales.y.ticks.callback(1000)).toBe("1,000");
      
      expect(options.scales.x.ticks.maxRotation).toBe(0);
      expect(options.scales.x.ticks.autoSkip).toBe(true);
      
      expect(options.plugins.tooltip.callbacks.label({ parsed: { y: 1000 } }))
        .toBe("スコア: 1,000");
    });
  });
});
