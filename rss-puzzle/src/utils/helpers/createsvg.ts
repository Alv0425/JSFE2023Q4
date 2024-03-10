function createSvg(url: string, classname: string) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add(classname);
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", url);
  svg.append(use);
  return svg;
}

export default createSvg;
