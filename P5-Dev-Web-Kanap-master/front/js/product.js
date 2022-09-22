let url = new URL(location.href);

let getId = url.searchParams.get("id");

const flagImg = document.querySelector(".item__img");
const flagTitle = document.querySelector("#title");
const flagPrice = document.querySelector("#price");
const flagDescription = document.querySelector("#description");
const flagColors = document.querySelector("#colors");

const flagQuantity = document.querySelector("#quantity");
const flagAddToCart = document.querySelector("#addToCart");

fetch(`http://localhost:3000/api/products/${getId}`)
  .then((res) => res.json())
  .then((data) => {
    flagImg.innerHTML += `
    <img src="${data.imageUrl}" alt="Photographie d'un canapé">
    `;
    flagTitle.innerText += `${data.name}`;
    flagPrice.innerText += `${data.price}`;
    flagDescription.innerText += `${data.description}`;
    for (let color of data.colors) {
      flagColors.innerHTML += `
      <option value="${color}">${color}</option>
      `;
    }
    takeIdColorsQuantity();
  });

// Permet d'enregistrer dans le LS ,clé : basket 'sérialisation'
function saveBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}

// Récupérer le panier puis pouvoir le lire en chaine de caractère
function getBasket() {
  let basket = localStorage.getItem("basket");
  if (basket == null) {
    return [];
  } else {
    return JSON.parse(basket);
  }
}

// Ajouter le produit au panier
function addBasket(product) {
  let basket = getBasket();
  let foundProduct = basket.find(
    (p) => p.id == product.id && p.color == product.color
  );
  if (foundProduct != undefined) {
    let actuallyQuantity =
      parseInt(foundProduct.quantity) + parseInt(flagQuantity.value);
    foundProduct.quantity = actuallyQuantity;
  } else {
    basket.push(product);
  }
  saveBasket(basket);
}

// Création d'un objet avec l'Id, color et quantity
function takeIdColorsQuantity() {
  flagAddToCart.addEventListener("click", () => {
    let selectedId = getId;
    let selectedColor = flagColors.value;
    let selectedQuantity = flagQuantity.value;

    let product = {
      id: selectedId,
      color: selectedColor,
      quantity: selectedQuantity,
    };

    if (
      (selectedQuantity < 1 && selectedColor == "") ||
      (selectedQuantity > 100 && selectedColor == "")
    ) {
      alert("Veuillez choisir une quantité entre 1 et 100 et une couleur");
    } else if (selectedQuantity < 1 || selectedQuantity > 100) {
      alert("Veuillez choisir une quantité entre 1 et 100");
    } else if (selectedQuantity == null) {
      alert("Oups vous avez oublié de choisir une quantité");
    } else if (selectedColor == "") {
      alert("Oups vous avez oublié de choisir une couleur");
    } else addBasket(product);
  });
}
