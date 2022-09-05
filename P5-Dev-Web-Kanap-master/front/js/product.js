// Nouvelle URL qui comporte l'URL actuel
let url = new URL(location.href);
// Prend dans l'url l'id
let getId = url.searchParams.get("id");

const flagImg = document.querySelector(".item__img");
const flagTitle = document.querySelector("#title");
const flagPrice = document.querySelector("#price");
const flagDescription = document.querySelector("#description");
const flagColors = document.querySelector("#colors");

const flagQuantity = document.querySelector("#quantity");
const flagAddToCart = document.querySelector("#addToCart");

// On fait une requête de l'Api via le fetch pour récupérer des ressources à travers le
// réseau de manière asynchrone et on retourne l'id via getId --> url.searchParams.get("id")
fetch(`http://localhost:3000/api/products/${getId}`)
  // retourne une promise (promesse) contenant, en réponse, un objet (de type Response) --> res
  // => on transforme Response en .json pour pouvoir le lire en chaine de caractère afin de le manipuler
  .then((res) => res.json())
  // Pour avoir accès à nos données
  .then((data) => {
    // On ajoute du HTML à l'endroit flagImg
    // On prend dans la base de donnée l'imageURL (data.imageURL)
    flagImg.innerHTML += `
    <img src="${data.imageUrl}" alt="Photographie d'un canapé">
    `;

    flagTitle.innerText += `${data.name}`;

    flagPrice.innerText += `${data.price}`;

    flagDescription.innerText += `${data.description}`;

    // Pour chaque couleur dans la base de donnée on écrit du html à l'endroit flagColors
    for (let color of data.colors) {
      flagColors.innerHTML += `
      <option value="${color}">${color}</option>
      `;
    }

    function takeIdColorsQuantity() {
      // On écoute au click sur "Ajouter au panier" l'Id, la couleur et la quantité
      flagAddToCart.addEventListener("click", () => {
        let selectedId = getId;
        let selectedColor = flagColors.value;
        let selectedQuantity = flagQuantity.value;

        // Création d'un objet qui comporte 3 clé et 3 valeurs mais ne vas pas créer un tableau pour autant !
        let product = {
          // Clé: Valeur
          id: selectedId,
          color: selectedColor,
          quantity: selectedQuantity,
        };

        // Vérification des conditions avant d'ajouter au panier
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
        } else addBasket(product); // On ajoute au panier le produit
      });
    }
    // Apelle la function
    takeIdColorsQuantity();
  });

// Permet d'enregistrer dans le LocalStorage en lui donnant comme nom de clé : basket
// C'est la sérialisation
function saveBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}

// Récupérer le panier puis pouvoir le lire en chaine de caractère
function getBasket() {
  //Permet de récupérer l'item avec le nom de clé : basket
  let basket = localStorage.getItem("basket");
  // Si basket est égal à null alors il va retourner un tableau
  if (basket == null) {
    return [];
  } else {
    // Retourne l'objet : basket en analysant la chaine de caractère qui est dedans
    return JSON.parse(basket);
  }
}

// Ajouter le produit au panier
function addBasket(product) {
  // Récupérer le panier puis pouvoir le lire en chaine de caractère
  let basket = getBasket();
  // On cherche dans le panier grace a .find par rapport a une condition

  /* Condition --> je cherche dans le panier (basket.find) (si il y a un produit (p) don l'id (p.id))
  est égale à l'id du produit que je veux ajouter (== product.id) et (&&) on cherche dans le panier
  (si il y a un produit (p) don la couleur (p.color)) est égale à la couleur du produit que je veux ajouter
  (== product.color) */

  // Si .find ne trouve pas la condition il retourne undefined
  let foundProduct = basket.find(
    (p) => p.id == product.id && p.color == product.color
  );
  // Si foundProduct est différent d'undefined
  if (foundProduct != undefined) {
    /* Analyse la chaîne de caractère avec un argument et renvoie un entier exprimé dans une Base de
    Donnée. On cherche la quantité dans le panier (foundProduct.quantity) + la quantité à l'écoute
    du click ajouter dans le panier (flagQuantity.value) */
    let actuallyQuantity =
      parseInt(foundProduct.quantity) + parseInt(flagQuantity.value);
    foundProduct.quantity = actuallyQuantity;
  } else {
    // on ajoute (.push) le produit à la fin du tableau qui est basket
    basket.push(product);
  }
  // Permet d'enregistrer dans le LocalStorage en lui donnant comme nom de clé : basket
  saveBasket(basket);
}
