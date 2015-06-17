var xhr = require('xhr'),
    tidy = require('geojson-tidy'),
    queue = require('queue-async');

module.exports.mapmatch = mapmatch;


// Public function

function mapmatch(geojson, callback) {

    var q = queue();

    // First tidy the geojson using defaults
    var featureCollection = JSON.parse(tidy.tidy(geojson, {
        "minimumDistance": 10,
        "minimumTime": 5
    }));


    // Hit mapmatching API for every feature
    var mapMatchAPI = "https://api-directions-johan-matching.tilestream.net/v4/directions/matching/mapbox.driving.json";
    var xhrUrl = mapMatchAPI + "?access_token=" + L.mapbox.accessToken;

    function matchFeature(feature, cb) {

        xhrOptions = {
            body: JSON.stringify(feature),
            uri: xhrUrl,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };

        xhr(xhrOptions, function (err, response, body) {

            cb(err, JSON.parse(body));

        });

    }

    // Match every input feature
    for (var i = 0; i < featureCollection.features.length; i++) {
        q.defer(matchFeature, featureCollection.features[i]);
    }

    q.awaitAll(function (error, results) {

        callback(error, results);

    });

}




// Test map matching
// curl -X POST -d @test/cross-country.json "https://api-directions-johan-matching.tilestream.net/v4/directions/matching/mapbox.driving.json?access_token=pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiemdYSVVLRSJ9.g3lbg_eN0kztmsfIPxa9MQ" --header "Content-Type:application/json"