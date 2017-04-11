/**
* server.js
* ----------
* NodeJS example of webhooks in Elvis.
* For setup instructions, please read the README.
*/

// CHECK ENV VARS.
// =============================================================================
if (!process.env.ELVIS_SERVER_URL || !process.env.ELVIS_USERNAME || !process.env.ELVIS_PASSWORD || !process.env.WEBHOOK_SECRET_TOKEN) {
	console.error('[server.js] Error: Specify ELVIS_SERVER_URL, ELVIS_USERNAME, ELVIS_PASSWORD and WEBHOOK_SECRET_TOKEN in environment.');
	process.exit(1);
}

// DEPENDENCIES
// =============================================================================
const express = require('express');
const crypto = require('crypto');
const compare = require('secure-compare');

// CUSTOM MODULES
// =============================================================================
const eventhandler = require('./eventhandler.js');

// GLOBAL VARS
// =============================================================================
var lastEvent = {}

// START SERVER
// =============================================================================
try {
	var app = express();

	var port = process.env.SAMPLE_APP_PORT;

	if (!port) {
		port = 0;
		console.log("No port has been specified, using a random one.");
		console.log("To specify a custom port, please set SAMPLE_APP_PORT=[port] in your environment.\n");
	}

	var listener = app.listen(port);

	console.log("=============");
	console.log('Elvis WebHooks Sample running with the following settings:\n');
	console.log('Port: ' + listener.address().port);
	console.log('Elvis Server URL: ' + process.env.ELVIS_SERVER_URL);
	console.log('Elvis API Username: ' + process.env.ELVIS_USERNAME);
	console.log('Webhook Secret Token: ' + process.env.WEBHOOK_SECRET_TOKEN);
	console.log("=============\n");

} catch (err) {
	console.log(err);
}

// EXPRESS SETUP
// =============================================================================
/** If you call the URL of the app in your browser, it will return the last event that has
been received. */
app.get('/', (req, res) => {
	res.send(JSON.stringify(lastEvent, null, 2));
});

/** Endpoint that handles POST requests. This is where event data comes in. */
app.post('/', (req, res, next) => {
	var signature = req.header("x-hook-signature");
	var data = [];

	req.on('data', (chunk) => {
		data += chunk;
	});

	req.on('end', () => {
		//First validate the signature
		if (validateSignature(signature, data)) {
			//We send the response back to Elvis before handling the event, so the sample app won't keep the connection open while it's handling the event. This results in better performance.
			res.status(200).send();
			eventhandler.handle(JSON.parse(data));
		} else {
			console.log("Signature invalid!");
			res.status(400).send("Invalid WebHook signature.");
		}
	});

	req.on('error', (error) => {
		return next(err);
	});
});

// SIGNATURE VALIDATION
// =============================================================================
/** Returns whether a signature is valid or not. */
function validateSignature(signature, data) {
	var hmac = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET_TOKEN);
	hmac.update(data);
	var digest = hmac.digest("hex");

	return compare(digest, signature);
}
