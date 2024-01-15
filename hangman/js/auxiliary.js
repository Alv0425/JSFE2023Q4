export function createNode(type, classlist, attrlist, content) {
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

export function clearNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

export function checkLocalstorage() {
  let hasProperty = Object.prototype.hasOwnProperty.call(
    localStorage,
    "hangmanprevnumber",
  );
  if (!hasProperty) {
    localStorage.hangmanprevnumber = -1;
  }
}

export function isLocalStorage() {
  try {
    const key = `check`;
    window.localStorage.setItem(key, null);
    window.localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.log("localStorage is not availible in this browser. Please, enable it to more stable work of app.");
    return false;
  }
}

