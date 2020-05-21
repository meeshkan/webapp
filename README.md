# Webapp readme

## Installing, building, testing and running

Here are instructions on how to install, build and run this web app.

### Installation

To install the webapp, download this repository and run:

```bash
yarn
```

### Build

To build the webapp, run:

```bash
yarn build
```

Note that there are many environment variables used in `webapp`. If you are attempting to build it without those variables, the build and/or first run will likely fail. If you are a member of the Meeshkan organization on `vercel`, you can obtain the development version of these variables by running `vercel env pull`. Otherwise, you can create an `.env` file and populate it with the variables you need to run the parts of the app you wish to run. At a minimum, you will need an Auth0 app with GitHub login configured and the GitHub login will need a mandatory e-mail field.

### Test

To test the webapp, invoke

```bash
yarn test
```

Please see the above note about environment variables before attempting to test the web app.

### Run

To run the webapp, invoke

```bash
yarn dev
```

Please see the above note about environment variables before attempting to run the web app.

## Routing style

We optimize for user experience (clear URL structure) and only add an abstraction if absolutely necessary. The repercussion of this is we will have some reserved paths such as `settings`, `user`, and more. We percieve this to have minimal impact and aren't actively solving for these edge cases.

## Important dependencies

This repository makes heavy use of certain libraries. Without being familiar with the basics of how these libraries work, it will be difficult to understand the code base.

These libraries are, in no particualr order:

- [`next.js`](https://github.com/zeit/next.js)
- [`chakra-ui`](https://github.com/chakra-ui/chakra-ui)
- [`fp-ts`](https://github.com/gcanti/fp-ts)
- [`io-ts`](https://github.com/gcanti/io-ts)
- [`monocle-ts`](https://github.com/gcanti/monocle-ts)

## Known issues

### Slack webhooks

We currently have no way to know if a user revokes an incoming webhook, nor do we have any way to select which webhook to use if a user registers multiple ones. Other potential models are to figure out how Slack behaves when a webhook is no longer valid (there's no documentation about this so we'd have to hack at it & assume it's stable), ask the user to create a Slack app (Netlify does this), to make a more sophisticated app with the `chat:write` scope which uses an `access_token` that will 401 if no longer valid (at which point we can delete the integration), or get rid of Slack integrations entirely and do what Github does where we just have a webhook that we spit events out to.
