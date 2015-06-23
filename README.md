[![Build Status](https://travis-ci.org/mapbox/mapbox-match.js.svg)](https://travis-ci.org/mapbox/mapbox/mapbox-match.js)

# mapbox-match.js

[Mapbox.js](https://github.com/mapbox/mapbox.js) plugin to match GeoJSON geometries to the OpenStreetMap streets network using the [Mapbox Map Matching API](https://www.mapbox.com/developers/api/map-matching).

![screenshot 2015-06-19 17 57 24](https://cloud.githubusercontent.com/assets/126868/8263826/ad755d58-16ac-11e5-966e-f7a9be97ff28.png)

_A GPS track (cyan) matched to the streets via a profile for cars (solid red line) and for pedestrians (dotted red line)._

## Installation
Inlcude mapbox-match.js after [Mapbox.js](https://github.com/mapbox/mapbox.js) in your html. Download the js files from the `dist` directory.

<!--
Or use the version on the [Mapbox Plugins CDN](http://mapbox.com/mapbox.js/plugins/#mapbox-mapmatch):

```html
<script src='//api.tiles.mapbox.com/mapbox.js/plugins/mapbox.match.js/v0.0.0/mapbox.match.min.js'></script>
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

### `L.mapbox.mapmatching(geojson, options?, callback)`

Given a geojson object, returns a leaflet feature layer with the matched geometries. Since an asynchronous request is made for matching, you need to specify a callback function that runs when there is a successful response.

### options
- `profile` to be used for mapmatching
 - :`car` (default) for matching to motorable roads
 - :`foot` for matching to pedestrian streets and footpaths
- `mapmatchAPI` : Custom API endpoint for mapmatching
- `gpsPrecision` : Integer indicating the precision of the input geometries in metres (default=5)
- `output` type of object to return after matching
 - :`layer` (default) returns a leaflet featureLayer
 - :`geojson` returns a geojson feature collection

## Development

This is a [browserify](http://browserify.org/) project:

```sh
git clone git@github.com:mapbox/mapbox-match.js.git
cd mapbox-match.js
npm install
npm run build
```

`mapbox-match.js` and `mapbox-match.min.js` are **built files** generated
from `index.js` by `browserify`. If you find an issue, it either needs to be
fixed in `index.js`, or in one of the libraries mapbox-mapmatch uses
to parse formats.

##Algorithm
1. Read an input geojson FeatureCollection
2. Tidy the geojson using [geojson-tidy](https://github.com/mapbox/geojson-tidy)
3. Match every feature using the [Mapbox Map Matching API](https://www.mapbox.com/developers/api/map-matching)
4. Return a leaflet [featureLayer](https://www.mapbox.com/mapbox.js/api/v2.1.9/l-mapbox-featurelayer/) with the matched features or just a geojson object
