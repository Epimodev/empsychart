import { createSelector } from 'reselect';
import {
  Animable,
  createAnimationStack,
  aggregateFormatRenderable,
  aggregateFormatToRenderable,
  aggregateHomogenise,
  aggregateComputeDiff,
  aggregateCreateStep,
} from '../utils/animations';
import { Ease } from '../utils/animations/easing';
import { getGridValues, gridAnim, GridLine, GridLineComputable } from '../utils/grids';
import { getTextHeight, getTextWidth } from '../utils/canvas';
import {
  computeTangentParams,
  computeLineGradient,
  computeX,
  computeY,
} from '../utils/linearFunction';
import { Point, pointAnim, pointsAnim } from '../utils/points';
import { Color, parseColor, colorAnim, colorsAnim } from '../utils/colors';
import { numberAnim } from '../utils/numbers';

/* ==================================================
======================INTERFACES=====================
================================================== */
export interface LineChartRenderable {
  width: number;
  height: number;
  top: number;
  left: number;
  fillColor: string[];
  lineColor: string;
  points: Point[];
  pointRadius: number;
  verticalGrid: GridLine[];
  horizontalGrid: GridLine[];
  origin: Point;
  font: string;
}

export interface LineChartComputable {
  width: number;
  height: number;
  top: number;
  left: number;
  fillColor: Color[];
  lineColor: Color;
  points: Point[];
  pointRadius: number;
  verticalGrid: GridLineComputable[];
  horizontalGrid: GridLineComputable[];
  origin: Point;
  font: string;
}

export interface ChartArea {
  width: number;
  height: number;
  top: number;
  left: number;
  graphWidth: number;
  graphHeight: number;
  translations: PointTranslations;
}

export interface DataPoint {
  label?: string;
  abscissa: number;
  value: number;
}

export interface LineChartOptions {
  data: DataPoint[];
  pointRadius?: number;
  lineColor?: string;
  graphColor?: string | string[];
  hasHorizontalGrid?: boolean;
  horizontalGridColor?: string;
  horizontalGridLabelColor?: string;
  hasVerticalGrid?: boolean;
  verticalGridColor?: string;
  verticalGridLabelColor?: string;
  transitionDuration?: number;
  isCurved?: boolean;
  ease?: Ease;
  font?: string;
}

export interface LineChartPrerenderOptions {
  width: number;
  height: number;
  data: DataPoint[];
  pointRadius: number;
  hasHorizontalGrid: boolean;
  horizontalGridColor: string;
  horizontalGridLabelColor: string;
  hasVerticalGrid: boolean;
  verticalGridColor: string;
  verticalGridLabelColor: string;
  lineColor: string;
  graphColor: string | string[];
  isCurved: boolean;
  font: string;
}

export interface PointTranslations {
  x: (value: number) => number;
  y: (value: number) => number;
}

export type Curve = 'concave' | 'convex' | 'none';

/* ==================================================
======================CONSTANTS======================
================================================== */
const TRANSPARENT_RGBA = 'rgba(0,0,0,0)';
const BLACK_COLOR = { red: 0, green: 0, blue: 0, alpha: 1 };
const GRID_PADDING = 20;

const animableFields = {
  fillColor: colorsAnim,
  lineColor: colorAnim,
  points: pointsAnim,
  pointRadius: numberAnim,
  width: numberAnim,
  height: numberAnim,
  top: numberAnim,
  left: numberAnim,
  verticalGrid: gridAnim,
  horizontalGrid: gridAnim,
  origin: pointAnim,
};
const unAnimableKeys = ['font'];

export const graphAnim: Animable<
  LineChartPrerenderOptions,
  LineChartComputable,
  LineChartRenderable
> = {
  formatInput(input) {
    return {
      width: input.width,
      height: input.height,
      top: 0,
      left: 0,
      fillColor: [],
      lineColor: { red: 0, green: 0, blue: 0, alpha: 1 },
      points: [],
      pointRadius: 0,
      verticalGrid: [],
      horizontalGrid: [],
      origin: { x: 0, y: 0, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      font: input.font,
    };
  },
  formatRenderable: aggregateFormatRenderable(animableFields, unAnimableKeys),
  formatToRenderable: aggregateFormatToRenderable(animableFields, unAnimableKeys),
  homogenise: aggregateHomogenise(animableFields, unAnimableKeys),
  computeDiff: aggregateComputeDiff(animableFields, unAnimableKeys),
  createStep: aggregateCreateStep(animableFields, unAnimableKeys),
};

/* ==================================================
======================SELECTORS======================
================================================== */
export const selectData = ({ data }: LineChartPrerenderOptions) => data;
export const selectPointRadius = ({ pointRadius }: LineChartPrerenderOptions) => pointRadius;
export const selectWidth = ({ width }: LineChartPrerenderOptions) => width;
export const selectHeight = ({ height }: LineChartPrerenderOptions) => height;
export const selectGraphColor = ({ graphColor }: LineChartPrerenderOptions) => graphColor;
export const selectLineColor = ({ lineColor }: LineChartPrerenderOptions) => lineColor;
export const selectIsCurved = ({ isCurved = false }: LineChartPrerenderOptions) => isCurved;
export const selectHasVerticalGrid = ({ hasVerticalGrid }: LineChartPrerenderOptions) =>
  hasVerticalGrid;
export const selectVerticalGridColor = ({ verticalGridColor }: LineChartPrerenderOptions) =>
  verticalGridColor;
export const selectVerticalGridLabelColor = ({
  verticalGridLabelColor,
}: LineChartPrerenderOptions) => verticalGridLabelColor;
export const selectHasHorizontalGrid = ({ hasHorizontalGrid }: LineChartPrerenderOptions) =>
  hasHorizontalGrid;
export const selectHorizontalGridColor = ({ horizontalGridColor }: LineChartPrerenderOptions) =>
  horizontalGridColor;
export const selectHorizontalGridLabelColor = ({
  horizontalGridLabelColor,
}: LineChartPrerenderOptions) => horizontalGridLabelColor;
export const selectFont = ({ font }: LineChartPrerenderOptions) => font;

export const createSelectGraphFill = () => createSelector(selectGraphColor, createGraphFill);
export const createSelectGraphLineColor = () =>
  createSelector(selectLineColor, createGraphLineColor);
export const createSelectGridValues = () => createSelector(selectData, computeHorizontalGridValues);
export const createSelectGraphArea = (
  selectGridValues: (res: LineChartPrerenderOptions) => number[],
) =>
  createSelector(
    selectWidth,
    selectHeight,
    selectData,
    selectGridValues,
    selectHasVerticalGrid,
    selectHasHorizontalGrid,
    selectFont,
    computeGraphArea,
  );
export const createSelectVerticalGrid = (
  selectGraphArea: (res: LineChartPrerenderOptions) => ChartArea,
) =>
  createSelector(
    selectHasVerticalGrid,
    selectVerticalGridColor,
    selectVerticalGridLabelColor,
    selectGraphArea,
    selectFont,
    selectData,
    computeVerticalGrid,
  );
export const createSelectHorizontalGrid = (
  selectGraphArea: (res: LineChartPrerenderOptions) => ChartArea,
  selectGridValues: (res: LineChartPrerenderOptions) => number[],
) =>
  createSelector(
    selectHasHorizontalGrid,
    selectHorizontalGridColor,
    selectHorizontalGridLabelColor,
    selectGraphArea,
    selectFont,
    selectGridValues,
    computeHorizontalGrid,
  );
export const createSelectGraphPoints = (
  selectGraphArea: (res: LineChartPrerenderOptions) => ChartArea,
) => createSelector(selectGraphArea, selectData, selectIsCurved, createGraphPoints);
export const createSelectInitialPoints = (
  selectGraphArea: (res: LineChartPrerenderOptions) => ChartArea,
) => createSelector(selectGraphArea, selectData, createInitialPoints);
export const createSelectGraph = (
  selectGraphArea: (res: LineChartPrerenderOptions) => ChartArea,
  selectGraphFill: (res: LineChartPrerenderOptions) => Color[],
  selectGraphLineColor: (res: LineChartPrerenderOptions) => Color,
  selectGraphPoints: (res: LineChartPrerenderOptions) => Point[],
  selectVerticalGrid: (res: LineChartPrerenderOptions) => GridLine[],
  selectHorizontalGrid: (res: LineChartPrerenderOptions) => GridLine[],
) =>
  createSelector(
    selectGraphArea,
    selectGraphFill,
    selectGraphLineColor,
    selectGraphPoints,
    selectPointRadius,
    selectVerticalGrid,
    selectHorizontalGrid,
    selectFont,
    createGraph,
  );
export const createSelectInitialGraph = (
  selectGraphArea: (res: LineChartPrerenderOptions) => ChartArea,
  selectInitialPoints: (res: LineChartPrerenderOptions) => Point[],
) => createSelector(selectGraphArea, selectInitialPoints, selectFont, createInitialGraph);
export const createSelectRenderableGraph = (
  selectGraph: (res: LineChartPrerenderOptions) => LineChartComputable,
) => createSelector(selectGraph, graphAnim.formatToRenderable);

/* ==================================================
======================FUNCTIONS======================
================================================== */

/**
 * Get min value on max value to display on graph
 * @param data - graph data
 * @return min and max value of data
 */
export function computeHorizontalGridValues(data: DataPoint[]): number[] {
  const values = data.map(point => point.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  return getGridValues(minValue, maxValue, 10);
}

/**
 * Compute graph area size and position
 * @param width - canvas width
 * @param height - canvas height
 * @param data - graph data
 * @param gridValues - horizontal grid values
 * @param hasVerticalGrid - display horizontal grid or not
 * @param hasHorizontalGrid - display horizontal grid or not
 * @param fontHeight - height of font
 * @return graph size and position
 */
export function computeGraphArea(
  width: number,
  height: number,
  data: DataPoint[],
  gridValues: number[],
  hasVerticalGrid: boolean,
  hasHorizontalGrid: boolean,
  font: string,
): ChartArea {
  const textHeight = getTextHeight(font);
  const top = hasHorizontalGrid ? textHeight : 0;
  const left = hasHorizontalGrid ? computePaddingLeft(gridValues, font) : 0;
  const bottom = hasVerticalGrid ? textHeight + GRID_PADDING : hasHorizontalGrid ? textHeight : 0;
  const graphWidth = width - left;
  const graphHeight = height - top - bottom;
  const graphTopToBottom = graphHeight + top;
  const yInterval = getGraphYinterval(gridValues);
  const xInterval = getGraphXinterval(data);
  const scaleX = graphWidth / xInterval;
  const scaleY = graphHeight / yInterval;
  const offsetX = -data[0].abscissa;
  const offsetY = -gridValues[0];

  const graphTranslations = {
    x: (value: number) => left + (value + offsetX) * scaleX,
    y: (value: number) => graphTopToBottom - (value + offsetY) * scaleY,
  };

  return {
    width,
    height,
    top,
    left,
    graphWidth,
    graphHeight,
    translations: graphTranslations,
  };
}

/**
 * Compute value interval of the graph
 * @param gridValues - horizontal grid values
 * @return value interval
 */
export function getGraphYinterval(gridValues: number[]): number {
  const maxGridValue = gridValues[gridValues.length - 1];
  const minGridValue = gridValues[0];
  return maxGridValue - minGridValue;
}

/**
 * Compute abscissa interval of the graph
 * @param data - graph data
 * @return abscissa interval
 */
export function getGraphXinterval(data: DataPoint[]): number {
  const abscissas = data.map(point => point.abscissa);
  const maxAbscissa = Math.max(...abscissas);
  const minAbscissa = Math.min(...abscissas);
  return maxAbscissa - minAbscissa;
}

/**
 * Compute distance between canvas left side and first vertical grid with horizontal grid values
 * @param gridValues - horizontal grid values
 * @return distance between canvas left side and first vertical grid line
 */
export function computePaddingLeft(gridValues: number[], font: string): number {
  const gridLineWidths = gridValues.map(value => getTextWidth(font, value.toString()));
  return Math.max(...gridLineWidths) + GRID_PADDING;
}

/**
 * Compute horizontal grid to display on graph
 * @param hasHorizontalGrid - display horizontal grid
 * @param horizontalGridColor - horizontal grid color
 * @param horizontalGridLabelColor - horizontal grid label color
 * @param graphArea - graph area
 * @param font - font use for grid
 * @param gridValues - grid horizontal lines values
 * @return list of horizontal grid lines
 */
export function computeHorizontalGrid(
  hasHorizontalGrid: boolean,
  horizontalGridColor: string,
  horizontalGridLabelColor: string,
  graphArea: ChartArea,
  font: string,
  gridValues: number[],
): GridLine[] {
  if (hasHorizontalGrid) {
    const labelHeight = getTextHeight(font);
    const semiLabelHeight = labelHeight / 2;

    return gridValues.map(gridValue => {
      const gridLineLabel = gridValue.toString();
      const labelWidth = getTextWidth(font, gridLineLabel);
      const labelXposition = graphArea.left - labelWidth - 10;
      const yPosition = graphArea.translations.y(gridValue);
      const labelYposition = yPosition + semiLabelHeight;

      return {
        label: gridLineLabel,
        x: graphArea.left,
        y: yPosition,
        labelX: labelXposition,
        labelY: labelYposition,
        color: horizontalGridColor,
        labelColor: horizontalGridLabelColor,
      };
    });
  }
  return [];
}

/**
 * Compute vertical grid to display on graph
 * @param graphArea - graph area
 * @param font - font use for grid
 * @param data - graph data
 * @return list of vertical grid lines
 */
export function computeVerticalGrid(
  hasVerticalGrid: boolean,
  verticalGridColor: string,
  verticalGridLabelColor: string,
  graphArea: ChartArea,
  font: string,
  data: DataPoint[],
): GridLine[] {
  if (hasVerticalGrid) {
    const yPosition = graphArea.top + graphArea.graphHeight;
    const labelYposition = yPosition + GRID_PADDING;

    return data.map((point, index) => {
      const isLast = index === data.length - 1;
      const gridLineLabel = point.label ? point.label : point.abscissa.toString();
      const xPosition = graphArea.translations.x(point.abscissa);
      const labelWidth = getTextWidth(font, gridLineLabel);
      const labelSemiWidth = labelWidth / 2;
      const labelXposition = isLast
        ? xPosition - labelWidth
        : Math.max(0, xPosition - labelSemiWidth);

      return {
        label: gridLineLabel,
        x: xPosition,
        y: yPosition,
        labelX: labelXposition,
        labelY: labelYposition,
        color: verticalGridColor,
        labelColor: verticalGridLabelColor,
      };
    });
  }
  return [];
}

/**
 * Create graph object
 * @param fillColor - graph fill color
 * @param lineColor - graph line color
 * @param points - graph points
 * @return graph ready to be render
 */
export function createGraph(
  graphArea: ChartArea,
  fillColor: Color[],
  lineColor: Color,
  points: Point[],
  pointRadius: number,
  verticalGrid: GridLine[],
  horizontalGrid: GridLine[],
  font: string,
): LineChartComputable {
  const verticalGridComputable = gridAnim.formatInput(verticalGrid);
  const horizontalGridComputable = gridAnim.formatInput(horizontalGrid);
  const originX = points[0].x;
  const originY = graphArea.translations.y(0);
  const origin = {
    x: originX,
    y: originY,
    cp1x: originX,
    cp1y: originY,
    cp2x: originX,
    cp2y: originY,
  };
  return {
    fillColor,
    lineColor,
    points,
    pointRadius,
    origin,
    font,
    width: graphArea.width,
    height: graphArea.height,
    top: graphArea.top,
    left: graphArea.left,
    verticalGrid: verticalGridComputable,
    horizontalGrid: horizontalGridComputable,
  };
}

/**
 * Create initial graph for intial animation
 * @param points - graph points
 * @return graph ready to be render
 */
export function createInitialGraph(
  graphArea: ChartArea,
  points: Point[],
  font: string,
): LineChartRenderable {
  return {
    points,
    font,
    pointRadius: 0,
    fillColor: [],
    lineColor: TRANSPARENT_RGBA,
    origin: { x: points[0].x, y: points[0].y, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
    width: graphArea.width,
    height: graphArea.height,
    top: graphArea.top,
    left: graphArea.left,
    verticalGrid: [],
    horizontalGrid: [],
  };
}

/**
 * Create list of graph points
 * @param graphArea - graph aera
 * @param data - graph data to display
 * @param isCurved - true if we want a curved line
 * @return list of points used to draw first graph line
 */
export function createGraphPoints(
  graphArea: ChartArea,
  data: DataPoint[],
  isCurved: boolean,
): Point[] {
  const graphPoints = data.map(dataToGraph(graphArea));

  if (isCurved) {
    return graphPoints.map(pointWithCurves);
  }
  return graphPoints;
}

/**
 * Create list of points to create initial graph line
 * @param graphArea - graph aera
 * @param data - graph data to display
 * @return list of points used to draw first graph line
 */
export function createInitialPoints(graphArea: ChartArea, data: DataPoint[]): Point[] {
  return data.map(dataPoint => {
    const positionX = graphArea.translations.x(dataPoint.abscissa);
    const positionY = graphArea.translations.y(0);
    return {
      x: positionX,
      y: positionY,
      cp1x: positionX,
      cp1y: positionY,
      cp2x: positionX,
      cp2y: positionY,
    };
  });
}

/**
 * Create list of fill colors from color option
 * @param color - graph color option
 * @return list of parsed colors
 */
export function createGraphFill(color: string | string[]) {
  if (!color) return [];
  return typeof color === 'string' ? [parseColor(color)] : color.map(parseColor);
}

/**
 * Create line color from line color option
 * @param color - graph line color option
 * @return parsed color or black if it's not defined
 */
export function createGraphLineColor(color?: string) {
  return color ? parseColor(color) : BLACK_COLOR;
}

/**
 * Create function to convert data to graph point
 * @param height - graph height
 * @param translations - graph translations
 * @return function which convert data to graph point
 */
export function dataToGraph({ translations }: ChartArea): (point: DataPoint) => Point {
  return point => {
    const positionX = translations.x(point.abscissa);
    const positionY = translations.y(point.value);

    return {
      x: positionX,
      y: positionY,
      cp1x: positionX,
      cp1y: positionY,
      cp2x: positionX,
      cp2y: positionY,
    };
  };
}

/**
 * Compute curve control points of a point
 * @param point - graph point
 * @param index - point position in list
 * @param points - list of graph points
 */
export function pointWithCurves(point: Point, index: number, points: Point[]): Point {
  const isFirst = index === 0;
  const isLast = index + 1 === points.length;
  if (isFirst || isLast) {
    return {
      ...point,
      cp1x: point.x,
      cp1y: point.y,
      cp2x: point.x,
      cp2y: point.y,
    };
  }
  const previousPoint = points[index - 1];
  const nextPoint = points[index + 1];

  if (isLocalMaximum(point, previousPoint, nextPoint)) {
    const cp1x = (previousPoint.x + point.x) / 2;
    const cp2x = (nextPoint.x + point.x) / 2;
    return {
      ...point,
      cp1x,
      cp2x,
      cp1y: point.y,
      cp2y: point.y,
    };
  }

  const tangentFunctionParams = computeTangentParams(point, previousPoint, nextPoint);
  const curveType = getCurveType(point, previousPoint, nextPoint);

  if (curveType === 'none') {
    return {
      ...point,
      cp1x: point.x,
      cp1y: point.y,
      cp2x: point.x,
      cp2y: point.y,
    };
  }

  const isIncreasing = tangentFunctionParams.coef > 0;
  if ((isIncreasing && curveType === 'convex') || (!isIncreasing && curveType === 'concave')) {
    const cp1y = (previousPoint.y + point.y) / 2;
    const cp1x = computeX(tangentFunctionParams)(cp1y);
    const cp2x = (point.x + nextPoint.x) / 2;
    const cp2y = computeY(tangentFunctionParams)(cp2x);
    return {
      ...point,
      cp1x,
      cp1y,
      cp2x,
      cp2y,
    };
  }
  if ((isIncreasing && curveType === 'concave') || (!isIncreasing && curveType === 'convex')) {
    const cp1x = (previousPoint.x + point.x) / 2;
    const cp1y = computeY(tangentFunctionParams)(cp1x);
    const cp2y = (point.y + nextPoint.y) / 2;
    const cp2x = computeX(tangentFunctionParams)(cp2y);
    return {
      ...point,
      cp1x,
      cp1y,
      cp2x,
      cp2y,
    };
  }

  return {
    ...point,
    cp1x: point.x,
    cp1y: point.y,
    cp2x: point.x,
    cp2y: point.y,
  };
}

/**
 * Check if a point is a local maximum
 * @param point - point to check
 * @param previousPoint - previous point
 * @param nextPoint - next point
 * @return true if point is a local maximum
 */
export function isLocalMaximum(point: Point, previousPoint: Point, nextPoint: Point) {
  return (
    (point.y >= previousPoint.y && point.y >= nextPoint.y) ||
    (point.y <= previousPoint.y && point.y <= nextPoint.y)
  );
}

/**
 * Get curve type on a point based on previous and next point
 * @param point - target point
 * @param previousPoint - previous point
 * @param nextPoint - next point
 * @return type of curve on point
 */
export function getCurveType(point: Point, previousPoint: Point, nextPoint: Point): Curve {
  const startGradient = computeLineGradient(previousPoint, point);
  const endGradient = computeLineGradient(point, nextPoint);
  if (startGradient > endGradient) {
    return 'concave';
  }
  if (startGradient < endGradient) {
    return 'convex';
  }
  // if startGradient is equal to endGradient
  return 'none';
}

/* ==================================================
======================ANIMATIONS=====================
================================================== */

/**
 * Create a stack of graph to create an animation
 * @param currentGraph - current graph displayed
 * @param targetGraph - graph to displayed
 * @param duration - animation duration
 * @param ease - animation ease
 * @return the list of graph steps for animation
 */
export function createLineChartAnimationStack(
  currentGraph: LineChartRenderable,
  targetGraph: LineChartComputable,
  duration: number,
  ease: Ease,
): LineChartRenderable[] {
  return createAnimationStack(graphAnim, currentGraph, targetGraph, duration, ease);
}
