const fakeCanvas = document.createElement('canvas');
const fakeCtx = fakeCanvas.getContext('2d');
const textHeightCache: { [key: string]: number } = {};

export function measureText(font: string, text: string): { width: number; height: number } {
  return {
    width: getTextWidth(font, text),
    height: getTextHeight(font),
  };
}

/**
 * Get width of a text in a canvas by using a canvas which is not append to DOM
 * @param font - text font style
 * @param text - text to measure
 * @return text width
 */
export function getTextWidth(font: string, text: string): number {
  if (fakeCtx) {
    fakeCtx.font = font;
    return fakeCtx.measureText(text).width;
  }
  return 0;
}

// tslint:disable max-line-length
/**
 * Compute height of text using a specific font.
 * This function get height between top and base line.
 * WARNING : don't use it to much because some DOM mutation are done to get height
 * this function is inspire by those posts:
 * https://videlais.com/2014/03/16/the-many-and-varied-problems-with-measuring-font-height-for-html5-canvas/
 * https://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
 * @param font - text font style
 * @return height of text using the params font
 */
// tslint:enable
export function getTextHeight(font: string): number {
  if (!textHeightCache[font]) {
    const fakeContainer = document.createElement('div');
    const fakeText = document.createElement('span');
    const fakeBlock = document.createElement('div');
    fakeText.innerHTML = 'Hg';
    fakeContainer.style.font = font;
    fakeContainer.style.lineHeight = '1';
    fakeContainer.style.position = 'absolute';
    fakeContainer.style.top = '-9999';
    fakeContainer.style.left = '-9999';
    fakeBlock.style.display = 'inline-block';
    fakeBlock.style.width = '1';
    fakeBlock.style.height = '0';
    fakeBlock.style.verticalAlign = 'baseline';

    fakeContainer.appendChild(fakeText);
    fakeContainer.appendChild(fakeBlock);
    document.body.appendChild(fakeContainer);
    const height = fakeBlock.offsetTop;
    document.body.removeChild(fakeContainer);

    // use cache to avoid to much DOM manipulation to compute font height
    // when font style didn't change
    textHeightCache[font] = height;
  }

  return textHeightCache[font];
}
