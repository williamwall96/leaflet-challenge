var myMap = L.map("mapid", {
  center: [37.09, -45.71],
  zoom: 3
});

var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// Perform a GET request to the query URL

d3.json(queryURL).then(function (data) {
    // Once we get a response, send the data.features object to the createFeatures function.
    
    console.log(data.features);
    let earthquakes = data.features;
    
    /*Sets up our color scheme for earthquakes */
    let color = {
        level1: "#3c0",
        level2: "#9f6",
        level3: "#fc3",
        level4: "#f93",
        level5: "#c60",
        level6: "#c00"
    }

    /* For each of the earthquakes, we are now identifying the lat/long and assessing a severity color to the earthquake */

    for (var i = 0; i < earthquakes.length; i++) {
        let latitude = earthquakes[i].geometry.coordinates[1];
        let longitude = earthquakes[i].geometry.coordinates[0];
        let magnitude = earthquakes[i].properties.mag;
        var fillColor;
        if (magnitude > 5) {
            fillColor = color.level6;
        } else if (magnitude > 4) {
            fillColor = color.level5;
        } else if (magnitude > 3) {
            fillColor = color.level4;
        } else if (magnitude > 2) {
            fillColor = color.level3;
        } else if (magnitude > 1) {
            fillColor = color.level2;
        } else {
            fillColor = color.level1;
        }

        // The radius of each circle will be determined on an exponential scale based on the size of the magnitude.
        var epicenter = L.circleMarker([latitude, longitude], {
            radius: magnitude ** 2,
            color: "black",
            fillColor: fillColor,
            fillOpacity: 1,
            weight: 1
        });
        epicenter.addTo(myMap);


        /* Set up labels as a pop-up when we use the mouse to point to one of the circles */

        epicenter.bindPopup("<h3> " + new Date(earthquakes[i].properties.time) + "</h3><h4>Magnitude: " + magnitude +
            "<br>Location: " + earthquakes[i].properties.place + "</h4><br>");

    }

    /* Setting the legend to appear in the bottom right of our chart */
    var legend = L.control({
        position: 'bottomright'
    });

    /* Adding on the legend based off the color scheme we have */
    legend.onAdd = function (color) {
        var div = L.DomUtil.create('div', 'info legend');
        var levels = ['>1', '1-2', '2-3', '3-4', '4-5', '5+'];
        var colors = ['#3c0', '#9f6', '#fc3', '#f93', '#c60', '#c00']
        for (var i = 0; i < levels.length; i++) {
            div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
        }
        return div;
    }
    legend.addTo(myMap);
});








