var xhr = require('xhr'),
    tidy = require('geojson-tidy');

module.exports.mapmatch = mapmatch;


// Public function

function mapmatch(geojson, map) {


    // First tidy the geojson
    var matchedGeojson = JSON.parse(tidy.tidy(geojson, {
        "minimumDistance": 20
    }));

    var featureLayer = L.mapbox.featureLayer().addTo(map);

    // Hit mapmatching API for every feature
    var mapMatchAPI = "https://api-directions-johan-matching.tilestream.net/v4/directions/matching/mapbox.driving.json";
    var xhrUrl = mapMatchAPI + "?" + L.mapbox.accessToken;

    function matchFeature(feature) {

        xhrOptions = {
            json: "",
            uri: xhrUrl,
            headers: {
                "Content-Type": "application/json"
            }
        };

        xhr(xhrOptions, function (err, response, body) {
            if (err) {
                console.log(err);
            }

            console.log(body);

        });

    }

    for (var i = 0; i < matchedGeojson.features.length; i++) {

        matchFeature(matchedGeojson.features[i]);

    }

}




// Test map matching
// curl -X POST -d @test/cross-country.json "https://api-directions-johan-matching.tilestream.net/v4/directions/matching/mapbox.driving.json?access_token=pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiemdYSVVLRSJ9.g3lbg_eN0kztmsfIPxa9MQ" --header "Content-Type:application/json"