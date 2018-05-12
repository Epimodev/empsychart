import { Animable, homogeniseScatter } from '../animations';
import { computeLineGradient, computeLineOffset, computeY } from '../linearFunction';

export interface Point {
  x: number;
  y: number;
  cp1x: number;
  cp1y: number;
  cp2x: number;
  cp2y: number;
}

/**
 * Check if a point has a tangent to create a curved line
 * @param point - point to check
 * @return true if point has a tangent
 */
export function hasTangent(point: Point): boolean {
  return (
    point.x !== point.cp1x ||
    point.x !== point.cp2x ||
    point.y !== point.cp1y ||
    point.y !== point.cp2y
  );
}

/**
 * Compute distance between two points
 * @param currentPoint - current graph point
 * @param targetPoint - target graph point
 * @return a point wich represent distance between 2 points for each axes
 */
export function computePointDistance(currentPoint: Point, targetPoint: Point): Point {
  const diffX = targetPoint.x - currentPoint.x;
  const diffY = targetPoint.y - currentPoint.y;
  const diffCp1x = targetPoint.cp1x - currentPoint.cp1x;
  const diffCp1y = targetPoint.cp1y - currentPoint.cp1y;
  const diffCp2x = targetPoint.cp2x - currentPoint.cp2x;
  const diffCp2y = targetPoint.cp2y - currentPoint.cp2y;
  return {
    x: diffX,
    y: diffY,
    cp1x: diffCp1x,
    cp1y: diffCp1y,
    cp2x: diffCp2x,
    cp2y: diffCp2y,
  };
}

/**
 * Compute distance between each current point with each target point
 * @param currentPoints - current graph points
 * @param targetPoints - target graph points
 * @return the list of distances
 */
export function computePointDistances(currentPoints: Point[], targetPoints: Point[]): Point[] {
  if (currentPoints.length !== targetPoints.length) {
    throw new Error(
      'computePointsDiffs : currentPoints and targetPoints must have the same length',
    );
  }
  const distances = currentPoints.map((currentPoint, index) => {
    const targetPoint = targetPoints[index];
    return computePointDistance(currentPoint, targetPoint);
  });

  return distances;
}

/**
 * Compute an animation step of a point
 * @param currentPoints - initial position before animation start
 * @param distances - distances between initial position and target position
 * @param progress - animation progress
 * @return the position of the point for an animation step
 */
export function createStepPoint(currentPoint: Point, distance: Point, progress: number): Point {
  const stepX = distance.x * progress;
  const stepY = distance.y * progress;
  const stepCp1x = distance.cp1x * progress;
  const stepCp1y = distance.cp1y * progress;
  const stepCp2x = distance.cp2x * progress;
  const stepCp2y = distance.cp2y * progress;
  return {
    x: currentPoint.x + stepX,
    y: currentPoint.y + stepY,
    cp1x: currentPoint.cp1x + stepCp1x,
    cp1y: currentPoint.cp1y + stepCp1y,
    cp2x: currentPoint.cp2x + stepCp2x,
    cp2y: currentPoint.cp2y + stepCp2y,
  };
}

/**
 * Compute an animation step of points
 * @param currentPoints - initial position before animation start
 * @param distances - distances between each points
 * @param progress - animation progress
 * @return the position of each points for an animation step
 */
export function createStepPoints(
  currentPoints: Point[],
  distances: Point[],
  progress: number,
): Point[] {
  const lastIndex = currentPoints.length - 1;
  const stepPoints = currentPoints
    .map((point, index) => {
      const pointDistance = distances[index];
      return createStepPoint(point, pointDistance, progress);
    })
    .map((point, index, points) => {
      const isFirst = index === 0;
      const isLast = index === lastIndex;
      if (isFirst || isLast) {
        return point;
      }
      const previousPoint = points[index - 1];
      const nextPoint = points[index + 1];
      return fixPointTangent(point, previousPoint, nextPoint);
    });

  return stepPoints;
}

/**
 * Fix tagent points of a point to avoid weird curve
 * during animation when the number of points change
 * @param point - point to fix
 * @param previousPoint - point before point to fix
 * @param nextPoint - point after point to fix
 * @return point with fixed tangent
 */
export function fixPointTangent(point: Point, previousPoint: Point, nextPoint: Point): Point {
  if (!hasTangent(point)) {
    return point;
  }
  const tanPoint1 = { x: point.cp1x, y: point.cp1y };
  const tanPoint2 = { x: point.cp2x, y: point.cp2y };

  const tangentGradient = computeLineGradient(tanPoint1, tanPoint2);
  const tangentOffset = computeLineOffset(tangentGradient, point);
  const computeTangentY = computeY({ coef: tangentGradient, offset: tangentOffset });

  const minCp1x = (point.x + previousPoint.x) / 2;
  const maxCp2x = (nextPoint.x + point.x) / 2;
  const cp1xExceed = point.cp1x < minCp1x;
  const cp2xExceed = point.cp2x > maxCp2x;

  const cp1x = cp1xExceed ? minCp1x : point.cp1x;
  const cp2x = cp2xExceed ? maxCp2x : point.cp2x;

  const cp1y = computeTangentY(cp1x);
  const cp2y = computeTangentY(cp2x);

  return { ...point, cp1x, cp2x, cp1y, cp2y };
}

export const pointsAnim: Animable<Point[], Point[], Point[]> = {
  formatInput(input) {
    return input;
  },
  formatRenderable(renderable) {
    return renderable;
  },
  formatToRenderable(computable) {
    return computable;
  },
  homogenise: homogeniseScatter,
  computeDiff: computePointDistances,
  createStep: createStepPoints,
};

export const pointAnim: Animable<Point, Point, Point> = {
  formatInput(input) {
    return input;
  },
  formatRenderable(renderable) {
    return renderable;
  },
  formatToRenderable(computable) {
    return computable;
  },
  homogenise(current, target) {
    return { current, target };
  },
  computeDiff: computePointDistance,
  createStep: createStepPoint,
};
