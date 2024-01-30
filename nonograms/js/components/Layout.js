export class Layout {
  constructor(darkMode = false){
    this.body = document.body;
    this.body.classList.add("body");
    this.header = null;
    this.footer = null;
    this.main = null;
    this.darkMode = darkMode;
  }

  renderHeader() {
    
  }

  renderMain() {

  }

  renderFooter() {

  }

  switchMode() {
    this.darkMode = !this.darkMode;
    this.body.classList.toggle('dark-mode');
  }

}