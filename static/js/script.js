console.log("JS loaded");

const form = document.getElementById("form1");
const cityInput = document.getElementById("inputcity");
const locationBtn = document.getElementById("locationBtn");
const weatherIcon = document.getElementById("weatherIcon");

// ---------- CITY SEARCH ----------
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const city = cityInput.value.trim();
    console.log("Button clicked");

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    fetch(`/weather?city=${city}`)
        .then(response => response.json())
        .then(updateUI)
        .catch(() => alert("Error fetching city weather"));
});

// ---------- LOCATION SEARCH ----------
if (locationBtn) {
    locationBtn.addEventListener("click", function () {

        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function (position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                fetch(`/weather_by_location?lat=${lat}&lon=${lon}`)
                    .then(response => response.json())
                    .then(updateUI)
                    .catch(() => alert("Error fetching location weather"));
            },
            function () {
                alert("Location access denied");
            }
        );
    });
}

// ---------- BACKGROUND CHANGE ----------
function changeBackground(condition) {
    document.body.className = "";

    if (condition === "Clear") {
        document.body.classList.add("sunny");
    } 
    else if (condition === "Clouds") {
        document.body.classList.add("cloudy");
    } 
    else if (condition === "Rain" || condition === "Drizzle") {
        document.body.classList.add("rainy");
    } 
    else if (condition === "Snow") {
        document.body.classList.add("snowy");
    } 
    else {
        document.body.classList.add("foggy");
    }
}

// ---------- WEATHER ICON ----------
function updateIcon(condition) {
    const c = condition.toLowerCase();

    if (c.includes("clear")) {
        weatherIcon.src = "/static/icons/clear.png";
    } 
    else if (c.includes("cloud")) {
        weatherIcon.src = "/static/icons/clouds.png";
    } 
    else if (c.includes("rain") || c.includes("drizzle")) {
        weatherIcon.src = "/static/icons/rain.png";
    } 
    else if (c.includes("snow")) {
        weatherIcon.src = "/static/icons/snow.png";
    } 
    else if (c.includes("smoke")) {
        weatherIcon.src = "/static/icons/smoke.png";
    } 
    else {
        weatherIcon.src = "/static/icons/mist.png";
    }
}

// ---------- COMMON UI UPDATE ----------
function updateUI(data) {
    if (data.error) {
        alert(data.error);
        return;
    }

    document.getElementById("temp").innerText = data.temp + "°C";
    document.getElementById("condition").innerText = data.condition;
    document.getElementById("humidity").innerText = data.humidity + "%";
    document.getElementById("Wind").innerText = data.wind + " km/h";

    changeBackground(data.condition);
    updateIcon(data.condition);
}
