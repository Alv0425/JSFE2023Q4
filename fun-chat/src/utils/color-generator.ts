function generateColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + hash * 31;
  }
  const h = hash % 360;
  return `hsl(${h}, ${30}%, ${70}%)`;
}

export default generateColor;
