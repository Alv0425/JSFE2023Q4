export class Human {
  constructor() {
    this.state = 0;
    this.head = null;
    this.body = null;
    this.leftHand = null;
    this.rightHand = null;
    this.leftLeg = null;
    this.rightLeg = null;
    this.parts = [];
    this.all = null;
  }
  render() {
    const svgHuman = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgHuman.classList.add('human');
    this.head = this.createPath(
      "M217.58 62.73c-1.73,-0.12 -3.17,0.2 -5.02,1.08 -1.85,0.89 -4.1,2.33 -5.86,3.78 -1.77,1.44 -3.05,2.89 -3.9,4.42 -0.84,1.52 -1.24,3.13 -1.56,5.38 -0.33,2.24 -0.57,5.14 -0.08,7.51 0.48,2.36 1.68,4.21 3.33,5.82 1.65,1.6 3.73,2.97 6.26,3.97 2.53,1.01 5.5,1.65 8.31,1.65 2.81,0 5.47,-0.64 7.91,-2.09 2.45,-1.45 4.7,-3.69 6.27,-5.74 1.56,-2.05 2.45,-3.9 2.85,-5.82 0.4,-1.93 0.32,-3.94 -0.12,-5.78 -0.44,-1.85 -1.25,-3.54 -2.41,-5.31 -1.17,-1.76 -2.69,-3.61 -4.46,-4.89 -1.76,-1.29 -3.77,-2.01 -5.78,-2.65 -2.01,-0.65 -4.02,-1.21 -5.74,-1.33"
    );
    this.body = this.createPath(
      "M217.77 96.29c-0.23,4.94 -0.45,9.87 -0.36,14.78 0.1,4.91 0.53,9.8 0.53,14.52 0,4.73 -0.43,9.3 -0.8,13.07 -0.37,3.77 -0.69,6.74 -0.85,9.98 -0.16,3.24 -0.16,6.74 -0.22,9.12 -0.06,2.37 -0.17,3.61 -0.29,4.85"
    );
    this.leftHand = this.createPath(
      "M216.82 107.72c-1.25,2.29 -2.5,4.58 -4.38,8.18 -1.87,3.59 -4.37,8.49 -6.23,11.96 -1.85,3.47 -3.07,5.52 -4.56,8.21 -1.5,2.69 -3.27,6.02 -4.36,7.99 -1.09,1.96 -1.51,2.55 -1.82,3.17 -0.32,0.63 -0.52,1.29 -0.92,2.05 -0.4,0.76 -0.99,1.63 -1.53,2.55 -0.54,0.92 -1.03,1.9 -1.37,2.76 -0.35,0.87 -0.56,1.63 -1.06,2.75 -0.5,1.11 -1.3,2.56 -2.1,4.02"
    );
    this.rightHand = this.createPath(
      "M218.49 109.18c1.11,1.73 2.22,3.47 3.66,5.54 1.44,2.06 3.21,4.46 4.32,6.18 1.11,1.72 1.56,2.76 2.1,3.92 0.54,1.16 1.17,2.45 1.69,3.37 0.52,0.92 0.93,1.47 1.37,2.26 0.43,0.78 0.88,1.78 1.8,3.29 0.92,1.51 2.31,3.53 3.79,5.96 1.47,2.43 3.04,5.27 4.46,7.62 1.42,2.34 2.71,4.18 3.75,5.68 1.04,1.49 1.84,2.63 2.64,3.78"
    );
    this.rightLeg = this.createPath(
      "M215.78 162.61c0.65,2.52 1.31,5.04 2.03,7.79 0.71,2.75 1.49,5.74 2.09,8.61 0.6,2.87 1.01,5.62 1.45,8.17 0.43,2.55 0.89,4.89 1.47,7.55 0.57,2.67 1.26,5.65 2.09,8.86 0.82,3.22 1.79,6.66 2.57,9.83 0.78,3.17 1.38,6.06 1.97,9.3 0.6,3.24 1.2,6.82 1.75,9.23 0.55,2.41 1.05,3.65 1.7,5.69 0.64,2.05 1.42,4.89 2.2,7.74"
    );
    this.leftLeg = this.createPath(
      "M215.98 160.19c-1.53,4.29 -3.05,8.58 -3.97,11.87 -0.92,3.3 -1.25,5.59 -1.8,7.75 -0.55,2.16 -1.33,4.18 -1.83,6.24 -0.51,2.07 -0.74,4.18 -1.2,6.2 -0.46,2.02 -1.15,3.95 -1.65,6.5 -0.51,2.55 -0.83,5.72 -1.33,8.77 -0.51,3.06 -1.2,5.99 -1.82,9.35 -0.62,3.35 -1.17,7.11 -1.67,10.1 -0.51,2.98 -0.97,5.19 -1.45,7.71 -0.48,2.53 -0.98,5.37 -1.42,7.78 -0.44,2.42 -0.81,4.39 -1.17,6.36"
    );
    const bodyParts = [this.head, this.body, this.leftHand, this.rightHand, this.leftLeg, this.rightLeg];
    bodyParts.forEach((part) => {
      part.classList.add("human__part");
    });
    svgHuman.setAttribute('fill', 'none');
    svgHuman.setAttribute('viewBox', "0 0 300 300");
    svgHuman.setAttribute('stroke', 'white');
    svgHuman.append(...bodyParts);
    this.parts.push(...bodyParts);
    this.all = svgHuman;
    return svgHuman;
  }
  createPath(d) {
    const path = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    path.setAttribute('d', d);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-width', '4');
    return path;
  }
  erase() {
    const eraser = this.createPath(
      "M175.74 255.49c24.13,-54.86 48.25,-109.71 50.19,-134.27 1.94,-24.56 -18.31,-18.82 -29.8,-11.11 -11.5,7.72 -14.25,17.41 -3.42,22.99 10.82,5.57 35.22,7.02 44.91,20.68 9.7,13.65 4.69,39.5 -11.3,52.91 -16,13.41 -42.98,14.38 -50.49,3.39 -7.5,-10.99 4.48,-33.94 20.88,-56.8 16.4,-22.87 37.22,-45.64 41.3,-58.59 4.09,-12.95 -8.57,-16.07 -20.69,-16.07 -12.12,0 -23.7,3.12 -18.1,26.34 5.61,23.21 28.39,66.51 37.52,94.62 9.13,28.12 4.6,41.04 -8.57,43.3 -13.17,2.27 -34.98,-6.14 -43.7,-14.62 -8.73,-8.48 -4.36,-17.04 7.92,-18.42 12.27,-1.37 32.47,4.45 52.67,10.26"
    );
    eraser.setAttribute('stroke', '#271033');
    eraser.setAttribute('stroke-width', '35');
    eraser.classList.add("human__eraser");
    this.all.append(eraser);
    eraser.addEventListener('animationend', () => {
      this.all.remove();
    })
  }
}