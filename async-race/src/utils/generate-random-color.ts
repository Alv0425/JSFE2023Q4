function generateRandoColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

export default generateRandoColor;
