import * as utils from './';

const points = [
  { x: 0, y: 30, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 10, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 20, y: 40, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 30, y: 60, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 40, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 50, y: 75, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 60, y: 45, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 70, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 80, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
];
const points2 = [
  { x: 0, y: 70, cp1x: 0, cp1y: 70, cp2x: 0, cp2y: 70 },
  { x: 20, y: 50, cp1x: 20, cp1y: 50, cp2x: 20, cp2y: 50 },
  { x: 40, y: 40, cp1x: 40, cp1y: 40, cp2x: 40, cp2y: 40 },
  { x: 60, y: 35, cp1x: 60, cp1y: 35, cp2x: 60, cp2y: 35 },
  { x: 80, y: 55, cp1x: 80, cp1y: 55, cp2x: 80, cp2y: 55 },
  { x: 100, y: 60, cp1x: 100, cp1y: 60, cp2x: 100, cp2y: 60 },
  { x: 120, y: 50, cp1x: 120, cp1y: 50, cp2x: 120, cp2y: 50 },
  { x: 140, y: 10, cp1x: 140, cp1y: 10, cp2x: 140, cp2y: 10 },
  { x: 160, y: 20, cp1x: 160, cp1y: 20, cp2x: 160, cp2y: 20 },
];
const longerPoints = [
  { x: 0, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 10, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 20, y: 40, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 30, y: 35, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 40, y: 55, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 50, y: 60, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 60, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 70, y: 10, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 80, y: 20, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 90, y: 25, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
  { x: 100, y: 30, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
];

describe('pointsAnim.homogenise', () => {
  test('Should add points on current points', () => {
    const currentPoints = points;
    const targetPoints = longerPoints;
    const pointLists = utils.pointsAnim.homogenise(currentPoints, targetPoints);

    expect(pointLists.current.length).toBeGreaterThan(currentPoints.length);
    expect(pointLists.target.length).toBe(targetPoints.length);
    expect(pointLists.current.length).toBe(targetPoints.length);
  });

  test('Should add points on target points', () => {
    const currentPoints = longerPoints;
    const targetPoints = points;
    const pointLists = utils.pointsAnim.homogenise(currentPoints, targetPoints);

    expect(pointLists.target.length).toBeGreaterThan(targetPoints.length);
    expect(pointLists.current.length).toBe(currentPoints.length);
    expect(pointLists.target.length).toBe(currentPoints.length);
  });
});

describe('computePointDistances', () => {
  test("Should throw an error if there isn't the same number of current and target points", () => {
    expect(() => utils.computePointDistances(points, longerPoints)).toThrowError(Error);
  });

  test('Should compute point distances', () => {
    const expectedDistances = [
      { x: 0, y: 40, cp1x: 0, cp1y: 70, cp2x: 0, cp2y: 70 },
      { x: 10, y: 0, cp1x: 20, cp1y: 50, cp2x: 20, cp2y: 50 },
      { x: 20, y: 0, cp1x: 40, cp1y: 40, cp2x: 40, cp2y: 40 },
      { x: 30, y: -25, cp1x: 60, cp1y: 35, cp2x: 60, cp2y: 35 },
      { x: 40, y: -15, cp1x: 80, cp1y: 55, cp2x: 80, cp2y: 55 },
      { x: 50, y: -15, cp1x: 100, cp1y: 60, cp2x: 100, cp2y: 60 },
      { x: 60, y: 5, cp1x: 120, cp1y: 50, cp2x: 120, cp2y: 50 },
      { x: 70, y: -40, cp1x: 140, cp1y: 10, cp2x: 140, cp2y: 10 },
      { x: 80, y: -50, cp1x: 160, cp1y: 20, cp2x: 160, cp2y: 20 },
    ];
    const distances = utils.computePointDistances(points, points2);

    expect(distances).toEqual(expectedDistances);
  });
});
