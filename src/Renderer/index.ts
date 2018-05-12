export const pixelRatio = devicePixelRatio || 1;

export default abstract class Renderer<T> {
  abstract render(data: T): void;
}
