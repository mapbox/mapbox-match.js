var xhr = require('corslite'),
    tidy = require('geojson-tidy');

module.exports.mapmatch = mapmatch;


// Public function

function mapmatch(geojson) {
    console.log("Hello there");
    console.log(geojson);
}