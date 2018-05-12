import { Animable, homogenisePush } from '../animations';

const charsList = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '.',
  ' ',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

/**
 * Convert a char to a number
 * @param char - string with only one char to convert
 * @return the corresponding number of char param
 */
export function charToNumber(char: string): number {
  const charIndex = charsList.indexOf(char);
  if (charIndex >= 0) {
    return charIndex;
  }
  return -char.charCodeAt(0);
}

/**
 * Convert a number to a string with 1 char
 * @param value - number to convert
 * @return the char corresponding to value param
 */
export function numberToChar(value: number): string {
  if (value >= 0) {
    return charsList[value] || ' ';
  }
  return String.fromCharCode(-value);
}

export const charsAnim: Animable<string, number[], string> = {
  formatInput(input) {
    return input.split('').map(charToNumber);
  },
  formatRenderable(renderable) {
    return renderable.split('').map(charToNumber);
  },
  formatToRenderable(computable) {
    return computable.map(numberToChar).join('');
  },
  homogenise(current, target) {
    return homogenisePush(current, target);
  },
  computeDiff(currentCharCodes, targetCharCodes) {
    const charsDiffs = currentCharCodes.map((currentCharCode, index) => {
      const targetCharCode = targetCharCodes[index];
      return targetCharCode - currentCharCode;
    });

    return charsDiffs;
  },
  createStep(initialCharCodes, charsDiffs, progress) {
    const stepValue = initialCharCodes.map((charCode, index) => {
      const charDiff = charsDiffs[index];
      const stepSize = charDiff * progress;
      const stepCharCode = Math.round(charCode + stepSize);
      return numberToChar(stepCharCode);
    });

    return stepValue.join('');
  },
};
