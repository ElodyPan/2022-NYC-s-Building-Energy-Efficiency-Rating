mapboxgl.accessToken = 'pk.eyJ1IjoiZWxvZHlwIiwiYSI6ImNsdWx2dWQzaDBuaGkybG13cmJhbHBia2MifQ.6QH1q00S5v6MYczAiRLy0g';

// Initialize the map
var map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-73.97997, 40.69785],
    zoom: 9,
    container: 'map-container',
    antialias: true
});

// Active boroughs for filtering
var activeBoroughs = {
    manhattan: true,
    brooklyn: true,
    queens: true,
    bronx: true,
    statenisland: true
};

// Borough centers for zooming
var boroughCenters = {
    manhattan: [-73.97718, 40.78175],
    brooklyn: [-73.93789, 40.65286],
    queens: [-73.83153, 40.67432],
    bronx: [-73.84927, 40.85169],
    statenisland: [-74.15461, 40.57240]
};

// Function to get the color based on the ENERGY STAR Score
function getGradeColor(score) {
    if (score >= 85) return '#238b45'; // A
    if (score >= 70) return '#74c476'; // B
    if (score >= 55) return '#bae4b3'; // C
    if (score < 55 && score !== null) return '#edf8e9'; // D
    return '#171716'; // No Data or Exempt or Not Covered
}

// Function to add markers
function addMarkers() {
    ratingData.forEach(function (building) {
        var score = building["ENERGY STAR Score"];
        var borough = building["Borough"].toLowerCase();
        
        if (activeBoroughs[borough] && (score !== null && score !== undefined)) {
            var el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundColor = getGradeColor(score);

            var popupContent = `
                <h3>${building["Address 1"]}</h3>
                <p><strong>Gross Square Footage:</strong> ${building["Property GFA - Self-Reported (ft²)"].toLocaleString()} sq ft</p>
                <p><strong>Energy Star Score:</strong> ${score}</p>
                <p><strong>Site EUI (kBtu/ft²):</strong> ${building["Site EUI (kBtu/ft²)"]}</p>
                <p><strong>Source EUI (kBtu/ft²):</strong> ${building["Source EUI (kBtu/ft²)"]}</p>
                <p><strong>GHG Emissions (Metric Tons CO2e):</strong> ${building["Total (Location-Based) GHG Emissions (Metric Tons CO2e)"]}</p>
                <p><strong>GHG Emissions Intensity (kgCO2e/ft²):</strong> ${building["Total (Location-Based) GHG Emissions Intensity (kgCO2e/ft²)"]}</p>
            `;

            // Create a popup
            var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

            // Add the marker to the map with the popup
            new mapboxgl.Marker(el)
                .setLngLat([building.Longitude, building.Latitude]) // Use longitude and latitude
                .setPopup(popup)
                .addTo(map);
        }
    });
}

// Add markers to the map once it is fully loaded
map.on('load', function() {
    // Add borough boundaries as a GeoJSON source
    map.addSource('borough-boundaries', {
        type: 'geojson',
        data: 'data/borough-boundaries.json'
    });

    // Add borough boundaries line layer
    map.addLayer({
        id: 'borough-boundaries-line',
        type: 'line',
        source: 'borough-boundaries',
        paint: {
            'line-color': '#fff',
            'line-width': 2
        }
    });

    // Add markers to the map
    addMarkers();
});

// Update markers based on selected boroughs and adjust the map center and zoom
document.querySelectorAll('.borough-btn').forEach(button => {
    button.addEventListener('click', () => {
        var borough = button.getAttribute('data-borough');
        activeBoroughs[borough] = !activeBoroughs[borough];
        button.classList.toggle('active', activeBoroughs[borough]);

        // Adjust the map center and zoom
        if (activeBoroughs[borough]) {
            map.flyTo({ center: boroughCenters[borough], zoom: 12 });
        }

        // Remove all markers
        document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());
        // Add markers based on the selected boroughs
        addMarkers();
    });
});

// Adjust the map when the window is resized
window.addEventListener('resize', () => {
    map.resize(); // This Mapbox GL JS method re-adjusts the map to fit its container
});
