'use strict';

if (!L.mapbox) throw new Error('include mapbox.js before mapbox.mapmatch.js');

L.mapbox.mapmatching = require('./src/mapmatch');
