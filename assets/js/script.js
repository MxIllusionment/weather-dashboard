var cityHistory = [];
var maxHistory = 10;
var weatherKey = "5efd05a754597abdb5bf0d33ada633b7";
var uviColors = {
  low: "#289500",
  moderate: "#f7e400",
  high: "#f85900",
  veryHigh: "#d80010",
  extreme: "#6b49c8"
};

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
  var cityIndex = cityHistory.indexOf(city);

  /* Remove city from history if already present */
  if (cityIndex !== -1) {
    cityHistory.splice(cityIndex, 1);
  }
  /* Add city to front of list */
  cityHistory.unshift(city);
  /* Trim history to limit */
  cityHistory = cityHistory.slice(0, maxHistory);
  /* Save history to storage */
  localStorage.setItem("past-cities", JSON.stringify(cityHistory));
  renderHistory();
}

/* Queries weather from history */
function cityFromHistory() {
  var city = $(this).text();
  queryCity(city);
}

/* Queries weather from input field and saves city to history */
function cityFromInput(event) {
  event.preventDefault();
  var city = $("#city-input").val().trim();

  $("#city-input").val("");

  if (city !== "") {
    queryCity(city);
  }
}

/* Updates UVI entry with text and color */
function updateUVI(uvi) {
  var bgColor;
  var textColor = "white";

  $("#current-uvi").text(uvi);
  if (uvi < 3) {
    bgColor = uviColors.low;
  } else if (uvi < 6) {
    bgColor = uviColors.moderate;
    textColor = "black";
  } else if (uvi < 8) {
    bgColor = uviColors.high;
  } else if (uvi < 11) {
    bgColor = uviColors.veryHigh;
  } else {
    bgColor = uviColors.extreme;
  }
  $("#current-uvi").css("background-color", bgColor);
  $("#current-uvi").css("color", textColor);
}

/* Updates the forecast info for a particular day */
function updateForecast(day, data) {
  var div = $("#forecast-day-" + day);

  div.children(".fc-date").text(moment().add(day, "days").format("M/D/YYYY"));
  div.children(".fc-icon").attr("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + ".png");
  div.find(".fc-temp").text(parseFloat(data.temp.day).toFixed(1));
  div.find(".fc-humid").text(data.humidity);
}

/* Queries Open Weather "One Call" to retrieve UVI and 5-day forecast */
function queryOneCall(lon, lat) {
  var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&exclude=minutely,hourly,alerts&appid=" + weatherKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function (response) {
    updateUVI(parseFloat(response.current.uvi));
    for (var i = 0; i < 5; i++) {
      updateForecast(i + 1, response.daily[i]);
    }
    /* Display results */
    $("#result-col").removeClass("hidden");
  });
}

/* Queries a city and updates the current weather. It then queries the lat/lon of that city for UVI and forecase.
   The city is saved to history if the query was successful. */
function queryCity(city) {
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + weatherKey;

  /* Hide results */
  $("#result-col").addClass("hidden");

  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function (response) {
    $("#current-date").text(moment().format("M/D/YYYY"));
    $("#current-city").text(response.name);
    $("#current-temp").text(parseFloat(response.main.temp).toFixed(1));
    $("#current-humid").text(response.main.humidity);
    $("#current-wind").text(response.wind.speed);
    $("#current-icon").attr("src", "https://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");

    /* Use lat/lon to query UVI and 5-day forecast */
    queryOneCall(response.coord.lon, response.coord.lat);

    saveCity(response.name);
  });
}

/* Add click response to search button */
$("#search-btn").click(cityFromInput);

loadHistory();
