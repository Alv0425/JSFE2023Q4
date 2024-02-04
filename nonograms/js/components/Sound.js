export class Sound {
  constructor() {
    this.soundWin = new Audio("./assets/sounds/win.webm");
    this.soundBlack = new Audio("./assets/sounds/fill.wav");
    this.soundCross = new Audio("./assets/sounds/cross.wav");
    this.soundEmpty = new Audio("./assets/sounds/empty.wav");
  }
  playWin(isMuted) {
    this.soundWin.muted = isMuted;
    this.currentTime = 0;
    this.soundWin.play();
  }
  playFill(isMuted) {
    this.soundBlack.muted = isMuted;
    this.currentTime = 0;
    this.soundBlack.play();
  }
  playEmpty(isMuted) {
    this.soundEmpty.muted = isMuted;
    this.currentTime = 0;
    this.soundEmpty.play();
  }
  playCross(isMuted) {
    this.soundCross.muted = isMuted;
    this.currentTime = 0;
    this.soundCross.play();
  }
}
