[![Build Status](https://travis-ci.org/mapbox/leaflet-mapmatch.svg)](https://travis-ci.org/mapbox/leaflet-mapmatch)

# leaflet-mapmatch

[Leaflet](http://leafletjs.com/) plugin to match input geojson geometries to perfectly align with the openstreetmap streets. 


## Installation

<!--use it easily with the [Mapbox Plugins CDN](http://mapbox.com/mapbox.js/plugins/#leaflet-mapmatch):

```html
<script src='//api.tiles.mapbox.com/mapbox.js/plugins/leaflet-mapmatch/v0.2.0/leaflet-mapmatch.min.js'></script>
```

-->

Or download `leaflet-mapmatch.min.js` from this repository.

## example

```js
var map = L.mapbox.map('map', 'examples.map-9ijuk24y')
    .setView([38, -102.0], 5);

mapmatch.geojson('a.geojson').addTo(map);
```

## API

Arguments with `?` are optional. **parser_options** consists of options
sent to the parser library, _not_ to the layer: if you want to provide options
to the layer, see the example in the Custom Layers section.

By default, the library will construct a `L.geoJson()` layer internally and
call `.addData(geojson)` on it in order to load it full of GeoJSON. If you want
to use a different kind of layer, like a `L.mapbox.featureLayer()`, you can,
by passing it as `customLayer`, as long as it supports events and `addData()`.
You can also use this API to pass custom options to a `L.geoJson()` instance.:


* `.csv(url, filterOptions?)`: Load & parse CSV, and return layer. Options are the same as [csv2geojson](https://github.com/mapbox/csv2geojson#api): `latfield, lonfield, delimiter`


#### filterOptions

* `minimumDistance` 
* `minimumTime`

### Custom Layers

Passing custom options:

```js
var customLayer = L.geoJson(null, {
    filter: function() {
        // my custom filter function
        return true;
    }
});

var myLayer = omnivore.csv('foo', null, customLayer);
```

Adding custom styles to a GeoJSON layer:

```js
var customLayer = L.geoJson(null, {
    // http://leafletjs.com/reference.html#geojson-style
    style: function(feature) {
        return { color: '#f00' };
    }
});
// this can be any kind of omnivore layer
var runLayer = omnivore.kml('line.kml', null, customLayer)
```

Using a `L.mapbox.featureLayer`:

```js
var layer = omnivore.gpx('a.gpx', null, L.mapbox.featureLayer());
```

### Async & Events

Each function returns an `L.geoJson` object. Functions that load from URLs
are **asynchronous**, so they will **not** immediately expose accurate `.setGeoJSON()` functions.

For this reason, we fire events:

* `ready`: fired when all data is loaded into the layer
* `error`: fired if data can't be loaded or parsed

```js
var layer = omnivore.gpx('a.gpx')
    .on('ready', function() {
        // when this is fired, the layer
        // is done being initialized
    })
    .on('error', function() {
        // fired if the layer can't be loaded over AJAX
        // or can't be parsed
    })
    .addTo(map);
```

`ready` does **not** fire if you don't use an asynchronous form of the function
like `.topojson.parse()`: because you don't need an event. Just run your code
after the call.

## Development

This is a [browserify](http://browserify.org/) project:

```sh
git clone git@github.com:mapbox/leaflet-mapmatch.git

cd leaflet-mapmatch

# to run tests
npm install

# to build leaflet-mapmatch.js
npm run build
```

`leaflet-mapmatch.js` and `leaflet-mapmatch.min.js` are **built files** generated
from `index.js` by `browserify`. If you find an issue, it either needs to be
fixed in `index.js`, or in one of the libraries leaflet-mapmatch uses
to parse formats.
