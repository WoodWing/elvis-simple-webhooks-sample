# Elvis Webhooks NodeJS Sample

## Introduction

This simple integration sample shows how easy it is use the Elvis webhooks API. It's based on NodeJS and can be used as starting point for creating your own integrations. 

It provides the following functionality:

If an asset's status is updated to "Final", the preview of the asset will be downloaded and saved in the specified download folder.

Then, just for visual purposes, a 5-star rating will be set for that asset.

If the "Final" status is removed from an asset, the preview is deleted and the asset will be given a 1-star rating.

## Installation and Setup

After checking out the project, use `npm install` to install dependencies.

### Creating an API user
The app will need to communicate with the Elvis REST API to download previews and update the rating. Therefore you will need to set up an API user. Further instructions, see the WoodWing [Help Center](https://helpcenter.woodwing.com/hc/en-us/articles/205655395).

### Setting up a webhook
You can set up a webhook through the Management Console or the REST API. More instructions, see the WoodWing [Help Center](https://helpcenter.woodwing.com/hc/en-us/articles/115001884346).

The app relies on the webhook using the `asset_update_metadata` event.

### Setting up your environment
After registering the webhook, the sample app will need the following variables in your environment to run:

  - `SAMPLE_APP_PORT`: The port the app will run on
  - `ELVIS_SERVER_URL`: The URL to your Elvis Server.
  - `ELVIS_USERNAME`: The username of the API user.
  - `ELVIS_PASSWORD`: The password of the API user.
  - `WEBHOOK_SECRET_TOKEN`: The secret token of the webhook.

You can set environment variables using `export [KEY]=[VALUE]`. Alternatively, you can use the `run.sh` script which exports these environment variables and starts the app.

### Save directory
Preview files downloaded by the app are stored in `./final/`.
To change this, set `ELVIS_SAVE_DIR` in your environment.

## Running the app
You can start the app using `npm start` or, when configured `./run.sh`.
