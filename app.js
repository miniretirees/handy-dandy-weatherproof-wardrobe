let weatherData;

//Get current location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(
          "Your location: Latitude " + latitude + " Longitude " + longitude
        );
        getWeatherForest(latitude, longitude);
      },
      function (error) {
        alert("Could not get your location. Please allow location access.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser");
  }
}

//Get weather forecast
function getWeatherForest(latitude, longitude) {
  fetch(`/.netlify/functions/weather?latitude=${latitude}&longitude=${longitude}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      weatherData = data;
      displaySummary();
      displayWardrobe();
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

function displaySummary() {
  if (!weatherData) return;

  let todaysWeatherCondition = weatherData.daily[0].weather[0].main;
  let todaysTemperature = weatherData.daily[0].temp;
  let pop = weatherData.daily[0].pop;
  let avgTemp = (todaysTemperature.min + todaysTemperature.max) / 2;

  document.getElementById("min-temperature").textContent = Math.round(
    todaysTemperature.min
  );
  document.getElementById("max-temperature").textContent = Math.round(
    todaysTemperature.max
  );

  //Display chance of rain (if applicable)
  const rainElement = document.getElementById("chance-of-rain");
  if (pop > 0.3) {
    rainElement.style.display = "block";
    document.getElementById("precipitation-probability").textContent = Math.round(pop * 100);
  } else {
    rainElement.style.display = "none";
  }

  const weatherMap = {
    Thunderstorm: { emoji: "⛈️", label: "thunderstorm-y" },
    Drizzle:      { emoji: "🌧️", label: "drizzly" },
    Rain:         { emoji: "🌧️", label: "rainy" },
    Clear:        { emoji: "☀️", label: "sunny" },
    Clouds:       { emoji: "☁️", label: "cloudy" },
    Snow:         { emoji: "❄️", label: "snowy" },
  };

  //Display weather condition emoji and text
  const weatherInfo = weatherMap[todaysWeatherCondition];
  if (weatherInfo) {
    document.getElementById("weather-condition-emoji").textContent = weatherInfo.emoji;
    document.getElementById("weather-condition").textContent = weatherInfo.label;
  }

  // Temperature condition logic
  let tempEmoji = "";
  let tempLabel = "";

  if (avgTemp >= 30) {
    tempEmoji = "🥵️";
    tempLabel = "hot";
  } else if (avgTemp >= 25) {
    tempEmoji = "🥵️";
    tempLabel = "warm";
  } else if (avgTemp >= 15) {
    tempEmoji = "😊";
    tempLabel = "chilly";
  } else if (avgTemp > 0) {
    tempEmoji = "🥶";
    tempLabel = "cold";
  } else {
    tempEmoji = "🥶";
    tempLabel = "freezing";
  }

  document.getElementById("temperature-condition-emoji").textContent = tempEmoji;
  document.getElementById("temperature-condition").textContent = tempLabel;
}

//Display wardrobe items
function displayWardrobe() {
  let todaysWeatherCondition = weatherData.daily[0].weather[0].main;
  let todaysTemperature = weatherData.daily[0].temp;
  let avgTemp = (todaysTemperature.min + todaysTemperature.max) / 2;
  console.log(avgTemp);

  let topItems = [];
  let bottomItems = [];
  let accessories = [];

  let needsRainjacketCool = avgTemp >= 15 && avgTemp < 25;
  let needsRainjacketCold = avgTemp < 8
  let needsRainjacketRain = todaysWeatherCondition === "Rain";

  if (avgTemp >= 25) {
    topItems.push("🥵️ Short sleeve shirt");
    bottomItems.push("🥵️ Shorts");
  } else if (avgTemp >= 15) {
    topItems.push("😊 Long sleeve shirt");
    bottomItems.push("😊 Pants");
  } else if (avgTemp >= 8) {
    topItems.push("🥶 Long sleeve shirt", "🥶 Puffer");
    bottomItems.push("🥶 Pants");
    accessories.push("🥶 Gloves");
  } else {
    topItems.push("🥶 Heattech top", "🥶 Long sleeve shirt", "🥶 Puffer");
    bottomItems.push("🥶 Heattech bottom", "🥶 Pants");
    accessories.push("🥶 Gloves");
  }

  if (needsRainjacketCool || needsRainjacketCold || needsRainjacketRain) {
    let reason = "";
    if (needsRainjacketCool) reason += "😊";
    if (needsRainjacketCold) reason += "🥶";
    if (needsRainjacketRain) reason += "🌧️";
    topItems.push(`${reason} Rainjacket`);
  }

  if (todaysWeatherCondition === "Clear") {
    accessories.push("☀️ Sunglasses");
  } else if (todaysWeatherCondition === "Rain") {
    accessories.push("🌧️ Umbrella");
  }

  document.getElementById("wardrobe-top").innerHTML = topItems
    .map((item) => `<li>${item}</li>`)
    .join("");
  document.getElementById("wardrobe-bottom").innerHTML = bottomItems
    .map((item) => `<li>${item}</li>`)
    .join("");
  document.getElementById("wardrobe-accessories").innerHTML = accessories
    .map((item) => `<li>${item}</li>`)
    .join("");

  document.getElementsByClassName("wardrobe-accessories")[0].style.display =
    accessories.length > 0 ? "block" : "none";
}
getLocation();
