const flagItem = document.querySelector("#cart__items");
let kanapPrice = [];

function BrowseIdKanap() {
  const addProduct = JSON.parse(localStorage.getItem("basket"));
  for (const i of addProduct) {
    fetch(`http://localhost:3000/api/products/${i.id}`)
      .then((response) => response.json())
      .then((data) => {
        displayCart(i, data);
        changeQuantity(i, data);
        stockKanapPrice(data);
        totalPrice();
        removeFromBasket();
      });
  }
}

BrowseIdKanap();

function stockKanapPrice(apiData) {
  kanapPrice.push(apiData.price);
}

function stockKanapQuantity() {
  let kanapQuantity = [];
  let basket = getBasket();
  for (i = 0; i < basket.length; i++) {
    kanapQuantity.push(basket[i].quantity);
  }
  return kanapQuantity;
}

function totalPrice() {
  const flagTotalPrice = document.querySelector("#totalPrice");
  let kanapQuantity = stockKanapQuantity();
  let calculationTotalPrice = 0;
  for (i = 0; i < kanapQuantity.length; i++) {
    calculationTotalPrice += parseInt(kanapQuantity[i]) * kanapPrice[i];
  }
  flagTotalPrice.textContent = `${calculationTotalPrice}`;
}

const displayCart = (localStorageData, apiData) => {
  flagItem.innerHTML += `<article class="cart__item" data-id="${localStorageData.id}" data-color="${localStorageData.color}">
            <div class="cart__item__img">
            <img src="${apiData.imageUrl}" alt="Photographie d'un canapé">
            </div>
            <div class="cart__item__content">
            <div class="cart__item__content__description">
            <h2>${apiData.name}</h2>
            <p>${localStorageData.color}</p>
            <p>${apiData.price} €</p>
            </div>
            <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${localStorageData.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
            </div>
            </div>
            </div>
            </article>`;
};
////////////////////////////////////////// Etape 9 //////////////////////////////////////////

const flagNumberProduct = document.querySelector("#totalQuantity");

function saveBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}

function getBasket() {
  let basket = localStorage.getItem("basket");
  if (basket == null) {
    return [];
  } else {
    return JSON.parse(basket);
  }
}

function getNumberProduct() {
  let basket = getBasket();
  let number = 0;
  for (let product of basket) {
    number += parseInt(product.quantity);
  }
  flagNumberProduct.innerHTML = `
${number}
`;
  return number;
}
getNumberProduct();

function changeQuantity() {
  const flagChangeQuantity = document.getElementsByClassName("itemQuantity");
  //const flagChangeQuantity = document.querySelectorAll(".itemQuantity");
  for (let input of flagChangeQuantity) {
    input.addEventListener("change", (e) => {
      let basket = getBasket();
      let kanapDataSetId = e.target.closest(".cart__item").dataset.id;
      let kanapQuantity = e.target.value;

      let foundProduct = basket.find((p) => p.id == kanapDataSetId);
      if (foundProduct != undefined) {
        foundProduct.quantity = kanapQuantity;
      }
      saveBasket(basket);
      getNumberProduct();
      totalPrice();
    });
  }
}

function removeFromBasket() {
  const flagDeleteItem = document.getElementsByClassName("deleteItem");
  for (let input of flagDeleteItem) {
    input.addEventListener("click", (e) => {
      let kanapDataSetId = e.target.closest(".cart__item").dataset.id;
      let kanapDataSetColor = e.target.closest(".cart__item").dataset.color;
      let basket = getBasket();
      basket = basket.filter(
        (p) => p.id != kanapDataSetId || p.color != kanapDataSetColor
      );
      saveBasket(basket);
      flagItem.innerHTML = ``;
      BrowseIdKanap();
      getNumberProduct();
      totalPrice();
    });
  }
}
