const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const weatherCardsDiv=document.querySelector(".weather-cards");
const currentWeatherDiv=document.querySelector(".current-weather");

const API_KEY = "3b13044eef411fc840cab0cda21a509d";

const createWeatherCard=(cityName, weatherItem, index)=>{
    if(index===0){
        return`<div class="details">
                    <h2>Current Weather</h2>
                    <h2>${cityName}(${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4>Temperature: ${(weatherItem.main.temp -273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                </div>
                <div class="icon">
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;

    }else{
        return`<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                <h4>Temp: ${(weatherItem.main.temp -273.15).toFixed(2)}°C</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </li>`;
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL=`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        
    
        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if(!uniqueForecastDays.includes (forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        
        fiveDaysForecast.forEach((weatherItem ,index) => {
            if(index===0){
                currentWeatherDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem , index));
            }else{
                weatherCardsDiv.insertAdjacentHTML("beforeend", createWeatherCard(cityName, weatherItem , index));
            }
        });
    }).catch(() => {
        alert("An error occurred while fetching the weather forecast!");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;
    const GEOCODING_API_URL=`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon }=data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => { 
        alert("An error occurred while fetching the coordinates!");
    });
}
searchButton.addEventListener("click",getCityCoordinates);

const cities = ["London", "Delhi", "Dubai", "New York", "Sydney"];
const weatherContainer = document.getElementById("weatherContainer");

// Function to fetch weather data
async function fetchWeather(city) {
    const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (response.ok) {
            displayWeather(data);
        } else {
            console.error("Error fetching data:", data.message);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

// Function to display weather data
function displayWeather(data) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <h2>${data.name}</h2>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather Icon">
        <p>Temp: ${Math.round(data.main.temp)}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s</p>
    `;

    weatherContainer.appendChild(card);
}

// Fetch weather for all cities
cities.forEach(city => fetchWeather(city));




