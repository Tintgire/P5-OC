let getItems = document.querySelector("#items");

fetch("http://localhost:3000/api/products")
  .then(function (res) {
    return res.json(); // Api retourner en fichier promise json
  })
  .then(function (data) {
    // data est le fichier json qui est stocker
    //console.log(data);
    console.log(data);
    data.forEach((e) => {
      // boucle Pour Chaque avec un paramètre variable qui représente chaque élement du tableau
      // innerHTML va injecter du code dynamiquement via la boucle
      getItems.innerHTML += `
      <a href="./product.html?id=${e._id}">
        <article>
          <img src=${e.imageUrl} alt=${e.altTxt}>
          <h3 class="productName">${e.name}</h3>
          <p class="productDescription">${e.description}</p>
        </article>
      </a>
      `;
    });
  });

// tu récupère ton localstorage, tu le boucle et dans la boucle tu fetch avec l'ID. le résultat du fetch
//après tu peux l'envoyer dans une fonction qui va afficher le panier avec toutes les données
