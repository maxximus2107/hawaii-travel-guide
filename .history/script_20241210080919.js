// API Keys
const weatherApiKey = "4963256e8f7a4831593ed26412a9dba6";

// Hawaii Locations
const locations = [
    { position: { lat: 21.281, lng: -157.837 }, title: "Waikiki Beach", description: "Famous for its golden sand and surf-friendly waves." },
    { position: { lat: 21.396, lng: -157.739 }, title: "Lanikai Beach", description: "Known for its calm turquoise waters and stunning sunrise views." },
    { position: { lat: 20.798, lng: -156.331 }, title: "Maui Beach", description: "A serene escape with lush greenery and scenic beauty." },
];

// Asset Photos
const assetPhotos = [
    { src: "assets/lanikai.jpeg", alt: "Lanikai Beach" },
    { src: "assets/maui.jpeg", alt: "Maui Beach" },
    { src: "assets/waikiki.jpeg", alt: "Waikiki Beach" },
];

// DOM Elements
const photoUploadInput = document.getElementById("photo-upload");
const userGallery = document.getElementById("user-gallery");

// Google Maps initialization
function initMap() {
    const hawaiiCenter = { lat: 20.798, lng: -156.331 };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: hawaiiCenter,
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
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const weatherInfo = `
                <div style="font-family: Arial, sans-serif; max-width: 300px;">
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
        .catch((error) => {
            console.error("Error fetching weather data:", error);
            infoWindow.setContent(`<div><p>Unable to fetch weather data. Please try again later.</p></div>`);
            infoWindow.open(marker.getMap(), marker);
        });
}

// Load predefined asset photos
function loadAssetPhotos() {
    assetPhotos.forEach((photo) => {
        const img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.alt;
        img.style = "width: 150px; height: 100px; margin: 5px; object-fit: cover; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);";
        userGallery.appendChild(img);
    });
}

// Handle user-uploaded photos
photoUploadInput.addEventListener("change", (event) => {
    const files = event.target.files;

    Array.from(files).forEach((file) => {
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const img = document.createElement("img");
                img.src = e.target.result;
                img.alt = "User Uploaded Photo";
                img.style = "width: 150px; height: 100px; margin: 5px; object-fit: cover; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);";
                userGallery.appendChild(img);
            };

            reader.readAsDataURL(file);
        } else {
            alert("Only image files are allowed!");
        }
    });
});

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
    loadAssetPhotos();
});
