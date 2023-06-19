// State
let currCity = "Jakarta";
let units = "metric";
let isLonglat = false;
let intervalId;
let weatherDataFound = true;

// Selectors
let city = document.querySelector(".weather__city");
let datetime = document.querySelector(".weather__datetime");
let weather__forecast = document.querySelector('.weather__forecast');
let weather__temperature = document.querySelector(".weather__temperature");
let weather__icon = document.querySelector(".weather__icon");
let weather__minmax = document.querySelector(".weather__minmax")
let weather__sunrise = document.querySelector(".sunrise")
let weather__sunset = document.querySelector(".sunset")
let weather__realfeel = document.querySelector('.weather__realfeel');
let weather__humidity = document.querySelector('.weather__humidity');
let weather__wind = document.querySelector('.weather__wind');
let weather__pressure = document.querySelector('.weather__pressure');
let air_quality = document.querySelector(".air_quality")
let air_quality_status = document.querySelector(".air_quality_status")
let components_value_all = document.querySelectorAll(".component_value")

// Get latitude and longitude
function getLatitudeLongitude() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
        function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            // Call weather API with obtained coordinates
            getWeatherByCoordinates(latitude, longitude);
            getAirQuality(latitude,longitude);
            getForecastByCoordinate(latitude, longitude);
        },
        function (error) {
            console.error("Error getting location:", error);
            // Fall back to default city if geolocation fails
            getWeatherByCity(currCity);
            getForecast();
        }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
        // Fall back to default city if geolocation is not supported
        getWeatherByCity(currCity);
        getForecast();
    }
}

// Get weather by city name
function getWeatherByCity(city) {
    const API_KEY = '86d88fac1164d4c3472d6e3666cf131f';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`)
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return res.json();
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            weatherDataFound = false; 
        })
        .then(data => {
            displayWeather(data);
            weatherDataFound = true;
        });
}

// Get weather by coordinates
function getWeatherByCoordinates(latitude, longitude) {
    const API_KEY = '86d88fac1164d4c3472d6e3666cf131f';
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=${units}`)
        .then(res => res.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });
}

// Display weather data
function displayWeather(data) {
    if (weatherDataFound) {
        // Update DOM elements with weather data
        city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`;
        updateDateTime(Date.now() / 1000, data.timezone); // Use current timestamp instead of data.dt
        weather__forecast.innerHTML = `<p>${data.weather[0].main}</p>`;
        weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176;`;
        weather__icon.innerHTML = `<img src="${data.weather[0].main}.png" />`;
        weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176;</p><p>Max: ${data.main.temp_max.toFixed()}&#176;</p>`;
        convertSunriseSunset(data.sys.sunrise, data.sys.sunset);
        weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176;`;
        weather__humidity.innerHTML = `${data.main.humidity}%`;
        weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph" : "m/s"}`;
        weather__pressure.innerHTML = `${data.main.pressure} hPa`;
    
        clearInterval(intervalId);
        intervalId = setInterval(function () {
        updateDateTime(Date.now() / 1000, data.timezone); // Update with current timestamp
        }, 1000);

        if (units == "metric") {
            document.querySelector(".weather_unit_celsius").style.backgroundColor = "#ffc200";
            document.querySelector(".weather_unit_farenheit").style.backgroundColor = "#ffffff";
        } else{
            document.querySelector(".weather_unit_celsius").style.backgroundColor = "#ffffff";
            document.querySelector(".weather_unit_farenheit").style.backgroundColor = "#ffc200";
        }
    } else {
        city.innerHTML = "City not found";
        datetime.innerHTML = "";
        weather__forecast.innerHTML = "";
        weather__temperature.innerHTML = "";
        weather__icon.innerHTML = "";
        weather__minmax.innerHTML = "";
        weather__sunrise.innerHTML = "";
        weather__sunset.innerHTML = "";
        weather__realfeel.innerHTML = "";
        weather__humidity.innerHTML = "";
        weather__wind.innerHTML = "";
        weather__pressure.innerHTML = "";
        weatherDataFound = true; 
    }
}
  
// Convert country code to name
function convertCountryCode(country) {
    let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(country);
}

// Convert timestamp to formatted date and time
function convertTimeStamp(timestamp, timezone) {
    const date = new Date(timestamp * 1000);
    const convertTimezone = timezone / 3600; // convert seconds to hours 
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
        hour12: false,
    };
    return date.toLocaleString("en-US", options);
}

function updateDateTime(timestamp, timezone) {
    const formattedDate = convertTimeStamp(timestamp, timezone);
    datetime.innerHTML = formattedDate;
}

function convertSunriseSunset(sr, ss) {
    let sunrise = new Date(sr * 1000);
    let sunset = new Date(ss * 1000);
    const options = {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
    };
    weather__sunrise.innerHTML = `Sunrise: ${sunrise.toLocaleString("en-US", options)}`;
    weather__sunset.innerHTML = `Sunset: ${sunset.toLocaleString("en-US", options)}`;
}
  

// Search form submission event
document.querySelector(".weather__search").addEventListener('submit', e => {
    let search = document.querySelector(".weather__searchform");
    // Prevent default action
    e.preventDefault();
    // Change current city
    currCity = search.value;
    // Clear form
    search.value = "";
    // Get weather forecast by city name
    clearInterval(intervalId);
    intervalId = setInterval(() => {
        if (weatherDataFound) {
            getWeatherByCity(currCity);
            getCoordinatesFromCity(currCity)
            .then(coordinates => {
                if (coordinates) {
                    getAirQuality(coordinates.latitude, coordinates.longitude);
                    console.log("masuk")
                } else {
                    console.log('Coordinates not found.');
                }
            });
            getForecast();
        } else {
            clearInterval(intervalId);
        }
    }, 1000);
});

document.querySelector(".weather__longlat").addEventListener("click", () => {
    isLonglat = true;
    getLatitudeLongitude();
});

// Units selection events
document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
  if (units !== "metric") {
    units = "metric";
    if (isLonglat) {
      getLatitudeLongitude();
    } else {
      getWeatherByCity(currCity);
    }
    document.querySelector(".weather_unit_celsius").style.backgroundColor = "#ffc200";
    document.querySelector(".weather_unit_farenheit").style.backgroundColor = "#FFFFFF";
  }
});

document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
  if (units !== "imperial") {
    units = "imperial";
    if (isLonglat) {
      getLatitudeLongitude();
    } else {
      getWeatherByCity(currCity);
    }
    document.querySelector(".weather_unit_celsius").style.backgroundColor = "#FFFFFF";
    document.querySelector(".weather_unit_farenheit").style.backgroundColor = "#ffc200";
  }
});

async function getCoordinatesFromCity(city) {
    const API_KEY = 'd2c621e47181ff427c2d3fe67c0b877a'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.length > 0) {
        const latitude = data[0].lat;
        const longitude = data[0].lon;
        return { latitude, longitude };
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

function getAirQuality(latitude, longitude) {
    const API_KEY = 'd2c621e47181ff427c2d3fe67c0b877a';
    fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        setValuesOfAir(data)
        setComponentsOfAir(data)
    })
    .catch(err => {
        console.error("Error fetching air quality data:", err);
    });
}

function setValuesOfAir(data) {
    const aqi = data.list[0].main.aqi;
    let status = "";
    let color = "";

    air_quality.innerHTML = aqi;

    switch (aqi) {
        case 1:
            status = "Good";
            color = "rgb(19, 201, 28)";
            break;
        case 2:
            status = "Fair";
            color = "rgb(15, 134, 25)";
            break;
        case 3:
            status = "Moderate";
            color = "rgb(201, 204, 13)";
            break;
        case 4:
            status = "Poor";
            color = "rgb(204, 83, 13)";
            break;
        case 5:
            status = "Very Poor";
            color = "rgb(204, 13, 13)";
            break;
        default:
            status = "Unknown";
            color = "rgb(0, 0, 0)"; // Default color when AQI is unknown
    }

    air_quality_status.innerHTML = status;
	air_quality_status.style.color = color;
}

function setComponentsOfAir(data) {
    const components = { ...data.list[0].components };
    
    components_value_all.forEach(component => {
        const attr = component.getAttribute('id');
        const value = components[attr] || 0; // Default 0 if the component is not available
        component.innerText = `${value} μg/m³`;
    });
      
}

function getForecast() {
  const API_KEY = 'd2c621e47181ff427c2d3fe67c0b877a';
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${currCity}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
        displayDataForecaset(data);
    })
    .catch(err => {
        console.error("Error fetching forecast data:", err);
        displayDataErrorForecast();
    });
}

function getForecastByCoordinate(latitude, longitude) {
    const API_KEY = 'd2c621e47181ff427c2d3fe67c0b877a';
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
          displayDataForecaset(data);
      })
      .catch(err => {
          console.error("Error fetching forecast data:", err);
          displayDataErrorForecast();
      });
}

function displayDataForecaset(data) {
    for (let i = 0; i < 5; i++) {
        document.getElementById("day" + (i + 1) + "Min").innerHTML = "Min: " + Number(data.list[i].main.temp_min - 273.15).toFixed(1) + "°";
        document.getElementById("day" + (i + 1) + "Max").innerHTML = "Max: " + Number(data.list[i].main.temp_max - 273.15).toFixed(2) + "°";
        document.getElementById("img" + (i + 1)).src = data.list[i].weather[0].main + ".png";
        document.getElementById("day" + (i + 1)).innerHTML = weekday[CheckDay(i)];
    }
}

function displayDataErrorForecast() {
    for (let i = 0; i < 5; i++) {
        document.getElementById("day" + (i + 1) + "Min").innerHTML = "Min: No Data";
        document.getElementById("day" + (i + 1) + "Max").innerHTML = "Max: No Data";
        document.getElementById("img" + (i + 1)).src = "Logo.png";
        document.getElementById("day" + (i + 1)).innerHTML = weekday[CheckDay(i)];
    }
}

// Getting and displaying the text for the upcoming five days of the week
const d = new Date();
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function CheckDay(day) {
    if (d.getDay() + day + 1 > 6) {
        return (d.getDay() + day + 1) - 7;
    } else {
        return (d.getDay() + day + 1);
    }
}

// Initial weather display
getWeatherByCity(currCity);
getCoordinatesFromCity(currCity)
.then(coordinates => {
    if (coordinates) {
        getAirQuality(coordinates.latitude, coordinates.longitude);
        console.log("masuk")
    } else {
        console.log('Coordinates not found.');
    }
});
getForecast();
