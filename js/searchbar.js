"use strict";

const searchInput = document.getElementById("searchInput")
searchInput.addEventListener("keyup", event =>{
  event.preventDefault()
  console.log(event.key)
  /* if (event.keyCode === 13){
    document.getElementById("searchButton") 
    console.log(document.getElementById("searchButton"))
  } */
})


// --------------------------------- Função Procurar () --------------------------------- //
function searchCoins(target) {

  if (localStorage.currency) {
    currency.name = JSON.parse(localStorage.currency).name;
    currency.symbol = JSON.parse(localStorage.currency).symbol;
  }
  target.preventDefault();
  var valTosearch = $("#searchInput").val().toLowerCase();

  $.ajax({
    type: "GET",
    datatype: "json",
    url: `https://api.coingecko.com/api/v3/coins/${valTosearch}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`,
    success: function (result) {
      console.log(result);
      let str = ``;

      str += `
          <tr id="fila">
              <th><button onclick="addStorage(this);" moeda="${result.id}" class="button-border button-favorite"><span class="fa-custom ${verifClass(result.id)}"><i class="fa fa-heart" aria-hidden="true"></i></span></button></th>
              <th scope="row"><span class="ranking">${result.market_cap_rank + "º"}</span></th>
              <td><img class="simbolo" src="${result.image.small}"/></td>
              <td><span class="moeda" onclick="criptomoeda(\`${result.id}\`)">${result.name}</span></td>
              <td><span class="abreviatura">${result.symbol.toUpperCase()}</span></td>
              <td><span class="valor">${currency.symbol +result.market_data.current_price[currency.name]}</span></td>
          `;

      if (
        result.market_data.price_change_percentage_24h != undefined &&
        result.market_data.price_change_percentage_24h
          .toFixed(1)
          .indexOf("-") == -1
      ) {
        str += `<td><span class="dailyChange" style="color: green;">▲ +${
          result.market_data.price_change_percentage_24h.toFixed(1) + "%"
        }</span></td>`;
      } else if (result.market_data.price_change_percentage_24h != undefined) {
        str += `<td><span class="dailyChange" style="color: red;">▼ ${
          result.market_data.price_change_percentage_24h.toFixed(1) + "%"
        }</span></td>`;
      } else {
        str += `<td><span class="dailyChange" style="color: red;"> ... </span></td>`;
      }

      str += `</tr>`;
		
	  var path = window.location.pathname;
	  var page = path.split("/").pop();
	  console.log( page );
	  if(page == "detalhes.html"){
		  localStorage.criptomoeda = result.id; 
		  location.reload();
	  }else{
      document.querySelector("#tabela>tbody").innerHTML = str;
	  }	
	  },
  });
}
