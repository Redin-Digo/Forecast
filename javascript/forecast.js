function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }

  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Teusday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day} ${hour}:${minute}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Teu", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  let days = ["Mon", "Teu", "Wed", "Thu", "Fri", "Sat"];
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `
              <div class="col-2">
                <div class="weather-forecast-date">${formatDay(
                  forecastDay.dt
                )}</div>
                <img src="http://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png" alt="" width="50px" />
                <div class="weather-forecast-range">
                  <span class="max-temperature">${Math.round(
                    forecastDay.temp.max
                  )}°</span>
                  <span class="min-temperature">${Math.round(
                    forecastDay.temp.min
                  )}°</span>
                </div>
              </div>
           `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = `fbb92b85cb462d93f2e6bd667b26244c`;
  let unit = `metric`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  getForecast(response.data.coord);

  let iconElement = document.querySelector(`#icon`);
  iconElement.setAttribute(
    `src`,
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  iconElement.setAttribute(`alt`, response.data.weather[0].description);

  let currentDate = document.querySelector(`#date`);
  currentDate.innerHTML = formatDate(response.data.dt * 1000);

  let windElement = document.querySelector(`#wind`);
  windElement.innerHTML = Math.round(response.data.wind.speed);

  let humidityElement = document.querySelector(`#humidity`);
  humidityElement.innerHTML = response.data.main.humidity;

  let descriptionElement = document.querySelector(`#description`);
  descriptionElement.innerHTML = response.data.weather[0].description;

  let cityElement = document.querySelector(`#city`);
  cityElement.innerHTML = response.data.name;

  celsiusTemperature = response.data.main.temp;

  let temperatureElement = document.querySelector(`#temperature`);
  temperatureElement.innerHTML = Math.round(response.data.main.temp);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityName = document.querySelector(`#city-name`);
  search(cityName.value);
}

function search(city) {
  let apiKey = `fbb92b85cb462d93f2e6bd667b26244c`;
  let unit = `metric`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayTemperature);
}

function searchLocation(position) {
  let apiKey = "fbb92b85cb462d93f2e6bd667b26244c";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayTemperature);
}

function currentTemp(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let currentLocation = document.querySelector("#current-location");
currentLocation.addEventListener("click", currentTemp);

let celsiusTemperature = null;

let form = document.querySelector(`#search-form`);
form.addEventListener("submit", handleSubmit);

search("Lagos");
