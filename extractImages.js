'use strict';

const fontkit = require('fontkit'),
	fs = require('fs'),
	path = require('path');

const imageSize = 64;

function extractImages(emojiCategories, inFontFile, outDir, callback){
	
	let failures = [];

	let emojis = [];

	let counter = 0;

	let worked = [];
	let errors = [];

	for (let category in emojiCategories){
		emojiCategories[category].forEach(function(emoji){
			emojis.push(emoji);
		});
	}

	fontkit.open(inFontFile, null, function(err, font){
		if (err) {
			callback(err);
		} else {

			console.log(`Found ${font.numGlyphs} glyphs in the font and ${emojis.length} to render out from the JSON file.`);

			emojis.forEach(function(emoji){
				let layout;

				try {
					layout = font.layout(emoji);
				} catch (e) {
					failures.push(emoji);
					console.error(`Error converting ${emoji} to image:`, e, e.stack);
					console.log('failed:', failures);
				}

				if (layout){

					let glyph = layout.glyphs[0];
					let img = glyph.getImageForSize(imageSize);
					
					worked.push(emoji);

					fs.writeFile(path.resolve(outDir,`${emoji}.${img.type.trim()}`), img.data, "binary", function(err){
						
						counter++;
						
						if (err){
							errors.push(err);
						}

						if (counter == emojis.length){
							
							if (errors.length === 0){
								errors = null;
							}

							callback(errors, worked);
						}

					});

				} else {
					counter++;
				}

			});
		}

	});
}

module.exports = extractImages;