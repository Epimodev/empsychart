import { Animable } from '../animations';

export const numberAnim: Animable<number, number, number> = {
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
  computeDiff(currentValue, targetValue) {
    return targetValue - currentValue;
  },
  createStep(initialValue, diff, progress) {
    return initialValue + diff * progress;
  },
};
