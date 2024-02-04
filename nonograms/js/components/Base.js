export class Base {
  constructor() {}

  createNode(type, classlist, attrlist, content) {
    let node;
    if (type) {
      node = document.createElement(type);
    }
    if (classlist) {
      node.classList.add(...classlist);
    }
    if (attrlist) {
      if (Object.keys(attrlist)) {
        for (let key in attrlist) {
          node.setAttribute(key, attrlist[key]);
        }
      }
    }
    if (content) {
      node.append(...content);
    }
    return node;
  }

  clearNode(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  addListeners(nodes, events, handler) {
    for (const node of nodes) {
      for (const eventType of events) {
        node.addEventListener(eventType, handler);
      }
    }
  }

  emitEvent(node, eventName) {
    const newEvent = new Event(eventName);
    node.dispatchEvent(newEvent);
  }

  checkLocalstorage() {
    let hasProperty = Object.prototype.hasOwnProperty.call(
      localStorage,
      "alv0425-nonograms",
    );
    if (!hasProperty) {
      const templateObj = {
        "saved game": "",
        settings: {
          darkmode: false,
          "all sounds": true,
          "win sound": true,
          "click sound": true,
        },
        history: [],
      };
      localStorage["alv0425-nonograms"] = JSON.stringify(templateObj);
    }
  }

  getLocalStorageObject() {
    this.checkLocalstorage();
    const localstorageObj = JSON.parse(
      localStorage.getItem("alv0425-nonograms"),
    );
    return localstorageObj;
  }

  setSavedGame(game) {
    this.checkLocalstorage();
    const currentObj = JSON.parse(localStorage.getItem("alv0425-nonograms"));
    currentObj["saved game"] = game;
    localStorage["alv0425-nonograms"] = JSON.stringify(currentObj);
  }

  getSavedGame() {
    this.checkLocalstorage();
    const currentObj = JSON.parse(localStorage.getItem("alv0425-nonograms"));
    return currentObj["saved game"];
  }

  updateHistory(newgame, newtime) {
    this.checkLocalstorage();
    const currentObj = JSON.parse(localStorage.getItem("alv0425-nonograms"));
    currentObj.history.push({ game: newgame, time: newtime });
    if (currentObj.history.length > 5) currentObj.history.shift();
    localStorage["alv0425-nonograms"] = JSON.stringify(currentObj);
  }

  getHistory() {
    this.checkLocalstorage();
    const currentObj = JSON.parse(localStorage.getItem("alv0425-nonograms"));
    return currentObj.history.sort((a, b) => a.time - b.time);
  }

  getSettings() {
    this.checkLocalstorage();
    const currentObj = JSON.parse(localStorage.getItem("alv0425-nonograms"));
    return currentObj.settings;
  }

  setSettings(settings) {
    this.checkLocalstorage();
    const currentObj = JSON.parse(localStorage.getItem("alv0425-nonograms"));
    currentObj.settings = settings;
    localStorage["alv0425-nonograms"] = JSON.stringify(currentObj);
  }

  isLocalStorage() {
    try {
      const key = `check`;
      window.localStorage.setItem(key, null);
      window.localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.log(
        "localStorage is not availible in this browser. Please, enable it to more stable work of app.",
      );
      return false;
    }
  }
}
