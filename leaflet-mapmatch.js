!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.mapmatch=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var xhr = require('corslite'),
    tidy = require('geojson-tidy');

module.exports.mapmatch = mapmatch;


// Public function

function mapmatch(geojson) {
    console.log("Hello there");
    console.log(geojson);
}
},{"corslite":2,"geojson-tidy":3}],2:[function(require,module,exports){
function corslite(url, callback, cors) {
    var sent = false;

    if (typeof window.XMLHttpRequest === 'undefined') {
        return callback(Error('Browser not supported'));
    }

    if (typeof cors === 'undefined') {
        var m = url.match(/^\s*https?:\/\/[^\/]*/);
        cors = m && (m[0] !== location.protocol + '//' + location.hostname +
                (location.port ? ':' + location.port : ''));
    }

    var x = new window.XMLHttpRequest();

    function isSuccessful(status) {
        return status >= 200 && status < 300 || status === 304;
    }

    if (cors && !('withCredentials' in x)) {
        // IE8-9
        x = new window.XDomainRequest();

        // Ensure callback is never called synchronously, i.e., before
        // x.send() returns (this has been observed in the wild).
        // See https://github.com/mapbox/mapbox.js/issues/472
        var original = callback;
        callback = function() {
            if (sent) {
                original.apply(this, arguments);
            } else {
                var that = this, args = arguments;
                setTimeout(function() {
                    original.apply(that, args);
                }, 0);
            }
        }
    }

    function loaded() {
        if (
            // XDomainRequest
            x.status === undefined ||
            // modern browsers
            isSuccessful(x.status)) callback.call(x, null, x);
        else callback.call(x, x, null);
    }

    // Both `onreadystatechange` and `onload` can fire. `onreadystatechange`
    // has [been supported for longer](http://stackoverflow.com/a/9181508/229001).
    if ('onload' in x) {
        x.onload = loaded;
    } else {
        x.onreadystatechange = function readystate() {
            if (x.readyState === 4) {
                loaded();
            }
        };
    }

    // Call the callback with the XMLHttpRequest object as an error and prevent
    // it from ever being called again by reassigning it to `noop`
    x.onerror = function error(evt) {
        // XDomainRequest provides no evt parameter
        callback.call(this, evt || true, null);
        callback = function() { };
    };

    // IE9 must have onprogress be set to a unique function.
    x.onprogress = function() { };

    x.ontimeout = function(evt) {
        callback.call(this, evt, null);
        callback = function() { };
    };

    x.onabort = function(evt) {
        callback.call(this, evt, null);
        callback = function() { };
    };

    // GET is the only supported HTTP Verb by XDomainRequest and is the
    // only one supported here.
    x.open('GET', url, true);

    // Send the request. Sending data is not supported.
    x.send(null);
    sent = true;

    return x;
}

if (typeof module !== 'undefined') module.exports = corslite;

},{}],3:[function(require,module,exports){
var haversine = require('haversine');

module.exports.tidy = tidy;


// Public function

function tidy(geojson, options) {

    // Set the minimum distance in metres and time interval in seconds between successive coordinates
    var filter = {
            minimumDistance: options && options.minimumDistance || 10,
            minimumTime: options && options.minimumTime || 5,
            maximumPoints: options && options.maximumPoints || 100
        };

    // Create the tidy output feature collection
    var tidyOutput = {
            "type": "FeatureCollection",
            "features": []
        },
        emptyFeature = {
            "type": "Feature",
            "properties": {
                "coordTimes": []
            },
            "geometry": {
                "type": "LineString",
                "coordinates": []
            }
        };

    // Helper to pass an object by value instead of reference
    function clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    //Loop through input features

    for ( var featureIndex = 0; featureIndex < geojson.features.length; featureIndex++) {

        // Skip non LineString features
        if ( geojson.features[featureIndex].geometry.type != 'LineString'){
            continue;
        }

        var simplifiedGeojson = geojson.features[featureIndex],
            lineString = simplifiedGeojson.geometry.coordinates,
            timeStamp = simplifiedGeojson.properties.coordTimes;

        tidyOutput.features.push(clone(emptyFeature));

        // Loop through the coordinate array of the noisy linestring and build a tidy linestring

        for (var i = 0; i < lineString.length; i++) {

            // Add first and last points
            if (i === 0 || i == lineString.length - 1) {
                tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.push(lineString[i]);
                if (timeStamp) {
                    tidyOutput.features[tidyOutput.features.length - 1].properties.coordTimes.push(timeStamp[i]);
                }
                continue;
            }

            // Calculate distance between successive points in metres
            var point1 = {
                    latitude: lineString[i][1],
                    longitude: lineString[i][0]
                },
                point2 = {
                    latitude: lineString[i + 1][1],
                    longitude: lineString[i + 1][0]
                };

            var Dx = haversine(point1, point2, {
                unit: 'km'
            }) * 1000;

            // Skip point if its too close to each other
            if (Dx < filter.minimumDistance) {
                continue;
            }

            // Calculate sampling time diference between successive points in seconds
            if (timeStamp) {
                var time1 = new Date(timeStamp[i]),
                    time2 = new Date(timeStamp[i + 1]),
                    Tx = (time2 - time1) / 1000;

                // Skip point if sampled to close to each other
                if (Tx < filter.minimumTime) {
                    continue;
                }

            }

            // Copy the point and timestamp to the tidyOutput
            tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.push(lineString[i]);
            if (timeStamp) {
                tidyOutput.features[tidyOutput.features.length - 1].properties.coordTimes.push(timeStamp[i]);
            }

            // If feature exceeds maximum points, start a new feature beginning at the previuos end point
            if (tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.length % filter.maximumPoints === 0) {
                tidyOutput.features.push(clone(emptyFeature));
                tidyOutput.features[tidyOutput.features.length - 1].geometry.coordinates.push(lineString[i]);
                if (timeStamp) {
                    tidyOutput.features[tidyOutput.features.length - 1].properties.coordTimes.push(timeStamp[i]);
                }
            }
        }
    }

    // DEBUG
    // Stats
    //    console.log(JSON.stringify(tidyOutput));

    // Your tidy geojson is ready!
    return JSON.stringify(tidyOutput);

}
},{"haversine":4}],4:[function(require,module,exports){
// haversine
// By Nick Justice (niix)
// https://github.com/niix/haversine

var haversine = (function() {

  // convert to radians
  var toRad = function(num) {
    return num * Math.PI / 180
  }

  return function haversine(start, end, options) {
    var km    = 6371
    var mile  = 3960
    options   = options || {}

    var R = options.unit === 'mile' ?
      mile :
      km

    var dLat = toRad(end.latitude - start.latitude)
    var dLon = toRad(end.longitude - start.longitude)
    var lat1 = toRad(start.latitude)
    var lat2 = toRad(end.latitude)

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2)
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    if (options.threshold) {
      return options.threshold > (R * c)
    } else {
      return R * c
    }
  }

})()

module.exports = haversine
},{}]},{},[1])(1)
});