'use strict';

var xhr = require('xhr'),
    tidy = require('geojson-tidy'),
    polyline = require('polyline'),
    queue = require('queue-async');


// Public function

function mapmatch(geojson, options, callback) {

    // Configure mapmatching API and create an empty queue for storing the responses
    var mapMatchAPI = "https://api-directions-johan-matching.tilestream.net/matching/v4/mapbox.driving.json";
    var xhrUrl = mapMatchAPI + "?access_token=" + L.mapbox.accessToken + "&geometry=polyline";
    var q = queue();

    function matchFeature(feature, cb) {
        var xhrOptions = {
            body: JSON.stringify(feature),
            uri: xhrUrl,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };

        xhr(xhrOptions, function (err, response, body) {
            // Polyline decoder
            var geojson = JSON.parse(body);
            geojson.features = geojson.features.map(function (feature) {
                var obj = {
                    "type": "Feature",
                    "properties": feature.properties,
                    "geometry": {
                        "type": "LineString",
                        // Invert latLon to lonLat because polyline thinks differently
                        "coordinates": polyline.decode(feature.geometry, 6).map(function (coords) {
                            return [coords[1], coords[0]];
                        })
                    }
                };
                return obj;
            });
            console.log(JSON.stringify(geojson));
            cb(err, geojson);
        });
    }

    // First tidy the input geojson to remove noisy points and match every feature using the API

    var inputGeometries = JSON.parse(tidy.tidy(geojson, {
        "minimumDistance": 10,
        "minimumTime": 5
    }));

    for (var i = 0; i < inputGeometries.features.length; i++) {
        q.defer(matchFeature, inputGeometries.features[i]);
    }

    // After all the features are matched merge them into a single feature collection

    q.awaitAll(function (error, results) {
        var matchedGeometeries = [];
        for (var i = 0; i < results.length; i++) {
            matchedGeometeries = matchedGeometeries.concat(results[i].features);
        }
        var featureLayer = L.mapbox.featureLayer(matchedGeometeries);

        callback(error, featureLayer);

    });

}

module.exports = function (feature, options, callback) {
    return new mapmatch(feature, options, callback);
};