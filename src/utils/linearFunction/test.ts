import * as utils from './';

describe('computeLinearParams', () => {
  test('Should create incresing linear function', () => {
    const point1 = {
      x: 10,
      y: 15,
    };
    const point2 = {
      x: 25,
      y: 50,
    };
    const linearParams = utils.computeLinearParams(point1, point2);

    expect(linearParams.coef).toBeCloseTo(2.333);
    expect(linearParams.offset).toBeCloseTo(-8.333);
  });

  test('Should create decresing linear function', () => {
    const point1 = {
      x: 28,
      y: 15,
    };
    const point2 = {
      x: 37,
      y: 10,
    };
    const linearParams = utils.computeLinearParams(point1, point2);

    expect(linearParams.coef).toBeCloseTo(-0.555);
    expect(linearParams.offset).toBeCloseTo(30.555);
  });

  test('Should create constant linear function', () => {
    const point1 = {
      x: 20,
      y: 18,
    };
    const point2 = {
      x: 32,
      y: 18,
    };
    const linearParams = utils.computeLinearParams(point1, point2);

    expect(linearParams.coef).toBeCloseTo(0);
    expect(linearParams.offset).toBeCloseTo(18);
  });
});
