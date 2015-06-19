[![Build Status](https://travis-ci.org/mapbox/mapbox-map-matching.js.svg)](https://travis-ci.org/mapbox/mapbox/mapbox-map-matching.js)

# mapbox-map-matching.js

[Mapbox.js](https://github.com/mapbox/mapbox.js) plugin to match input geojson geometries to perfectly align with the openstreetmap streets using the Mapbox Map Matching API.


## Installation
Inlcude mapbox-map-matching.js after [Mapbox.js](https://github.com/mapbox/mapbox.js) in your html. Download the js files from the `dist` directory..

<!--
Or use the version on the [Mapbox Plugins CDN](http://mapbox.com/mapbox.js/plugins/#mapbox-mapmatch):

```html
<script src='//api.tiles.mapbox.com/mapbox.js/plugins/mapbox.map-matching.js/v0.0.0/mapbox.map-matching.min.js'></script>
```
-->

## example

```js
L.mapbox.mapmatching(geojson, options, function (error, layer) {
    layer.addTo(map);
    layer.setStyle({
        color: '#9a0202',
        weight: 4,
        opacity: 0.8
    });
});
```

## API

### options
- `profile` to be used for mapmatching
 - :`car` (default) for matching to motorable roads
 - :`foot` for matching to pedestrian streets and footpaths
- `mapmatchAPI` : Custom API endpoint for mapmatching
- `gpsPrecision` : Integer indicating the precision of the input geometries in metres (default=5)
- `return` type of object to return after matching
 - :`layer` (default) returns a leaflet featureLayer
 - :`geojson` returns a geojson feature collection

## Development

This is a [browserify](http://browserify.org/) project:

```sh
git clone git@github.com:mapbox/mapbox-map-matching.js.git
cd mapbox-map-matching.js
npm install
npm run build
```

`mapbox-map-matching.js` and `mapbox-map-matching.min.js` are **built files** generated
from `index.js` by `browserify`. If you find an issue, it either needs to be
fixed in `index.js`, or in one of the libraries mapbox-mapmatch uses
to parse formats.
