// Variables
const weatherApiKey = "4963256e8f7a4831593ed26412a9dba6";
const locations = [
    { position: { lat: 21.281, lng: -157.837 }, title: "Waikiki Beach", description: "Famous for its golden sand and surf-friendly waves." },
    { position: { lat: 21.396, lng: -157.739 }, title: "Lanikai Beach", description: "Known for its calm turquoise waters and stunning sunrise views." },
    { position: { lat: 20.798, lng: -156.331 }, title: "Maui Beach", description: "A serene escape with lush greenery and scenic beauty." },
];
const photoUploadInput = document.getElementById("photo-upload");
const userGallery = document.getElementById("user-gallery");

// Google Maps initialization
function initMap() {
    const hawaii = { lat: 20.798, lng: -156.331 };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: hawaii,
    });

    // Add markers and info windows
    locations.forEach((location) => {
        const marker = new google.maps.Marker({
            position: location.position,
            map,
            title: location.title,
        });

        const infoWindow = new google.maps.InfoWindow();

        marker.addListener("click", () => {
            fetchWeather(location, marker, infoWindow);
        });
    });
}

// Fetch and display weather data
function fetchWeather(location, marker, infoWindow) {
    const { lat, lng } = location.position;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${weatherApiKey}`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            const weatherInfo = `
                <div>
                    <h3>${location.title}</h3>
                    <p>${location.description}</p>
                    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
                    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
                    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
                </div>
            `;
            infoWindow.setContent(weatherInfo);
            infoWindow.open(marker.getMap(), marker);
        })
        .catch((error) => console.error("Error fetching weather data:", error));
}

// Handle user-uploaded photos
photoUploadInput.addEventListener("change", (event) => {
    const files = event.target.files;

    Array.from(files).forEach((file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.alt = "User Uploaded Photo";
            userGallery.appendChild(img);
        };

        reader.readAsDataURL(file);
    });
});
