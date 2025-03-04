// /home/aware621/repos/weather-app/app.js

// 使用 Visual Crossing Weather API
const API_KEY = '63JLN4UUDKY937DTK958B4TQY'; // 替换为你的 Visual Crossing API key

/**
 * 处理原始天气数据，提取所需信息
 * @param {object} rawData - 原始的 JSON 数据
 * @returns {object} - 包含简化天气信息的对象
 */
function processWeatherData(rawData) {
  if (!rawData || !rawData.currentConditions) {
    console.error('Invalid or incomplete weather data:', rawData);
    return null; // Or throw an error, depending on your error handling strategy
  }

  return {
    location: rawData.address,
    weather: rawData.currentConditions.conditions,
    temperature: rawData.currentConditions.temp,
    feelsLike: rawData.currentConditions.feelslike,
    humidity: rawData.currentConditions.humidity,
    windSpeed: rawData.currentConditions.windspeed,
    icon: rawData.currentConditions.icon,
    sunrise: rawData.currentConditions.sunrise,
    sunset: rawData.currentConditions.sunset,
    datetime: rawData.currentConditions.datetime
  };
}

/**
 * 通过城市名称获取天气数据
 * @param {string} location - 城市名称
 * @returns {Promise<object|null>} - 包含简化天气信息的对象，或发生错误时为 null
 */
async function getWeatherDataByLocation(location) {
  const API_URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${API_KEY}&contentType=json`;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();
    const processedData = processWeatherData(rawData);

    if (processedData) {
      console.log('Processed Weather Data:', processedData);
    }

    return processedData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null; // Return null on error
  }
}

/**
 * 通过经纬度获取天气数据
 * @param {number} lat - 纬度
 * @param {number} lon - 经度
 * @returns {Promise<object|null>} - 包含简化天气信息的对象，或发生错误时为 null
 */
async function getWeatherDataByCoordinates(lat, lon) {
  const API_URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?unitGroup=metric&key=${API_KEY}&contentType=json`;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawData = await response.json();
    const processedData = processWeatherData(rawData);
    if (processedData) {
      console.log('Processed Weather Data:', processedData);
    }

    return processedData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null; // Return null on error
  }
}

// Form handling
const weatherForm = document.createElement('form');
const locationInput = document.createElement('input');
const submitButton = document.createElement('button');
const weatherInfo = document.createElement('div'); // Container for weather info
const loadingComponent = document.createElement('div'); // Loading Component

locationInput.type = 'text';
locationInput.id = 'location';
locationInput.name = 'location';
locationInput.placeholder = 'Enter a location';

submitButton.type = 'submit';
submitButton.textContent = 'Get Weather';

//Loading component
loadingComponent.id = 'loading';
loadingComponent.textContent = 'Loading...';
loadingComponent.style.display = 'none'; // Initially hidden

weatherForm.appendChild(locationInput);
weatherForm.appendChild(submitButton);
document.body.appendChild(weatherForm);
document.body.appendChild(weatherInfo); // Add weather info container to the page
document.body.appendChild(loadingComponent); // Add loading component to the page

/**
 * Displays the weather data on the webpage.
 * @param {object} data - The processed weather data.
 */
function displayWeatherData(data) {
  // Hide the loading component
  loadingComponent.style.display = 'none';

  if (!data) {
    weatherInfo.innerHTML = `<p class="error">Could not retrieve weather data.</p>`;
    return;
  }

  // Clear previous data
  weatherInfo.innerHTML = '';

  const locationElement = document.createElement('h2');
  locationElement.textContent = data.location;
  weatherInfo.appendChild(locationElement);

  const tempElement = document.createElement('p');
  tempElement.textContent = `Temperature: ${data.temperature}°C`;
  weatherInfo.appendChild(tempElement);

  const feelsLikeElement = document.createElement('p');
  feelsLikeElement.textContent = `Feels Like: ${data.feelsLike}°C`;
  weatherInfo.appendChild(feelsLikeElement);

  const weatherElement = document.createElement('p');
  weatherElement.textContent = `Weather: ${data.weather}`;
  weatherInfo.appendChild(weatherElement);

  const humidityElement = document.createElement('p');
  humidityElement.textContent = `Humidity: ${data.humidity}%`;
  weatherInfo.appendChild(humidityElement);

  const windSpeedElement = document.createElement('p');
  windSpeedElement.textContent = `Wind Speed: ${data.windSpeed} m/s`;
  weatherInfo.appendChild(windSpeedElement);

  const sunriseElement = document.createElement('p');
  sunriseElement.textContent = `Sunrise: ${data.sunrise}`;
  weatherInfo.appendChild(sunriseElement);

  const sunsetElement = document.createElement('p');
  sunsetElement.textContent = `Sunset: ${data.sunset}`;
  weatherInfo.appendChild(sunsetElement);

  const datetimeElement = document.createElement('p');
  datetimeElement.textContent = `Time: ${data.datetime}`;
  weatherInfo.appendChild(datetimeElement);

  // You can add more elements for other data fields here.
  weatherInfo.classList.add('weather-info'); // Add a class for styling.
}

weatherForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent page reload

  const location = locationInput.value;
  if (!location) {
    console.error('Please enter a location.');
    weatherInfo.innerHTML = `<p class="error">Please enter a location.</p>`;
    return;
  }
  // Clear data before loading.
  weatherInfo.innerHTML = '';
  // Show the loading component
  loadingComponent.style.display = 'block';
  const weatherData = await getWeatherDataByLocation(location);
  displayWeatherData(weatherData);
  locationInput.value = '';
});
