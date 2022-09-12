const flagItem = document.querySelector("#cart__items");
let kanapPrice = [];

// Function Main qui permet de trier l'api en fonction du LS
function BrowseIdKanap() {
  const addProduct = JSON.parse(localStorage.getItem("basket"));
  if (addProduct <= 0) {
    document.querySelector(
      "h1"
    ).innerHTML = `Votre panier est tristement vide :-(`;
    document.querySelector("#totalPrice").textContent = `0`;
    return;
  }
  for (const i of addProduct) {
    fetch(`http://localhost:3000/api/products/${i.id}`)
      .then((response) => response.json())
      .then((data) => {
        displayCart(i, data);
        changeQuantity(i, data);
        stockKanapPrice(data);
        totalPrice();
        removeFromBasket();
        console.log("cc");
      });
  }
}
BrowseIdKanap();

// Affiche chaque article
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

// Sauvegarde dans le LS
function saveBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}

// Récupère le LS et stock dans la function au format JSON
function getBasket() {
  let basket = localStorage.getItem("basket");
  if (basket == null) {
    return [];
  } else {
    return JSON.parse(basket);
  }
}
// Push dans le tableau kanapPrice
function stockKanapPrice(apiData) {
  kanapPrice.push(apiData.price);
}

// Stock dans la function la quantité de Kanap
function stockKanapQuantity() {
  let kanapQuantity = [];
  let basket = getBasket();
  for (i = 0; i < basket.length; i++) {
    kanapQuantity.push(basket[i].quantity);
  }
  return kanapQuantity;
}

// Affiche et calcul le prix total
function totalPrice() {
  const flagTotalPrice = document.querySelector("#totalPrice");
  let kanapQuantity = stockKanapQuantity();
  let calculationTotalPrice = 0;
  for (i = 0; i < kanapQuantity.length; i++) {
    calculationTotalPrice += parseInt(kanapQuantity[i]) * kanapPrice[i];
  }
  flagTotalPrice.textContent = `${calculationTotalPrice}`;
}

// Affiche et calcul le quantité total du nombre d'article du LS
function getNumberProduct() {
  const flagNumberProduct = document.querySelector("#totalQuantity");
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

// Change la quantité dans le LS sur L'id indiqué
function changeQuantity() {
  const flagChangeQuantity = document.getElementsByClassName("itemQuantity");
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

// Supprime l'article au "Click"
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

//////////////////// Formulaire ////////////////////

document.querySelector("#order").addEventListener("click", (e) => {
  e.preventDefault();
  let basket = getBasket();

  const contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };

  let products = [];

  for (let kanap of basket) {
    products.push(kanap.id);
  }

  const orderId = fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ contact, products }),
  });
  orderId.then(async (res) => {
    const data = await res.json();
    console.log(`${data.orderId}`);
    //document.querySelector("#orderId").textContent = `${data.orderId}`;
    location.href = `confirmation.html?${data.orderId}`;
  });
});
