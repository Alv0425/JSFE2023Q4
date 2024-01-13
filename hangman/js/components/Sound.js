export class Sound {
  constructor(type, isMuted) {
    this.type = type;
    this.sound = null;
    this.isMuted = isMuted;
  }
  createSound() {
    this.sound = new Audio();
    this.sound.volume = 0.3;
    this.sound.muted = this.isMuted;
    document.body.addEventListener("mutetoggle", () => {
      this.sound.muted = !this.sound.muted;
    });
    switch (this.type) {
      case "line":
        this.sound.src = "./assets/sounds/nline.webm";
        break;
      case "circle":
        this.sound.src = "./assets/sounds/circle.webm";
        break;
      case "letter":
        this.sound.src = "./assets/sounds/letter.webm";
        break;
      case "erase":
        this.sound.src = "./assets/sounds/erase.webm";
        break;
      case "win":
        this.sound.src = "./assets/sounds/win.webm";
        this.sound.volume = 0.2;
        break;
      case "lose":
        this.sound.src = "./assets/sounds/lose.webm";
        this.sound.volume = 0.2;
        break;
    }
    this.sound.load();
  }
  playSound() {
    this.sound.play();
  }
}
