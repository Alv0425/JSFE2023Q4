export function createNode(type, classlist, attrlist, content) {
  let node;
  if (type) {
    node = document.createElement(type);
  }
  if (classlist) {
    node.classList.add(...classlist);
  }
  if (attrlist && attrlist.keys) {
    for (let key in attrlist) {
      node.setAttribute(key, attrlist[key]);
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
