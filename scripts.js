
mapboxgl.accessToken = 'pk.eyJ1IjoiZWxvZHlwIiwiYSI6ImNsdWx2dWQzaDBuaGkybG13cmJhbHBia2MifQ.6QH1q00S5v6MYczAiRLy0g';

var map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/dark-v11',
    center: [-74.01833, 40.70498],
    zoom: 15,
    pitch: 45,
    bearing: -17.6,
    container: 'map-container',
    antialias: true
});

map.on('style.load', () => {
    // Insert the layer beneath any symbol layer.
    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
    ).id;

    // The 'building' layer in the Mapbox Streets
    // vector tileset contains building height data
    // from OpenStreetMap.
    map.addLayer(
        {
            'id': 'add-3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#aaa',

                // Use an 'interpolate' expression to
                // add a smooth transition effect to
                // the buildings as the user zooms in.
                'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'height']
                ],
                'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05,
                    ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
            }
        },
        labelLayerId
    );
});

map.on('load', function () {
    ratingData.forEach(function (building) {
        var el = document.createElement('div');
        el.className = 'marker';
        el.style.backgroundColor = getGradeColor(building["ENERGY EFFICIENCY GRADE"]);

        var popupContent = `
            <h3>${building["STREET NAME"]}</h3>
            <p><strong>DOF Gross Square Footage:</strong> ${building["DOF GROSS SQUARE FOOTAGE"].toLocaleString()} sq ft</p>
            <p><strong>Energy Star Score:</strong> ${building["ENERGY STAR 1-100 SCORE"]}</p>
            <p><strong>Energy Efficiency Grade:</strong> ${building["ENERGY EFFICIENCY GRADE"]}</p>
        `;

        // Create a popup
        var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent);

        // Add the marker to the map with the popup
        new mapboxgl.Marker(el)
            .setLngLat([building.longitude, building.latitude])
            .setPopup(popup)
            .addTo(map);
    });
});

function getGradeColor(grade) {
    switch (grade) {
        case 'A': return '#08922d'; // dark green
        case 'B': return '#6fd884'; // light green
        case 'C': return '#e6f4ea'; // pale green
        case 'D': return '#c3ab91'; // beige
        case 'F': return '#e1861d'; // orange
        case 'N': return '#5b5957'; // dark grey
        default:  return '#ffffff'; // white for undefined grades
    }
}
