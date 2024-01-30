import { Base } from './Base.js';
export class Layout extends Base {
  constructor(darkMode = false){
    super();
    this.body = document.body;
    this.body.classList.add("body");
    this.header = null;
    this.footer = null;
    this.main = null;
    this.darkMode = darkMode;
    this.appButtons = {};
    this.soundsTogglers = {};
  }

  renderHeader() {
    this.header = this.createNode('header', ['header']);
    const headerTitle = this.createNode('h1', ['header__title'], {}, 'NONOGRAMS');
    this.header.append(headerTitle);
    this.body.append(this.header);
  }

  renderMain() {
    this.main = this.createNode('main', ['main']);
    const appContainer = this.createNode('section', ['app']);
    const appMain = this.createNode('div', ['app__main']);
    const appHeader = this.createNode('div', ['app__header']);
    const appBody = this.createNode('div', ['app__body']);
    const appGameContainer = this.createNode('div', ['app__game-container']);
    const appSidebar = this.createNode('div', ['app__sidebar']);
    const navbuttons = this.createNode('div', ['app__nav-buttons']);
    const settingsContainer = this.createNode('div', ['app__settings']);
    appSidebar.append(navbuttons, settingsContainer);
    appMain.append(appHeader, appBody);
    appBody.append(appGameContainer, appSidebar);
    ['select game', 'play random', 'save game', 'open saved'].forEach((text) => {
      const newButton = this.createNode('button', ['button'], {type: 'button'}, text);
      navbuttons.append(newButton);
      this.appButtons[text] = newButton;
    });
    const settingsSounds = this.createNode('div', ['app__settings-sounds']);
    const settingsSoundsTitle = this.createNode('h3', ['app__settings-title'], {}, 'Sounds:');
    settingsSounds.append(settingsSoundsTitle);
    ['all sounds', 'win sound', 'click sound'].forEach((sound) => {
      const togglerContainer = this.createNode('div', ['app__sound-toggler']);
      const input = this.createNode('input', ['input'], {type: 'checkbox', id: sound.replace(' ','')});
      const label = this.createNode('label', ['toggler'], {for: sound.replace(' ','')});
      const circle = this.createNode('span', ['toggler__circle']);
      label.append(circle);
      const text = this.createNode('p', ['app__sound-toggler-label'], {}, sound);
      this.soundsTogglers[sound] = input;
      togglerContainer.append(input, label, text);
      settingsSounds.append(togglerContainer);
    });
    const settingsDarkmode = this.createNode('div', ['app__settinds-darkmode']);
    const settingsDarkmodeTitle = this.createNode('h3', ['app__settings-title'], {}, 'Dark/light mode:');
    const input = this.createNode('input', ['input'], {type: 'checkbox', id: 'darkmode'});
    const label = this.createNode('label', ['toggler', 'toggler_darkmode'], {for: "darkmode"});
    const circle = this.createNode('span', ['toggler__circle']);
    label.append(circle);
    settingsDarkmode.append(settingsDarkmodeTitle, input, label);
    settingsContainer.append(settingsSounds, settingsDarkmode)
    const appScoreContainer = this.createNode('div', ['app__score']);
    const appScoreTitle = this.createNode('h2', ['app__score-title'], {}, 'Score');
    this.scoreList = this.createNode('ul', ['app__score-list']);
    appContainer.append(appMain, appScoreContainer);
    appScoreContainer.append(appScoreTitle, this.scoreList);
    this.main.append(appContainer);
    this.body.append(this.main);
  }

  renderFooter() {
    this.footer = this.createNode('footer', ['footer']);
    const footerCont = this.createNode('div', ['footer__container']);
    const year = this.createNode('p', ['footer__year'], {}, '2024');
    const author = this.createNode('a', ['footer__author'], {href: "https://github.com/Alv0425", target: '_blank'}, 'Elena Vilejshikova');
    footerCont.append(year, author);
    this.footer.append(footerCont);
    this.body.append(this.footer);
  }

  renderPage() {
    if (this.darkMode) {
      this.body.classList.add('dark-mode');
    } else {
      this.body.classList.remove('dark-mode');
    }
    this.renderHeader();
    this.renderMain();
    this.renderFooter();
  }

  switchMode() {
    this.darkMode = !this.darkMode;
    this.body.classList.toggle('dark-mode');
  }
}