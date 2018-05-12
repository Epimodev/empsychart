import * as utils from './';

/* ==================================================
======================FAKE DATA======================
================================================== */
const gray: utils.Color = {
  red: 200,
  green: 200,
  blue: 200,
  alpha: 1,
};
const transparent: utils.Color = {
  red: 0,
  green: 0,
  blue: 0,
  alpha: 0,
};
const pink: utils.Color = {
  red: 255,
  green: 0,
  blue: 136,
  alpha: 1,
};
const green = {
  red: 100,
  green: 145,
  blue: 115,
  alpha: 1,
};
const pinkTransparent: utils.Color = {
  red: 255,
  green: 0,
  blue: 136,
  alpha: 0.6,
};

/* ==================================================
========================TESTS========================
================================================== */
describe('parseColor', () => {
  test('Should return transparent if format is invalid', () => {
    const colorToParse = 'rb(10, 10, 10)';
    const parsedColor = utils.parseColor(colorToParse);
    expect(parsedColor).toEqual(transparent);
  });
  test('Should parse hexa3 color', () => {
    const colorToParse = '#f08';
    const parsedColor = utils.parseColor(colorToParse);
    expect(parsedColor).toEqual(pink);
  });
  test('Should parse hexa4 color', () => {
    const colorToParse = '#f089';
    const parsedColor = utils.parseColor(colorToParse);
    expect(parsedColor).toEqual(pinkTransparent);
  });
  test('Should parse hexa6 color', () => {
    const colorToParse = '#ff0088';
    const parsedColor = utils.parseColor(colorToParse);
    expect(parsedColor).toEqual(pink);
  });
  test('Should parse hexa8 color', () => {
    const colorToParse = '#ff008899';
    const parsedColor = utils.parseColor(colorToParse);
    expect(parsedColor).toEqual(pinkTransparent);
  });
  test('Should parse rgb color', () => {
    const colorToParse = 'rgb(255, 0, 136)';
    const parsedColor = utils.parseColor(colorToParse);
    expect(parsedColor).toEqual(pink);
  });
  test('Should parse rgba color', () => {
    const colorToParse = 'rgba(255, 0, 136, 0.6)';
    const parsedColor = utils.parseColor(colorToParse);
    expect(parsedColor).toEqual(pinkTransparent);
  });
  test('Should parse hsl color', () => {
    const colorToParse = 'hsl(328, 100%, 50%)';
    const parsedColor = utils.parseColor(colorToParse);
    expect(parsedColor).toEqual(pink);
  });
  test('Should parse hsla color', () => {
    const colorToParse = 'hsla(328, 100%, 50%, 0.6)';
    const parsedColor = utils.parseColor(colorToParse);
    expect(parsedColor).toEqual(pinkTransparent);
  });
  test('Should parse hsl gray color', () => {
    const colorToParse = 'hsl(0, 0%, 78.4%)';
    const parsedColor = utils.parseColor(colorToParse);
    expect(parsedColor).toEqual(gray);
  });
});

describe('addColor', () => {
  test('Should add 2 colors', () => {
    const color1 = {
      red: 100,
      green: 10,
      blue: 250,
      alpha: 0.6,
    };
    const color2 = {
      red: 50,
      green: 200,
      blue: 0,
      alpha: 0.2,
    };
    const expectedColor = {
      red: 150,
      green: 210,
      blue: 250,
      alpha: 0.8,
    };

    const computedColor = utils.addColor(color1, color2);
    expect(computedColor.red).toBeCloseTo(expectedColor.red);
    expect(computedColor.green).toBeCloseTo(expectedColor.green);
    expect(computedColor.blue).toBeCloseTo(expectedColor.blue);
    expect(computedColor.alpha).toBeCloseTo(expectedColor.alpha);
  });
});

describe('subsctractColor', () => {
  test('Should substract 1 color', () => {
    const color1 = {
      red: 100,
      green: 10,
      blue: 250,
      alpha: 0.6,
    };
    const color2 = {
      red: 50,
      green: 200,
      blue: 0,
      alpha: 0.2,
    };
    const expectedColor = {
      red: 50,
      green: -190,
      blue: 250,
      alpha: 0.4,
    };

    const computedColor = utils.subsctractColor(color1, color2);
    expect(computedColor.red).toBeCloseTo(expectedColor.red);
    expect(computedColor.green).toBeCloseTo(expectedColor.green);
    expect(computedColor.blue).toBeCloseTo(expectedColor.blue);
    expect(computedColor.alpha).toBeCloseTo(expectedColor.alpha);
  });
});

describe('multiplyColorBy', () => {
  test('Should multiply color components', () => {
    const color = {
      red: 100,
      green: 10,
      blue: 250,
      alpha: 1,
    };
    const multiplyValue = 0.1;
    const expectedColor = {
      red: 10,
      green: 1,
      blue: 25,
      alpha: 0.1,
    };

    const computedColor = utils.multiplyColorBy(color, multiplyValue);
    expect(computedColor.red).toBeCloseTo(expectedColor.red);
    expect(computedColor.green).toBeCloseTo(expectedColor.green);
    expect(computedColor.blue).toBeCloseTo(expectedColor.blue);
    expect(computedColor.alpha).toBeCloseTo(expectedColor.alpha);
  });
});

describe('homogeniseColorsNumber', () => {
  test('Should create lists with same length when current has more colors than target', () => {
    const currentColors = [pink, green, pink, green];
    const targetColors = [pink, green];
    const result = utils.homogeniseColorsNumber(currentColors, targetColors);
    expect(result.currentColor.length).toBe(result.targetColor.length);
  });

  test('Should create lists with same length when current has less colors than target', () => {
    const currentColors = [pink];
    const targetColors = [pink, green, green];
    const result = utils.homogeniseColorsNumber(currentColors, targetColors);
    expect(result.currentColor.length).toBe(result.targetColor.length);
  });

  test('Should not change current and target colors when they have the same length', () => {
    const currentColors = [pink, green];
    const targetColors = [pink, green];
    const result = utils.homogeniseColorsNumber(currentColors, targetColors);
    expect(result.currentColor).toBe(currentColors);
    expect(result.targetColor).toBe(targetColors);
  });

  test('Should not change current colors when there are more color in current graph', () => {
    const currentColors = [pink, green, pink, green];
    const targetColors = [pink, green];
    const result = utils.homogeniseColorsNumber(currentColors, targetColors);
    expect(result.currentColor).toBe(currentColors);
  });

  test('Should not change target colors when there are more color in target graph', () => {
    const currentColors = [pink];
    const targetColors = [pink, green, green];
    const result = utils.homogeniseColorsNumber(currentColors, targetColors);
    expect(result.targetColor).toBe(targetColors);
  });

  test('Should append transparent colors when current color is empty', () => {
    const currentColors = [] as utils.Color[];
    const targetColors = [pink, green, green];
    const result = utils.homogeniseColorsNumber(currentColors, targetColors);
    expect(result.currentColor[0]).toEqual({ ...pink, alpha: 0 });
    expect(result.currentColor[1]).toEqual({ ...green, alpha: 0 });
    expect(result.currentColor[2]).toEqual({ ...green, alpha: 0 });
  });

  test('Should append transparent colors when target color is empty', () => {
    const currentColors = [pink, green, green];
    const targetColors = [] as utils.Color[];
    const result = utils.homogeniseColorsNumber(currentColors, targetColors);
    expect(result.targetColor[0]).toEqual({ ...pink, alpha: 0 });
    expect(result.targetColor[1]).toEqual({ ...green, alpha: 0 });
    expect(result.targetColor[2]).toEqual({ ...green, alpha: 0 });
  });

  test('Should append transparent colors when target has more colors', () => {
    const currentColors = [pink];
    const targetColors = [pink, green, green];
    const result = utils.homogeniseColorsNumber(currentColors, targetColors);
    expect(result.currentColor[0]).toBe(pink);
    expect(result.currentColor[1]).toEqual({ ...green, alpha: 0 });
    expect(result.currentColor[2]).toEqual({ ...green, alpha: 0 });
  });

  test('Should append transparent colors when target has less colors', () => {
    const currentColors = [pink, green, green];
    const targetColors = [pink];
    const result = utils.homogeniseColorsNumber(currentColors, targetColors);
    expect(result.targetColor[0]).toBe(pink);
    expect(result.targetColor[1]).toEqual({ ...green, alpha: 0 });
    expect(result.targetColor[2]).toEqual({ ...green, alpha: 0 });
  });
});

describe('stringifyColor', () => {
  test('Should convert a color to a css string', () => {
    const color = {
      red: 100,
      green: 10,
      blue: 250,
      alpha: 1,
    };
    const expectedValue = 'rgba(100,10,250,1)';

    const cssColor = utils.stringifyColor(color);
    expect(cssColor).toBe(expectedValue);
  });
});

describe('colorAnim.createStep', () => {
  test('Color should change on new step', () => {
    const currentFill = green;
    const fillDiff = { red: 20, green: 20, blue: 20, alpha: 0 };
    const progress = 0.5;
    const nextColor = utils.colorAnim.createStep(currentFill, fillDiff, progress);

    expect(nextColor).not.toEqual(currentFill);
  });
});

describe('colorsAnim.createStep', () => {
  test('Color should change on new step', () => {
    const currentFill = [green];
    const fillDiff = [{ red: 20, green: 20, blue: 20, alpha: 0 }];
    const progress = 0.5;
    const nextColor = utils.colorsAnim.createStep(currentFill, fillDiff, progress);

    expect(nextColor).not.toEqual(currentFill);
  });
});
