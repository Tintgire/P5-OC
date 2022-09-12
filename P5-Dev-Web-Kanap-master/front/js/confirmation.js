// Prend l'urlet saute le 1er caractère
const orderId = location.search.substring(1);
document.querySelector("#orderId").textContent = `${orderId}`;
