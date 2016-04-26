'use strict';

const extractCharacters = require('./extractCharacters.js'),
	  extractImages = require('./extractImages.js'),
	  makeCSS = require('./makeCSS.js');

module.exports = {
	extractCharacters: extractCharacters,
	extractImages: extractImages,
	makeCSS: makeCSS
};