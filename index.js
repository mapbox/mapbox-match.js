'use strict';

if (!L.mapbox) throw new Error('include mapbox.js before mapbox.match.js');

L.mapbox.mapmatching = require('./src/match');
