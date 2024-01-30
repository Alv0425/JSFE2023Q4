export class Base {
  constructor() {
  }

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
}