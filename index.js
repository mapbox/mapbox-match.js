var xhr = require('xhr'),
    tidy = require('geojson-tidy');

module.exports.mapmatch = mapmatch;


// Public function

function mapmatch(geojson, map) {


    // First tidy the geojson
    var featureCollection = JSON.parse(tidy.tidy(geojson, {
            "minimumDistance": 20
        }));

    var featureLayer = L.mapbox.featureLayer().addTo(map);

    // Hit mapmatching API for every feature
    var mapMatchAPI = "https://api-directions-johan-matching.tilestream.net/v4/directions/matching/mapbox.driving.json";
    var xhrUrl = mapMatchAPI + "?access_token=" + L.mapbox.accessToken;

    function matchFeature(feature) {

        xhrOptions = {
            body: JSON.stringify(feature),
            uri: xhrUrl,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };

        xhr(xhrOptions, function (err, response, body) {
            if (err) {
                console.log(err);
            }

            // Style the matched geometry
            L.geoJson(JSON.parse(body), {
                style: {
                    "weight": 20,
                    "color": "#172AEF",
                    "opacity": 0.6
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup(body, {
                        minWidth: 600,
                        maxHeight: 600
                    });
                }
            }).addTo(map);

            console.log(body);

        });

    }

    // Match every input feature
    for (var i = 0; i < featureCollection.features.length; i++) {
        matchFeature(featureCollection.features[i]);
    }


}




// Test map matching
// curl -X POST -d @test/cross-country.json "https://api-directions-johan-matching.tilestream.net/v4/directions/matching/mapbox.driving.json?access_token=pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiemdYSVVLRSJ9.g3lbg_eN0kztmsfIPxa9MQ" --header "Content-Type:application/json"