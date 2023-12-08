export class Product {
  constructor(name, description, price, url, additives, sizes) {
    this.name = name;
    this.description = description;
    this.price = price;
    this.additives = additives;
    this.sizes = sizes;
    this.url = url;
    this.card = this.createCard();
  }
  createNode(elementType, ...classlist){
    let newNode = document.createElement(elementType);
    newNode.classList.add(...classlist);
    return newNode;
  }
  createCard(){
    let card = this.createNode('div','menu-card', 'fade-in');
    let cardImageContainer = this.createNode('div', 'menu-card__image');
    let cardImage = this.createNode('img');
    let cardTitle = this.createNode('h3','menu-card__title');
    let cardDescription = this.createNode('p','menu-card__description');
    let cardPrice = this.createNode('p', 'menu-card__price');
    card.dataName = this.name;
    cardImage.src = this.url;
    cardImage.alt = this.name;
    cardTitle.textContent = this.name;
    cardDescription.textContent = this.description;
    cardPrice.innerHTML = '&#36;' + this.price;
    cardImageContainer.append(cardImage);
    card.append(cardImageContainer, cardTitle, cardDescription, cardPrice);
    card.onclick = () => {
      this.openModal();
      console.log('click');
    }
    return card;
  }
  openModal(){
    let body = document.querySelector('body');
    let modalOverlay = this.createNode('div','overlay');
    let modal = this.createNode('div','menu-modal');
    
    let modalColumns = ['',''].map(el => this.createNode('div', 'menu-modal__container'));
    let modalImageContainer = this.createNode('div','menu-modal__image');
    let modalImage = this.createNode('img');
    modalImage.src = this.url;
    modalImage.alt = this.name;
    let modalForm = this.createNode('form','menu-modal__form');
    let modalText = this.createNode('div','menu-modal__text');
    let modalTitle = this.createNode('h3','menu-modal__title');
    modalTitle.textContent = this.name;
    let modalDescription = this.createNode('div','menu-modal__description');
    modalDescription.textContent = this.description;
    modalText.append(modalTitle, modalDescription);
    
    let modalSize = this.createNode('div','menu-modal__size');
    let modalSizeLabel = this.createNode('p',"menu-modal__field-label");
    modalSizeLabel.textContent = 'Size';
    let modalSizeInputs = this.createNode('div','menu-modal__inputs-container');
    let sizeInputs = ['s','m','l'].map((el) => {
      let input = this.createNode('INPUT','menu-modal__input');
      input.setAttribute('type', 'radio');
      input.setAttribute('id', el);
      console.log(this.sizes[el]['add-price']*1);
      input.value = this.sizes[el]['add-price']*1;
      input.name = 'size';
      return input;
    });
    sizeInputs[0].checked = true;
    let sizeOptions = ['s','m','l'].map((el) => {
      let option = this.createNode('LABEL','menu-modal__option');
      let circle = this.createNode('span', 'menu-modal__circle');
      circle.textContent = el.toUpperCase();
      let text = this.createNode('span');
      text.textContent = this.sizes[el]['size'];
      option.append(circle, text);
      option.setAttribute('for', el);
      return option;
    });
    modalSizeInputs.append(...sizeInputs, ...sizeOptions);
    modalSize.append(modalSizeLabel, modalSizeInputs);
    
    let modalAdditives = this.createNode('div','menu-modal__additives');
    let modalAdditivesLabel = this.createNode('p',"menu-modal__field-label");
    modalAdditivesLabel.textContent = 'Additives';
    let modalAdditivesInputs = this.createNode('div','menu-modal__inputs-container');
    let addInputs = [1,2,3].map(el => {
      let input = this.createNode('INPUT','menu-modal__input');
      input.setAttribute('type', 'checkbox');
      input.setAttribute('id', `add-${el}`);
      input.value = this.additives[el-1]['add-price'] * 1;
      input.name = `add-${el}`;
      return input;
    });
    let addOptions = [1,2,3].map((el) => {
      let option = this.createNode('LABEL','menu-modal__option');
      let circle = this.createNode('span', 'menu-modal__circle');
      circle.textContent = el;
      let text = this.createNode('span');
      text.textContent = this.additives[el-1]['name'];
      option.append(circle, text);
      option.setAttribute('for', `add-${el}`);
      return option;
    });
    modalAdditivesInputs.append(...addInputs,...addOptions);
    modalAdditives.append(modalAdditivesLabel, modalAdditivesInputs);
    let modalPriceContainer = this.createNode('div','menu-modal__price');
    let modalPriceLabel = this.createNode('div','price__label');
    modalPriceLabel.textContent = 'Total:';
    let modalPricePrice = this.createNode('div','price__price');
    modalPricePrice.innerHTML = `&#36;${this.price}`;
    modalPriceContainer.append(modalPriceLabel,modalPricePrice);
    let modalInfo = this.createNode('div','menu-modal__info');
    modalInfo.innerHTML = `<div class="menu-modal__icon"></div>
    <p class="menu-modal__footnote">The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.</p>`
    
    let modalClose =  this.createNode('div','menu-modal__button', 'pill-button');
    modalClose.textContent = 'Close';
    modalColumns[0].append(modalImageContainer);
    modalForm.append(modalText,modalSize,modalAdditives,modalPriceContainer,modalInfo,modalClose);
    modalColumns[1].append(modalForm);
    modalImageContainer.append(modalImage);
    modal.append(...modalColumns);
    modalOverlay.append(modal);
    body.append(modalOverlay);
    modalClose.onclick = () => {
      modalOverlay.classList.add('fade-out');
      setTimeout(() => {modalOverlay.remove()},500);
    }

    [...addInputs,...sizeInputs].forEach(input => {
      console.log(input.value * 1)
      input.oninput = () => {
        let totalPriceAddition = 0;
        [...addInputs,...sizeInputs].forEach((input)=>{
          console.log(input.value*1)
          totalPriceAddition += input.checked ?input.value*1 : 0;
        },0);
        let totalPrice = (this.price * 1 + totalPriceAddition);
        modalPricePrice.innerHTML = `&#36;${parseFloat(totalPrice).toFixed(2)}`;
      }
    })
    modalOverlay.onclick = (e) => {
      if (!modal.contains(e.target)&&!modalClose.contains(e.target)) {
        modalOverlay.classList.add('fade-out');
        setTimeout(() => {modalOverlay.remove()},500);
      }
    }
    modalForm.onsubmit = (e) => {
      e.preventDefault();
    }
  }
}