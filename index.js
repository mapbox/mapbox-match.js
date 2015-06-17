var xhr = require('corslite'),
    tidy = require('geojson-tidy');

module.exports.mapmatch = mapmatch;


// Public function

function mapmatch(geojson) {

    //    var layer = featureLayer || L.geoJson();

    // Create a tidy geojson
    var tidyGeojson = tidy.tidy(geojson, {
        "minimumDistance": 20
    });

    var mapMatchAPI = "https://api-directions-johan-matching.tilestream.net/v4/directions/matching/mapbox.driving.json";
    var xhrUrl = mapMatchAPI + "?" + L.mapbox.accessToken;

    console.log(tidyGeojson);

    //    for (var i = 0; i < tidyGeojson.features.length; i++) {
    //
    //        xhr(xhrUrl, function (err, response) {
    //            if (err) return layer.fire('error', {
    //                error: err
    //            });
    //            addData(layer, JSON.parse(response.responseText));
    //            layer.fire('ready');
    //        });
    //
    //    }

}

// Test map matching
// curl -X POST -d @test/cross-country.json "https://api-directions-johan-matching.tilestream.net/v4/directions/matching/mapbox.driving.json?access_token=pk.eyJ1IjoicGxhbmVtYWQiLCJhIjoiemdYSVVLRSJ9.g3lbg_eN0kztmsfIPxa9MQ" --header "Content-Type:application/json"