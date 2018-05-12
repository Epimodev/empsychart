import Renderer from './Renderer';
import { FRAME_DURATION } from './utils/animations';
import { Ease } from './utils/animations/easing';

export interface BaseOptions {
  transitionDuration?: number;
  ease?: Ease;
}

/**
 * O - Options
 * C - Computable Data
 * T - Renderable Data
 * R - Renderer
 */
export default abstract class Chart<O extends BaseOptions, C, T, R extends Renderer<T>> {
  container: HTMLElement;
  width = 0;
  height = 0;
  renderer: R;
  options: O;
  lastRenderDate = 0;
  currentChart: T;
  animationStack: T[] = [];

  constructor(container: HTMLElement, options: O) {
    this.refreshSize = this.refreshSize.bind(this);
    this.launchStackRender = this.launchStackRender.bind(this);

    this.container = container;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    const defaultOptions = this.getDefaultOptions();
    this.options = { ...(<any>defaultOptions), ...(<any>options) };
    this.renderer = this.createRenderer(container);

    this.currentChart = this.getInitialChart(options);
    this.renderer.render(this.currentChart);
    this.update(this.options);

    window.addEventListener('resize', this.refreshSize);
  }

  abstract createRenderer(container: HTMLElement): R;
  abstract getDefaultOptions(): Partial<O>;
  abstract getInitialChart(options: O): T;
  abstract getComputableChart(options: O): C;
  abstract getRenderableChart(options: O): T;
  abstract createAnimationStack(currentChart: T, targetChart: C, duration: number, ease: Ease): T[];

  onUnmount() {
    this.animationStack = [];
    window.removeEventListener('resize', this.refreshSize);
  }

  update(options: Partial<O>) {
    this.options = { ...(<any>this.options), ...(<any>options) };
    const { transitionDuration, ease } = this.options;
    const newGraph = this.getComputableChart(this.options);
    this.animationStack = this.createAnimationStack(
      this.currentChart,
      newGraph,
      transitionDuration!,
      ease!,
    );

    this.launchStackRender();
  }

  private refreshSize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.animationStack = [];
    this.currentChart = this.getRenderableChart(this.options);
    this.renderer.render(this.currentChart);
  }

  private computeNbDroppedSteps() {
    if (this.lastRenderDate === 0) {
      return 0;
    }
    const now = Date.now();
    const durationSinceLastRender = now - this.lastRenderDate;
    if (durationSinceLastRender <= FRAME_DURATION) {
      return 0;
    }
    return Math.floor(durationSinceLastRender / FRAME_DURATION) - 1;
  }

  private launchStackRender() {
    if (this.animationStack.length === 0) {
      this.lastRenderDate = 0;
    } else {
      const maxStepsToShift = this.computeNbDroppedSteps() + 1;
      this.lastRenderDate = Date.now();
      const isLastRender = maxStepsToShift >= this.animationStack.length;
      const nbStepsToShift = isLastRender ? this.animationStack.length : maxStepsToShift;
      for (let i = 0; i < nbStepsToShift; i += 1) {
        this.currentChart = this.animationStack.shift()!;
      }
      this.renderer.render(this.currentChart);
      requestAnimationFrame(this.launchStackRender);
    }
  }
}
