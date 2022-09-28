// Prend l'url et saute le 1er caractère
const orderId = location.search.substring(1);
document.querySelector("#orderId").textContent = `${orderId}`;

localStorage.clear();
