let getItems = document.querySelector("#items");

// Récupère LS puis le boucle en l'affichant dans le dom pour chaque Object
fetch("http://localhost:3000/api/products")
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    data.forEach((e) => {
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
