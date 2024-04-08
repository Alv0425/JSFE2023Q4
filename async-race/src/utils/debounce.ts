function debounce(f: (...parameters: unknown[]) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout> = setTimeout(() => {});
  return function debounced(this: unknown, ...parameters: unknown[]) {
    clearTimeout(timer);
    timer = setTimeout(() => f.apply(this, parameters), delay);
  };
}

export default debounce;
