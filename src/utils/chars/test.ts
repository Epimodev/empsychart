import * as utils from './';
import * as animationUtils from '../animations';

describe('charToNumber', () => {
  test('Should transform char to number', () => {
    expect(utils.charToNumber('0')).toBe(0);
    expect(utils.charToNumber('.')).toBe(10);
    expect(utils.charToNumber('d')).toBe(15);
    expect(utils.charToNumber('t')).toBe(31);
    expect(utils.charToNumber('*')).toBe(-42);
  });
});

describe('numberToChar', () => {
  test('Should return associated string', () => {
    expect(utils.numberToChar(0)).toBe('0');
    expect(utils.numberToChar(10)).toBe('.');
    expect(utils.numberToChar(15)).toBe('d');
    expect(utils.numberToChar(31)).toBe('t');
    expect(utils.numberToChar(-42)).toBe('*');
  });
});

describe('charsAnim.createStep', () => {
  test('Should create correct steps with progress changes', () => {
    const initialStr = '0';
    const targetStr = '.';
    const initialComputable = utils.charsAnim.formatInput(initialStr);
    const targetComputable = utils.charsAnim.formatInput(targetStr);
    const strDiff = utils.charsAnim.computeDiff(initialComputable, targetComputable);

    expect(utils.charsAnim.createStep(initialComputable, strDiff, 0)).toBe('0');
    expect(utils.charsAnim.createStep(initialComputable, strDiff, 0.1)).toBe('1');
    expect(utils.charsAnim.createStep(initialComputable, strDiff, 0.2)).toBe('2');
    expect(utils.charsAnim.createStep(initialComputable, strDiff, 0.3)).toBe('3');
    expect(utils.charsAnim.createStep(initialComputable, strDiff, 0.4)).toBe('4');
    expect(utils.charsAnim.createStep(initialComputable, strDiff, 0.5)).toBe('5');
    expect(utils.charsAnim.createStep(initialComputable, strDiff, 0.6)).toBe('6');
    expect(utils.charsAnim.createStep(initialComputable, strDiff, 0.7)).toBe('7');
    expect(utils.charsAnim.createStep(initialComputable, strDiff, 0.73)).toBe('7');
    expect(utils.charsAnim.createStep(initialComputable, strDiff, 0.8)).toBe('8');
    expect(utils.charsAnim.createStep(initialComputable, strDiff, 0.9)).toBe('9');
    expect(utils.charsAnim.createStep(initialComputable, strDiff, 1)).toBe('.');
  });

  test('Should create 9 steps of a char', () => {
    const duration = 144; // 1 frame of 16ms * 9
    const initialStr = '0';
    const targetStr = '9';
    const targetComputable = utils.charsAnim.formatInput(targetStr);

    const animationStack = animationUtils.createAnimationStack(
      utils.charsAnim,
      initialStr,
      targetComputable,
      duration,
      'linear',
    );
    const expectedStack = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

    expect(animationStack.length).toEqual(expectedStack.length);
    expect(animationStack).toEqual(expectedStack);
  });

  test('Should create 9 steps of a string', () => {
    const duration = 144; // 1 frame of 16ms * 9
    const initialStr = 'aa';
    const targetStr = 'jj';
    const targetComputable = utils.charsAnim.formatInput(targetStr);

    const animationStack = animationUtils.createAnimationStack(
      utils.charsAnim,
      initialStr,
      targetComputable,
      duration,
      'linear',
    );
    const expectedStack = ['bb', 'cc', 'dd', 'ee', 'ff', 'gg', 'hh', 'ii', 'jj'];

    expect(animationStack.length).toEqual(expectedStack.length);
    expect(animationStack).toEqual(expectedStack);
  });
});
