var xhr = require('xhr'),
    tidy = require('geojson-tidy'),
    queue = require('queue-async');

module.exports.mapmatch = mapmatch;


// Public function

function mapmatch(geojson, callback) {

    var q = queue();

    // First tidy the geojson using defaults
    var inputGeometries = JSON.parse(tidy.tidy(geojson, {
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

    //    console.log("input", JSON.stringify(inputGeometries));

    for (var i = 0; i < inputGeometries.features.length; i++) {
        q.defer(matchFeature, inputGeometries.features[i]);

    }


    q.awaitAll(function (error, results) {

        var matchedGeometeries = [];

        console.log("results", results);
        // Merge feature collections array into first one
        for (var i = 0; i < results.length; i++) {
            matchedGeometeries = matchedGeometeries.concat(results[i].features);
        }

        var featureLayer = L.mapbox.featureLayer(matchedGeometeries);
        
        callback(error, featureLayer);

    });

}




// Test map matching
// curl -X POST -d @test/cross-country.json "https://api-directions-johan-matching.tilestream.net/v4/directions/matching/mapbox.driving.json?access_token=pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiemdYSVVLRSJ9.g3lbg_eN0kztmsfIPxa9MQ" --header "Content-Type:application/json"