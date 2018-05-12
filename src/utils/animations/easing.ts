export type Ease = 'linear' | 'quad' | 'elastic' | 'bounce';

/**
 * Get ease function for animations
 * @param ease - ease function to get
 * @return ease function
 */
export function getEaseFunction(ease: Ease = 'quad'): (t: number) => number {
  switch (ease) {
    case 'linear':
      return linear;
    case 'quad':
      return easeOutQuad;
    case 'elastic':
      return easeOutElastic;
    case 'bounce':
      return easeOutBounce;
  }
}

export function linear(t: number): number {
  return t;
}

export function easeOutQuad(t: number): number {
  return t * (2 - t);
}

export function easeOutElastic(t: number): number {
  const p = 0.5;
  return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
}

export function easeOutBounce(t: number): number {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  }
  if (t < 2 / 2.75) {
    const u = t - 1.5 / 2.75;
    return 7.5625 * u * u + 0.75;
  }
  if (t < 2.5 / 2.75) {
    const u = t - 2.25 / 2.75;
    return 7.5625 * u * u + 0.9375;
  }
  const u = t - 2.625 / 2.75;
  return 7.5625 * u * u + 0.984375;
}
