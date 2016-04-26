'use strict';

const b64img = require('css-b64-images'),
	  fs = require('fs');

function makeCSS(emojis, outFile, outDir, makeInline, callback){
	let x = 0, y = 0;
	let failures = [];

	fs.unlink(outFile, function(){

		let cssStringArr = emojis.map(function(emoji){
			return `.no-emoji-support .emoji-wrapper[raw-char="${emoji}"]{ background-image: url('${emoji}.png'); }`;
		});

		if (!makeInline){
			fs.writeFile(outFile, cssStringArr.join('\n'), callback);
		} else {

			cssStringArr.forEach(function(cssString){

				b64img.fromString(cssString, outDir,  outDir, {maxSize: Math.Infinity},function(err, css){
					x++;
					if (err){
						let em = css.split('[raw-char="')[1].split('"]')[0];
						console.error(`Error inlining ${em} in css:`, err, err.stack);
						failures.push(em);
						if (x == emojis.length){
							callback(failures);
						}
					} else {
						fs.appendFile(outFile,css,(err) => {
							y++;
							if (err){
								let em = css.split('[raw-char="')[1].split('"]')[0];
								console.error(`Error adding ${em} inlined to the out.css file:`, err, err.stack);
								failures.push(em);
								if (y == emojis.length){
									callback(failures);
								}
							} else {
								if (y == emojis.length){						
									if (failures.length === 0){
										failures = null;
									}
									callback(failures);
								}
							}
						});
					}
				});
				
			});
		}
		
	});
}

module.exports = makeCSS;