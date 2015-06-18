[![Build Status](https://travis-ci.org/mapbox/mapbox-mapmatch.svg)](https://travis-ci.org/mapbox/mapbox-mapmatch)

# mapbox-mapmatch

[Mapbox.js](https://github.com/mapbox/mapbox.js) plugin to match input geojson geometries to perfectly align with the openstreetmap streets using the Mapbox mapmatching API. 


## Installation
Inlcude mapbox-mapmatch after  mapbox.js in your html.

From [Mapbox Plugins CDN](http://mapbox.com/mapbox.js/plugins/#mapbox-mapmatch):

```html
<script src='//api.tiles.mapbox.com/mapbox.js/plugins/mapbox-mapmatch/v0.2.0/mapbox-mapmatch.min.js'></script>
```

Or download the js files from the `dist` directory.

## example

```js
var map = L.mapbox.map('map', 'examples.map-9ijuk24y')
    .setView([38, -102.0], 5);

L.mapmatch('a.geojson').addTo(map);
```

## API

### options
- `profile` to be used for mapmatching
 - :`car` (default) for matching to motorable roads
 - :`foot` for matching to pedestrian streets and footpaths
- `mapmatchAPI` : Custom API endpoint for mapmatching
- `precision` : Integer indicating the precision of the input geometries in metres (default=5)
- `return` type of object to return after matching
 - :`layer` (default) returns a leaflet featureLayer
 - :`feature` returns a geojson feature collection object

## Development

This is a [browserify](http://browserify.org/) project:

```sh
git clone git@github.com:mapbox/mapbox-mapmatch.git

cd mapbox-mapmatch

# to run tests
npm install

# to build mapbox-mapmatch.js
npm run build
```

`mapbox-mapmatch.js` and `mapbox-mapmatch.min.js` are **built files** generated
from `index.js` by `browserify`. If you find an issue, it either needs to be
fixed in `index.js`, or in one of the libraries mapbox-mapmatch uses
to parse formats.
