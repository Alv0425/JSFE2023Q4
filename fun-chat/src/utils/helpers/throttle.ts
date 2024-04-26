export default function throttle(fn: () => void, delay: number): () => void {
  let timeout: NodeJS.Timeout | null = null;
  return (): void => {
    if (timeout === null) {
      fn();
      timeout = setTimeout(() => {
        timeout = null;
      }, delay);
    }
  };
}
