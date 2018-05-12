import { Animable, homogeniseScatter } from '../animations';
import {
  Color,
  subsctractColor,
  parseColor,
  stringifyColor,
  addColor,
  multiplyColorBy,
} from '../colors';

export interface GridLine {
  label: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  color: string;
  labelColor: string;
}

export interface GridLineComputable {
  label: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  color: Color;
  labelColor: Color;
}

/**
 * Compute grid interval of a graph
 * @param minValue - min graph value
 * @param maxValue - max graph value
 * @param precision - precision coef, higher coef return a lower value (better precision)
 *                    default value is 10.
 * @return value between each grid line
 */
export function computeGridIntervalSize(
  minValue: number,
  maxValue: number,
  precision: number = 10,
): number {
  const value = Math.max(Math.abs(minValue), Math.abs(maxValue));
  if (value === 0) {
    return 0;
  }
  const positiveValue = Math.abs(value);
  const valueLog10 = Math.log10(positiveValue);
  const tenPow = Math.ceil(valueLog10);
  const magnitude = Math.pow(10, tenPow);

  return magnitude / precision;
}

/**
 * Compute value of extrem grid line of graph
 * @param value - max or min graph value
 * @param intervalSize - size of interval between each grid line
 * @return the value of the grid line
 */
export function computeExtremGridLine(value: number, intervalSize: number): number {
  if (value > 0) {
    return Math.ceil(value / intervalSize) * intervalSize;
  }
  if (value < 0) {
    return Math.floor(value / intervalSize) * intervalSize;
  }
  return 0;
}

/**
 * Compute list of grid lines to display
 * @param minValue - value of bottom grid line
 * @param maxValue - value of top grid line
 * @param precision - coeficient which define the interval
 *                    between each grid line and the number of grid lines
 * @return grid line values
 */
export function getGridValues(minValue: number, maxValue: number, precision: number): number[] {
  const intervalSize = computeGridIntervalSize(minValue, maxValue, precision);
  const isFullPositive = minValue >= 0 && maxValue >= 0;
  const isFullNegative = !isFullPositive && minValue < 0 && maxValue < 0;
  const firstGridLine = isFullPositive ? 0 : computeExtremGridLine(minValue, intervalSize);
  const lastGridLine = isFullNegative ? 0 : computeExtremGridLine(maxValue, intervalSize);
  const nbGridLines = Math.round((lastGridLine - firstGridLine) / intervalSize) + 1;

  const gridRange: undefined[] = Array.apply(null, Array(nbGridLines));
  const gridValues = gridRange.map((_, index) => {
    const isLast = index + 1 === nbGridLines;
    if (isLast) {
      return lastGridLine;
    }
    return firstGridLine + intervalSize * index;
  });

  return gridValues;
}

/**
 * Compute difference between 2 grid line
 * @param currentGrid - grid displayed on graph
 * @param targetGrid - grid to display
 * @return difference between the grids
 */
export function computeGridLineDiff(
  currentGrid: GridLineComputable,
  targetGrid: GridLineComputable,
): GridLineComputable {
  const xDiff = targetGrid.x - currentGrid.x;
  const yDiff = targetGrid.y - currentGrid.y;
  const labelXDiff = targetGrid.labelX - currentGrid.labelX;
  const labelYDiff = targetGrid.labelY - currentGrid.labelY;
  const colorDiff = subsctractColor(targetGrid.color, currentGrid.color);
  const labelColorDiff = subsctractColor(targetGrid.labelColor, currentGrid.labelColor);

  return {
    label: targetGrid.label,
    x: xDiff,
    y: yDiff,
    labelX: labelXDiff,
    labelY: labelYDiff,
    color: colorDiff,
    labelColor: labelColorDiff,
  };
}

/**
 * Compute difference between current grid and target grid
 * @param currentGrid - grid displayed on graph
 * @param targetGrid - grid to display
 * @return list of grid lines difference
 */
export function computeGridDiff(
  currentGrid: GridLineComputable[],
  targetGrid: GridLineComputable[],
): GridLineComputable[] {
  if (currentGrid.length !== targetGrid.length) {
    throw new Error('computeGridDiff : currentGrid and targetGrid must have the same length');
  }
  const distances = currentGrid.map((currentGridLine, index) => {
    const targetGridLine = targetGrid[index];
    return computeGridLineDiff(currentGridLine, targetGridLine);
  });

  return distances;
}

/**
 * Compute an animation step of grid
 * @param initialGrid - initial grid before animation start
 * @param diffs - difference between each grid line
 * @param progress - animation progress
 * @return the list of grid lines to display for an animation step
 */
export function createGridStep(
  initialGrid: GridLineComputable[],
  diffs: GridLineComputable[],
  progress: number,
): GridLine[] {
  const stepGrid = initialGrid.map((gridLine, index) => {
    const gridLineDiff = diffs[index];
    const label = progress > 0.5 ? gridLineDiff.label : gridLine.label;
    const stepX = gridLineDiff.x * progress;
    const stepY = gridLineDiff.y * progress;
    const stepLabelX = gridLineDiff.labelX * progress;
    const stepLabelY = gridLineDiff.labelY * progress;

    const stepColorSize = multiplyColorBy(gridLineDiff.color, progress);
    const stepColor = addColor(gridLine.color, stepColorSize);
    const stepLabelColorSize = multiplyColorBy(gridLineDiff.labelColor, progress);
    const stepLabelColor = addColor(gridLine.labelColor, stepLabelColorSize);

    return {
      label,
      x: gridLine.x + stepX,
      y: gridLine.y + stepY,
      labelX: gridLine.labelX + stepLabelX,
      labelY: gridLine.labelY + stepLabelY,
      color: stringifyColor(stepColor),
      labelColor: stringifyColor(stepLabelColor),
    };
  });

  return stepGrid;
}

export const gridAnim: Animable<GridLine[], GridLineComputable[], GridLine[]> = {
  formatInput(input) {
    return input.map(gridLine => ({
      ...gridLine,
      color: parseColor(gridLine.color),
      labelColor: parseColor(gridLine.labelColor),
    }));
  },
  formatRenderable(renderable) {
    return renderable.map(gridLine => ({
      ...gridLine,
      color: parseColor(gridLine.color),
      labelColor: parseColor(gridLine.labelColor),
    }));
  },
  formatToRenderable(computable) {
    return computable.map(gridLine => ({
      ...gridLine,
      color: stringifyColor(gridLine.color),
      labelColor: stringifyColor(gridLine.labelColor),
    }));
  },
  homogenise(current, target) {
    return homogeniseScatter(current, target, gridLine => {
      return {
        ...gridLine,
        color: { ...gridLine.color, alpha: 0 },
        labelColor: { ...gridLine.labelColor, alpha: 0 },
      };
    });
  },
  computeDiff: computeGridDiff,
  createStep: createGridStep,
};
