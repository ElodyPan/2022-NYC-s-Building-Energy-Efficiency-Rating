mapboxgl.accessToken = 'pk.eyJ1IjoiZWxvZHlwIiwiYSI6ImNsdWx2dWQzaDBuaGkybG13cmJhbHBia2MifQ.6QH1q00S5v6MYczAiRLy0g';

// Initialize the map
var map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-74.11667, 40.67938], // Center on NYC
    zoom: 9.3, // Zoom level for NYC
    container: 'map-container',
    antialias: true
});

// Define borough centers for zooming
var boroughCenters = {
    "MANHATTAN": [-73.98364, 40.78990],
    "BROOKLYN": [-73.98549, 40.64653],
    "QUEENS": [-73.85590, 40.72275],
    "BRONX": [-73.91524, 40.83951],
    "STATEN IS": [-74.18422, 40.57817]
};

// Mapping for normalizing borough names
var boroughNameMapping = {
    "MANHATTAN": "Manhattan",
    "BROOKLYN": "Brooklyn",
    "QUEENS": "Queens",
    "BRONX": "Bronx",
    "STATEN IS": "Staten Island"
};

// Convert ratingData to GeoJSON format
var geojsonData = {
    type: 'FeatureCollection',
    features: ratingData.map(function(building) {
        var normalizedBorough = boroughNameMapping[building["Borough"]];
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [building.Longitude, building.Latitude]
            },
            properties: {
                address: building["Address 1"],
                gfa: building["Property GFA - Self-Reported (ft²)"],
                score: building["ENERGY STAR Score"],
                siteEUI: building["Site EUI (kBtu/ft²)"],
                sourceEUI: building["Source EUI (kBtu/ft²)"],
                ghgEmissions: building["Total (Location-Based) GHG Emissions (Metric Tons CO2e)"],
                ghgIntensity: building["Total (Location-Based) GHG Emissions Intensity (kgCO2e/ft²)"],
                borough: normalizedBorough
            }
        };
    })
};

// Function to get the color based on the ENERGY STAR Score
function getGradeColor(score) {
    if (score >= 85) return '#238b45'; // A
    if (score >= 70) return '#74c476'; // B
    if (score >= 55) return '#bae4b3'; // C
    if (score < 55 && score !== null) return '#edf8e9'; // D
    return '#000000'; // No Data or Exempt or Not Covered
}

// Add GeoJSON sources and layers
map.on('load', function() {
    // Add borough boundaries as a GeoJSON source
    map.addSource('borough-boundaries', {
        type: 'geojson',
        data: 'data/nyc-borough-boundaries.geojson'
    });

    // Log to ensure data is loaded
    map.on('sourcedata', function(e) {
        if (e.sourceId === 'borough-boundaries' && e.isSourceLoaded) {
            console.log('Borough boundaries data loaded:', e);
        }
    });

    // Add fill and line layers for each borough
    ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'].forEach(borough => {
        // Add fill layer
        map.addLayer({
            id: `${borough}-fill`,
            type: 'fill',
            source: 'borough-boundaries',
            filter: ['==', ['get', 'boro_name'], borough],
            paint: {
                'fill-color': {
                    'Manhattan': 'rgba(215, 25, 28, 0.5)', // Red
                    'Brooklyn': 'rgba(253, 174, 97, 0.5)', // Orange
                    'Queens': 'rgba(255, 255, 191, 0.5)', // Yellow
                    'Bronx': 'rgba(171, 221, 164, 0.5)', // Green
                    'Staten Island': 'rgba(43, 131, 186, 0.5)' // Blue
                }[borough],
                'fill-opacity': 0.5
            }
        });

        // Add line layer
        map.addLayer({
            id: `${borough}-line`,
            type: 'line',
            source: 'borough-boundaries',
            filter: ['==', ['get', 'boro_name'], borough],
            paint: {
                'line-color': '#cc3300', // Brown color for clear boundaries
                'line-width': 2, // Increased line width
                'line-opacity': 0.8, // Increased line opacity
                'line-dasharray': [2, 2] // Dashed line style
            }
        });

        // Log layer addition
        console.log(`Added ${borough} layers: fill and line`);
    });

    // Add buildings GeoJSON source
    map.addSource('buildings', {
        type: 'geojson',
        data: geojsonData
    });

    // Add circle layer for buildings
    map.addLayer({
        id: 'buildings-circle-layer',
        type: 'circle',
        source: 'buildings',
        paint: {
            'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                10, 2,
                15, 8
            ],
            'circle-color': [
                'case',
                ['>=', ['get', 'score'], 85], '#238b45', // A
                ['>=', ['get', 'score'], 70], '#74c476', // B
                ['>=', ['get', 'score'], 55], '#bae4b3', // C
                ['<', ['get', 'score'], 55], '#edf8e9', // D
                ['==', ['get', 'score'], null], '#000000', // No Data or Exempt or Not Covered
                ['!=', ['typeof', ['get', 'score']], 'number'], '#000000', // Catch-all for non-number scores
                '#000000' // Default
            ],
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 1
        }
    });

    // Add popup interaction for circle layer
    map.on('click', 'buildings-circle-layer', function(e) {
        var coordinates = e.features[0].geometry.coordinates.slice();
        var properties = e.features[0].properties;

        var popupContent = `
            <h3>${properties.address}</h3>
            <p><strong>Gross Square Footage:</strong> ${properties.gfa.toLocaleString()} sq ft</p>
            <p><strong>Energy Star Score:</strong> ${properties.score}</p>
            <p><strong>Site EUI (kBtu/ft²):</strong> ${properties.siteEUI}</p>
            <p><strong>Source EUI (kBtu/ft²):</strong> ${properties.sourceEUI}</p>
            <p><strong>GHG Emissions (Metric Tons CO2e):</strong> ${properties.ghgEmissions}</p>
            <p><strong>GHG Emissions Intensity (kgCO2e/ft²):</strong> ${properties.ghgIntensity}</p>
        `;

        new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over the circle layer
    map.on('mouseenter', 'buildings-circle-layer', function() {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change the cursor back to default when it leaves the circle layer
    map.on('mouseleave', 'buildings-circle-layer', function() {
        map.getCanvas().style.cursor = '';
    });

    // Initially filter buildings to show all boroughs
    map.getSource('buildings').setData({
        type: 'FeatureCollection',
        features: geojsonData.features
    });

    // Show all borough layers initially
    ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'].forEach(borough => {
        map.setLayoutProperty(`${borough}-fill`, 'visibility', 'visible');
        map.setLayoutProperty(`${borough}-line`, 'visibility', 'visible');
    });
});

// Update markers based on selected boroughs and adjust the map center and zoom
document.querySelectorAll('.borough-btn').forEach(button => {
    button.addEventListener('click', () => {
        var borough = button.getAttribute('data-borough');
        console.log('Button clicked:', borough); // Debug log

        if (borough === 'ALL') {
            // Show all boroughs
            map.flyTo({ center: [-74.11667, 40.67938], zoom: 9.3 });

            // Update the data to show all buildings
            map.getSource('buildings').setData({
                type: 'FeatureCollection',
                features: geojsonData.features
            });

            // Show all borough layers
            ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'].forEach(borough => {
                map.setLayoutProperty(`${borough}-fill`, 'visibility', 'visible');
                map.setLayoutProperty(`${borough}-line`, 'visibility', 'visible');
            });

        } else {
            // Show selected borough
            var normalizedBorough = boroughNameMapping[borough];
            map.flyTo({ center: boroughCenters[borough], zoom: 11 });

            // Filter the buildings layer based on the selected borough
            var filteredFeatures = geojsonData.features.filter(feature => feature.properties.borough === normalizedBorough);
            console.log('Filtered Features for', borough, ':', filteredFeatures); // Debug log
            map.getSource('buildings').setData({
                type: 'FeatureCollection',
                features: filteredFeatures
            });

            // Hide all borough layers
            ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'].forEach(borough => {
                map.setLayoutProperty(`${borough}-fill`, 'visibility', 'none');
                map.setLayoutProperty(`${borough}-line`, 'visibility', 'none');
            });

            // Show selected borough layers
            map.setLayoutProperty(`${normalizedBorough}-fill`, 'visibility', 'visible');
            map.setLayoutProperty(`${normalizedBorough}-line`, 'visibility', 'visible');
        }

        // Update button styles
        document.querySelectorAll('.borough-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-borough') === borough || borough === 'ALL');
        });
    });
});

// Adjust the map when the window is resized
window.addEventListener('resize', () => {
    map.resize(); // This Mapbox GL JS method re-adjusts the map to fit its container
});
