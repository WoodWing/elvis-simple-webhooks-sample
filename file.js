/**
* file.js
* ----------
* This module handles the downloading and removing of files.
*
* Note that this doesnt use the assets-request module for making requests. It does use the
* same cookie jar however, so it is authenticated. Not using the assets-request module
* means that it doesnt support the auto-login feature when the session cookie expires.
* However, the chances of this happening in this scenario are small, since other requests 
* (that do support auto login) are made right before this is called.
*/

// DEPENDENCIES
// =============================================================================
const URL = require('url');
const fs = require('fs');
const request = require('request').defaults({ jar: true });
const dir = (process.env.ASSETS_SAVE_DIR) ? process.env.ASSETS_SAVE_DIR : './final';

module.exports = function () {
	var module = {};

	/* Create 'final' directory if it doesn't exist */
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}

	/** Download a file */
	module.download = function (url, filename, callback) {
		parsedUrl = URL.parse(url);
		var localFilename = filename + '_preview.' + parsedUrl.pathname.split('.').pop();
		var destination = dir + '/' + localFilename;
		var file = fs.createWriteStream(destination);
		request(url).on('end', () => {
			console.log('Downloaded: ' + localFilename);
		}).pipe(file);
	};

	/** Remove a file */
	module.remove = function (url, filename) {
		url = URL.parse(url);
		localFilename = filename + '_preview.' + url.pathname.split('.').pop();
		fs.unlink(dir + '/' + localFilename, () => {
			console.log('Removed: ' + localFilename);
		})
	}

	return module;
}
