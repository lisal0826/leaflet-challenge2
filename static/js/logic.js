// Initialize the map on the "map" div with a center and zoom
var myMap = L.map('map').setView([37.8, -96], 4);

// Add a base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(myMap);

// Marker size based on earthquake magnitude
function markerSize(magnitude) {
    return magnitude * 20000;
}

// Marker color based on earthquake depth
function markerColor(depth) {
    if (depth > 90) return '#ff0000';
    else if (depth > 70) return '#ff6600';
    else if (depth > 50) return '#ff9900';
    else if (depth > 30) return '#ffcc00';
    else if (depth > 10) return '#ffff00';
    else return '#ccff33';
}

// GeoJSON data URL
var geojsonUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Load GeoJSON data
d3.json(geojsonUrl).then(function(data) {
    L.geoJSON(data, {
        pointToLayer: function(feature, latlng) {
            return L.circle(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]} km</p>`);
            layer.on({
                mouseover: function(event) {
                    this.openPopup();
                },
                mouseout: function(event) {
                    this.closePopup();
                },
                click: function(event) {
                    myMap.setView(event.latlng, 8); // Zoom into the map on click
                }
            });
        }
    }).addTo(myMap);
});

// Legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [-10, 10, 30, 50, 70, 90],
    labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + ' km<br>' : '+ km');
    }

    return div;
};

legend.addTo(myMap);

// Example of a responsive map event
myMap.on('zoomend', function() {
    console.log("Current Zoom Level: ", myMap.getZoom());
});
