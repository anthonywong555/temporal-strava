# Temporal Strava

This project illusturate how you keep an access token "fresh" using Temporal against your Strava Account.

## Prerequisite

Before you can get started you will need the following:

- [Temporal CLI](https://github.com/temporalio/cli)
- [Strava App](https://www.strava.com/settings/api)

## Getting Strava API Application's Client Id

1. Copy the following URL and replace the `STRAVA_CLIENT_ID` with your own.

https://www.strava.com/oauth/authorize?client_id=STRAVA_CLIENT_ID&redirect_uri=http%3A%2F%2Flocalhost&response_type=code&scope=activity%3Awrite%2Cprofile%3Awrite%2Cread_all%2Cprofile%3Aread_all%2Cactivity%3Aread_all

2. Go to the browser and paste the URL.

3. Accept everything and copy the code value. It should look like this:

http://localhost/?state=&code=STRAVA_CODE&scope=read,activity:write,activity:read_all,profile:write,profile:read_all,read_all

## Getting Started with Temporal CLI

1. Execute the following commands:

```sh
temporal server start-dev
```

2. Copy the .env-example file and rename it to .env. Modify the .env with the following:

## Running this code

1. `temporal server start-dev` to start [Temporal Server](https://github.com/temporalio/cli/#installation).
1. `npm install` to install dependencies.
1. `npm run start.watch` to start the Worker.
2. In another shell, `npm run workflow` to run the Workflow Client.
