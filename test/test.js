require('mapbox.js');

var test = require('tape'),
    fs = require('fs'),
    omnivore = require('../');

test('gpx-featureLayer', function (t) {
    function customFilter() { return true; }
    var l = L.mapbox.markerLayer();
    var layer = omnivore.gpx('a.gpx', null, l);

    t.ok('setFilter' in layer, 'uses a featureLayer');
    layer.on('ready', function() {
        t.pass('fires ready event');
        t.ok('setFilter' in layer, 'uses a featureLayer');
        t.end();
    });
    layer.on('error', function() {
        t.fail('does not fire error event');
        t.end();
    });
});

