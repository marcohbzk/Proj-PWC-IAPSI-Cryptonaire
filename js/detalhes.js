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
              <span style="padding:10px">Valor Atual: ${
                currency.symbol + res.market_data.current_price[currency.name]
              }</span><br>
              <span></span><br>
              <span style="padding:10px">Website: <a href="${
                res.links.homepage[0]
              }">${res.links.homepage[0]}</a></span><br>
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
    let str = ``;
    str += `       
              $("#sparkline").sparkline(${res.market_data.sparkline_7d.price}, {type: 'line'});
          `;
    document.querySelector("#details").innerHTML = str;
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
