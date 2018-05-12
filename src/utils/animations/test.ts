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

describe('addScatterItems', () => {
  test('Should add 1 point in point list', () => {
    const nbPointsToAdd = 1;
    const extentedPoints = utils.addScatterItems(points, nbPointsToAdd);
    const expectedResult = [
      { x: 0, y: 30, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 10, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 20, y: 40, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 30, y: 60, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 40, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 40, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 50, y: 75, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 60, y: 45, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 70, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 80, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
    ];

    expect(extentedPoints.length).toBe(points.length + nbPointsToAdd);
    expect(extentedPoints).toEqual(expectedResult);
  });

  test('Should add 2 points in point list', () => {
    const nbPointsToAdd = 2;
    const extentedPoints = utils.addScatterItems(points, nbPointsToAdd);
    const expectedResult = [
      { x: 0, y: 30, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 10, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 20, y: 40, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 30, y: 60, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 30, y: 60, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 40, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 40, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 50, y: 75, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 60, y: 45, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 70, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 80, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
    ];

    expect(extentedPoints.length).toBe(points.length + nbPointsToAdd);
    expect(extentedPoints).toEqual(expectedResult);
  });

  test('Should add 3 points in point list', () => {
    const nbPointsToAdd = 3;
    const extentedPoints = utils.addScatterItems(points, nbPointsToAdd);
    const expectedResult = [
      { x: 0, y: 30, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 10, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 20, y: 40, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 30, y: 60, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 30, y: 60, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 40, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 40, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 50, y: 75, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 50, y: 75, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 60, y: 45, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 70, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 80, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
    ];

    expect(extentedPoints.length).toBe(points.length + nbPointsToAdd);
    expect(extentedPoints).toEqual(expectedResult);
  });

  test('Should double the number of points in point list', () => {
    const nbPointsToAdd = points.length;
    const extentedPoints = utils.addScatterItems(points, nbPointsToAdd);
    const expectedResult = [
      { x: 0, y: 30, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 0, y: 30, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 10, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 10, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 20, y: 40, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 20, y: 40, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 30, y: 60, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 30, y: 60, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 40, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 40, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 50, y: 75, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 50, y: 75, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 60, y: 45, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 60, y: 45, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 70, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 70, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 80, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 80, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
    ];

    expect(extentedPoints.length).toBe(points.length + nbPointsToAdd);
    expect(extentedPoints).toEqual(expectedResult);
  });

  test('Should add more than the double of points in point list', () => {
    const nbPointsToAdd = 13;
    const extentedPoints = utils.addScatterItems(points, 13);
    const expectedResult = [
      { x: 0, y: 30, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 0, y: 30, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 10, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 10, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 20, y: 40, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 20, y: 40, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 20, y: 40, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 30, y: 60, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 30, y: 60, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 30, y: 60, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 40, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 40, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 40, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 50, y: 75, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 50, y: 75, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 50, y: 75, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 60, y: 45, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 60, y: 45, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 70, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 70, y: 50, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 80, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
      { x: 80, y: 70, cp1x: 0, cp1y: 0, cp2x: 0, cp2y: 0 },
    ];

    expect(extentedPoints.length).toBe(points.length + nbPointsToAdd);
    expect(extentedPoints).toEqual(expectedResult);
  });
});
