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
        console.log(key);
        node.setAttribute(key, attrlist[key]);
      }
    }
  }
  if (content) {
    console.log(content)
    node.append(...content);
  }
  return node;
}

export function clearNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
