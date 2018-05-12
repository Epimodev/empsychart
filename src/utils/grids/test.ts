import * as utils from './';

describe('computeGridIntervalSize', () => {
  test('Should return 0 when min and max value are 0', () => {
    expect(utils.computeGridIntervalSize(0, 0)).toBe(0);
  });

  test('Should return 0.1 when max value is between 0.1 and 1', () => {
    expect(utils.computeGridIntervalSize(0, 0.15)).toBe(0.1);
    expect(utils.computeGridIntervalSize(0, 0.5)).toBe(0.1);
    expect(utils.computeGridIntervalSize(0, 0.75)).toBe(0.1);
    expect(utils.computeGridIntervalSize(0, 1)).toBe(0.1);
  });

  test('Should return 1 when max value is between 1 and 10', () => {
    expect(utils.computeGridIntervalSize(0, 2)).toBe(1);
    expect(utils.computeGridIntervalSize(0, 5)).toBe(1);
    expect(utils.computeGridIntervalSize(0, 8)).toBe(1);
    expect(utils.computeGridIntervalSize(0, 10)).toBe(1);
  });

  test('Should return 10 when max value is between 10 and 100', () => {
    expect(utils.computeGridIntervalSize(0, 11)).toBe(10);
    expect(utils.computeGridIntervalSize(0, 25)).toBe(10);
    expect(utils.computeGridIntervalSize(0, 55)).toBe(10);
    expect(utils.computeGridIntervalSize(0, 80)).toBe(10);
    expect(utils.computeGridIntervalSize(0, 95)).toBe(10);
  });

  test('Should compute from min value when its absolute value is higher than max value', () => {
    expect(utils.computeGridIntervalSize(-11, 5)).toBe(10);
    expect(utils.computeGridIntervalSize(-25, 5)).toBe(10);
    expect(utils.computeGridIntervalSize(-55, 5)).toBe(10);
    expect(utils.computeGridIntervalSize(-80, 5)).toBe(10);
    expect(utils.computeGridIntervalSize(-95, 5)).toBe(10);
  });

  test('Should return 20 when value is between 10 and 100 and precision is 5', () => {
    expect(utils.computeGridIntervalSize(0, 11, 5)).toBe(20);
    expect(utils.computeGridIntervalSize(0, 25, 5)).toBe(20);
    expect(utils.computeGridIntervalSize(0, 55, 5)).toBe(20);
    expect(utils.computeGridIntervalSize(0, 80, 5)).toBe(20);
    expect(utils.computeGridIntervalSize(0, 95, 5)).toBe(20);
  });
});

describe('computeExtremGridLine', () => {
  test('Should return 0 when value is 0', () => {
    expect(utils.computeExtremGridLine(0, 10)).toBe(0);
    expect(utils.computeExtremGridLine(0, 20)).toBe(0);
    expect(utils.computeExtremGridLine(0, 50)).toBe(0);
  });

  test('Should ceil by interval size when value is positive', () => {
    expect(utils.computeExtremGridLine(5, 10)).toBe(10);
    expect(utils.computeExtremGridLine(8, 10)).toBe(10);
    expect(utils.computeExtremGridLine(35, 20)).toBe(40);
    expect(utils.computeExtremGridLine(35, 50)).toBe(50);
    expect(utils.computeExtremGridLine(49, 50)).toBe(50);
    expect(utils.computeExtremGridLine(49, 100)).toBe(100);
    expect(utils.computeExtremGridLine(51, 50)).toBe(100);
  });

  test('Should floor by interval size when value is negative', () => {
    expect(utils.computeExtremGridLine(-5, 10)).toBe(-10);
    expect(utils.computeExtremGridLine(-8, 10)).toBe(-10);
    expect(utils.computeExtremGridLine(-35, 20)).toBe(-40);
    expect(utils.computeExtremGridLine(-35, 50)).toBe(-50);
    expect(utils.computeExtremGridLine(-49, 50)).toBe(-50);
    expect(utils.computeExtremGridLine(-49, 100)).toBe(-100);
    expect(utils.computeExtremGridLine(-51, 50)).toBe(-100);
  });
});

describe('getGridValues', () => {
  test('Should return grid from 0 to 100 with interval of 10', () => {
    const expectedValue = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    expect(utils.getGridValues(10, 95, 10)).toEqual(expectedValue);
  });
  test('Should return grid from 0 to 60 with interval of 20', () => {
    const expectedValue = [0, 20, 40, 60];
    expect(utils.getGridValues(25, 45, 5)).toEqual(expectedValue);
  });
  test('Should return grid from -20 to 60 with interval of 20', () => {
    const expectedValue = [-20, 0, 20, 40, 60];
    expect(utils.getGridValues(-5, 45, 5)).toEqual(expectedValue);
  });
  test('Should return grid from -75 to 0 with interval of 25', () => {
    const expectedValue = [-75, -50, -25, 0];
    expect(utils.getGridValues(-70, -40, 4)).toEqual(expectedValue);
  });
  test('Should return grid from -75 to 25 with interval of 25', () => {
    const expectedValue = [-75, -50, -25, 0, 25];
    expect(utils.getGridValues(-70, 20, 4)).toEqual(expectedValue);
  });
});
