"use strict";
currency = JSON.parse(localStorage.currency);

let criptoM = localStorage.criptomoeda;

// ---------------- Navbar Responsive ------------------------------------------//

document.querySelector(".navbar-toggler").addEventListener("click", function(e){document.querySelector(".collapse").classList.toggle("show");}); 

document.querySelector("#shmenulinks").addEventListener("click",function(e){document.querySelector("#menulinks").classList.toggle("show");});

// --------------------------------- Função Para Detalhes (Detalhes) --------------------------------- //

function mostrarBase() {
  let itensAtivos = document.querySelectorAll("#menulinks a");
  itensAtivos.forEach((itemAtivo) => {
    itemAtivo.classList.remove("active");
  });

  document.querySelector("#base").classList.add("active");

  $.ajax({
    method: "GET",
    url: `https://api.coingecko.com/api/v3/coins/${criptoM}?sparkline=true`,
  }).done(function (res) {
    console.log(res);
    let str = ``;
    str += `
              <span><img src="${res.image.large}" class="imgdetalhes"/></span>
              <span style="padding:10px">Posição: <strong>${
                res.market_data.market_cap_rank + "º"
              }</strong></span><br>
              <span style="padding:10px">Nome: ${res.name}</span><br>
              <span style="padding:10px">Abreviatura: ${res.symbol.toUpperCase()}</span><br>
              <span style="padding:10px">Valor Atual: ${currency.symbol + res.market_data.current_price[currency.name]}</span><br>
              <span></span><br>
              <span style="padding:10px">Website: <a href="${res.links.homepage[0]}">${res.links.homepage[0]}</a></span><br>
			  <span></span><br>
			  <button onclick="addStorage(this);" moeda="${res.id}" class="button-border button-favorite"><span style="padding:10px; cursor:pointer; font-size:25px;" class="fa-custom ${verifClass(res.id)}"><i class="fa fa-heart" aria-hidden="true"></i></span></button>
          `;

    document.querySelector("#details").innerHTML = str;
  });
}


// --------------------------------- Função Para Mostrar Ativos (Detalhes) --------------------------------- //
function mostrarGrafico() {
  let itensAtivos = document.querySelectorAll("#menulinks a");
  itensAtivos.forEach((itemAtivo) => {
    itemAtivo.classList.remove("active");
  });

  document.querySelector("#grafico").classList.add("active");

  $.ajax({
    method: "GET",
    url: `https://api.coingecko.com/api/v3/coins/${criptoM}?sparkline=true`,
  }).done(function (res) {
    console.log(res.market_data.current_price);
	$("#details").sparkline(res.market_data.sparkline_7d.price, {type: 'line'});
  });
}

function mostrarHistoria() {
  let itensAtivos = document.querySelectorAll("#menulinks a");
  itensAtivos.forEach((itemAtivo) => {
    itemAtivo.classList.remove("active");
  });

  document.querySelector("#historia").classList.add("active");

  $.ajax({
    method: "GET",
    url: `https://api.coingecko.com/api/v3/coins/${criptoM}?sparkline=true`,
  }).done(function (res) {
    console.log(res.market_data.current_price);
    let str = ``;
    str += `
              <img src="${res.image.small}" class="imgdetalhes"/>
              <h1 style="text-align:center;">${res.name}'s Description:</h1>
              <br>         
              <span>${res.description.pt}.</span>
              
          `;
    document.querySelector("#details").innerHTML = str;
  });
}

mostrarBase();

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
              <td><span class="valor">${
                currency.symbol + result.current_price
              }</span></td>
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
}
function verifClass(moeda) {
  let favorites = getFavorite();
  if (favorites) {
    if (favorites.includes(moeda)) {
      return "favSimbVerm";
    }
  }
}
