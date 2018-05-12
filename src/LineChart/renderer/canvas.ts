import CanvasRenderer from '../../Renderer/canvas';
import { LineChartRenderable } from '../utils';

const TWO_PI = 2 * Math.PI;

export default class LineChartRenderer extends CanvasRenderer<LineChartRenderable> {
  renderCanvas(graph: LineChartRenderable) {
    this.renderLine(graph);
    this.renderGrid(graph);
    if (graph.pointRadius > 0) {
      this.renderPoints(graph);
    }

    // this.renderTangents(points);
  }

  private renderLine(graph: LineChartRenderable): void {
    const { width, height, fillColor, lineColor, points, origin } = graph;
    const [firstPoint, ...nextPoints] = points;
    const fillStyle = this.createFillStyle(height, fillColor);

    this.ctx!.beginPath();
    this.ctx!.moveTo(firstPoint.x, firstPoint.y);
    nextPoints.forEach((point, index) => {
      const isFirst = index === 0;
      const previousPoint = isFirst ? firstPoint : nextPoints[index - 1];
      this.ctx!.bezierCurveTo(
        previousPoint.cp2x,
        previousPoint.cp2y,
        point.cp1x,
        point.cp1y,
        point.x,
        point.y,
      );
    });
    this.ctx!.strokeStyle = lineColor;
    this.ctx!.stroke();
    if (fillStyle) {
      this.ctx!.lineTo(width, origin.y);
      this.ctx!.lineTo(origin.x, origin.y);
      this.ctx!.fillStyle = fillStyle;
      this.ctx!.fill();
    }
  }

  private renderPoints({ points, lineColor, pointRadius }: LineChartRenderable) {
    this.ctx!.beginPath();
    points.forEach(point => {
      this.ctx!.moveTo(point.x + pointRadius, point.y);
      this.ctx!.arc(point.x, point.y, pointRadius, 0, TWO_PI);
    });
    this.ctx!.strokeStyle = lineColor;
    this.ctx!.stroke();
    this.ctx!.fillStyle = '#FFFFFF';
    this.ctx!.fill();
  }

  private renderGrid({ top, font, verticalGrid, horizontalGrid }: LineChartRenderable) {
    this.ctx!.font = font;
    if (verticalGrid.length > 0) {
      this.ctx!.beginPath();
      this.ctx!.fillStyle = verticalGrid[0].labelColor;
      this.ctx!.strokeStyle = verticalGrid[0].color;

      verticalGrid.forEach(gridLine => {
        this.ctx!.moveTo(gridLine.x, gridLine.y);
        this.ctx!.lineTo(gridLine.x, top);
        this.ctx!.fillText(gridLine.label, gridLine.labelX, gridLine.labelY);
      });
      this.ctx!.stroke();
    }

    if (horizontalGrid.length > 0) {
      this.ctx!.beginPath();
      this.ctx!.fillStyle = horizontalGrid[0].labelColor;
      this.ctx!.strokeStyle = horizontalGrid[0].color;

      horizontalGrid.forEach(gridLine => {
        this.ctx!.moveTo(gridLine.x, gridLine.y);
        this.ctx!.lineTo(this.width, gridLine.y);
        this.ctx!.fillText(gridLine.label, gridLine.labelX, gridLine.labelY);
      });
      this.ctx!.stroke();
    }
  }

  // private renderTangents(points: Point[]) {
  //   this.ctx!.beginPath();
  //   points.forEach(point => {
  //     this.ctx!.moveTo(point.cp1x, point.cp1y);
  //     this.ctx!.lineTo(point.cp2x, point.cp2y);
  //   });
  //   this.ctx!.strokeStyle = '#555';
  //   this.ctx!.stroke();
  // }

  private createFillStyle(height: number, colors: string[]): string | CanvasGradient | null {
    if (colors.length === 0) {
      return null;
    }
    if (colors.length === 1) {
      return colors[0];
    }

    const gradient = this.ctx!.createLinearGradient(0, 0, 0, height);
    colors.forEach((color, index) => {
      gradient.addColorStop(index, color);
    });
    return gradient;
  }
}
