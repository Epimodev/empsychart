import Chart from '../Chart';
import {
  LineChartOptions,
  LineChartPrerenderOptions,
  LineChartComputable,
  LineChartRenderable,
  createLineChartAnimationStack,
  createSelectGraphFill,
  createSelectGraphLineColor,
  createSelectGridValues,
  createSelectGraphArea,
  createSelectVerticalGrid,
  createSelectHorizontalGrid,
  createSelectGraphPoints,
  createSelectInitialPoints,
  createSelectGraph,
  createSelectInitialGraph,
  createSelectRenderableGraph,
} from './utils';
import { Ease } from '../utils/animations/easing';
import CanvasRenderer from './renderer/canvas';

const defaultOptions: Partial<LineChartOptions> = {
  lineColor: '#000',
  graphColor: '',
  hasHorizontalGrid: true,
  horizontalGridColor: 'rgba(100, 100, 100, 0.2)',
  horizontalGridLabelColor: '#999',
  hasVerticalGrid: true,
  verticalGridColor: 'rgba(100, 100, 100, 0.2)',
  verticalGridLabelColor: '#999',
  transitionDuration: 500,
  pointRadius: 0,
  isCurved: false,
  ease: 'quad',
  font: '12px sans-serif',
};

export default class LineChart extends Chart<
  LineChartOptions,
  LineChartComputable,
  LineChartRenderable,
  CanvasRenderer
> {
  selectInitialGraph: ((options: LineChartPrerenderOptions) => LineChartRenderable) | undefined;
  selectGraph: ((options: LineChartPrerenderOptions) => LineChartComputable) | undefined;
  selectRenderableGraph: ((options: LineChartPrerenderOptions) => LineChartRenderable) | undefined;

  createRenderer(container: HTMLElement) {
    return new CanvasRenderer(container);
  }

  getDefaultOptions() {
    return defaultOptions;
  }

  getInitialChart(options: LineChartOptions): LineChartRenderable {
    this.initSelectors();
    const prerenderOptions = this.getPrerenderOptions(this.options);
    return this.selectInitialGraph!(prerenderOptions);
  }

  getComputableChart(options: LineChartOptions): LineChartComputable {
    const prerenderOptions = this.getPrerenderOptions(this.options);
    return this.selectGraph!(prerenderOptions);
  }

  getRenderableChart(options: LineChartOptions): LineChartRenderable {
    const prerenderOptions = this.getPrerenderOptions(this.options);
    return this.selectRenderableGraph!(prerenderOptions);
  }

  createAnimationStack(
    currentChart: LineChartRenderable,
    targetChart: LineChartComputable,
    duration: number,
    ease: Ease,
  ) {
    return createLineChartAnimationStack(currentChart, targetChart, duration, ease);
  }

  private getPrerenderOptions(options: LineChartOptions): LineChartPrerenderOptions {
    return {
      data: options.data,
      pointRadius: options.pointRadius!,
      graphColor: options.graphColor!,
      lineColor: options.lineColor!,
      isCurved: options.isCurved!,
      hasHorizontalGrid: options.hasHorizontalGrid!,
      horizontalGridColor: options.horizontalGridColor!,
      horizontalGridLabelColor: options.horizontalGridLabelColor!,
      hasVerticalGrid: options.hasVerticalGrid!,
      verticalGridColor: options.verticalGridColor!,
      verticalGridLabelColor: options.verticalGridLabelColor!,
      font: options.font!,
      width: this.width,
      height: this.height,
    };
  }

  private initSelectors() {
    const selectGraphFill = createSelectGraphFill();
    const selectGraphLineColor = createSelectGraphLineColor();
    const selectGridValues = createSelectGridValues();
    const selectGraphArea = createSelectGraphArea(selectGridValues);
    const selectVerticalGrid = createSelectVerticalGrid(selectGraphArea);
    const selectHorizontalGrid = createSelectHorizontalGrid(selectGraphArea, selectGridValues);
    const selectGraphPoints = createSelectGraphPoints(selectGraphArea);
    const selectInitialPoints = createSelectInitialPoints(selectGraphArea);
    this.selectGraph = createSelectGraph(
      selectGraphArea,
      selectGraphFill,
      selectGraphLineColor,
      selectGraphPoints,
      selectVerticalGrid,
      selectHorizontalGrid,
    );
    this.selectInitialGraph = createSelectInitialGraph(selectGraphArea, selectInitialPoints);
    this.selectRenderableGraph = createSelectRenderableGraph(this.selectGraph);
  }
}
