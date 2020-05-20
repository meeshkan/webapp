const webpack = require('webpack')
const nextSourceMaps = require('@zeit/next-source-maps')

module.exports = nextSourceMaps({
  devIndicators: {
    autoPrerender: false,
  },
  env: {
    SLACK_OAUTH_REDIRECT_URI: process.env.SLACK_OAUTH_REDIRECT_URI,
    SLACK_OAUTH_APP_CLIENT_ID: process.env.SLACK_OAUTH_APP_CLIENT_ID,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    GITHUB_AUTH_ENV: process.env.GITHUB_AUTH_ENV,
    EIGHT_BASE_ENDPOINT: process.env.EIGHT_BASE_ENDPOINT,
    GH_OAUTH_APP_CLIENT_ID: process.env.GH_OAUTH_APP_CLIENT_ID,
    PRINT_CLIENT_SIDE_ERROR_MESSAGES: process.env.PRINT_CLIENT_SIDE_ERROR_MESSAGES,
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
  webpack: (config, { isServer, buildId }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.SENTRY_RELEASE': JSON.stringify(buildId),
      })
    )

    if (!isServer) {
      config.resolve.alias['@sentry/node'] = '@sentry/browser'
    }

    return config
  },
});