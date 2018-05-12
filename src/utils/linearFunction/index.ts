export interface LinearParams {
  coef: number;
  offset: number;
}

export interface Point {
  x: number;
  y: number;
}

export type LinearFunction = (x: number) => number;

/**
 * Compute gradient of line between point1 and point2
 * @param point1 - first point of line
 * @param point2 - second point of line
 * @return gradiant of line between point1 and point2
 */
export function computeLineGradient(point1: Point, point2: Point): number {
  const deltaX = point2.x - point1.x;
  const deltaY = point2.y - point1.y;

  return deltaY / deltaX;
}

/**
 * Compute offset of linear function which pass through point and with coef grandient
 * @param coef - linear function gradient
 * @param point - point where linear function pass through
 * @return linear function offset
 */
export function computeLineOffset(coef: number, point: Point): number {
  // y = coef * x + offset <===> offset = y - coef * x
  const offset = point.y - coef * point.x;
  return offset;
}

/**
 * Compute linear params which can be use for linear function
 * y = coef * x + offset
 * @param point1 - first point of line
 * @param point2 - second point of line
 * @return coeficient and offset to compute line points
 */
export function computeLinearParams(point1: Point, point2: Point): LinearParams {
  const coef = computeLineGradient(point1, point2);
  const offset = computeLineOffset(coef, point1);

  return {
    coef,
    offset,
  };
}

/**
 * Create linear function which
 * - have gradient of previous and next point
 * - pass on target point
 * @param point - uniq point of tangent
 * @param previousPoint - previous point
 * @param nextPoint - next point
 * @return linear function of tangent which touch point param
 */
export function computeTangentParams(
  point: Point,
  previousPoint: Point,
  nextPoint: Point,
): LinearParams {
  const coef = computeLineGradient(previousPoint, nextPoint);

  const offset = point.y - coef * point.x;

  return {
    coef,
    offset,
  };
}

/**
 * Create function to compute y position of a point on a straight line
 * @param linearParams - params of linear function
 * @return function to compute y position of a point
 */
export function computeY({ coef, offset }: LinearParams): LinearFunction {
  return (x: number) => coef * x + offset;
}

/**
 * Create function to compute x position of a point on a straight line
 * @param linearParams - params of linear function
 * @return function to compute x position of a point
 */
export function computeX({ coef, offset }: LinearParams): LinearFunction {
  return (y: number) => (y - offset) / coef;
}
