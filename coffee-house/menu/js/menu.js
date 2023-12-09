import { initBurger } from "./burger.js"
import { Product } from "./components/Product.js"

window.onload = () => {
  initBurger();

  const menu = document.querySelector('.menu');
  const menuContent = document.querySelector('.menu__content');
  const refreshButton = document.createElement('div');
  refreshButton.classList.add("menu__refresh", "circle-button");
  const menuPagination = document.querySelector('.menu__pagination');
  const loader = document.createElement('div');
  loader.className = 'loader';
  const loaderContainer = document.createElement('div');
  loaderContainer.className = 'loader__container';
  const loaderCeter = document.createElement('div');
  loaderCeter.className ='loader__center';
  loader.append(loaderContainer);
  loaderContainer.append(loaderCeter);
  menuContent.append(loader);
  

  let products;
  async function getProducts() {
    const result = await fetch('./js/products.json');
    products = await result.json();
    return products;
  }

  getProducts().then(()=> {
    
    refreshButton.onclick = () => {
      menuContent.classList.add('menu__content-extended');
      refreshButton.remove();
    }
    menuPagination.onchange = (e) => {renderCardsOfType(e.target.value);} 
    // const [coffeeTag, teaTag, menuTag] = [document.getElementById('coffee'),document.getElementById('tea'), document.getElementById('dessert')];
    // [coffeeTag, teaTag, menuTag].forEach(tag => {tag.oninput = (e) => {
    //     if (e.target.checked === true) {
    //         renderCardsOfType(e.target.value);
    //     }
    // }})
    const productsCategory = (type) => products.filter(prod => prod.category === type).map((item, index) => {
        return new Product(item.name, item.description, item.price, `./assets/menu/${item.category}-${index + 1}.webp`, item.additives, item.sizes);
    });

    function renderCardsOfType(type){
      refreshButton.remove();
      menuContent.classList.remove('menu__content-extended')
      menuContent.classList.add('fade-out');
      const clearContent = new Promise((resolve) => {
      setTimeout(()=>{
          menuContent.classList.remove('fade-out');
          removeChilds(menuContent);
          resolve('res');
      },500);
     });
     clearContent.then(() => {
      let productsList = productsCategory(type);
      let cards = productsList.map(prod => prod.card);
      if (cards.length > 4){ 
        menu.append(refreshButton); 
      }
      menuContent.append(...cards);
      
     });
    
    }   
    renderCardsOfType("coffee");

  });
}

function removeChilds(parentNode) {
  while(parentNode.firstChild){
    parentNode.removeChild(parentNode.firstChild);
  }
}