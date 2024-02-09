import { Base } from "./Base.js";
export class Layout extends Base {
  constructor(darkMode = false) {
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
    this.header = this.createNode("header", ["header"]);
    const headerTitle = this.createNode(
      "h1",
      ["header__title"],
      {},
      "NONOGRAMS",
    );
    this.header.append(headerTitle);
    this.body.append(this.header);
  }

  updateNonogramCont() {
    this.clearNode(this.nonogramContainer);
    this.cluesXCont = this.createNode("div", ["nonogram__clues-x-cont"]);
    this.cluesYCont = this.createNode("div", ["nonogram__clues-y-cont"]);
    this.nonogramFieldCont = this.createNode("div", ["nonogram__field-cont"]);
    this.miniatureCont = this.createNode("div", ["nonogram__miniature-cont"]);
    this.nonogramContainer.append(
      this.miniatureCont,
      this.cluesXCont,
      this.cluesYCont,
      this.nonogramFieldCont,
    );
  }

  showHint(hintText) {
    const hintTextCont = this.createNode("p", ["nonogram__hint"], {}, hintText);
    this.main.append(hintTextCont);
    setTimeout(() => {
      hintTextCont.remove();
    }, 1000);
  }

  renderMain() {
    this.main = this.createNode("main", ["main"]);
    const appContainer = this.createNode("section", ["app"]);
    const appMain = this.createNode("div", ["app__main"]);
    const appHeader = this.createNode("div", ["app__header"]);
    this.timerCont = this.createNode("div", ["app__timer-cont"], {}, "XX:XX");
    this.gameNameCont = this.createNode(
      "div",
      ["app__name-game-cont"],
      {},
      "Game name",
    );
    const appHeaderButtons = this.createNode("div", ["app__header-buttons"]);
    const scoreButton = this.createNode("button", ["app__score-button"]);
    const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    star.append(use);
    use.setAttribute("href", "./assets/star-solid.svg#star");
    star.setAttribute("viewBox", "0 0 576 576");
    star.setAttribute("width", "30px");
    star.classList.add("icon");
    scoreButton.append(star);
    const settingsButton = this.createNode("button", ["app__settings-button"]);
    const gear = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const useGear = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "use",
    );
    gear.append(useGear);
    useGear.setAttribute("href", "./assets/gear-solid.svg#gear");
    gear.setAttribute("viewBox", "0 0 512 512");
    gear.setAttribute("width", "30px");
    gear.classList.add("icon");
    settingsButton.append(gear);
    appHeaderButtons.append(scoreButton, settingsButton);
    appHeader.append(this.gameNameCont, this.timerCont, appHeaderButtons);
    const appBody = this.createNode("div", ["app__body"]);
    const appGameContainer = this.createNode("div", ["app__game-container"]);
    const appPlayFieldContainer = this.createNode("div", ["nonogram"]);
    this.nonogramContainer = this.createNode("div", ["nonogram__container"]);
    this.cluesXCont = this.createNode("div", ["nonogram__clues-x-cont"]);
    this.cluesYCont = this.createNode("div", ["nonogram__clues-y-cont"]);
    this.miniatureCont = this.createNode("div", ["nonogram__miniature-cont"]);
    this.nonogramFieldCont = this.createNode("div", ["nonogram__field-cont"]);
    this.nonogramContainer.append(
      this.miniatureCont,
      this.cluesXCont,
      this.cluesYCont,
      this.nonogramFieldCont,
    );
    appPlayFieldContainer.append(this.nonogramContainer);
    const appGameButtons = this.createNode("div", ["app__game-buttons"]);
    ["show solution", "reset game"].forEach((text) => {
      const newButton = this.createNode(
        "button",
        ["button"],
        { type: "button" },
        text,
      );
      appGameButtons.append(newButton);
      this.appButtons[text] = newButton;
    });
    appGameContainer.append(appPlayFieldContainer, appGameButtons);
    const appSidebar = this.createNode("div", ["app__sidebar"]);
    const navbuttons = this.createNode("div", ["app__nav-buttons"]);
    const settingsContainer = this.createNode("div", ["app__settings"]);
    const appSettingsHeader = this.createNode("div", ["app__settings-header"]);
    const appSettingsTitle = this.createNode(
      "h2",
      ["app__settings-title"],
      {},
      "SETTINGS",
    );
    const appSettingsClose = this.createNode("button", ["app__settings-close"]);
    settingsButton.onclick = () => {
      settingsContainer.classList.add("app__settings_active");
    };
    appSettingsClose.onclick = () => {
      settingsContainer.classList.remove("app__settings_active");
    };
    appSettingsClose.append(this.createNode("span"), this.createNode("span"));
    settingsContainer.append(appSettingsHeader);
    appSettingsHeader.append(appSettingsTitle, appSettingsClose);
    appSidebar.append(navbuttons, settingsContainer);
    appMain.append(appHeader, appBody);
    appBody.append(appGameContainer, appSidebar);
    ["select game", "play random", "save game", "open saved"].forEach(
      (text) => {
        const newButton = this.createNode(
          "button",
          ["button"],
          { type: "button" },
          text,
        );
        navbuttons.append(newButton);
        this.appButtons[text] = newButton;
      },
    );
    const settingsSounds = this.createNode("div", ["app__settings-sounds"]);
    const settingsSoundsTitle = this.createNode(
      "h3",
      ["app__settings-title"],
      {},
      "Sounds:",
    );
    settingsSounds.append(settingsSoundsTitle);
    ["all sounds", "win sound", "cell sounds"].forEach((sound) => {
      const togglerContainer = this.createNode("div", ["app__sound-toggler"]);
      const input = this.createNode("input", ["input"], {
        type: "checkbox",
        id: sound.replace(" ", ""),
      });
      const label = this.createNode("label", ["toggler"], {
        for: sound.replace(" ", ""),
      });
      const circle = this.createNode("span", ["toggler__circle"]);
      label.append(circle);
      const text = this.createNode(
        "p",
        ["app__sound-toggler-label"],
        {},
        sound,
      );
      this.soundsTogglers[sound] = input;
      togglerContainer.append(input, label, text);
      settingsSounds.append(togglerContainer);
    });
    const settingsDarkmode = this.createNode("div", ["app__settings-darkmode"]);
    const settingsDarkmodeTitle = this.createNode(
      "h3",
      ["app__settings-title"],
      {},
      "Dark mode:",
    );
    this.darkmodeToggler = this.createNode("input", ["input"], {
      type: "checkbox",
      id: "darkmode",
    });
    this.darkmodeToggler.oninput = () => {
      this.switchMode();
      this.updateSettings();
    };
    const label = this.createNode("label", ["toggler", "toggler_darkmode"], {
      for: "darkmode",
    });
    const circle = this.createNode("span", ["toggler__circle"]);
    label.append(circle);
    settingsDarkmode.append(settingsDarkmodeTitle, this.darkmodeToggler, label);
    settingsContainer.append(settingsSounds, settingsDarkmode);
    const appScoreContainer = this.createNode("div", ["app__score"]);
    const appScoreHeader = this.createNode("div", ["app__score-header"]);
    const appScoreTitle = this.createNode(
      "h2",
      ["app__score-title"],
      {},
      "High Score",
    );
    const appScoreClose = this.createNode("button", ["app__score-close"]);
    appScoreClose.append(this.createNode("span"), this.createNode("span"));
    scoreButton.onclick = () => {
      appScoreContainer.classList.add("app__score_active");
    };
    appScoreClose.onclick = () => {
      appScoreContainer.classList.remove("app__score_active");
    };
    appScoreHeader.append(appScoreTitle, appScoreClose);
    this.scoreList = this.createNode("ul", ["app__score-list"]);
    appContainer.append(appMain, appScoreContainer);
    appScoreContainer.append(appScoreHeader, this.scoreList);
    this.main.append(appContainer);
    this.body.append(this.main);
    this.soundsTogglers["all sounds"].oninput = () => {
      this.soundsTogglers["win sound"].checked =
        this.soundsTogglers["all sounds"].checked;
      this.soundsTogglers["cell sounds"].checked =
        this.soundsTogglers["all sounds"].checked;
      this.updateSettings();
    };
    this.soundsTogglers["win sound"].oninput = () => {
      this.soundsTogglers["all sounds"].checked =
        this.soundsTogglers["win sound"].checked ||
        this.soundsTogglers["cell sounds"].checked;
      this.updateSettings();
    };
    this.soundsTogglers["cell sounds"].oninput = () => {
      this.soundsTogglers["all sounds"].checked =
        this.soundsTogglers["win sound"].checked ||
        this.soundsTogglers["cell sounds"].checked;
      this.updateSettings();
    };
  }

  renderFooter() {
    this.footer = this.createNode("footer", ["footer"]);
    const footerCont = this.createNode("div", ["footer__container"]);
    const year = this.createNode("p", ["footer__year"], {}, "2024");
    const author = this.createNode(
      "a",
      ["footer__author"],
      { href: "https://github.com/Alv0425", target: "_blank" },
      "Elena Vilejshikova",
    );
    footerCont.append(year, author);
    this.footer.append(footerCont);
    this.body.append(this.footer);
  }

  renderPage() {
    if (this.darkMode) {
      this.body.classList.add("dark-mode");
    } else {
      this.body.classList.remove("dark-mode");
    }
    this.renderHeader();
    this.renderMain();
    this.renderFooter();
    this.loadSettings();
  }

  switchMode() {
    this.darkMode = !this.darkMode;
    this.body.classList.toggle("dark-mode");
  }

  loadSettings() {
    const curSettings = this.getSettings();
    this.darkmodeToggler.checked = curSettings.darkmode;
    this.darkMode = curSettings.darkmode;
    if (curSettings.darkmode) {
      this.body.classList.add("dark-mode");
    } else {
      this.body.classList.remove("dark-mode");
    }
    this.soundsTogglers["all sounds"].checked = curSettings["all sounds"];
    this.soundsTogglers["win sound"].checked = curSettings["win sound"];
    this.soundsTogglers["cell sounds"].checked = curSettings["cell sounds"];
  }

  updateSettings() {
    const newSettings = {
      darkmode: this.darkmodeToggler.checked,
      "all sounds": this.soundsTogglers["all sounds"].checked,
      "win sound": this.soundsTogglers["win sound"].checked,
      "cell sounds": this.soundsTogglers["cell sounds"].checked,
    };
    this.setSettings(newSettings);
  }
}
