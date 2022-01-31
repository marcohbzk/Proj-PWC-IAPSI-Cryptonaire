"use strict";

currency = JSON.parse(localStorage.currency);

document.cookie = "SameSite";

// --------------------------------- Ideias --------------------------------- //
/*
    ->  Refresh automático da informação das moedas.
    ->    Search atualizado à medida da escrita.
    ->      Animação no botão de favoritos.
    ->        Search feito pelo Enter e pelo botão.
    ->          Sparkline apenas na página dos detalhes.
    ->             Conseguir pesquisar a moeda pelo ranking e por abreviaturas
*/
// --------------------------------- Manutenção --------------------------------- //
/*
-> Página de favoritos tem espaços vazios.
-> Localstorage não funciona em aba anónima.
*/

// ---------------- Navbar Responsive ------------------------------------------//

document.querySelector(".navbar-toggler").addEventListener("click", function(e){document.querySelector(".collapse").classList.toggle("show");}); 

// --------------------------------- Função Alterar Top --------------------------------- //

function check() {
  if (document.getElementById("onoff1").checked) {
    showTenCoins();
  } else if (document.getElementById("onoff1")) {
    showAllCoins();
  }
}

// --------------------------------- Função Chamar API --------------------------------- //
function criptomoeda(cripto) {
  localStorage.criptomoeda = cripto;
  window.location.href = "./detalhes.html";
}
// ----- Chamar Top 100 ----- //

function showAllCoins() {
  if (localStorage.currency) {
    currency.name = JSON.parse(localStorage.currency).name;
    currency.symbol = JSON.parse(localStorage.currency).symbol;
  }

  $.ajax({
    method: "GET",
    url: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
  }).done(function (res) {
    let str = ``;
    res.forEach((result) => {
      str += `
        <tr id="fila">
            <th><button onclick="addStorage(this);" moeda="${result.id}" class="button-border button-favorite"><span class="fa-custom ${verifClass(result.id)}"><i class="fa fa-heart" aria-hidden="true"></i></span></button></th>
            <th scope="row"><span class="ranking">${
              result.market_cap_rank + "º"
            }</span></th>
            <td><img class="simbolo" src="${result.image}"/></td>
            <td><span class="moeda" onclick="criptomoeda(\`${result.id}\`)">${
        result.name
      }</span></td>
            <td><span class="abreviatura" style="text-align: left;">${result.symbol.toUpperCase()}</span></td>
            <td><span class="valor">${
              currency.symbol + result.current_price
            }</span></td>
        `;
      if (result.price_change_percentage_24h.toFixed(1).indexOf("-") == -1) {
        str += `<td><span class="dailyChange" style="color: green;">▲ +${
          result.price_change_percentage_24h.toFixed(1) + "%"
        }</span></td>`;
      } else {
        str += `<td><span class="dailyChange" style="color: red;">▼ ${
          result.price_change_percentage_24h.toFixed(1) + "%"
        }</span></td>`;
      }
      str += `</tr>`;
    });
    document.querySelector("#tabela>tbody").innerHTML = str;
  });
}

window.onload = showAllCoins;

// ----- Chamar Top 10 ----- //

function showTenCoins() {
  if (localStorage.currency) {
    currency.name = JSON.parse(localStorage.currency).name;
    currency.symbol = JSON.parse(localStorage.currency).symbol;
  }

  $.ajax({
    method: "GET",
    url: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}&order=market_cap_desc&per_page=10&page=1&sparkline=false`,
  }).done(function (res) {
    let str = ``;
    res.forEach((result) => {
      str += `
        <tr id="fila">
            <th><button onclick="addStorage(this);" moeda="${
              result.id
            }" class="button-border button-favorite"><span class="fa-custom ${verifClass(
        result.id
      )}"><i class="fa fa-heart" aria-hidden="true"></i></span></button></th>
            <th scope="row"><span class="ranking">${
              result.market_cap_rank + "º"
            }</span></th>
            <td><img class="simbolo" src="${result.image}"/></td>
            <td><span class="moeda" onclick="criptomoeda(\`${result.id}\`)">${
        result.name
      }</span></td>
            <td><span class="abreviatura" style="text-align: left;">${result.symbol.toUpperCase()}</span></td>
            <td><span class="valor">${
              currency.symbol + result.current_price
            }</span></td>
        `;
      if (result.price_change_percentage_24h.toFixed(1).indexOf("-") == -1) {
        str += `<td><span class="dailyChange" style="color: green;">▲ +${
          result.price_change_percentage_24h.toFixed(1) + "%"
        }</span></td>`;
      } else {
        str += `<td><span class="dailyChange" style="color: red;">▼ ${
          result.price_change_percentage_24h.toFixed(1) + "%"
        }</span></td>`;
      }
      str += `</tr>`;
    });
    document.querySelector("#tabela>tbody").innerHTML = str;
  });
}

// --------------------------------- Função Para Chamar (Favorite) --------------------------------- //

function getFavorite() {
  let favorite = localStorage.getItem("favorite");

  return JSON.parse(favorite) || [];
}
// --------------------------------- Função Para Adicionar aos Favoritos (Favorite) --------------------------------- //

function addStorage(coin) {
  let icon = coin.querySelector("span");
  let moeda = coin.getAttribute("moeda").toLowerCase();
  let favorite = getFavorite();
  if (favorite.length) {
    if (!favorite.includes(moeda)) {
      icon.classList.add("favSimbVerm");
      favorite.push(moeda);
      localStorage.setItem("favorite", JSON.stringify(favorite));
    } else {
      icon.classList.remove("favSimbVerm");
      removeStorage(moeda);
    }
  } else {
    icon.classList.add("favSimbVerm");
    favorite.push(moeda);
    localStorage.setItem("favorite", JSON.stringify(favorite));
  }
  console.log(icon);
}
// --------------------------------- Função Para Remover dos Favoritos (Favorite) --------------------------------- //
function removeStorage(moeda) {
  let favorite = getFavorite();
  let index = favorite.indexOf(moeda);
  favorite.splice(index, 1);
  localStorage.setItem("favorite", JSON.stringify(favorite));
}
// --------------------------------- Função Para Mostrar (Favorite) --------------------------------- //
function showFavCoins() {
  if (localStorage.currency) {
    currency.name = JSON.parse(localStorage.currency).name;
    currency.symbol = JSON.parse(localStorage.currency).symbol;
  }
	
  let favorite = localStorage.getItem("favorite");
  if (favorite != null) {
    favorite = JSON.parse(favorite);
    favorite.join();
    let count = 0;
    currency.name = JSON.parse(localStorage.currency).name;

    $.ajax({
      method: "GET",
      url: `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${
        currency.name
      }&ids=${encodeURI(
        favorite.join()
      )}&order=market_cap_desc&per_page=100&page=1&sparkline=false`,
    }).done(function (res) {
      let str = ``;
      res.forEach((result) => {
        for (let i = 0; i < favorite.length; i++) {
          if (result.id.toLowerCase() == favorite[i].toLowerCase()) {
            console.log(favorite.length);
            str += `
          <tr id="fila">
              <th><button onclick="addStorage(this);" moeda="${
                result.id
              }"  class="button-border button-favorite"><span class="fa-custom ${verifClass(
              result.id
            )}"><i class="fa fa-heart" aria-hidden="true"></i></span></button></th>
              <th scope="row"><span class="ranking">${
                result.market_cap_rank + "º"
              }</span></th>
              <td><img class="simbolo" src="${result.image}"/></td>
              <td><span class="moeda" onclick="criptomoeda(\`${result.id}\`)">${
              result.name
            }</span></td>
              <td><span class="abreviatura" style="text-align: left;">${result.symbol.toUpperCase()}</span></td>
              <td><span class="valor">${currency.symbol + result.current_price}</span></td>
          `;
            if (
              result.price_change_percentage_24h.toFixed(1).indexOf("-") == -1
            ) {
              str += `<td><span class="dailyChange" style="color: green;">▲ +${
                result.price_change_percentage_24h.toFixed(1) + "%"
              }</span></td>`;
            } else {
              str += `<td><span class="dailyChange" style="color: red;">▼ ${
                result.price_change_percentage_24h.toFixed(1) + "%"
              }</span></td>`;
            }
            str += `</tr>`;
            break;
          }
        }
      });
      document.querySelector("#tabela>tbody").innerHTML = str;
    });
  }
  if(favorite.length == 0){
	alert("Não existem criptomoedas favoritas!");
  }
}

function verifClass(moeda) {
  let favorites = getFavorite();
  if (favorites) {
    if (favorites.includes(moeda)) {
      return "favSimbVerm";
    }
  }
}
