import { Ease, getEaseFunction } from './easing';

export const FRAME_DURATION = 16; // milliseconds => 60 fps

/**
 * Interface which define needed functions to create an animation
 * @param I - (Input) define the API exposed
 * @param C - (Computable) define a format optimized for step computation
 * @param R - (Renderable) define a format optimized for render
 */
export interface Animable<I, C, R> {
  formatInput: (input: I) => C;
  formatRenderable: (renderable: R) => C;
  formatToRenderable: (computable: C) => R;
  homogenise: (initial: C, target: C) => { current: C; target: C };
  computeDiff: (initial: C, target: C) => C;
  createStep: (initial: C, diff: C, progress: number) => R;
}

export type AnimableFields<I, C, R> = { [key: string]: Animable<I, C, R> };

/**
 * Homogenise 2 lists by push in shorter list a default item or the last item
 * @param currentList - current list of items
 * @param targetList - target list of items
 * @param defaultItem - item to push in shorter list
 */
export function homogenisePush<T>(
  currentList: T[],
  targetList: T[],
  formatPushed?: (item: T, index: number, array: T[]) => T,
): { current: T[]; target: T[] } {
  const nbAddedItems = targetList.length - currentList.length;

  if (nbAddedItems > 0) {
    const firstNewItemIndex = targetList.length - nbAddedItems;
    const itemsToDuplicate = targetList.slice(firstNewItemIndex);
    const itemsToConcat = formatPushed ? itemsToDuplicate.map(formatPushed) : itemsToDuplicate;
    return { current: currentList.concat(itemsToConcat), target: targetList };
  }
  if (nbAddedItems < 0) {
    const firstNewItemIndex = currentList.length + nbAddedItems;
    const itemsToDuplicate = currentList.slice(firstNewItemIndex);
    const itemsToConcat = formatPushed ? itemsToDuplicate.map(formatPushed) : itemsToDuplicate;
    return { current: currentList, target: targetList.concat(itemsToConcat) };
  }

  return {
    current: currentList,
    target: targetList,
  };
}

/**
 * Adapt current list or target list to have 2 lists with the same length
 * with new items scatter from center
 * @param currentPoints - current points on graph
 * @param targetPoints - points to display at the end of animation
 * @return current points and target points list with the same length
 */
export function homogeniseScatter<T>(
  currentList: T[],
  targetList: T[],
  formatAdded?: (item: T) => T,
): { current: T[]; target: T[] } {
  const nbDiff = targetList.length - currentList.length;
  if (nbDiff > 0) {
    const newCurrentList =
      currentList.length > 0
        ? addScatterItems(currentList, nbDiff)
        : createListOfFirst(targetList, formatAdded);
    return {
      current: newCurrentList,
      target: targetList,
    };
  }

  if (nbDiff < 0) {
    const newTargetList =
      targetList.length > 0
        ? addScatterItems(targetList, -nbDiff)
        : createListOfFirst(currentList, formatAdded);
    return {
      current: currentList,
      target: newTargetList,
    };
  }

  return {
    current: currentList,
    target: targetList,
  };
}

/**
 * Add items scatter from center to a list
 * @param items - list which need new items
 * @param nbItems - number of points to add
 * @return list with items dupplicated
 */
export function addScatterItems<T>(items: T[], nbItems: number, formatAdded?: (item: T) => T): T[] {
  const halfIndex = Math.floor(items.length / 2);
  const nbDuplicateForEach = Math.floor(nbItems / items.length);
  const nbItemsDuplicatedOneMore = nbItems % items.length;
  const halfNbItemsDuplicatedOneMore = nbItemsDuplicatedOneMore / 2;
  const firstIndexToDuplicate = halfIndex - halfNbItemsDuplicatedOneMore;
  const lastIndexToDuplicate = halfIndex + nbItemsDuplicatedOneMore - halfNbItemsDuplicatedOneMore;
  const newPoints = items.reduce(
    (acc, item, index) => {
      const isDuplicateOneMore = index >= firstIndexToDuplicate && index < lastIndexToDuplicate;
      const nbPointToAdd = isDuplicateOneMore ? nbDuplicateForEach + 1 : nbDuplicateForEach;

      const emptyArray: undefined[] = Array.apply(null, Array(nbPointToAdd));
      const pointsToAdd = emptyArray.map(() => (formatAdded ? formatAdded(item) : item));
      return [...acc, item, ...pointsToAdd];
    },
    [] as T[],
  );

  return newPoints;
}

/**
 * Create a list from a list and replace all items by the first item of the original list
 * @param list - original list
 * @param format - function which transform the item the insert
 * @return list where all items are replace by the first item of the list
 */
function createListOfFirst<T>(list: T[], format?: (item: T) => T): T[] {
  const listItem = format ? format(list[0]) : list[0];
  return list.map(() => listItem);
}

/**
 * Create a list of each item to render in each frame for animation
 * @param param0 - object animation utils
 * @param current - displayed object
 * @param target - object to display
 * @param duration - animation duration
 * @param ease - animation ease
 * @return list of items ready to render
 */
export function createAnimationStack<C, R>(
  {
    formatRenderable,
    formatToRenderable,
    homogenise,
    computeDiff,
    createStep,
  }: Animable<any, C, R>,
  current: R,
  target: C,
  duration: number,
  ease?: Ease,
): R[] {
  const easeFunc = getEaseFunction(ease);
  const nbSteps = Math.ceil(duration / FRAME_DURATION);

  const currentForCompute = formatRenderable(current);

  const { current: homogenisedCurrent, target: homogenisedTarget } = homogenise(
    currentForCompute,
    target,
  );
  const diff = computeDiff(homogenisedCurrent, homogenisedTarget);

  const stackRange: undefined[] = Array.apply(null, Array(nbSteps));
  const stack = stackRange.map((_: undefined, index: number) => {
    const step = index + 1;
    const isLastStep = step === nbSteps;

    if (isLastStep) {
      const stepData = formatToRenderable(target);
      return stepData;
    }

    const progress = step / nbSteps;
    const easeProgress = easeFunc(progress);
    const stepData = createStep(homogenisedCurrent, diff, easeProgress);

    return stepData;
  });

  return stack;
}

/**
 * Aggregate all formatRenderable functions for an object to make object animation easier to create.
 * WARNING : this function isn't stricted type.
 * You must have in your animableFields all fields of the object you want to animate.
 * @param animableFields - fields which are animable
 * @return function which format renderable object
 */
export function aggregateFormatRenderable(
  animableFields: AnimableFields<any, any, any>,
  unAnimableKeys: string[],
) {
  const animableKeys = Object.keys(animableFields);
  return (renderable: any): any => {
    const animableValues = animableKeys.reduce((acc, key) => {
      const valueToFormat = renderable[key];
      const animationUtils = animableFields[key];
      const formattedValue = animationUtils.formatRenderable(valueToFormat);
      return { ...acc, [key]: formattedValue };
    }, {});
    const unAnimableValues = unAnimableKeys.reduce((acc, key) => {
      return { ...acc, [key]: renderable[key] };
    }, {});

    return { ...animableValues, ...unAnimableValues };
  };
}

/**
 * Aggregate all formatToRenderable functions for an object
 * to make object animation easier to create.
 * WARNING : this function isn't stricted type.
 * You must have in your animableFields all fields of the object you want to animate.
 * @param animableFields - fields which are animable
 * @return function which format to renderable object
 */
export function aggregateFormatToRenderable(
  animableFields: AnimableFields<any, any, any>,
  unAnimableKeys: string[],
) {
  const animableKeys = Object.keys(animableFields);
  return (computable: any): any => {
    const animableValues = animableKeys.reduce((acc, key) => {
      const valueToFormat = computable[key];
      const animationUtils = animableFields[key];
      const formattedValue = animationUtils.formatToRenderable(valueToFormat);
      return { ...acc, [key]: formattedValue };
    }, {});
    const unAnimableValues = unAnimableKeys.reduce((acc, key) => {
      return { ...acc, [key]: computable[key] };
    }, {});

    return { ...animableValues, ...unAnimableValues };
  };
}

/**
 * Aggregate all homogenise functions for an object to make object animation easier to create.
 * WARNING : this function isn't stricted type.
 * You must have in your animableFields all fields of the object you want to animate.
 * @param animableFields - fields which are animable
 * @return function which homogenise each field of object
 */
export function aggregateHomogenise(
  animableFields: AnimableFields<any, any, any>,
  unAnimableKeys: string[],
) {
  const animableKeys = Object.keys(animableFields);
  return (initialValues: any, targetValues: any): { current: any; target: any } => {
    const animableValues = animableKeys.reduce(
      ({ current, target }, key) => {
        const initialValue = initialValues[key];
        const targetValue = targetValues[key];
        const animationUtils = animableFields[key];
        const { current: currentKeyValue, target: targetKeyValue } = animationUtils.homogenise(
          initialValue,
          targetValue,
        );
        return {
          current: { ...current, [key]: currentKeyValue },
          target: { ...target, [key]: targetKeyValue },
        };
      },
      { current: {}, target: {} },
    );
    const unAnimableValues = unAnimableKeys.reduce(
      ({ current, target }, key) => {
        return {
          current: { ...current, [key]: initialValues[key] },
          target: { ...target, [key]: targetValues[key] },
        };
      },
      { current: {}, target: {} },
    );

    return {
      current: { ...animableValues.current, ...unAnimableValues.current },
      target: { ...animableValues.target, ...unAnimableValues.target },
    };
  };
}

/**
 * Aggregate all computeDiff functions for an object to make object animation easier to create.
 * WARNING : this function isn't stricted type.
 * You must have in your animableFields all fields of the object you want to animate.
 * @param animableFields - fields which are animable
 * @return function which compute diff of each field of object
 */
export function aggregateComputeDiff(
  animableFields: AnimableFields<any, any, any>,
  unAnimableKeys: string[],
) {
  const animableKeys = Object.keys(animableFields);
  return (initial: any, target: any): any => {
    const animableValues = animableKeys.reduce((acc, key) => {
      const initialValue = initial[key];
      const targetValue = target[key];
      const animationUtils = animableFields[key];
      const valueDiff = animationUtils.computeDiff(initialValue, targetValue);
      return { ...acc, [key]: valueDiff };
    }, {});
    const unAnimableValues = unAnimableKeys.reduce((acc, key) => {
      return { ...acc, [key]: target[key] };
    }, {});

    return { ...animableValues, ...unAnimableValues };
  };
}

/**
 * Aggregate all createStep functions for an object to make object animation easier to create.
 * WARNING : this function isn't stricted type.
 * You must have in your animableFields all fields of the object you want to animate.
 * @param animableFields - fields which are animable
 * @return function which create an animation step of object
 */
export function aggregateCreateStep(
  animableFields: AnimableFields<any, any, any>,
  unAnimableKeys: string[],
) {
  const animableKeys = Object.keys(animableFields);
  return (initial: any, diff: any, progress: number): any => {
    const animableValues = animableKeys.reduce((acc, key) => {
      const initialValue = initial[key];
      const diffValue = diff[key];
      const animationUtils = animableFields[key];
      const stepValue = animationUtils.createStep(initialValue, diffValue, progress);
      return { ...acc, [key]: stepValue };
    }, {});
    const unAnimableValues = unAnimableKeys.reduce((acc, key) => {
      return { ...acc, [key]: diff[key] };
    }, {});

    return { ...animableValues, ...unAnimableValues };
  };
}
