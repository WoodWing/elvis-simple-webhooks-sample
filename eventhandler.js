/**
* eventhandler.js
* ----------
* Module containing event handling logic.
*/

// DEPENDENCIES
// =============================================================================
const file = require('./file.js')();

const serverUrl = process.env.ELVIS_SERVER_URL;

const request = require('./elvis-request.js')({
	serverUrl: serverUrl,
	useBaseUrl: true,
	username: process.env.ELVIS_USERNAME,
	password: process.env.ELVIS_PASSWORD,
	parseJSON: true
});

var exports = {}

exports.handle = (event) => {
	//Log event
	console.log('Event ' + JSON.stringify(event, null, 2));

	//Using a switch to make it easy to add additional event types in the future.
	switch (event.type) {
		case "asset_update_metadata":
			handleMetadataUpdate(event);
			break;
		default:
			break;
	}
}

function handleMetadataUpdate(event) {
	//Check if the "status" field is present in the changed metadata.
	if (event.changedMetadata.status) {

		//Get the asset (which contains the preview url)
		request({
			url: '/services/search?q=id:' + event.assetId
		}).then(result => {
			var asset = result.hits[0];
			var rating;
			if (event.changedMetadata.status.newValue === "Final") {
				rating = 5;
				if (asset.previewUrl) {
					file.download(asset.previewUrl, asset.metadata.filename);
				}
			} else {
				rating = 1;
				if (asset.previewUrl) {
					file.remove(asset.previewUrl, asset.metadata.filename);
				}
			}

			//Update the rating
			var options = {
				url: '/services/update?id=' + event.assetId + '&metadata=' + JSON.stringify({ rating: rating }),
				method: 'POST'
			}
			request(options)
		}).catch(err => {
			console.log(err);
		}) 
	}
}

module.exports = exports;
