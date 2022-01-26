"use strict";

let currency;

// --------------------------------- Função Alterar Moedas --------------------------------- //

function setCurrency() {
  let currencies = document.querySelectorAll(".dropdown-content a");
  currencies.forEach((c) => {
    c.onclick = (event) => {
      console.log(event.target);
      currency.name = event.currentTarget.getAttribute("currencyName");
      currency.symbol = event.currentTarget.getAttribute("currencySymbol");
      console.log(currency);
      localStorage.currency = JSON.stringify(currency);
      location.reload();
    };
  });
}
setCurrency();
