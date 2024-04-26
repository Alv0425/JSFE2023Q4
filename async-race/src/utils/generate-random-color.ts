function generateRandomColor(): string {
  const hexAlphabet = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];
  const colorArray = new Array(6).fill("").map(() => hexAlphabet[Math.round(Math.random() * (hexAlphabet.length - 1))]);
  return `#${colorArray.join("")}`;
}

export default generateRandomColor;
