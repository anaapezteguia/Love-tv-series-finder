'use strict'
//inicializo variables globales
const formElement = document.querySelector('.js-form');
const inputElement = document.querySelector('.js-seriesInput');
const searchBtnElement = document.querySelector('.js-searchBtn');
const resetBtnElement = document.querySelector('.js-resetBtn');
const ulResultsElement = document.querySelector('.js-searchList');

//arrays de pelis vacíos
let seriesArray = [];
let favSeries = [];

//llamada a API para coger series
function getSeries() {
    const search = inputElement.value;
    fetch(`http://api.tvmaze.com/search/shows?q=${search}`)
 
      .then(response => response.json())
        .then(data => {
            for (const series of data) {
                seriesArray.push(series.show);
            }
            paintSearchResults();
        //guardaremos en LOCAL STORAGE
        });
}
searchBtnElement.addEventListener('click', getSeries);

// prevenir envío form
function handleForm(ev) {
    ev.preventDefault();
}
formElement.addEventListener('submit', handleForm);

//local storage
// function setInLocalStorage() {
//     const stringSeries = JSON.stringify(favSeries);
//     localStorage.setItem('favSeries', stringSeries);
//   }

  
// pintar series
function paintSearchResults() {
    let htmlCode = '';
    const defaultImg = 'https://via.placeholder.com/210x295/dcbcc6/666666/?text=DEFAULT IMAGE';
    // pintando HTML
    // si me queda tiempo, PARA NOTA, pintarlo con DOM
    for (const serie of seriesArray) {
        //aplico la clase favorita al clicarla
        let isFavoriteClass;
        let fav;
        if (isFavoriteSerie(serie)) {
            isFavoriteClass = 'favorite';
            fav = '⭑';
        } else {
            isFavoriteClass = '';
            fav = '';
        }
        const seriesId = serie.id;
        const seriesName = serie.name;
        const serieImgsObj = serie.image; //objeto con las imágenes
        htmlCode += `<li class="searchList__li js-series" id="${seriesId}">`;
        htmlCode += '<div class="searchList__container">';
        // si no existe img medium, saca la default img y si no la suya
        let myImg = serieImgsObj === null ? defaultImg : serieImgsObj.medium;
        htmlCode += `<img class="${isFavoriteClass} favImg js-seriesImg" src="${myImg}" alt="${seriesName}" title="${seriesName}" size="210x295" >`;
        htmlCode += `<h3 class="searchList__title ${isFavoriteClass} title js-seriesTitle">${seriesName} ${fav}`;
        htmlCode += '</div>';
        htmlCode += '</li>';
    }
    ulResultsElement.innerHTML = htmlCode;
    listenSeriesEvents();
}

// favoritos
function isFavoriteSerie(serie) {
    // compruebo si la serie que recibo por parámetro está en los favoritos
    const favoriteFound = favSeries.find(favorite => {
        // console.log(favorite);
      return favorite.id === serie.id;
    });
    // find devuelve undefined si no lo encuentra
    // retorno si está o no está en favoritos
    if (favoriteFound === undefined) {
      return false;
    } else {
      return true;
    }
}

// escucho los eventos de las series
function listenSeriesEvents() {
    const seriesElements = document.querySelectorAll('.js-series');
    for (const serieElement of seriesElements) {
      serieElement.addEventListener('click', handlePickedSeries);
    }
  }
  
  // compruebo si la serie clicada está dentro de favSeries
function handlePickedSeries(ev) {
    // obtengo el id de la serie clicada
    const clickedSeriesId = parseInt(ev.currentTarget.id);//convertir en nº
    // busco si la serie clicada está en el array favSeries
    const favoritesFoundIndex = favSeries.findIndex(function (favorite) {
      return favorite.id === clickedSeriesId;
    });
    // busco la serie clicada en el array de seriesArray
      const seriesFoundIndex = seriesArray.find(function (serie) {
      return serie.id === clickedSeriesId;
      });
      const seriesIndexId = seriesFoundIndex.id;
      // si la serie no está en favoritos findIndex me ha devuelto -1
      if (favoritesFoundIndex === -1) {
          // para luego añadirlo al array favSeries
          favSeries.push(seriesFoundIndex);
        //   console.log(favSeries);
          
          // si hay favoritos comparo los ID del clicado y el de favoritos
    } else if ((favoritesFoundIndex >= 0) && (clickedSeriesId === seriesIndexId)){
      // para sacarlo de favSeries necesito el índice del elemento que quiero borrar (solo un elemento)
        favSeries.splice(favoritesFoundIndex, 1);
        // console.log(favSeries);
    }
    // vuelvo a pintar y a escuchar eventos cada vez que cambio algo
    paintSearchResults();
  }

//quitar antes de subir
searchBtnElement.click()