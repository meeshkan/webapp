module.exports = {
  devIndicators: {
    autoPrerender: false,
  },
  env: {
    SLACK_OAUTH_REDIRECT_URI: process.env.SLACK_OAUTH_REDIRECT_URI,
    SLACK_OAUTH_APP_CLIENT_ID: process.env.SLACK_OAUTH_APP_CLIENT_ID,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    GITHUB_AUTH_ENV: process.env.GITHUB_AUTH_ENV
  }
};
