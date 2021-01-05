var cityHistory = [];
var maxHistory = 10;
var weatherKey = "5efd05a754597abdb5bf0d33ada633b7";

/* Renders city history list */
function renderHistory() {
  $("#history-container").empty();
  /* Adds one div for each city in history */
  cityHistory.forEach(function (city) {
    $("#history-container").append("<div class='past-city'>" + city + "</div>");
  });
  /* Adds click event to run a weather query when a city is clicked */
  $(".past-city").click(cityFromHistory);
}

/* Loads city history from local storage */
function loadHistory() {
  var loadedHistory = JSON.parse(localStorage.getItem("past-cities"));

  if (loadedHistory) {
    cityHistory = loadedHistory;
    renderHistory();
  }

  /* Query most recent city or hide results if none */
  if (cityHistory[0]) {
    queryCity(cityHistory[0]);
  } else {
    $("#result-col").addClass("hidden");
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

/* Queries weather from history */
function cityFromHistory() {
  var city = $(this).text();
  queryCity(city);
}

/* Queries weather from input field and saves city to history */
function cityFromInput(event) {
  event.preventDefault();
  var city = $("#city-input").val();

  if (city !== "") {
    $("#city-input").val("");
    queryCity(city);
    saveCity(city);
  }
}

/* Queries a city and updates the current weather. It then queries the lat/lon of that city for UVI and forecase */
function queryCity(city) {
  var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + weatherKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    $("#result-col").removeClass("hidden");
    $("#current-date").text(moment().format("M/D/YYYY"));
    $("#current-city").text(response.name);
    $("#current-temp").text(response.main.temp);
    $("#current-humid").text(response.main.humidity);
    $("#current-wind").text(response.wind.speed);
    $("#current-icon").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");

    /* TODO: Use lat/lon to query UVI and 5-day forecast */
  });
}

/* Add click response to search button */
$("#search-btn").click(cityFromInput);

loadHistory();
