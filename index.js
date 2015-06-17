var xhr = require('xhr'),
    tidy = require('geojson-tidy');

module.exports.mapmatch = mapmatch;


// Public function

function mapmatch(FeatureCollection, map) {


    // First tidy the geojson
    var featureCollection = JSON.parse(tidy.tidy(FeatureCollection, {
            "minimumDistance": 20
        })),
        matchedFeatureCollection;

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

    for (var i = 0; i < featureCollection.features.length; i++) {

        matchedFeatureCollection = matchFeature(featureCollection.features[i]);

    }


}




// Test map matching
// curl -X POST -d @test/cross-country.json "https://api-directions-johan-matching.tilestream.net/v4/directions/matching/mapbox.driving.json?access_token=pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiemdYSVVLRSJ9.g3lbg_eN0kztmsfIPxa9MQ" --header "Content-Type:application/json"