export class Sound {
  constructor(type) {
    this.type = type;
    this.sound = null;
  }
  createSound() {
    this.sound = new Audio;
    this.sound.volume = 0.3;
    switch(this.type) {
      case 'line':
        this.sound.src = './assets/sounds/nline.webm';
        break;
      case 'circle':
        this.sound.src = './assets/sounds/circle.webm';
        break;
      case 'letter':
        this.sound.src = './assets/sounds/letter.webm';
        break;
      case 'erase':
        this.sound.src = './assets/sounds/erase.webm';
        break;
      case 'win':
        this.sound.src = './assets/sounds/win.webm';
        break;
      case 'lose':
        this.sound.src = './assets/sounds/lose.webm';
        break;
    }
    this.sound.load();
  }
  playSound() {
    this.sound.play();
  }
}