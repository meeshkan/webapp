module.exports = {
  devIndicators: {
    autoPrerender: false,
  },
  env: {
    SLACK_OAUTH_REDIRECT_URI: process.env.SLACK_OAUTH_REDIRECT_URI,
  }
};
