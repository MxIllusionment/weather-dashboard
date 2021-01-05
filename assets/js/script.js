var cityHistory = [];
var maxHistory = 10;

/* Renders city history list */
function renderHistory() {
  $("#history-container").empty();
  cityHistory.forEach(function (city) {
    $("#history-container").append("<div class='past-city'>" + city + "</div>");
  })
}

/* Loads city history from local storage */
function loadHistory() {
  var loadedHistory = JSON.parse(localStorage.getItem("past-cities"));

  if (loadedHistory) {
    cityHistory = loadedHistory;
    renderHistory();
  }
}

/* Saves city to history */
function saveCity(city) {
  if (cityHistory.indexOf(city) === -1) {
    cityHistory.unshift(city);
    cityHistory = cityHistory.slice(0, maxHistory);
    localStorage.setItem("past-cities", JSON.stringify(cityHistory));
    renderHistory();
  }
}

/* Queries weather and saves city to history */
function queryCity(event) {
  event.preventDefault();
  var city = $("#city-input").val();
  $("#city-input").val("");

  /* TODO: Send AJAX query to Open Weather API */

  saveCity(city);
}

/* Add click response to search button */
$("#search-btn").click(queryCity);

loadHistory();
