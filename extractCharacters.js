'use strict';

const fs = require('fs');
const path = require('path');
const bplist = require('bplist');

module.exports = function(inFile, callback) {
	bplist.parseFile(inFile, function (err, result) {
		if (err){
			callback(err, null);
		} else {
			let categories = {};

			result[0].EmojiDataArray.forEach(function(category){
				categories[category.CVDataTitle.split('EmojiCategory-').join('')] = category.CVCategoryData.Data.split(',');
			});

			callback(null, categories);
		}
	});
};