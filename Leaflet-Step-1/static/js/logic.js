// Store API endpoint 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";
var magnitude = [];

//Get request to the query URL
d3.json(queryUrl, function(data) {

    createFeatures(data.features);
    magnitude.push(data.features[0].properties);
console.log(data);
console.log(data.features[0].properties);
   
    console.log(magnitude);
    console.log(magnitude[0].mag);
});


//Generate markers and info displayed on popup 
function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.title + "</h3>");
    }
//Set scale to determine color based on magnitude     
function getColor(d) {
        return d > 6 ? '#800026' :
               d > 4 ? '#BD0026' :
               d > 2  ? '#E31A1C' :
                        '#FC4E2A';
}

//Appearance of circle markers
function style(feature) {
    return {
        fillColor: getColor(feature.properties.mag),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        radius: getradius(feature.properties.mag)
    };
}
//Multiplier applied to each magnitude (radius)
function getradius(r) {
    return r * 5;
    
}

//Combine functions to create map that includes markers and marker features 
var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
      },
    style:style 
});
 
createMap(earthquakes);
}

//Add layers
function createMap(earthquakes) {

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
  });

  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var baseMaps = {
      "Street Map": streetmap,
      "Light Map": lightmap
  };

  var overlayMaps = {
      Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
      center: [
          37.09, -95.71
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
  });
//User can control which layers are visible
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(myMap);
  
//Recall function to be used for legend  
  function getColor(d) {
    return d > 6 ? '#800026' :
           d > 4 ? '#BD0026' :
           d > 2  ? '#E31A1C' :
                    '#FC4E2A'; 
}
//Legend set up   
var legend = L.control({position: "bottomright"});

  legend.onAdd = function (map) {
  
      var div = L.DomUtil.create('div', 'info legend'),
          grades = [0, 4, 6],
          labels = [];
  
      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
              grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }
  
      return div;
  };
//Do not forget to add to the map  
  legend.addTo(myMap);
};
