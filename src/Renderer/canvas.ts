import Renderer, { pixelRatio } from './index';

export interface SizeOptions {
  width: number;
  height: number;
}

export default abstract class CanvasRenderer<T extends SizeOptions> extends Renderer<T> {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null = null;
  width: number = 0;
  height: number = 0;

  abstract renderCanvas(data: T): void;

  constructor(container: HTMLElement) {
    super();
    this.setSize = this.setSize.bind(this);

    this.canvas = document.createElement('canvas');
    container.appendChild(this.canvas);

    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      this.ctx = ctx;
    }
  }

  render(data: T) {
    const { width, height } = data;
    if (this.isSizeChanged(data)) {
      this.setSize(width, height);
    }

    this.ctx!.clearRect(0, 0, width, height);
    this.renderCanvas(data);
  }

  private isSizeChanged({ width, height }: T) {
    return this.width !== width || this.height !== height;
  }

  private setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.canvas.width = this.width * pixelRatio;
    this.canvas.height = this.height * pixelRatio;
    this.ctx!.scale(pixelRatio, pixelRatio);
  }
}
