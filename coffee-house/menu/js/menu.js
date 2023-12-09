import { initBurger } from "./burger.js"
import { Product } from "./components/Product.js"

window.onload = () => {
  initBurger();
  let products;
  async function getProducts() {
    const result = await fetch('./js/products.json');
    products = await result.json();
    return products;
  }

  getProducts().then(()=> {
    const menu = document.querySelector('.menu');
    const menuContent = document.querySelector('.menu__content');
    const refreshButton = document.querySelector('.menu__refresh');
    const menuPagination = document.querySelector('.menu__pagination');
    refreshButton.onclick = () => {
      menuContent.classList.add('menu__content-extended');
      refreshButton.remove();
    }
    menuPagination.onchange = (e) => {console.log(e.target.value);
      renderCardsOfType(e.target.value);} 
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
      menu.append(refreshButton);
      menuContent.classList.remove('menu__content-extended')
      menuContent.classList.add('fade-out');
      const clearContent = new Promise((resolve) => {
      setTimeout(()=>{
          menuContent.classList.remove('fade-out');
          removeChilds(menuContent);
          resolve('res');
      },1000);
     });
     clearContent.then(() => {
      let productsList = productsCategory(type);
      let cards = productsList.map(prod => prod.card);
      menuContent.append(...cards);
     });
    
    }   
    renderCardsOfType("coffee");
    console.log(products)
  });
}

function removeChilds(parentNode) {
  while(parentNode.firstChild){
    parentNode.removeChild(parentNode.firstChild);
  }
}