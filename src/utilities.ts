/** Generates a sequence of integers in `[min,max]`. */
export function* integers(min: number, max: number, step = 1) {
  for (let i = min; i <= max; i += step) {
    yield i;
  }
}

export const sleep = async (timeout: number): Promise<void> =>
  new Promise<void>((resolve) => setTimeout(resolve, timeout));
