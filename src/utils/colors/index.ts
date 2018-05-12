import { Animable, homogenisePush } from '../animations';

export interface ColorMatchers {
  name: string;
  regex: RegExp;
  parse: (matches: RegExpMatchArray) => Color;
}

export interface Color {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export const colorMatchers: ColorMatchers[] = [
  {
    name: 'hexa3',
    regex: /^#([a-f0-9]{3})$/i,
    parse: parseHexa3,
  },
  {
    name: 'hexa4',
    regex: /^#([a-f0-9]{4})$/i,
    parse: parseHexa4,
  },
  {
    name: 'hexa6',
    regex: /^#([a-f0-9]{6})$/i,
    parse: parseHexa6,
  },
  {
    name: 'hexa8',
    regex: /^#([a-f0-9]{8})$/i,
    parse: parseHexa8,
  },
  {
    name: 'rgb',
    regex: /^rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)$/,
    parse: parseRgb,
  },
  {
    name: 'rgba',
    regex: /^rgba\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3}), ?(1|0(\.\d+)?)\)$/,
    parse: parseRgba,
  },
  {
    name: 'hsl',
    regex: /^hsl\((\d{1,3}), ?(\d{1,3}(\.\d+)?)%, ?(\d{1,3}(\.\d+)?)%\)$/,
    parse: parseHsl,
  },
  {
    name: 'hsla',
    regex: /^hsla\((\d{1,3}), ?(\d{1,3}(\.\d+)?)%, ?(\d{1,3}(\.\d+)?)%, ?(1|0(\.\d+)?)\)$/,
    parse: parseHsla,
  },
];

/**
 * Transform hexa3 parsed string to rgba color
 * @param matches - regex matches
 * @return rgba color
 */
export function parseHexa3(matches: RegExpMatchArray): Color {
  const hexaColor = matches[1];
  const hexaRed = hexaColor[0].concat(hexaColor[0]);
  const hexaGreen = hexaColor[1].concat(hexaColor[1]);
  const hexaBlue = hexaColor[2].concat(hexaColor[2]);
  const red = parseInt(hexaRed, 16);
  const green = parseInt(hexaGreen, 16);
  const blue = parseInt(hexaBlue, 16);
  return {
    red,
    green,
    blue,
    alpha: 1,
  };
}

/**
 * Transform hexa4 parsed string to rgba color
 * @param matches - regex matches
 * @return rgba color
 */
export function parseHexa4(matches: RegExpMatchArray): Color {
  const hexaColor = matches[1];
  const hexaRed = hexaColor[0].concat(hexaColor[0]);
  const hexaGreen = hexaColor[1].concat(hexaColor[1]);
  const hexaBlue = hexaColor[2].concat(hexaColor[2]);
  const hexaAlpha = hexaColor[3].concat(hexaColor[3]);
  const red = parseInt(hexaRed, 16);
  const green = parseInt(hexaGreen, 16);
  const blue = parseInt(hexaBlue, 16);
  const alphaBase255 = parseInt(hexaAlpha, 16);
  const alpha = alphaBase255 / 255;
  return {
    red,
    green,
    blue,
    alpha,
  };
}

/**
 * Transform hexa6 parsed string to rgba color
 * @param matches - regex matches
 * @return rgba color
 */
export function parseHexa6(matches: RegExpMatchArray): Color {
  const hexaColor = matches[1];
  const hexaRed = hexaColor.slice(0, 2);
  const hexaGreen = hexaColor.slice(2, 4);
  const hexaBlue = hexaColor.slice(4, 6);
  const red = parseInt(hexaRed, 16);
  const green = parseInt(hexaGreen, 16);
  const blue = parseInt(hexaBlue, 16);
  return {
    red,
    green,
    blue,
    alpha: 1,
  };
}

/**
 * Transform hexa8 parsed string to rgba color
 * @param matches - regex matches
 * @return rgba color
 */
export function parseHexa8(matches: RegExpMatchArray): Color {
  const hexaColor = matches[1];
  const hexaRed = hexaColor.slice(0, 2);
  const hexaGreen = hexaColor.slice(2, 4);
  const hexaBlue = hexaColor.slice(4, 6);
  const hexaAlpha = hexaColor.slice(6, 8);
  const red = parseInt(hexaRed, 16);
  const green = parseInt(hexaGreen, 16);
  const blue = parseInt(hexaBlue, 16);
  const alphaBase255 = parseInt(hexaAlpha, 16);
  const alpha = alphaBase255 / 255;
  return {
    red,
    green,
    blue,
    alpha,
  };
}

/**
 * Transform rgb parsed string to rgba color
 * @param matches - regex matches
 * @return rgba color
 */
export function parseRgb(matches: RegExpMatchArray): Color {
  return {
    red: parseInt(matches[1], 10),
    green: parseInt(matches[2], 10),
    blue: parseInt(matches[3], 10),
    alpha: 1,
  };
}

/**
 * Transform rgba parsed string to rgba color
 * @param matches - regex matches
 * @return rgba color
 */
export function parseRgba(matches: RegExpMatchArray): Color {
  return {
    red: parseInt(matches[1], 10),
    green: parseInt(matches[2], 10),
    blue: parseInt(matches[3], 10),
    alpha: parseFloat(matches[4]),
  };
}

/**
 * Transform hsl parsed string to rgba color
 * @param matches - regex matches
 * @return rgba color
 */
export function parseHsl(matches: RegExpMatchArray): Color {
  const valueGroups = matches.filter(match => match && match.charAt(0) !== '.');
  const hue = parseInt(valueGroups[1], 10);
  const saturation = parseFloat(valueGroups[2]);
  const lightness = parseFloat(valueGroups[3]);

  return hslToRgb(hue, saturation, lightness);
}

/**
 * Transform hsla parsed string to rgba color
 * @param matches - regex matches
 * @return rgba color
 */
export function parseHsla(matches: RegExpMatchArray): Color {
  const valueGroups = matches.filter(match => match && match.charAt(0) !== '.');
  const hue = parseInt(valueGroups[1], 10);
  const saturation = parseFloat(valueGroups[2]);
  const lightness = parseFloat(valueGroups[3]);
  const alpha = parseFloat(valueGroups[4]);

  const color = hslToRgb(hue, saturation, lightness);
  return { ...color, alpha };
}

/**
 * Convert hsl color to rgb
 * @param hue - from 0 to 360 color hue
 * @param saturation - from 0 to 100 color saturation
 * @param lightness - from 0 to 100 color lightness
 * @return rgb color
 */
export function hslToRgb(hue: number, saturation: number, lightness: number): Color {
  if (saturation === 0) {
    const colorLevel = Math.round(lightness / 100 * 255);
    return { red: colorLevel, green: colorLevel, blue: colorLevel, alpha: 1 };
  }
  const third = 1 / 3;
  const h = hue / 360;
  const s = saturation / 100;
  const l = lightness / 100;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const red = Math.round(hueToRgb(p, q, h + third) * 255);
  const green = Math.round(hueToRgb(p, q, h) * 255);
  const blue = Math.round(hueToRgb(p, q, h - third) * 255);

  return {
    red,
    green,
    blue,
    alpha: 1,
  };
}

/**
 * Compute color value
 * @param p
 * @param q
 * @param t
 * @return color level between 0 and 1
 */
export function hueToRgb(p: number, q: number, t: number): number {
  let u = t;
  if (u < 0) u += 1;
  if (u > 1) u -= 1;
  if (u < 1 / 6) return p + (q - p) * 6 * t;
  if (u < 1 / 2) return q;
  if (u < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

/**
 * Parse a string to a color. Accepted format are :
 * - hexa3
 * - hexa4
 * - hexa6
 * - hexa8
 * - rgb
 * - rgba
 * - hsl
 * - hsla
 * @param color - color string
 * @return rgba color
 */
export function parseColor(color: string): Color {
  function tryMatcher(matchers: ColorMatchers[]): Color {
    if (matchers.length === 0) {
      console.warn(`Warning: color '${color}' has an invalid format`);
      return {
        red: 0,
        green: 0,
        blue: 0,
        alpha: 0,
      };
    }
    const [matcher, ...otherMatchers] = matchers;
    const colorMatches = color.match(matcher.regex);
    if (colorMatches) {
      return matcher.parse(colorMatches);
    }
    return tryMatcher(otherMatchers);
  }

  return tryMatcher(colorMatchers);
}

/**
 * Add a color to another
 * @param color1
 * @param color2
 * @return new color
 */
export function addColor(color1: Color, color2: Color): Color {
  return {
    red: color1.red + color2.red,
    green: color1.green + color2.green,
    blue: color1.blue + color2.blue,
    alpha: color1.alpha + color2.alpha,
  };
}

/**
 * Subtract a color by another
 * @param color1
 * @param color2
 * @return new color
 */
export function subsctractColor(color1: Color, color2: Color): Color {
  return {
    red: color1.red - color2.red,
    green: color1.green - color2.green,
    blue: color1.blue - color2.blue,
    alpha: color1.alpha - color2.alpha,
  };
}

/**
 * Multiply each color component by a value
 * @param color
 * @param value
 * @return new color
 */
export function multiplyColorBy(color: Color, value: number): Color {
  return {
    red: Math.round(color.red * value),
    green: Math.round(color.green * value),
    blue: Math.round(color.blue * value),
    alpha: color.alpha * value,
  };
}

/**
 * Homogenise the number of current colors with the number of target colors
 * @param currentColor - current graph color
 * @param targetColor - target graph color
 * @return list of current colors and target colors with the same lenght
 */
export function homogeniseColorsNumber(
  currentColor: Color[],
  targetColor: Color[],
): { currentColor: Color[]; targetColor: Color[] } {
  const nbAddedColors = targetColor.length - currentColor.length;

  if (nbAddedColors > 0) {
    const firstNewColorIndex = targetColor.length - nbAddedColors;
    const colorsToDuplicate = targetColor.slice(firstNewColorIndex);
    const colorsToConcat = colorsToDuplicate.map(color => ({ ...color, alpha: 0 }));
    return { targetColor, currentColor: currentColor.concat(colorsToConcat) };
  }
  if (nbAddedColors < 0) {
    const firstNewColorIndex = currentColor.length + nbAddedColors;
    const colorsToDuplicate = currentColor.slice(firstNewColorIndex);
    const colorsToConcat = colorsToDuplicate.map(color => ({ ...color, alpha: 0 }));
    return { currentColor, targetColor: targetColor.concat(colorsToConcat) };
  }

  return { currentColor, targetColor };
}

/**
 * Transform a Color to a string for css or canvas
 * @param color - color to stringify
 * @return color to rgba format
 */
export function stringifyColor(color: Color): string {
  return `rgba(${color.red},${color.green},${color.blue},${color.alpha})`;
}

export const colorAnim: Animable<string, Color, string> = {
  formatInput(input) {
    return parseColor(input);
  },
  formatRenderable(renderable) {
    return parseColor(renderable);
  },
  formatToRenderable(computable) {
    return stringifyColor(computable);
  },
  homogenise(current, target) {
    return { current, target };
  },
  computeDiff(currentColor, targetColor) {
    return subsctractColor(targetColor, currentColor);
  },
  createStep(initialColor, colorDiff, progress) {
    const stepSize = multiplyColorBy(colorDiff, progress);
    const stepColor = addColor(initialColor, stepSize);
    return stringifyColor(stepColor);
  },
};

export const colorsAnim: Animable<string | string[], Color[], string[]> = {
  formatInput(input) {
    if (typeof input === 'string') {
      return [parseColor(input)];
    }
    return input.map(parseColor);
  },
  formatRenderable(renderable) {
    return renderable.map(parseColor);
  },
  formatToRenderable(computable) {
    return computable.map(stringifyColor);
  },
  homogenise(current, target) {
    return homogenisePush(current, target, color => ({ ...color, alpha: 0 }));
  },
  computeDiff(currentColors, targetColors) {
    const fillDiffs = currentColors.map((currentColor, index) => {
      const targetColor = targetColors[index];
      return subsctractColor(targetColor, currentColor);
    });

    return fillDiffs;
  },
  createStep(initialColors, colorDiffs, progress) {
    const stepFill = initialColors.map((color, index) => {
      const colorDiff = colorDiffs[index];
      const stepSize = multiplyColorBy(colorDiff, progress);
      const stepColor = addColor(color, stepSize);
      return stringifyColor(stepColor);
    });

    return stepFill;
  },
};
