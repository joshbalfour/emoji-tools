const path = require('path');

const outCssFile = path.resolve('.','out','emojis.css');
const outInlineCssFile = path.resolve('.','out','emojis.inlined.css');
const outImagesDir = path.resolve('.', 'out', 'images');

const inPlistFile = path.resolve('.','in','Resources','Category-Emoji.plist');
const inFontFile = path.resolve('.','in','Fonts','Apple Color Emoji.ttf');

const emojiTools = require('./index.js');

emojiTools.extractCharacters(inPlistFile, function(err, emojiCategories){
	if (!err){
		emojiTools.extractImages(emojiCategories, inFontFile, outImagesDir, function(errs, emojis){
			if (!errs){
				emojiTools.makeCSS(emojis, outInlineCssFile, outImagesDir, false, function(err){
					if (!errs){
						emojiTools.makeCSS(emojis, outInlineCssFile, outImagesDir, true, function(errs){
							if (!errs){
								console.log('Success!');
							} else {
								console.error('Error making inline CSS file:', errs);
							}
						});
					} else {
						console.error('Error making CSS file:', err);
					}
				});
			} else {
				console.error('Error extracting images from font:', errs);
			}
		});
	} else {
		console.error('Error extracting emojis characters from plist:', err);
	}
});